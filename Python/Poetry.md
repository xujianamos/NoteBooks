# Poetry

# 1.简介

**Poetry 是一个用于 Python依赖管理**和**打包的**工具。它允许你声明项目依赖的库，并会自动管理（安装/更新）这些库。Poetry 提供了一个锁定文件来确保安装的可重复性，并且可以构建用于分发的项目。

Poetry 需要**Python 3.9 或**更高版本。它是跨平台的，目标是使其在 Linux、macOS 和 Windows 上都能完美运行。

# 2.安装

**推荐方式**：使用官方脚本安装（避免依赖冲突）

```bash
curl -sSL https://install.python-poetry.org | python3 -
# windows安装
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Poetry 安装完毕并添加到您的系统中后`$PATH`，您可以执行以下操作：

```bash
poetry --version
```

如果您看到类似这样的信息`Poetry (version 2.0.0)`，说明您的安装已经准备就绪！

## 2.1配置虚拟环境路径

将虚拟环境创建在项目目录内（避免全局污染）.

```bash
poetry config virtualenvs.in-project true
```

## 2.2设置国内镜像源（加速依赖下载）

在 `pyproject.toml` 中添加清华源：

```toml
[[tool.poetry.source]]
name = "tuna"
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
priority = "primary"
```

# 3.项目初始化与依赖管理

**创建新项目**

```bash
poetry new my-project  # 生成目录结构及 pyproject.toml
```

**现有项目初始化**：

```bash
cd existing-project
poetry init  # 交互式生成 pyproject.toml 
```

**添加依赖**：

```bash
poetry add flask  # 生产依赖
poetry add pytest --group dev  # 开发依赖分组 
```

**删除依赖**（自动清理关联依赖）：

```bash
poetry remove flask
```

**同步依赖**：

```bash
poetry install  # 安装所有依赖（含开发组）
poetry install --no-dev  # 仅安装生产依赖
```

# 虚拟环境操作

**创建并激活虚拟环境**

- **自动创建**（执行 `poetry install` 时自动生成）
- **手动指定 Python 版本**：

```bash
poetry env use python3.10  # 使用指定版本解释器 
```

**进入虚拟环境**

- **启动子 Shell**：

```bash
poetry shell  # 进入虚拟环境 
```

**直接运行命令**：

```bash
poetry run python app.py  # 无需激活环境 
```

