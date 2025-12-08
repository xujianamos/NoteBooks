# FastAPI

# 1. 环境变量

你在 **shell（终端）中就可以**创建和使用环境变量，并不需要用到 Python：

```shell
# 你可以使用以下命令创建一个名为 MY_NAME 的环境变量
export MY_NAME="Wade Wilson"
# 然后，你可以在其他程序中使用它，例如
echo "Hello $MY_NAME"
```


你也可以在 Python **之外**的终端中创建环境变量（或使用任何其他方法），然后在 Python 中**读取**它们。

例如，你可以创建一个名为 `main.py` 的文件，其中包含以下内容：

```python 
import os

name = os.getenv("MY_NAME", "World")
print(f"Hello {name} from Python")
```


> 第二个参数是 `os.getenv()` 的默认返回值。如果没有提供，默认值为 `None`，这里我们提供 `"World"` 作为默认值。

然后你可以调用这个 Python 程序：

```shell
# 这里我们还没有设置环境变量
$ python main.py
# 因为我们没有设置环境变量，所以我们得到的是默认值
$ Hello World from Python
# 但是如果我们事先创建过一个环境变量
$ export MY_NAME="Wade Wilson"
# 然后再次调用程序
$ python main.py
# 现在就可以读取到环境变量了
$ Hello Wade Wilson from Python
```


由于环境变量可以在代码之外设置、但可以被代码读取，并且不必与其他文件一起存储（提交到 `git`），因此通常用于配置或**设置**。

你还可以为**特定的程序调用**创建特定的环境变量，该环境变量仅对该程序可用，且仅在其运行期间有效。

要实现这一点，只需在同一行内、程序本身之前创建它：

```shell
# 在这个程序调用的同一行中创建一个名为 MY_NAME 的环境变量
MY_NAME="Wade Wilson" python main.py
# 现在就可以读取到环境变量了
Hello Wade Wilson from Python
# 在此之后这个环境变量将不会依然存在
python main.py
```


# 2. 虚拟环境

当你在 Python 工程中工作时，你可能会有必要用到一个**虚拟环境**（或类似的机制）来隔离你为每个工程安装的包。

## 2.1 创建一个虚拟环境

在开始一个 Python 工程的第一时间，在你的工程内部创建一个虚拟环境。

> 你只需要在每个工程中操作一次，而不是每次工作时都操作。

如果你安装了`uv`，你也可以使用它来创建一个虚拟环境。

```bash 
$ uv venv
```

默认情况下，`uv` 会在一个名为 `.venv` 的目录中创建一个虚拟环境。但你可以通过传递一个额外的参数来自定义它，指定目录的名称。

## 2.2 激活虚拟环境

激活新的虚拟环境来确保你运行的任何 Python 命令或安装的包都能使用到它。

> 每次开始一个新的终端会话来工作在这个工程时，你都需要执行这个操作。

```bash 
$ source .venv/bin/activate
```

每次你在这个环境中安装一个新的包时，都需要重新激活这个环境。这么做确保了当你使用一个由这个包安装的终端（CLI）程序时，你使用的是你的虚拟环境中的程序，而不是全局安装、可能版本不同的程序。

## 2.3 检查虚拟环境是否激活

```bash 
$ which python
```


如果它显示了在你工程 的 `.venv/bin/python` 中的 `python` 二进制文件，那么它就生效了。

## 2.4 退出虚拟环境

当你完成工作后，你可以退出虚拟环境。

```bash 
$ deactivate
```


这样，当你运行 `python` 时，它不会尝试从安装了软件包的虚拟环境中运行。（即，它将不再会尝试从虚拟环境中运行，也不会使用其中安装的软件包。）

# 3. 安装 FastAPI

请确保您创建并激活一个虚拟环境，然后安装 FastAPI：

```bash 
pip install "fastapi[standard]"
```

当您使用 `pip install "fastapi[standard]"` 进行安装时，它会附带一些默认的可选标准依赖项。如果您不想安装这些可选依赖，可以选择安装 `pip install fastapi`。

# 4. 快速入门

最简单的FastAPI文件可能像下面这样：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

交互式API文档:

跳转到 <http://127.0.0.1:8000/docs。你将会看到自动生成的交互式> API 文档（由 Swagger UI 提供）。

前往 <http://127.0.0.1:8000/redoc。你将会看到可选的自动生成文档> （由 [ReDoc](https://github.com/Rebilly/ReDoc "ReDoc") 提供）。

# 5. 路径参数

FastAPI 支持使用 Python 字符串格式化语法声明路径参数**（**变量）：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}
```


这段代码把路径参数 `item_id` 的值传递给路径函数的参数 `item_id`。

## 5.1 声明路径参数的类型

使用 Python 标准类型注解，声明路径操作函数中路径参数的类型。

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```


> 注意，函数接收并返回的值是`3`（`int`），不是 `"3"`（`str`）。FastAPI通过类型声明**自动解析**请求中的数据。

## 5.2 顺序很重要

有时，路径操作中的路径是写死的。比如要使用 `/users/me` 获取当前用户的数据。然后还要使用 `/users/{user_id}`，通过用户 ID 获取指定用户的数据。由于路径操作是按顺序依次运行的，因此，一定要在 `/users/{user_id}` 之前声明 `/users/me` ：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}

@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
```


否则，`/users/{user_id}` 将匹配 `/users/me`，FastAPI 会认为正在接收值为 `"me"` 的 `user_id` 参数。

## 5.3 预设值

路径操作使用 Python 的 `Enum` 类型接收预设的路径参数。

### 5.3.1 使用 Enum 类

导入 `Enum` 并创建继承自 `str` 和 `Enum` 的子类。通过从 `str` 继承，API 文档就能把值的类型定义为**字符串**，并且能正确渲染。然后，创建包含固定值的类属性，这些固定值是可用的有效值：

```python 
from enum import Enum

