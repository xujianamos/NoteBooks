## FastAPI 错误处理与结果归一最佳实践

适用范围：任何使用 FastAPI 构建的项目，目标是减少路由层重复的 try/except 与响应拼装，统一错误格式与可维护性。

### 总览

- 方案 A：全局异常处理（推荐，必须）
- 方案 B：结果归一工具函数（推荐，必须）
- 方案 C：装饰器封装路由错误处理（可选，按需）

可独立使用，但推荐 A + B 组合；若某些路由需要“最少改动接入”，再叠加 C。

---

### 方案 A：全局异常处理（必须）

统一将底层异常（如 ES NotFound）与业务异常（自定义）映射为一致的 JSON 响应。

示例：`app/main.py`

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from elasticsearch import NotFoundError as ESNotFoundError
from app.core.exceptions import CustomException
from app.core.logging_config import get_logger

app = FastAPI()

@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(status_code=exc.code, content={"code": exc.code, "message": exc.message})

@app.exception_handler(ESNotFoundError)
async def es_not_found_handler(request: Request, exc: ESNotFoundError):
    return JSONResponse(status_code=404, content={"code": 404, "message": "资源不存在或已删除"})

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger = get_logger(__name__)
    logger.error("未处理异常: %s", str(exc), exc_info=True)
    return JSONResponse(status_code=500, content={"code": 500, "message": "服务器内部错误，请稍后重试"})
```

自定义异常：`app/core/exceptions.py`

```python
class CustomException(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
        super().__init__(message)

class NotFoundException(CustomException):
    def __init__(self, message: str = "数据不存在"):
        super().__init__(code=404, message=message)

class BadRequestException(CustomException):
    def __init__(self, message: str = "错误的请求"):
        super().__init__(code=400, message=message)

class ValidationException(BadRequestException):
    def __init__(self, message: str = "参数验证失败"):
        super().__init__(message=message)
```

接入方式：

- 在 `main.py` 注册异常处理器
- 在路由/服务中通过 `raise ValidationException("xxx")` 抛错，不再手动拼装错误响应

---

### 方案 B：结果归一工具函数（必须）

把“根据服务层结果返回 success/error”的逻辑提炼为通用函数，接口只关注业务。

示例：`app/utils/api_helpers.py`

```python
from typing import Dict, Any, Union
from app.utils.response_formatter import success_response, error_response

def respond_from_result(result: Union[Dict[str, Any], None], success_msg: str) -> Dict[str, Any]:
    if not result:
        return error_response(message="执行失败", code=500)
    if not result.get("success", False):
        message = result.get("message", "执行失败")
        code = 404 if ("不存在" in message or "已删除" in message) else 500
        return error_response(message=message, code=code)
    return success_response(data=result, message=success_msg)
```

路由改造示例：

```python
@router.post("/{task_id}/execute")
async def execute_task(task_id: str, es_client = Depends(get_es_client)):
    if not task_id:
        raise ValidationException("任务ID不能为空")
    result = await service.execute_task(es_client, task_id)
    return respond_from_result(result, "执行任务成功")
```

---

### 方案 C：装饰器封装路由错误处理（可选）

最小改动情况下快速接入，把 try/except 统一放在装饰器里。

工具：

```python
from functools import wraps
from elasticsearch import NotFoundError as ESNotFoundError
from app.utils.response_formatter import success_response, error_response

def handle_api_errors(success_msg: str):
    def wrapper(fn):
        @wraps(fn)
        async def inner(*args, **kwargs):
            try:
                result = await fn(*args, **kwargs)
                if isinstance(result, dict) and not result.get("success", True):
                    msg = result.get("message", "执行失败")
                    code = 404 if "不存在" in msg else 500
                    return error_response(message=msg, code=code)
                return success_response(data=result, message=success_msg)
            except ESNotFoundError:
                return error_response(message="资源不存在或已删除", code=404)
            except Exception:
                return error_response(message="执行失败，请稍后再试", code=500)
        return inner
    return wrapper
```

使用：

```python
@router.post("/batch/execute")
@handle_api_errors("批量开启任务成功")
async def batch_execute_tasks(task_ids: List[str], es_client = Depends(get_es_client)):
    return await service.batch_execute_tasks(es_client, task_ids)
```

---

## 落地步骤（可复制到任何项目）

1. 新增/完善异常定义

   - 文件：`app/core/exceptions.py`
   - 至少包含：`CustomException`、`ValidationException`、可选业务异常

2. 注册全局异常处理器

   - 文件：`app/main.py`
   - 处理：`CustomException`、ES 的 `NotFoundError`、兜底 `Exception`

3. 引入结果归一函数

   - 新建：`app/utils/api_helpers.py`
   - 使用 `respond_from_result(result, "成功消息")`

4. 路由层改造

   - 用“抛异常 + 归一函数”替代“try/except + 手工拼装响应”
   - 仅保留参数校验（抛 `ValidationException`）与核心业务调用

5. （可选）装饰器化接入
   - 对无法大改的旧路由使用装饰器包裹

---

## 快速对照清单

- [ ] main.py 注册了异常处理器
- [ ] exceptions.py 定义了自定义异常
- [ ] api_helpers.py 提供了 `respond_from_result`
- [ ] 路由不再充斥 try/except，而是抛异常 + 归一返回
- [ ] 如需最小改动，使用装饰器 `handle_api_errors`

---

## FAQ

- Q：服务层返回的结构必须是什么？
  - A：建议统一为 `{ "success": bool, "message": str, ... }`。失败时 `success=False` 并给出 `message`。
- Q：如何定制 4xx/5xx？
  - A：在 `respond_from_result` 里根据 `message` 或返回结构判定；或使用自定义异常在全局处理器中映射。
- Q：与 Pydantic 的请求体验证冲突吗？
  - A：不冲突，Pydantic 负责请求体验证；本方案统一业务异常与服务层结果。
