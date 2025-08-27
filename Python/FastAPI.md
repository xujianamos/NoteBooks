# FastAPI

## 目录

- [环境变量](#环境变量)
- [虚拟环境](#虚拟环境)
  - [创建一个虚拟环境](#创建一个虚拟环境)
  - [激活虚拟环境](#激活虚拟环境)
  - [检查虚拟环境是否激活](#检查虚拟环境是否激活)
  - [退出虚拟环境](#退出虚拟环境)
- [安装 FastAPI](#安装-FastAPI)
- [快速入门](#快速入门)
  - [交互式 API 文档](#交互式-API-文档)
- [路径参数](#路径参数)
  - [声明路径参数的类型](#声明路径参数的类型)
  - [顺序很重要](#顺序很重要)
  - [预设值](#预设值)
    - [使用 Enum 类](#使用-Enum-类)
    - [包含路径的路径参数](#包含路径的路径参数)
- [查询参数](#查询参数)
  - [默认值](#默认值)
  - [可选参数](#可选参数)
  - [多个路径和查询参数](#多个路径和查询参数)
    - [必选查询参数](#必选查询参数)
- [请求体](#请求体)
  - [基本使用](#基本使用)
  - [使用模型](#使用模型)
  - [请求体 + 路径参数](#请求体--路径参数)
    - [请求体 + 路径参数 + 查询参数](#请求体--路径参数--查询参数)
- [查询参数和字符串校验](#查询参数和字符串校验)
  - [额外的校验](#额外的校验)
  - [添加更多校验](#添加更多校验)
  - [添加正则表达式](#添加正则表达式)
  - [默认值](#默认值)
  - [声明为必需参数](#声明为必需参数)
    - [使用None声明必需参数](#使用None声明必需参数)
  - [查询参数列表 / 多个值](#查询参数列表--多个值)
  - [声明更多元数据](#声明更多元数据)
  - [别名参数](#别名参数)
  - [弃用参数](#弃用参数)
- [路径参数和数值校验](#路径参数和数值校验)
  - [声明元数据](#声明元数据)
  - [按需对参数排序](#按需对参数排序)
  - [按需对参数排序的技巧](#按需对参数排序的技巧)
  - [数值校验](#数值校验)
    - [大于等于](#大于等于)
    - [大于和小于等于](#大于和小于等于)
    - [浮点数、大于和小于](#浮点数大于和小于)
- [查询参数模型](#查询参数模型)
  - [使用 Pydantic 模型的查询参数](#使用-Pydantic-模型的查询参数)
  - [禁止额外的查询参数](#禁止额外的查询参数)
- [请求体 - 多个参数](#请求体---多个参数)
  - [混合使用 Path、Query 和请求体参数](#混合使用PathQuery和请求体参数)
  - [多个请求体参数](#多个请求体参数)
  - [请求体中的单一值](#请求体中的单一值)
  - [多个请求体参数和查询参数](#多个请求体参数和查询参数)
  - [嵌入单个请求体参数](#嵌入单个请求体参数)
- [请求体 - 字段](#请求体---字段)
  - [导入 Field](#导入Field)
  - [声明模型属性](#声明模型属性)

# 环境变量

你在 **shell（终端）中就可以**创建和使用环境变量，并不需要用到 Python：

```markdown 
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

```bash 
# 这里我们还没有设置环境变量
$python main.py
# 因为我们没有设置环境变量，所以我们得到的是默认值
$Hello World from Python
# 但是如果我们事先创建过一个环境变量
$export MY_NAME="Wade Wilson"
# 然后再次调用程序
$python main.py
# 现在就可以读取到环境变量了
$Hello Wade Wilson from Python

```


由于环境变量可以在代码之外设置、但可以被代码读取，并且不必与其他文件一起存储（提交到 `git`），因此通常用于配置或**设置**。

你还可以为**特定的程序调用**创建特定的环境变量，该环境变量仅对该程序可用，且仅在其运行期间有效。

要实现这一点，只需在同一行内、程序本身之前创建它：

```markdown 
# 在这个程序调用的同一行中创建一个名为 MY_NAME 的环境变量
MY_NAME="Wade Wilson" python main.py
# 现在就可以读取到环境变量了
Hello Wade Wilson from Python
# 在此之后这个环境变量将不会依然存在
python main.py

```


# 虚拟环境

当你在 Python 工程中工作时，你可能会有必要用到一个**虚拟环境**（或类似的机制）来隔离你为每个工程安装的包。

## 创建一个虚拟环境

在开始一个 Python 工程的**第一时间**，**在你的工程内部**创建一个虚拟环境。

> 你只需要 **在每个工程中操作一次**，而不是每次工作时都操作。

如果你安装了 [uv](https://github.com/astral-sh/uv "uv")，你也可以使用它来创建一个虚拟环境。

```bash 
$ uv venv
```


> 默认情况下，`uv` 会在一个名为 `.venv` 的目录中创建一个虚拟环境。但你可以通过传递一个额外的参数来自定义它，指定目录的名称。

## 激活虚拟环境

激活新的虚拟环境来确保你运行的任何 Python 命令或安装的包都能使用到它。

> **每次**开始一个 **新的终端会话** 来工作在这个工程时，你都需要执行这个操作。

```bash 
$ source .venv/bin/activate
```


> 每次你在这个环境中安装一个 **新的包** 时，都需要 **重新激活** 这个环境。这么做确保了当你使用一个由这个包安装的 **终端（CLI）程序** 时，你使用的是你的虚拟环境中的程序，而不是全局安装、可能版本不同的程序。

## 检查虚拟环境是否激活

```bash 
$ which python
```


如果它显示了在你工程 的 `.venv/bin/python` 中的 `python` 二进制文件，那么它就生效了。

## 退出虚拟环境

当你完成工作后，你可以**退出**虚拟环境。

```bash 
$ deactivate
```


这样，当你运行 `python` 时，它不会尝试从安装了软件包的虚拟环境中运行。（即，它将不再会尝试从虚拟环境中运行，也不会使用其中安装的软件包。）

# 安装 FastAPI

请确保您创建并激活一个[虚拟环境](https://fastapi.tiangolo.com/zh/virtual-environments/ "虚拟环境")，然后**安装 FastAPI**：

```bash 
pip install "fastapi[standard]"
```


> 当您使用 `pip install "fastapi[standard]"` 进行安装时，它会附带一些默认的可选标准依赖项。如果您不想安装这些可选依赖，可以选择安装 `pip install fastapi`。

# 快速入门

最简单的 FastAPI 文件可能像下面这样：

```python 
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
```


### 交互式 API 文档

跳转到 <http://127.0.0.1:8000/docs。你将会看到自动生成的交互式> API 文档（由 Swagger UI 提供）。

前往 <http://127.0.0.1:8000/redoc。你将会看到可选的自动生成文档> （由 [ReDoc](https://github.com/Rebilly/ReDoc "ReDoc") 提供）。

# 路径参数

FastAPI 支持使用 Python 字符串格式化语法声明**路径参数**（**变量**）：

```python 
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}
```


这段代码把路径参数 `item_id` 的值传递给路径函数的参数 `item_id`。

## 声明路径参数的类型

使用 Python 标准类型注解，声明路径操作函数中路径参数的类型。

```python 
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```


> 注意，函数接收并返回的值是 `3`（ `int`），不是 `"3"`（`str`）。**FastAPI** 通过类型声明自动**解析**请求中的数据。

## 顺序很重要

有时，*路径操作*中的路径是写死的。

比如要使用 `/users/me` 获取当前用户的数据。

然后还要使用 `/users/{user_id}`，通过用户 ID 获取指定用户的数据。

由于*路径操作*是按顺序依次运行的，因此，一定要在 `/users/{user_id}` 之前声明 `/users/me` ：

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


否则，`/users/{user_id}` 将匹配 `/users/me`，FastAPI 会**认为**正在接收值为 `"me"` 的 `user_id` 参数。

## 预设值

路径操作使用 Python 的 `Enum` 类型接收预设的*路径参数*。

### 使用 Enum 类

导入 `Enum` 并创建继承自 `str` 和 `Enum` 的子类。

通过从 `str` 继承，API 文档就能把值的类型定义为**字符串**，并且能正确渲染。

然后，创建包含固定值的类属性，这些固定值是可用的有效值：

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

### 包含路径的路径参数

假设*路径操作*的路径为 `/files/{file_path}`。但需要 `file_path` 中也包含*路径*，比如，`home/johndoe/myfile.txt`。此时，该文件的 URL 是这样的：`/files/home/johndoe/myfile.txt`。

OpenAPI 不支持声明包含路径的*路径参数*，因为这会导致测试和定义更加困难。不过，仍可使用 Starlette 内置工具在 **FastAPI** 中实现这一功能。而且不影响文档正常运行，但是不会添加该参数包含路径的说明。

直接使用 Starlette 的选项声明包含*路径*的*路径参数*：

```markdown 
/files/{file_path:path}
```


本例中，参数名为 `file_path`，结尾部分的 `:path` 说明该参数应匹配*路径*。

```python 
from fastapi import FastAPI

app = FastAPI()


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```


> 注意，包含 `/home/johndoe/myfile.txt` 的路径参数要以斜杠（`/`）开头。本例中的 URL 是 `/files//home/johndoe/myfile.txt`。注意，`files` 和 `home` 之间要使用**双斜杠**（`//`）。

# 查询参数

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

### 默认值

查询参数不是路径的固定内容，它是可选的，还支持默认值。

上例用 `skip=0` 和 `limit=10` 设定默认值。

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

### 可选参数

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

## 多个路径和查询参数

**FastAPI** 可以识别同时声明的多个路径参数和查询参数。

而且声明查询参数的顺序并不重要。

FastAPI 通过参数名进行检测：

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


### 必选查询参数

为不是路径参数的参数声明默认值（至此，仅有查询参数），该参数就**不是必选**的了。

如果只想把参数设为**可选**，但又不想指定参数的值，则要把默认值设为 `None`。

如果要把查询参数设置为**必选**，就不要声明默认值：

```python 
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_user_item(item_id: str, needy: str):
    item = {"item_id": item_id, "needy": needy}
    return item
```


这里的查询参数 `needy` 是类型为 `str` 的必选查询参数。

# 请求体

FastAPI 使用**请求体**从客户端（例如浏览器）向 API 发送数据。

**请求体**是客户端发送给 API 的数据。**响应体**是 API 发送给客户端的数据。

API 基本上肯定要发送**响应体**，但是客户端不一定发送**请求体**。

使用 Pydantic 模型声明**请求体**，能充分利用它的功能和优点。

### 基本使用

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


## 使用模型

在*路径操作*函数内部直接访问模型对象的属性：

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


## 请求体 + 路径参数

**astAPI** 支持同时声明路径参数和请求体。

**FastAPI** 能识别与**路径参数**匹配的函数参数，还能识别从**请求体**中获取的类型为 Pydantic 模型的函数参数。

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


### 请求体 + 路径参数 + 查询参数

**FastAPI** 支持同时声明**请求体**、**路径参数**和**查询参数**。

**FastAPI** 能够正确识别这三种参数，并从正确的位置获取数据。

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

# 查询参数和字符串校验

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


### 额外的校验

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


由于我们必须用 `Query(default=None)` 替换默认值 `None`，`Query` 的第一个参数同样也是用于定义默认值。

所以：

```python 
q: Union[str, None] = Query(default=None)
```


等同于：

```python 
q: str = None
```


但是 `Query` 显式地将其声明为查询参数。

然后，我们可以将更多的参数传递给 `Query`。在本例中，适用于字符串的 `max_length` 参数：

## 添加更多校验

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


## 添加正则表达式

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

## 默认值

你可以向 `Query` 的第一个参数传入 `None` 用作查询参数的默认值，以同样的方式你也可以传递其他默认值。

假设你想要声明查询参数 `q`，使其 `min_length` 为 `3`，并且默认值为 `fixedquery`：

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

## 声明为必需参数

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


### 使用`None`声明必需参数

你可以声明一个参数可以接收`None`值，但它仍然是必需的。这将强制客户端发送一个值，即使该值是`None`。

为此，你可以声明`None`是一个有效的类型，并仍然使用`default=...`：

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


## 查询参数列表 / 多个值

当你使用 `Query` 显式地定义查询参数时，你还可以声明它去接收一组值，或换句话来说，接收多个值。

例如，要声明一个可在 URL 中出现多次的查询参数 `q`，你可以这样写：

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


你会在*路径操作函数*的*函数参数* `q` 中以一个 Python `list` 的形式接收到*查询参数* `q` 的多个值（`foo` 和 `bar`）。

因此，该 URL 的响应将会是：

```json 
{
  "q": [
    "foo",
    "bar"
  ]
}
```


## 声明更多元数据

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


## 别名参数

假设你想要查询参数为 `item-query`。

像下面这样：

```markdown 
http://127.0.0.1:8000/items/?item-query=foobaritems
```


但是 `item-query` 不是一个有效的 Python 变量名称。

最接近的有效名称是 `item_query`。

但是你仍然要求它在 URL 中必须是 `item-query`...

这时你可以用 `alias` 参数声明一个别名，该别名将用于在 URL 中查找查询参数值：

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


## 弃用参数

现在假设你不再喜欢此参数。

你不得不将其保留一段时间，因为有些客户端正在使用它，但你希望文档清楚地将其展示为已弃用。

那么将参数 `deprecated=True` 传入 `Query`：

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


# 路径参数和数值校验

与使用 `Query` 为查询参数声明更多的校验和元数据的方式相同，你也可以使用 `Path` 为路径参数声明相同类型的校验和元数据。

## 声明元数据

你可以声明与 `Query` 相同的所有参数。

例如，要声明路径参数 `item_id`的 `title` 元数据值，你可以输入：

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


## 按需对参数排序

假设你想要声明一个必需的 `str` 类型查询参数 `q`。

而且你不需要为该参数声明任何其他内容，所以实际上你并不需要使用 `Query`。

但是你仍然需要使用 `Path` 来声明路径参数 `item_id`。

如果你将带有「默认值」的参数放在没有「默认值」的参数之前，Python 将会报错。

但是你可以对其重新排序，并将不带默认值的值（查询参数 `q`）放到最前面。

对 **FastAPI** 来说这无关紧要。它将通过参数的名称、类型和默认值声明（`Query`、`Path` 等）来检测参数，而不在乎参数的顺序。

因此，你可以将函数声明为：

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


## 按需对参数排序的技巧

如果你想不使用 `Query` 声明没有默认值的查询参数 `q`，同时使用 `Path` 声明路径参数 `item_id`，并使它们的顺序与上面不同，Python 对此有一些特殊的语法。

传递 `*` 作为函数的第一个参数。

Python 不会对该 `*` 做任何事情，但是它将知道之后的所有参数都应作为关键字参数（键值对），也被称为 `kwargs`，来调用。即使它们没有默认值。

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


## 数值校验

### 大于等于

使用 `Query` 和 `Path`（以及你将在后面看到的其他类）可以声明字符串约束，但也可以声明数值约束。

像下面这样，添加 `ge=1` 后，`item_id` 将必须是一个大于（`g`reater than）或等于（`e`qual）`1` 的整数。

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


### 大于和小于等于

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


### 浮点数、大于和小于

数值校验同样适用于 `float` 值。

能够声明 `gt` 而不仅仅是 `ge` 在这个前提下变得重要起来。例如，你可以要求一个值必须大于 `0`，即使它小于 `1`。

因此，`0.5` 将是有效值。但是 `0.0`或 `0` 不是。

对于 `lt` 也是一样的。

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


# 查询参数模型

如果你有一组具有相关性的**查询参数**，你可以创建一个 **Pydantic 模型**来声明它们。这将允许你在**多个地方**去**复用模型**，并且一次性为所有参数声明验证和元数据。

## 使用 Pydantic 模型的查询参数

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

## 禁止额外的查询参数

在一些特殊的使用场景中（可能不是很常见），你可能希望**限制**你要接收的查询参数。

你可以使用 Pydantic 的模型配置来 `forbid`（意为禁止）任何 `extra`（意为额外的 ）字段：

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

# 请求体 - 多个参数

## 混合使用 `Path`、`Query` 和请求体参数

首先，毫无疑问地，你可以随意地混合使用 `Path`、`Query` 和请求体参数声明，**FastAPI** 会知道该如何处理。

你还可以通过将默认值设置为 `None` 来将请求体参数声明为可选参数：

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

## 多个请求体参数

在上面的示例中，*路径操作*将期望一个具有 `Item` 的属性的 JSON 请求体，就像：

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


在这种情况下，**FastAPI** 将注意到该函数中有多个请求体参数（两个 Pydantic 模型参数）。

因此，它将使用参数名称作为请求体中的键（字段名称），并期望一个类似于以下内容的请求体：

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

**FastAPI** 将自动对请求中的数据进行转换，因此 `item` 参数将接收指定的内容，`user` 参数也是如此。

它将执行对复合数据的校验，并且像现在这样为 OpenAPI 模式和自动化文档对其进行记录。

## 请求体中的单一值

与使用 `Query` 和 `Path` 为查询参数和路径参数定义额外数据的方式相同，**FastAPI** 提供了一个同等的 `Body`。

例如，为了扩展先前的模型，你可能决定除了 `item` 和 `user` 之外，还想在同一请求体中具有另一个键 `importance`。

如果你就按原样声明它，因为它是一个单一值，**FastAPI** 将假定它是一个查询参数。

但是你可以使用 `Body` 指示 **FastAPI** 将其作为请求体的另一个键进行处理。

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

## 多个请求体参数和查询参数

当然，除了请求体参数外，你还可以在任何需要的时候声明额外的查询参数。

由于默认情况下单一值被解释为查询参数，因此你不必显式地添加 `Query`，你可以仅执行以下操作：

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


## 嵌入单个请求体参数

假设你只有一个来自 Pydantic 模型 `Item` 的请求体参数 `item`。

默认情况下，**FastAPI** 将直接期望这样的请求体。

但是，如果你希望它期望一个拥有 `item` 键并在值中包含模型内容的 JSON，就像在声明额外的请求体参数时所做的那样，则可以使用一个特殊的 `Body` 参数 `embed`：

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


# 请求体 - 字段

与在*路径操作函数*中使用 `Query`、`Path` 、`Body` 声明校验与元数据的方式一样，可以使用 Pydantic 的 `Field` 在 Pydantic 模型内部声明校验和元数据。

## 导入 `Field`

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

## 声明模型属性

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