from fastapi import FastAPI

# 1.创建 Enum 类
class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

app = FastAPI()

@app.get("/models/{model_name}")
# 2.使用 Enum 类（ModelName）创建使用类型注解的路径参数：
async def get_model(model_name: ModelName):
    # 枚举类 ModelName 中的枚举元素支持比较操作：
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}
     # 使用 model_name.value 或 your_enum_member.value 获取实际的值
    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}
    # 返回给客户端之前，要把枚举元素转换为对应的值（本例中为字符串）：
    return {"model_name": model_name, "message": "Have some residuals"}
```


> 使用 `ModelName.lenet.value` 也能获取值 `"lenet"`。

### 5.3.2 包含路径的路径参数

假设路径操作的路径为 `/files/{file_path}`。但需要 `file_path` 中也包含*路径*，比如，`home/johndoe/myfile.txt`。此时，该文件的 URL 是这样的：`/files/home/johndoe/myfile.txt`。

OpenAPI 不支持声明包含路径的路径参数，因为这会导致测试和定义更加困难。不过，仍可使用 Starlette 内置工具在 **FastAPI** 中实现这一功能。而且不影响文档正常运行，但是不会添加该参数包含路径的说明。

直接使用 Starlette 的选项声明包含路径的路径参数：

```markdown 
/files/{file_path:path}
```


本例中，参数名为 `file_path`，结尾部分的 `:path` 说明该参数应匹配路径。

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```


> 注意，包含 `/home/johndoe/myfile.txt` 的路径参数要以斜杠（`/`）开头。本例中的 URL 是 `/files//home/johndoe/myfile.txt`。注意，`files` 和 `home` 之间要使用**双斜杠**（`//`）。

## 5.4 路径参数和数值校验

与使用 `Query` 为查询参数声明更多的校验和元数据的方式相同，你也可以使用 `Path` 为路径参数声明相同类型的校验和元数据。

### 5.4.1 声明元数据

你可以声明与 `Query` 相同的所有参数。例如，要声明路径参数 `item_id`的 `title` 元数据值，你可以输入：

