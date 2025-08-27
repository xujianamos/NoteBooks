# Pydantic

Pydantic 是 Python 中使用最广泛的数据验证库。

优点：

- 由类型提示驱动——借助 Pydantic，模式验证和序列化由类型注释控制；学习的更少，编写的代码更少，并且与您的 IDE 和静态分析工具集成。
- 速度——Pydantic 的核心验证逻辑是用 Rust 编写的。因此，Pydantic 是 Python 中最快的数据验证库之一。
- JSON 模式——Pydantic 模型可以生成 JSON 模式，从而便于与其他工具进行集成。

# 安装

```python 
pip install pydantic

```


Pydantic 有一些依赖项：

- `pydantic-core` ：用 Rust 编写的 pydantic 的核心验证逻辑。
- `typing-extensions` ：标准库 \[typing] 模块的回溯移植。
- `annotated-types` ：可与 \[ `typing.Annotated` ]\[ `typing.Annotated` ] 一起使用的可重用约束类型。

## 可选依赖项

Pydantic 有以下可选依赖项：

- 如果需要进行电子邮件验证，可以添加 email-validator。

安装 Pydantic 时一起安装可选依赖项：

`pip install pydantic[email]`

当然，你也可以使用 `pip install email-validator` 手动安装需求 。

## 从仓库安装

并且如果你更倾向于直接从仓库安装 Pydantic：

```bash 
pip install git+https://github.com/pydantic/pydantic@main#egg=pydantic
# or with extras
pip install git+https://github.com/pydantic/pydantic@main#egg=pydantic[email]
```


# 基本使用

```python 
from datetime import datetime

from pydantic import BaseModel, PositiveInt


class User(BaseModel):
    # id 的类型是 int ；仅注释声明告知 Pydantic 该字段是必需的。如果可能，字符串、字节或浮点数将被强制转换为整数；否则将引发异常。
    id: int
    name: str = "John Doe"  # name 是一个字符串；因为它有默认值，所以不需要。
    signup_ts: datetime | None  # signup_ts 是一个必填的 datetime 字段，但值 None 可以提供；Pydantic 将处理 Unix 时间戳整数（例如 1496498400 ）或表示日期和时间的字符串。
    tastes: dict[
        str, PositiveInt
    ]  # tastes 是一个键为字符串且值为正整数的字典。 PositiveInt 类型是 Annotated[int, annotated_types.Gt(0)] 的简写。


external_data = {
    "id": 123,
    "signup_ts": "2019-06-01 12:22",  # 这里的输入是一个 ISO8601 格式的日期时间，Pydantic 将把它转换为一个 datetime 对象。
    "tastes": {
        "wine": 9,
        b"cheese": 7,  # 关键在这里是 bytes ，但 Pydantic 会负责将其强制转换为字符串。
        "cabbage": "1",  # 同样地，Pydantic 会将字符串 '1' 强制转换为整数 1 。
    },
}

# 这里通过将外部数据作为关键字参数传递给 User 来创建 User 的实例
user = User(**external_data)

# 我们可以将字段作为模型的属性来访问
print(user.id)
# > 123

# 我们可以将模型转换为带有 model_dump() 的字典
print(user.model_dump())
"""
{
    'id': 123,
    'name': 'John Doe',
    'signup_ts': datetime.datetime(2019, 6, 1, 12, 22),
    'tastes': {'wine': 9, 'cheese': 7, 'cabbage': 1},
}
"""

```
