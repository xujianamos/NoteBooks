# 部署问题

## 部署脚本

```bash
VERSION=$(curl -Ls -o /dev/null -w %{url_effective} https://github.com/getsentry/self-hosted/releases/latest)
VERSION=${VERSION##*/}
git clone https://github.com/getsentry/self-hosted.git
cd self-hosted
git checkout ${VERSION}
./install.sh
# After installation, run the following to start Sentry:
docker compose up --wait
```



## 问题 1

拉取镜像`debian:bookworm-slim`失败：

![image-20251119170058596](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191701345.png)

解决办法：

修改 docker 加速源后手动拉取。

加速源：

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn",
    "http://hub-mirror.c.163.com",
    "http://docker.camera360.com",
    "http://mirrors.aliyun.com"
  ]
}
```

```bash
$ docker pull debian:bookworm-slim
```

拉取成功后手动执行以下命令：

```bash
./install.sh
```

## 问题 2

Docker 运行内存不够

![image-20251119170506206](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191705440.png)

解决办法：

修改 docker 的运行内存为 15GB

![image-20251119170537880](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191705981.png)

重新启动 docker 后执行以下命令

```bash
./install.sh
```

## 问题 3

bash 版本太低

![image-20251119170713525](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191707586.png)

解决办法：

这个报错的核心原因是：**当前运行脚本的 Bash 版本（3.2.57）低于脚本要求的最低版本（4.4.0）**，导致脚本中依赖的 Bash 4.4+ 新特性无法正常运行。

### 一、为什么会出现这个问题？

#### 1. Bash 版本差异的本质

Bash（Bourne-Again Shell）是 Linux/macOS 等系统的默认命令行解释器，不同版本支持的语法、内置命令、特性有明显差异：

- Bash 3.2：是 **macOS 系统默认自带的版本**（由于版权原因，macOS 长期未更新默认 Bash），兼容性强但缺少新特性；
- Bash 4.4+：是 Linux 主流发行版（Ubuntu 18.04+、CentOS 8+ 等）默认或可安装的版本，新增了数组操作、关联数组、字符串处理优化、`mapfile` 内置命令等特性。

#### 2. 脚本要求 4.4+ 的常见原因

脚本中可能使用了 Bash 4.4+ 才支持的特性，例如：

- 关联数组（`declare -A arr`）：Bash 4.0+ 支持，3.2 完全不支持；
- 字符串替换增强（`${var@Q}` 转义字符串）：Bash 4.4+ 新增；
- `mapfile`/`readarray` 读取文件到数组：Bash 4.0+ 支持；
- 正则表达式匹配优化（`=~` 运算符的扩展用法）；
- 局部变量作用域增强（`local` 关键字的嵌套使用优化）。

如果脚本开发者基于 Bash 4.4+ 编写，且未做向下兼容处理，在 3.2 版本中运行就会触发 “版本不足” 的校验报错。

### 二、快速判断当前 Bash 环境

#### 1. 查看当前 Bash 版本

在终端执行以下命令，确认当前使用的 Bash 版本：

```bash
bash --version
```

- 输出示例（macOS 默认）：`GNU bash, version 3.2.57(1)-release (x86_64-apple-darwin22)`；
- 输出示例（Linux 正常版本）：`GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)`。

#### 2. 确认当前使用的 Shell 是否为 Bash

部分系统可能默认使用 `zsh`（如 macOS Catalina 及以上），需确认脚本是否通过 Bash 执行：

```bash
echo $SHELL  # 查看默认 Shell（输出 /bin/bash 或 /bin/zsh 等）
```

如果默认是 `zsh`，但脚本头部指定了 `#!/bin/bash`，仍会使用 Bash 3.2 运行（macOS 环境）。

### 三、解决方案（按优先级排序）

#### 方案 1：升级 Bash 版本（推荐，一劳永逸）

适用于 macOS（默认版本过低）或 Linux（旧版本系统），升级后可支持所有 Bash 4.4+ 特性。

##### （1）macOS 系统升级 Bash

由于 macOS 自带的 Bash 受系统限制无法直接更新，需通过 `homebrew` 安装新版本：

1. 安装 Homebrew（若未安装）：

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. 安装最新版 Bash：

   ```bash
   brew install bash
   ```

3. 查看新 Bash 安装路径（通常是`/usr/local/bin/bash`或`/opt/homebrew/bin/bash`)

   ```bash
   which bash  # 输出新路径，例如 /opt/homebrew/bin/bash
   ```

4. 将新 Bash 添加到系统允许的 Shell 列表（可选，避免权限问题）：

   ```bash
   sudo echo "$(which bash)" >> /etc/shells
   ```

5. 验证版本（需重新打开终端）：

   ```bash
   bash --version  # 应显示 5.x 版本（高于 4.4）
   ```

6. 运行脚本时，指定使用新 Bash（或修改脚本头部）：

   - 临时指定：`/opt/homebrew/bin/bash 你的脚本.sh`；
   - 永久修改：将脚本头部的 `#!/bin/bash` 改为 `#!/opt/homebrew/bin/bash`（即新 Bash 路径）。

## 问题4

拉取镜像失败`ghcr.io/getsentry/vroom:25.11.0`

![image-20251119171227671](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191712875.png)

尝试手动拉取

```bash
sudo docker pull ghcr.io/getsentry/snuba:25.11.0
```

重新执行脚本

```bash
./install.sh
```

fallback_getpass(prompt, stream)



![image-20251119172058540](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191720785.png)

![image-20251119172217296](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511191722473.png)