```python 
from typing import Annotated

from fastapi import FastAPI, Path, Query

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: Annotated[str | None, Query(alias="item-query")] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

> 扩展：`Annotated` 是 `typing` 模块（Python 3.9+ 引入）提供的一个特殊类型工具，用于为类型添加**额外的元数据（metadata）**。它的核心作用是在保留原有类型信息的同时，附加一些描述性数据或配置信息。
>
> `Annotated` 的用法和含义如下：
>
> 1. **基本语法**：
>    `Annotated[类型, 元数据1, 元数据2, ...]`
>    第一个参数是变量的**基础类型**（如 `int`、`str | None`），后面的参数是附加的**元数据**（可以是任意类型的信息）。
> 2. **在 FastAPI 中的特殊作用**：
>    FastAPI 会识别 `Annotated` 中包含的特定元数据（如 `Path`、`Query` 等对象），并将其作为**参数配置信息**：
>    - 对于 `item_id: Annotated[int, Path(...)]`：
>      `int` 是 `item_id` 的基础类型（必须是整数），`Path(title="The ID of the item to get")` 是元数据，用于描述这个路径参数的标题（会显示在自动生成的 API 文档中）。
>    - 对于 `q: Annotated[str | None, Query(alias="item-query")] = None`：
>      `str | None` 表示 `q` 可以是字符串或 `None`（默认值为 `None`），`Query(alias="item-query")` 是元数据，指定这个查询参数的别名是 `item-query`（即请求时用 `?item-query=xxx` 替代 `?q=xxx`）。

### 5.4.2 按需对参数排序

假设你想要声明一个必需的 `str` 类型查询参数 `q`。而且你不需要为该参数声明任何其他内容，所以实际上你并不需要使用 `Query`。

但是你仍然需要使用 `Path` 来声明路径参数 `item_id`。如果你将带有「默认值」的参数放在没有「默认值」的参数之前，Python 将

会报错。但是你可以对其重新排序，并将不带默认值的值（查询参数 `q`）放到最前面。

对 **FastAPI** 来说这无关紧要。它将通过参数的名称、类型和默认值声明（`Query`、`Path` 等）来检测参数，而不在乎参数的顺序。因

此，你可以将函数声明为：

```python 
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(q: str, item_id: int = Path(title="The ID of the item to get")):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```


### 5.4.3 按需对参数排序的技巧

如果你想不使用 `Query` 声明没有默认值的查询参数 `q`，同时使用 `Path` 声明路径参数 `item_id`，并使它们的顺序与上面不同，

Python 对此有一些特殊的语法。传递 `*` 作为函数的第一个参数。Python 不会对该 `*` 做任何事情，但是它将知道之后的所有参数都

应作为关键字参数（键值对），也被称为 `kwargs`，来调用。即使它

们没有默认值。

```python 
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(*, item_id: int = Path(title="The ID of the item to get"), q: str):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```


### 5.4.4 数值校验

1. 大于等于

使用 `Query` 和 `Path`（以及你将在后面看到的其他类）可以声明字符串约束，但也可以声明数值约束。像下面这样，添加 `ge=1` 

后，`item_id` 将必须是一个大于（`g`reater than）或等于（`e`qual）`1` 的整数。

```python 
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(
    *, item_id: int = Path(title="The ID of the item to get", ge=1), q: str
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

2. 大于和小于等于

同样的规则适用于：

- `gt`：大于（`g`reater `t`han）
- `le`：小于等于（`l`ess than or `e`qual）

```python 
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(
    *,
    item_id: int = Path(title="The ID of the item to get", gt=0, le=1000),
    q: str,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

3. 浮点数、大于和小于

数值校验同样适用于 `float` 值。能够声明 `gt` 而不仅仅是 `ge` 在这个前提下变得重要起来。例如，你可以要求一个值必须大于

 `0`，即使它小于 `1`。因此，`0.5` 将是有效值。但是 `0.0`或 `0` 不是。对于 `lt` 也是一样的。

```python 
from fastapi import FastAPI, Path, Query

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(
    *,
    item_id: int = Path(title="The ID of the item to get", ge=0, le=1000),
    q: str,
    size: float = Query(gt=0, lt=10.5),
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if size:
        results.update({"size": size})
    return results
```

# 6. 查询参数

声明的参数不是路径参数时，路径操作函数会把该参数自动解释为**查询**参数。

```python 
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```


查询字符串是键值对的集合，这些键值对位于 URL 的 `?` 之后，以 `&` 分隔。

例如，以下 URL 中：

```markdown 
http://127.0.0.1:8000/items/?skip=0&limit=10
```


查询参数为：

- `skip`：值为 `0`
- `limit`：值为 `10`

这些值都是 URL 的组成部分，因此，它们的类型**本应**是字符串。

但声明 Python 类型（上例中为 `int`）之后，这些值就会转换为声明的类型，并进行类型校验。

## 6.1 默认值

查询参数不是路径的固定内容，它是可选的，还支持默认值。上例用 `skip=0` 和 `limit=10` 设定默认值。

访问 URL：

```markdown 
http://127.0.0.1:8000/items/
```


与访问以下地址相同：

```markdown 
http://127.0.0.1:8000/items/?skip=0&limit=10
```


但如果访问：

```markdown 
http://127.0.0.1:8000/items/?skip=20
```


查询参数的值就是：

- `skip=20`：在 URL 中设定的值
- `limit=10`：使用默认值

## 6.2 可选参数

同理，把默认值设为 `None` 即可声明**可选的**查询参数：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
```


本例中，查询参数 `q` 是可选的，默认值为 `None`。

## 6.3 多个路径和查询参数

**FastAPI** 可以识别同时声明的多个路径参数和查询参数。**而且声明查询参数的顺序并不重要**。FastAPI 通过参数名进行检测：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, item_id: str, q: str | None = None, short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item
```

1. 必选查询参数

为不是路径参数的参数声明默认值（至此，仅有查询参数），该参数就**不是必选**的了。如果只想把参数设为**可选**，但又不想指定参数的值，则要把默认值设为 `None`。如果要把查询参数设置为**必选**，就不要声明默认值：

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_user_item(item_id: str, needy: str):
    item = {"item_id": item_id, "needy": needy}
    return item
```

这里的查询参数 `needy` 是类型为 `str` 的必选查询参数。

## 6.4 查询参数和字符串校验

**FastAPI** 允许你为参数声明额外的信息和校验。

```python 
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
# 查询参数 q 的类型为 str，默认值为 None，因此它是可选的。
async def read_items(q: str | None = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.1 额外的校验

我们打算添加约束条件：即使 `q` 是可选的，但只要提供了该参数，则该参数值**不能超过50个字符的长度**。

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
# 将 Query 用作查询参数的默认值，并将它的 max_length 参数设置为 50
async def read_items(q: Union[str, None] = Query(default=None, max_length=50)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

> 扩展：`Union[str, None]` 是 typing 模块提供的类型注解，表示一个变量或返回值可以是两种类型之一。Python 3.10+ 中可以用更简洁的 `str | None` 替代 `Union[str, None]`，两者含义完全相同

由于我们必须用 `Query(default=None)` 替换默认值 `None`，`Query` 的第一个参数同样也是用于定义默认值。所以：

```python 
q: Union[str, None] = Query(default=None)
```


等同于：

```python 
q: str = None
```


但是 `Query` 显式地将其声明为查询参数。然后，我们可以将更多的参数传递给 `Query`。在本例中，适用于字符串的 `max_length` 参数：

### 6.4.2 添加更多校验

你还可以添加 `min_length` 参数：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Union[str, None] = Query(default=None, min_length=3, max_length=50),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.3 添加正则表达式

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Union[str, None] = Query(
        default=None, min_length=3, max_length=50, pattern="^fixedquery$"
    ),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


这个指定的正则表达式通过以下规则检查接收到的参数值：

- `^`：以该符号之后的字符开头，符号之前没有字符。
- `fixedquery`: 值精确地等于 `fixedquery`。
- `$`: 到此结束，在 `fixedquery` 之后没有更多字符。

### 6.4.4 默认值

你可以向 `Query` 的第一个参数传入 `None` 用作查询参数的默认值，以同样的方式你也可以传递其他默认值。假设你想要声明查询参数 `q`，使其 `min_length` 为 `3`，并且默认值为 `fixedquery`：

```python 
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(q: str = Query(default="fixedquery", min_length=3)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


具有默认值还会使该参数成为可选参数。

### 6.4.5 声明为必需参数

当我们不需要声明额外的校验或元数据时，只需不声明默认值就可以使 `q` 参数成为必需参数，例如：

```python 
q: str
```


代替：

```python 
q: Union[str, None] = None
```


因此，当你在使用 `Query` 且需要声明一个值是必需的时，只需不声明默认参数：

```python 
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(q: str = Query(min_length=3)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.6 使用`None`声明必需参数

你可以声明一个参数可以接收`None`值，但它仍然是必需的。这将强制客户端发送一个值，即使该值是`None`。为此，你可以声明`None`是一个有效的类型，并仍然使用`default=...`：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(q: Union[str, None] = Query(min_length=3)):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.7 查询参数列表（多个值）

当你使用 `Query` 显式地定义查询参数时，你还可以声明它去接收一组值，或换句话来说，接收多个值。例如，要声明一个可在 URL 中出现多次的查询参数 `q`，你可以这样写：

```python 
from typing import List, Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(q: Union[List[str], None] = Query(default=None)):
    query_items = {"q": q}
    return query_items
```


然后，输入如下网址：

```markdown 
http://localhost:8000/items/?q=foo&q=bar
```


你会在路径操作函数的函数参数 `q` 中以一个 Python `list` 的形式接收到查询参数 `q` 的多个值（`foo` 和 `bar`）。

因此，该 URL 的响应将会是：

```json 
{
  "q": [
    "foo",
    "bar"
  ]
}
```


### 6.4.8 声明更多元数据

你可以添加 `title`：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Union[str, None] = Query(default=None, title="Query string", min_length=3),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


以及 `description`：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Union[str, None] = Query(
        default=None,
        title="Query string",
        description="Query string for the items to search in the database that have a good match",
        min_length=3,
    ),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.9 别名参数

假设你想要查询参数为 `item-query`。像下面这样：

```markdown 
http://127.0.0.1:8000/items/?item-query=foobaritems
```


但是 `item-query` 不是一个有效的 Python 变量名称。最接近的有效名称是 `item_query`。但是你仍然要求它在 URL 中必须是 `item-query`...这时你可以用 `alias` 参数声明一个别名，该别名将用于在 URL 中查找查询参数值：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(q: Union[str, None] = Query(default=None, alias="item-query")):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```


### 6.4.10 弃用参数

现在假设你不再喜欢此参数。你不得不将其保留一段时间，因为有些客户端正在使用它，但你希望文档清楚地将其展示为已弃用。那么将参数 `deprecated=True` 传入 `Query`：

```python 
from typing import Union

from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Union[str, None] = Query(
        default=None,
        alias="item-query",
        title="Query string",
        description="Query string for the items to search in the database that have a good match",
        min_length=3,
        max_length=50,
        pattern="^fixedquery$",
        deprecated=True,
    ),
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

## 6.5 查询参数模型

如果你有一组具有相关性的**查询参数**，你可以创建一个 **Pydantic 模型**来声明它们。这将允许你在**多个地方**去**复用模型**，并且一次性为所有

参数声明验证和元数据。

### 6.5.1 使用 Pydantic 模型的查询参数

在一个 **Pydantic 模型**中声明你需要的**查询参数**，然后将参数声明为 `Query`：

```python 
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()

class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []

@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```


**FastAPI** 将会从请求的**查询参数**中**提取**出**每个字段**的数据，并将其提供给你定义的 Pydantic 模型。

### 6.5.2 禁止额外的查询参数

在一些特殊的使用场景中（可能不是很常见），你可能希望**限制**你要接收的查询参数。你可以使用 Pydantic 的模型配置来 `forbid`（意

为禁止）任何 `extra`（意为额外的 ）字段：

```python 
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()

class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}

    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```


假设有一个客户端尝试在**查询参数**中发送一些**额外的**数据，它将会收到一个**错误**响应。

# 7. 请求体

FastAPI 使用**请求体**从客户端（例如浏览器）向 API 发送数据。**请求体**是客户端发送给 API 的数据。**响应体**是 API 发送给客户端的数据。API 基本上肯定要发送**响应体**，但是客户端不一定发送**请求体**。使用 Pydantic 模型声明**请求体**，能充分利用它的功能和优点。

## 7.1 基本使用

```python 
from fastapi import FastAPI
#1. 从 pydantic 中导入 BaseModel
from pydantic import BaseModel

#2.创建数据模型：把数据模型声明为继承 BaseModel 的类（使用 Python 标准类型声明所有属性）。
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.post("/items/")
# 3.声明请求体参数：使用与声明路径和查询参数相同的方式声明请求体，把请求体添加至路径操作
async def create_item(item: Item):
    return item
```


## 7.2 使用模型

在路径操作函数内部直接访问模型对象的属性：

```python 
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.dict()
    if item.tax is not None:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict
```


## 7.3 请求体 + 路径参数

**FastAPI** 支持同时声明路径参数和请求体。**FastAPI** 能识别与**路径参数**匹配的函数参数，还能识别从**请求体**中获取的类型为 Pydantic 模型的函数参数。

```python 
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, **item.dict()}
```


## 7.4 请求体+路径参数+查询参数

**FastAPI** 支持同时声明**请求体**、**路径参数**和**查询参数**。**FastAPI** 能够正确识别这三种参数，并从正确的位置获取数据。

```python 
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, q: str | None = None):
    result = {"item_id": item_id, **item.dict()}
    if q:
        result.update({"q": q})
    return result
```


函数参数按如下规则进行识别：

- **路径**中声明了相同参数的参数，是路径参数
- 类型是（`int`、`float`、`str`、`bool` 等）**单类型**的参数，是**查询**参数
- 类型是 **Pydantic 模型**的参数，是**请求体**

> 因为默认值是 `None`， FastAPI 会把 `q` 当作可选参数。

## 7.5 请求体-多个参数

### 7.5.1 混合使用 `Path`、`Query` 和请求体参数

首先，毫无疑问地，你可以随意地混合使用 `Path`、`Query` 和请求体参数声明，**FastAPI** 会知道该如何处理。你还可以通过将默认值

设置为 `None` 来将请求体参数声明为可选参数：

```python 
from typing import Annotated

from fastapi import FastAPI, Path
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: str | None = None,
    item: Item | None = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```


> 请注意，在这种情况下，将从请求体获取的 `item` 是可选的。因为它的默认值为 `None`。

### 7.5.2 多个请求体参数

在上面的示例中，路径操作将期望一个具有 `Item` 的属性的 JSON 请求体，就像：

```json 
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2
}
```


但是你也可以声明多个请求体参数，例如 `item` 和 `user`：

```python 
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

class User(BaseModel):
    username: str
    full_name: str | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, user: User):
    results = {"item_id": item_id, "item": item, "user": user}
    return results
```

在这种情况下，**FastAPI** 将注意到该函数中有多个请求体参数（两个 Pydantic 模型参数）。因此，它将使用参数名称作为请求体中的键

（字段名称），并期望一个类似于以下内容的请求体：

```json 
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    }
}
```


> 请注意，即使 `item` 的声明方式与之前相同，但现在它被期望通过 `item` 键内嵌在请求体中。

**FastAPI** 将自动对请求中的数据进行转换，因此 `item` 参数将接收指定的内容，`user` 参数也是如此。它将执行对复合数据的校验，

并且像现在这样为 OpenAPI 模式和自动化文档对其进行记录。

### 7.5.3 请求体中的单一值

与使用 `Query` 和 `Path` 为查询参数和路径参数定义额外数据的方式相同，**FastAPI** 提供了一个同等的 `Body`。例如，为了扩展先

前的模型，你可能决定除了 `item` 和 `user` 之外，还想在同一请求体中具有另一个键 `importance`。如果你就按原样声明它，因为

它是一个单一值，**FastAPI** 将假定它是一个查询参数。但是你可以使用 `Body` 指示 **FastAPI** 将其作为请求体的另一个键进行处理。

```python 
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

class User(BaseModel):
    username: str
    full_name: str | None = None

@app.put("/items/{item_id}")
async def update_item(
    item_id: int, item: Item, user: User, importance: Annotated[int, Body()]
):
    results = {"item_id": item_id, "item": item, "user": user, "importance": importance}
    return results
```


在这种情况下，**FastAPI** 将期望像这样的请求体：

```json 
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    },
    "importance": 5
}
```


同样的，它将转换数据类型，校验，生成文档等。

### 7.5.4 多个请求体参数和查询参数

当然，除了请求体参数外，你还可以在任何需要的时候声明额外的查询参数。由于默认情况下单一值被解释为查询参数，因此你不必显式地添

加 `Query`，你可以仅执行以下操作：

```python 
q: str = None
```


比如：

```python 
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

class User(BaseModel):
    username: str
    full_name: str | None = None

@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int,
    item: Item,
    user: User,
    importance: Annotated[int, Body(gt=0)],
    q: str | None = None,
):
    results = {"item_id": item_id, "item": item, "user": user, "importance": importance}
    if q:
        results.update({"q": q})
    return results
```


### 7.5.5 嵌入单个请求体参数

假设你只有一个来自 Pydantic 模型 `Item` 的请求体参数 `item`。默认情况下，**FastAPI** 将直接期望这样的请求体。但是，如果你希

望它期望一个拥有 `item` 键并在值中包含模型内容的 JSON，就像在声明额外的请求体参数时所做的那样，则可以使用一个特殊的 

`Body` 参数 `embed`：

```python 
item: Item = Body(embed=True)
```


比如：

```python 
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```


在这种情况下，**FastAPI** 将期望像这样的请求体：

```json 
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    }
}
```


而不是：

```json 
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2
}
```


## 7.6 请求体-字段

与在路径操作函数中使用 `Query`、`Path` 、`Body` 声明校验与元数据的方式一样，可以使用 Pydantic 的 `Field` 在 Pydantic 

模型内部声明校验和元数据。

### 7.6.1 导入 `Field`

首先，从 Pydantic 中导入 `Field`：

```python 
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```


> 注意，与从 `fastapi` 导入 `Query`，`Path`、`Body` 不同，要直接从 `pydantic` 导入 `Field` 。

### 7.6.2 声明模型属性

然后，使用 `Field` 定义模型的属性：

```python 
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

`Field` 的工作方式和 `Query`、`Path`、`Body` 相同，参数也相同。

## 7.7 请求体-嵌套模型

使用 **FastAPI**，你可以定义、校验、记录文档并使用任意深度嵌套的模型（归功于Pydantic）。

### 7.7.1 List 字段

你可以将一个属性定义为拥有子元素的类型。例如 Python `list`：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list = []


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

这将使 `tags` 成为一个由元素组成的列表。不过它没有声明每个元素的类型。

### 7.7.2 具有子类型的 List 字段

但是 Python 有一种特定的方法来声明具有子类型的列表：从 typing 导入 `List`

1. 从 typing 导入 `List`

首先，从 Python 的标准库 `typing` 模块中导入 `List`：

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: List[str] = []

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

2. 声明具有子类型的 List

要声明具有子类型的类型，例如 `list`、`dict`、`tuple`：

- 从 `typing` 模块导入它们
- 使用方括号 `[` 和 `]` 将子类型作为「类型参数」传入

```python
from typing import List

my_list: List[str]
```

这完全是用于类型声明的标准 Python 语法。对具有子类型的模型属性也使用相同的标准语法。因此，在我们的示例中，我们可以将 

`tags` 明确地指定为一个「字符串列表」：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

### 7.7.3 Set 类型

但是随后我们考虑了一下，意识到标签不应该重复，它们很大可能会是唯一的字符串。Python 具有一种特殊的数据类型来保存一组唯一的元

素，即 `set`。然后我们可以导入 `Set` 并将 `tag` 声明为一个由 `str` 组成的 `set`：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

这样，即使你收到带有重复数据的请求，这些数据也会被转换为一组唯一项。而且，每当你输出该数据时，即使源数据有重复，它们也将作为

一组唯一项输出。并且还会被相应地标注 / 记录文档。

### 7.7.4 嵌套模型

Pydantic 模型的每个属性都具有类型。但是这个类型本身可以是另一个 Pydantic 模型。因此，你可以声明拥有特定属性名称、类型和

校验的深度嵌套的 JSON 对象。上述这些都可以任意的嵌套。

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 1.定义子模型
class Image(BaseModel):
    url: str
    name: str


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    # 2.将子模型用作类型
    image: Image | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

这意味着 **FastAPI** 将期望类似于以下内容的请求体：

```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2,
    "tags": ["rock", "metal", "bar"],
    "image": {
        "url": "http://example.com/baz.jpg",
        "name": "The Foo live"
    }
}
```

### 7.7.5 特殊的类型和校验

除了普通的单一值类型（如 `str`、`int`、`float` 等）外，你还可以使用从 `str` 继承的更复杂的单一值类型。要了解所有的可用选

项，请查看关于 [来自 Pydantic 的外部类型](https://docs.pydantic.dev/latest/concepts/types/) 的文档。你将在下一章节中看到一些示例。例如，在 `Image` 模型中我们有一个 `url` 

字段，我们可以把它声明为 Pydantic 的 `HttpUrl`，而不是 `str`：

```python
from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Image(BaseModel):
    url: HttpUrl
    name: str


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    image: Image | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

该字符串将被检查是否为有效的 URL，并在 JSON Schema / OpenAPI 文档中进行记录。

### 7.7.6 带有一组子模型的属性

你还可以将 Pydantic 模型用作 `list`、`set` 等的子类型：

```python
from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Image(BaseModel):
    url: HttpUrl
    name: str


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    images: list[Image] | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

这将期望（转换，校验，记录文档等）下面这样的 JSON 请求体：

```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2,
    "tags": [
        "rock",
        "metal",
        "bar"
    ],
    "images": [
        {
            "url": "http://example.com/baz.jpg",
            "name": "The Foo live"
        },
        {
            "url": "http://example.com/dave.jpg",
            "name": "The Baz"
        }
    ]
}
```

### 7.7.7 深度嵌套模型

你可以定义任意深度的嵌套模型：

```python
from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Image(BaseModel):
    url: HttpUrl
    name: str


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    images: list[Image] | None = None


class Offer(BaseModel):
    name: str
    description: str | None = None
    price: float
    items: list[Item]


@app.post("/offers/")
async def create_offer(offer: Offer):
    return offer
```

### 7.7.8 纯列表请求体

如果你期望的 JSON 请求体的最外层是一个 JSON `array`（即 Python `list`），则可以在路径操作函数的参数中声明此类型，就像声明 Pydantic 模型一样：

```
images: List[Image]
```

例如：

```python
from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()

class Image(BaseModel):
    url: HttpUrl
    name: str

@app.post("/images/multiple/")
async def create_multiple_images(images: list[Image]):
    return images
```

# 8. 模式的额外信息

您可以在JSON模式中定义额外的信息。一个常见的用例是添加一个将在文档中显示的`example`。有几种方法可以声明额外的 JSON 模式信

息。

## 8.1 Pydantic `schema_extra`

您可以使用 `Config` 和 `schema_extra` 为Pydantic模型声明一个示例，如

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ]
        }
    }


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

这些额外的信息将按原样添加到输出的JSON模式中。

## 8.2 `Field` 的附加参数

在 `Field`, `Path`, `Query`, `Body` 和其他你之后将会看到的工厂函数，你可以为JSON 模式声明额外信息，你也可以通过给工厂

函数传递其他的任意参数来给JSON 模式声明额外信息，比如增加 `example`:

```py
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str = Field(examples=["Foo"])
    description: str | None = Field(default=None, examples=["A very nice Item"])
    price: float = Field(examples=[35.4])
    tax: float | None = Field(default=None, examples=[3.2])


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

## 8.3 `Body` 额外参数

你可以通过传递额外信息给 `Field` 同样的方式操作`Path`, `Query`, `Body`等。比如，你可以将请求体的一个 `example` 传递给 

`Body`:

```python
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Annotated[
        Item,
        Body(
            examples=[
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ],
        ),
    ],
):
    results = {"item_id": item_id, "item": item}
    return results
```

# 9. Cookie 参数

定义 `Cookie` 参数与定义 `Query` 和 `Path` 参数一样。

```python
from typing import Annotated
#1.导入 Cookie
from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
# 2.声明 Cookie 参数:第一个值是默认值，还可以传递所有验证参数或注释参数：
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

> `Cookie` 、`Path` 、`Query` 是**兄弟类**，都继承自共用的 `Param` 类。注意，从 `fastapi` 导入的 `Query`、`Path`、`Cookie` 等对象，实际上是返回特殊类的函数。

必须使用 `Cookie` 声明 cookie 参数，否则该参数会被解释为查询参数。

## 9.1 参数模型

如果您有一组相关的 **cookie**，您可以创建一个 **Pydantic 模型**来声明它们。这将允许您在**多个地方**能够**重用模型**，并且可以一次性声明所

有参数的验证方式和元数据。

### 9.1.1 带有 Pydantic 模型的 Cookie

在 **Pydantic** 模型中声明所需的 **cookie** 参数，然后将参数声明为 `Cookie` ：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None


@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

**FastAPI** 将从请求中接收到的 **cookie** 中**提取**出**每个字段**的数据，并提供您定义的 Pydantic 模型。

### 9.1.2 禁止额外的 Cookie

在某些特殊使用情况下（可能并不常见），您可能希望**限制**您想要接收的 cookie。您的 API 现在可以控制自己的 cookie 同意。您可以

使用 Pydantic 的模型配置来禁止（ `forbid` ）任何额外（ `extra` ）字段：

```python
from typing import Annotated, Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None


@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

如果客户尝试发送一些**额外的 cookie**，他们将收到**错误**响应。可怜的 cookie 通知条，费尽心思为了获得您的同意，却被API 拒绝了。

例如，如果客户端尝试发送一个值为 `good-list-please` 的 `santa_tracker` cookie，客户端将收到一个**错误**响应，告知他们

 `santa_tracker` cookie 是不允许的：

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["cookie", "santa_tracker"],
            "msg": "Extra inputs are not permitted",
            "input": "good-list-please",
        }
    ]
}
```

# 10. Header 参数

定义 `Header` 参数的方式与定义 `Query`、`Path`、`Cookie` 参数相同。

```py
from typing import Annotated
#1.导入 Header
from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
#2.声明 Header 参数:第一个值是默认值，还可以传递所有验证参数或注释参数
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

## 10.1 自动转换

`Header` 比 `Path`、`Query` 和 `Cookie` 提供了更多功能。大部分标准请求头用**连字符**分隔，即**减号**（`-`）。但是 `user-`

`agent` 这样的变量在 Python 中是无效的。因此，默认情况下，`Header` 把参数名中的字符由下划线（`_`）改为连字符（`-`）来提

取并存档请求头 。同时，HTTP 的请求头不区分大小写，可以使用 Python 标准样式（即 **snake_case**）进行声明。因此，可以像在 

Python 代码中一样使用 `user_agent` ，无需把首字母大写为 `User_Agent` 等形式。如需禁用下划线自动转换为连字符，可以把 

`Header` 的 `convert_underscores` 参数设置为 `False`： 

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(
    strange_header: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    return {"strange_header": strange_header}
```

## 10.2 重复的请求头

有时，可能需要接收重复的请求头。即同一个请求头有多个值。类型声明中可以使用 `list` 定义多个请求头。使用 Python `list` 可

以接收重复请求头所有的值。例如，声明 `X-Token` 多次出现的请求头，可以写成这样：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[list[str] | None, Header()] = None):
    return {"X-Token values": x_token}
```

与*路径操作*通信时，以下面的方式发送两个 HTTP 请求头：

```
X-Token: foo
X-Token: bar
```

响应结果是：

```json
{
    "X-Token values": [
        "bar",
        "foo"
    ]
}
```

## 10.3 参数模型

如果您有一组相关的 **header 参数**，您可以创建一个 **Pydantic 模型**来声明它们。这将允许您在**多个地方**能够**重用模型**，并且可以一次性

声明所有参数的验证和元数据。

### 10.3.1 使用 Pydantic 模型的 Header 参数

在 **Pydantic 模型**中声明所需的 **header 参数**，然后将参数声明为 `Header` :

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

**FastAPI** 将从请求中接收到的 **headers** 中**提取**出**每个字段**的数据，并提供您定义的 Pydantic 模型。

### 10.3.2 禁止额外的 Headers

在某些特殊使用情况下（可能并不常见），您可能希望**限制**您想要接收的 headers。您可以使用 Pydantic 的模型配置来禁止（ `forbid` ）任何额外（ `extra` ）字段：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

如果客户尝试发送一些**额外的 headers**，他们将收到**错误**响应。

例如，如果客户端尝试发送一个值为 `plumbus` 的 `tool` header，客户端将收到一个**错误**响应，告知他们 header 参数 `tool` 是不允许的：

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["header", "tool"],
            "msg": "Extra inputs are not permitted",
            "input": "plumbus",
        }
    ]
}
```

# 11. 响应模型

你可以在任意的*路径操作*中使用 `response_model` 参数来声明用于响应的模型：

- `@app.get()`
- `@app.post()`
- `@app.put()`
- `@app.delete()`

```python
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Any:
    return item


@app.get("/items/", response_model=list[Item])
async def read_items() -> Any:
    return [
        {"name": "Portal Gun", "price": 42.0},
        {"name": "Plumbus", "price": 32.0},
    ]
```

> 注意，`response_model`是「装饰器」方法（`get`，`post` 等）的一个参数。不像之前的所有参数和请求体，它不属于*路径操作函数*。

它接收的类型与你将为 Pydantic 模型属性所声明的类型相同，因此它可以是一个 Pydantic 模型，但也可以是一个由 Pydantic 模型

组成的 `list`，例如 `List[Item]`。FastAPI 将使用此 `response_model` 来：

- 将输出数据转换为其声明的类型。
- 校验数据。
- 在 OpenAPI 的*路径操作*中为响应添加一个 JSON Schema。
- 并在自动生成文档系统中使用。

但最重要的是：

- 会将输出数据限制在该模型定义内。

> 响应模型在参数中被声明，而不是作为函数返回类型的注解，这是因为路径函数可能不会真正返回该响应模型，而是返回一个 `dict`、数据库对象或其他模型，然后再使用 `response_model` 来执行字段约束和序列化。

## 11.1 返回与输入相同的数据

现在我们声明一个 `UserIn` 模型，它将包含一个明文密码属性。

```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()


class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: Union[str, None] = None


# Don't do this in production!
@app.post("/user/")
async def create_user(user: UserIn) -> UserIn:
    return user
```

现在，每当浏览器使用一个密码创建用户时，API 都会在响应中返回相同的密码。在这个案例中，这可能不算是问题，因为用户自己正在发

送密码。但是，如果我们在其他的*路径操作*中使用相同的模型，则可能会将用户的密码发送给每个客户端。

## 11.2 添加输出模型

相反，我们可以创建一个有明文密码的输入模型和一个没有明文密码的输出模型：

```python
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()


class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: str | None = None


class UserOut(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None


@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn) -> Any:
    return user
```

这样，即便我们的*路径操作函数*将会返回包含密码的相同输入用户.因此，**FastAPI** 将会负责过滤掉未在输出模型中声明的所有数据（使用 Pydantic）。

## 11.3 响应模型编码参数

你的响应模型可以具有默认值，例如：

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5
    tags: List[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get("/items/{item_id}", response_model=Item, response_model_exclude_unset=True)
async def read_item(item_id: str):
    return items[item_id]
```

- `description: Union[str, None] = None` 具有默认值 `None`。
- `tax: float = 10.5` 具有默认值 `10.5`.
- `tags: List[str] = []` 具有一个空列表作为默认值： `[]`.

但如果它们并没有存储实际的值，你可能想从结果中忽略它们的默认值。举个例子，当你在 NoSQL 数据库中保存了具有许多可选属性的模

型，但你又不想发送充满默认值的很长的 JSON 响应。

### 11.3.1 使用 `response_model_exclude_unset` 参数

你可以设置*路径操作装饰器*的 `response_model_exclude_unset=True` 参数：

```python
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5
    tags: List[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get("/items/{item_id}", response_model=Item, response_model_exclude_unset=True)
async def read_item(item_id: str):
    return items[item_id]
```

然后响应中将不会包含那些默认值，而是仅有实际设置的值。

因此，如果你向*路径操作*发送 ID 为 `foo` 的商品的请求，则响应（不包括默认值）将为：

```json
{
    "name": "Foo",
    "price": 50.2
}
```

#### 1.默认值字段有实际值的数据

但是，如果你的数据在具有默认值的模型字段中有实际的值，例如 ID 为 `bar` 的项：

```json
{
    "name": "Bar",
    "description": "The bartenders",
    "price": 62,
    "tax": 20.2
}
```

这些值将包含在响应中。

#### 2.具有与默认值相同值的数据

如果数据具有与默认值相同的值，例如 ID 为 `baz` 的项：

```json
{
    "name": "Baz",
    "description": None,
    "price": 50.2,
    "tax": 10.5,
    "tags": []
}
```

即使 `description`、`tax` 和 `tags` 具有与默认值相同的值，FastAPI 足够聪明 (实际上是 Pydantic 足够聪明) 去认识到这一点，它们的值被显式地所设定（而不是取自默认值）。

因此，它们将包含在 JSON 响应中。

### 11.3.2 `response_model_include` 和 `response_model_exclude`

你还可以使用*路径操作装饰器*的 `response_model_include` 和 `response_model_exclude` 参数。它们接收一个由属性名称 

`str` 组成的 `set` 来包含（忽略其他的）或者排除（包含其他的）这些属性。如果你只有一个 Pydantic 模型，并且想要从输出中

移除一些数据，则可以使用这种快捷方法。

>但是依然建议你使用上面提到的主意，使用多个类而不是这些参数。这是因为即使使用 `response_model_include` 或 `response_model_exclude` 来省略某些属性，在应用程序的 OpenAPI 定义（和文档）中生成的 JSON Schema 仍将是完整的模型。这也适用于作用类似的 `response_model_by_alias`。

```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The Bar fighters", "price": 62, "tax": 20.2},
    "baz": {
        "name": "Baz",
        "description": "There goes my baz",
        "price": 50.2,
        "tax": 10.5,
    },
}


@app.get(
    "/items/{item_id}/name",
    response_model=Item,
    response_model_include={"name", "description"},
)
async def read_item_name(item_id: str):
    return items[item_id]


@app.get("/items/{item_id}/public", response_model=Item, response_model_exclude={"tax"})
async def read_item_public_data(item_id: str):
    return items[item_id]
```

#### 1.使用 `list` 而不是 `set`

如果你忘记使用 `set` 而是使用 `list` 或 `tuple`，FastAPI 仍会将其转换为 `set` 并且正常工作：

```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The Bar fighters", "price": 62, "tax": 20.2},
    "baz": {
        "name": "Baz",
        "description": "There goes my baz",
        "price": 50.2,
        "tax": 10.5,
    },
}


@app.get(
    "/items/{item_id}/name",
    response_model=Item,
    response_model_include=["name", "description"],
)
async def read_item_name(item_id: str):
    return items[item_id]


@app.get("/items/{item_id}/public", response_model=Item, response_model_exclude=["tax"])
async def read_item_public_data(item_id: str):
    return items[item_id]
```

# 12. 更多模型

多个关联模型这种情况很常见,特别是用户模型，因为：

- **输入模型**应该含密码
- **输出模型**不应含密码
- **数据库模型**需要加密的密码

## 12.1 多个模型

















# 13. 响应状态码

# 14. 表单数据
