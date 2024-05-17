# 1.基本概念

Docker 有三大基本概念，分别是镜像（Image）、容器（Container）和仓库（Repository）。**镜像是 Docker 容器运行的前提，仓库是存放镜像的场所。**

## 1.1镜像

操作系统分为 **内核** 和 **用户空间**。对于 `Linux` 而言，内核启动后，会挂载 `root` 文件系统为其提供用户空间支持。而 **Docker 镜像**（`Image`），就相当于是一个 `root` 文件系统。比如官方镜像 `ubuntu:18.04` 就包含了完整的一套 Ubuntu 18.04 最小系统的 `root` 文件系统。

**Docker 镜像是一个特殊的文件系统**，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

> 分层存储

镜像包含操作系统完整的 `root` 文件系统，其体积往往是庞大的，因此 Docker 在设计之初，就充分利用 Union FS 的技术，将其设计为分层存储的架构。所以严格来说，镜像并非是像一个 `ISO` 那样的打包文件，镜像只是一个虚拟的概念，其实际体现并非由一个文件组成，而是由一组文件系统组成，或者说，由多层文件系统联合组成。

镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。

分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

## 1.2容器

**通过镜像运行的实例称之为容器**，两者的关系就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

Docker 利用容器来运行应用，每个容器都是相互隔离的、保证安全的平台。我们可以把容器看做是一个轻量级的Linux 运行环境。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。因此容器可以拥有自己的 `root` 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。

镜像使用的是分层存储，容器也是如此。每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为容器存储层。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。

按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用数据卷(volume)、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失。

## 1.3仓库

Docker Repository 用于镜像的集中存储、分发的地方。有了它，镜像在构建完成后，在其他机器上就可以非常方便的下载使用这个镜像了。

一个 **Docker Registry** 中可以包含多个 **仓库**（`Repository`）；每个仓库可以包含多个 **标签**（`Tag`）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 `<仓库名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest` 作为默认标签，表示最新的一个版本。

以 Ubuntu 镜像为例，`ubuntu` 是仓库的名字，其内包含有不同的版本标签，如，`16.04`, `18.04`。我们可以通过 `ubuntu:16.04`，或者 `ubuntu:18.04` 来具体指定所需哪个版本的镜像。如果忽略了标签，比如 `ubuntu`，那将视为 `ubuntu:latest`。

仓库名经常以 *两段式路径* 形式出现，比如 `jwilder/nginx-proxy`，前者往往意味着 Docker Registry 多用户环境下的用户名，后者则往往是对应的软件名。但这并非绝对，取决于所使用的具体 Docker Registry 的软件或服务。

> 公有仓库:

公有仓库是允许用户免费上传、下载的公开镜像服务。比如官方的 [Docker Hub](https://hub.docker.com/) ，也是默认的 Docker Repository，里面拥有着大量的高质量镜像。但是国内访问它可能比较慢，国内的云服务商提供了针对 Docker Hub 的镜像服务（`Registry Mirror`），这些镜像服务被称为**镜像加速器**。国内常见有阿里云加速器、网易加速器、DaoCloud 加速器等。

> 私有仓库:

除了公有仓库外，用户还可以在本地搭建私有仓库。Docker 官方提供了 [Docker Registry](https://hub.docker.com/_/registry/) 镜像，可以直接使用做为私有 Registry 服务。

开源的 Docker Registry 镜像只提供了 [Docker Registry API](https://docs.docker.com/registry/spec/api/) 的服务端实现，足以支持 `docker` 命令，不影响使用。但不包含图形界面，以及镜像维护、用户管理、访问控制等高级功能。

除了官方的 Docker Registry 外，还有第三方软件实现了 Docker Registry API，甚至提供了用户界面以及一些高级功能。比如，Harbor 和 Sonatype Nexus。

# 2.Docker镜像

## 2.1搜索镜像

在 Docker 中，通过如下命令搜索镜像：

```Bash
docker search [option] keyword
```

比如，你想搜索仓库中 `mysql` 相关的镜像，可以输入如下命令：

```Bash
docker search mysql
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334212.png)

返回字段说明：

- **NAME** : 镜像名称；
- **DESCRIPTION** : 镜像描述信息；
- **STARS** : 用户标星数；
- **OFFICIAL**: 是否为官方提供，`[OK]`表示为官方提供；

> `search` 命令支持的参数:

命令行执行 `docker search --help`, 可以知道 `search` 命令支持的参数：

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334419.png)

参数说明：

- `-f, --filter filter`: 过滤输出的内容；
- `--limit int`：指定搜索内容展示个数;
- `--no-index`: 不截断输出内容；
- `--no-trunc`：不截断输出内容；

举个例子🌰，比如想搜索 Stars 数超过 100 的 mysql 镜像：

```Bash
docker search --filter=stars=100 mysql
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334723.png)

## 2.2下载镜像

想要在本地运行 Docker 容器，需要先下载 Docker 镜像。默认情况下，Docker 会尝试从 Docker Hub 镜像仓库下载。另外，用户也可以自定义配置镜像仓库地址。

可以通过 `pull` 命令下载镜像, 命令如下：

```Bash
docker pull [IMAGE_NAME]:[TAG]
```

参数说明：

- `IMAGE_NAME`: 表示想要下载的镜像名称；
- `TAG`: 镜像的标签, 通常是镜像的版本号;

> 注意：您也可以不显式地指定 TAG, 它会默认下载 latest 标签，也就是下载仓库中最新版本的镜像。这里并不推荐您下载 latest 标签，因为该镜像的内容会跟踪镜像的最新版本，并随之变化，所以它是不稳定的。在生产环境中，可能会出现莫名其妙的 bug, 推荐您最好还是显示的指定具体的 TAG。

实践一下，假设想要下载一个 Mysql 5.7 镜像，可以通过下面命令来下载：

```Bash
docker pull mysql:5.7
```

当有 **Downloaded** 字符串输出的时候，说明下载成功了！！

> 验证镜像是否下载成功:

```Bash
docker images
```

可以看到本地已经有了 `mysql:5.7` 的镜像，确实是下载成功了！

> `PULL` 参数说明:

命令行中输入：

docker pull --help

可以获取 `pull` 命令支持的参数：

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334991.png)

参数说明：

1. `-a, --all-tags=true|false`: 是否获取仓库中所有镜像，默认为否；
2. `--disable-content-trust`: 跳过镜像内容的校验，默认为 true;

## 2.3查看镜像信息

### 2.3.1`images` 命令列出镜像

通过使用如下两个命令，可以列出本地已下载的镜像：

```Bash
docker images
# 或
docker image ls
```

如下图所示：

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405170054302.png)

字段说明：

- **REPOSITORY**: 来自于哪个仓库；
- **TAG**: 镜像的标签信息，比如 5.7、latest 表示镜像不同的版本；
- **IMAGE ID**: 镜像的 ID, 如果您看到两个 ID 完全相同，那么实际上，它们指向的是同一个镜像，只是标签名称不同罢了；
- **CREATED**: 镜像创建于什么时间；
- **SIZE**: 镜像的大小，优秀的镜像一般体积都比较小，小哈更倾向于轻量级的 alpine 版本镜像；

### 2.3.2使用 inspect 命令查看镜像详细信息

通过 `docker inspect` 命令，可以获取镜像的更多详细信息，其中，包括创建者，各层 `layer` 的数字摘要等。

```Bash
docker inspect nginx
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334276.png)

`docker inspect` 返回的是 `JSON` 格式的信息，如果您想获取其中指定的一项内容，可以通过 `-f` 来指定，如获取镜像大小：

```Bash
docker inspect -f {{".Size"}} nginx
```

### 2.3.3使用 `history` 命令查看镜像历史

一个镜像是由多个层（layer）组成的，那么，我们要如何知道各个层的具体内容呢？

通过 `docker history` 命令，可以列出各个层（layer）的创建信息，以下是查看 nginx 的各层信息的命令：

```Bash
docker history nginx
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334526.png)

上面的输出信息中，为了美观，超出的都省略了，如果想要看具体信息，可以添加 `--no-trunc` 参数，命令如下：

```Bash
docker history --no-trunc nginx
```

## 2.4导出&导入镜像

日常编码中，如果需要将自己本地的镜像分享给别人，可以将镜像导出成 tar 包，别人直接导入这个 tar 包，即可将镜像引入到本地镜像库。

### 2.4.1导出镜像

通过 `docker save` 命令可以导出 Docker 镜像。

举个例子🌰，比如想导出下图中的 nginx 镜像：

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405170057245.png)

执行命令如下：

```Bash
docker save -o nginx.tar nginx:latest
```

执行成功后，即可在当前目录看到打包好的 tar 包了：

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334756.png)

可以看到 `nginx.tar` 镜像文件已经生成。接下来，你可以复制它，分享给别人了！

> 注意：默认导出位置是当前的工作目录！

### 2.4.2导入镜像

别人拿到了这个 `tar` 包后，要如何导入到本地的镜像库呢？

可以通过 `docker load` 命令导入镜像：

```Bash
docker load -i nginx.tar
# 或者
docker load < nginx.tar
```

导入成功后，查看本地镜像，即可看到别人分享的镜像导入成功！怎么样，是不是很方便呢！

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405170058754.png)

## 2.5删除镜像

### 2.5.1通过标签删除镜像

以下两种命令均可删除镜像：

```Bash
docker rmi [image]
# 或者
docker image rm [image]
```

支持的参数如下：

- `-f, -force`: 强制删除镜像，即便有容器引用该镜像；
- `-no-prune`: 不要删除未带标签的父镜像；

假设，我们想删除创建的 nginx 镜像，命令如下：

```Bash
docker rmi -f nginx:latest
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334944.png)

> PS： 当有多个同名镜像存在时，想要删除指定镜像需带上 TAG。

### 2.5.2通过 ID 删除镜像

除了通过标签名称来删除镜像，还可以通过镜像 ID 来删除镜像。

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405170059663.png)

直接通过 ID 删除镜像，命令如下：

```Bash
docker rmi df1fda32d4fd
```

### 2.5.3清理镜像

在使用 Docker 一段时间后，系统一般都会残存一些临时的、没有被使用的镜像文件，可以通过以下命令进行清理：

```Bash
docker image prune
```

它支持的子命令有：

- `-a, --all`: 删除所有没有用的镜像，而不仅仅是临时文件；
- `-f, --force`：强制删除镜像文件，无需弹出提示确认；

另外，执行完 `docker image prune` 命令后，还会告诉我们释放了多少存储空间！

## 2.6上传镜像

# 3.Docker 容器

## 3.1启动容器

### 3.1.1基于镜像新建一个容器并启动

通过如下命令来启动容器：

```Bash
docker run IMAGE:TAG
```

参数说明：

- `IMAGE`: 镜像名称；
- `TAG`: 标签，镜像版本号；

举个例子🌰，比如想启动一个 nginx 容器, 并通过终端输出 `Hello world`：

```Bash
docker run nginx:latest /bin/echo 'Hello world'
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334131.png)

注意，上面这行命令运行容器，在输出 `Hello world` 后就会终止运行。如果想以交互的方式运行容器，执行如下命令：

```Bash
docker run -t -i nginx:latest /bin/bash
```

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334254.png)

参数说明：

- `-t`: 让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上;
- `-i`: 让容器的标准输入保持打开;

如此，就可以直接在终端执行命令了：

> 执行 `docker run` 后，Docker 都干了些啥？

- 检查本地是否存在指定的镜像，不存在就从 [registry](https://www.quanxiaoha.com/docker/docker-run-container.html) 下载
- 利用镜像创建并启动一个容器
- 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
- 从地址池配置一个 ip 地址给容器
- 执行用户指定的应用程序
- 执行完毕后容器被终止

> 以 daemon 守护态方式运行容器

实际应用中，需要让容器以后台的方式运行，以此保证一个稳定的服务。

运行容器时添加 `-d` 参数可以让容器以后台的方式运行，例如启动一个 nginx 后台容器，并每隔一秒打印 `Hello world`，命令如下:

```Bash
docker run -d nginx:latest /bin/sh -c "while true; do echo hello world; sleep 1; done"
```

执行成功后，会返回一个容器 ID。

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404242334415.png)

后台运行的容器可以通过 `docker logs` 命令来查看日志：

```Bash
docker container logs [container ID or NAMES]
```

### 3.1.2启动终止状态的容器

执行如下命令，可以将已经终止 （`exited`）运行的容器重启。

```Bash
docker container start [container ID or NAMES]
```

## 3.2查看容器

查看正在运行中、停止运行的容器.

- `docker ps` : 查看正在运行中的容器；
- `docker ps -a` : 查看所有容器，包括运行中的、已经停止运行的容器。

返回字段说明：

- **CONTAINER ID** : 容器 ID；
- **IMAGE** : 创建容器时使用的镜像；
- **COMMAND** : 容器最后运行的命令；
- **CREATED** : 容器创建时间；
- **STATUS** : 容器状态；
- **PORTS** : 端口信息；
- **NAMES** : 容器名：和容器 ID 一样，可以标识容器的唯一性，同一台宿主机上不允许有同名容器存在，否则会冲突；

### 拓展命令

- `docker ps -l` : 查看最新创建的容器，注意，只列出最后创建的容器。
- `docker ps -n=2`: `-n=2` 指定列出最新创建的 2 个容器。

## 3.3进入容器

要想进入到已运行的 Docker 容器，主要有如下两种方式：

- 使用 `docker exec` 命令;
- 使用 `docker attach` 命令;

> `exec` 命令（推荐）

Docker 在 1.3.X 版本后开始支持 `exec` 命令进入容器，命令如下：

```Bash
docker exec -it [container ID or NAMES]
```

可以通过容器 ID 或者名称进入容器：

```Bash
docker exec -it nginx /bin/bash
```

要想退出容器，只需键入 `exit` 命令回车即可：

> `attach` 命令

执行命令格式如下：

```Bash
docker attach [container ID or NAMES]
```

注意：这种方式在执行 exit 命令退出容器时，会导致容器停止运行。

## 3.4停止&关闭容器

有以下两种方式关闭一个正在运行的 Docker 容器：

> `stop` 优雅模式

```Bash
docker container stop [container ID or NAMES]
# 简写模式（可省略关键字 container ）
docker stop [container ID or NAMES]
```

> `kill` 强制模式

`kill` 命令强制关闭容器：

```Bash
docker container kill [container ID or NAMES]
# 简写模式（可省略关键字 container ）
docker kill [container ID or NAMES]
```

> 对于交互形式运行的容器如何关闭?

可以通过输入 `exit` 或者 `Ctrl+d` 退出容器。

> 查看已经停止运行的容器

执行如下命令，可以看到那些已经停止运行的容器：

```Bash
docker container ls -a
```

想要重启已经停止运行的容器，命令如下：

```Bash
docker container start [container ID or NAMES]
```

另外，`docker container restart` 命令会将一个已经运行中的容器重新启动。

## 3.5重启容器

执行如下命令重启 Docker 容器：

```Bash
# 不管容器是否启动，直接重启
docker restart [container ID or NAMES]
```

> `-t` 参数

`-t` : 设置关闭容器的限制时间，若超时未能关闭，则使用 `kill` 命令强制关闭，默认值为 10s，这个时间用于容器保存自己的状态。

```Bash
# 限时 5s 关闭 redis 容器，然后重启

docker restart -t=5 redis
```

## 3.6导出&导入容器

> 1.导出容器

使用 `docker export` 命令可以导出容器

```Bash
docker export 9e8d11aeef0c > redis.tar
```

导出的 `tar` 包快照存于当前目录下。

> 2.导入容器快照

使用 `docker import` 命令可以将快照导入为镜像，例如：

```Bash
cat redis.tar | docker import - test/redis:v1.0
```

导入成功后，就可以看到新生成的镜像了：

除了通过快照的方式导入容器，还可以通过指定 URL 或者某个目录来导入，例如：

```Bash
docker import http://example.com/exampleimage.tgz example/imagerepo
```

## 3.7删除容器

> 1.删除容器

执行如下命令可以删除一个已经停止运行的容器：

```Bash
docker container rm [container ID or NAMES]
# 简写模式（可省略关键字 container ）
docker rm [container ID or NAMES]
```

强制删除容器:

添加 `-f` 参数可强制删除一个正在运行的容器：

> 2.删除所有已经停止运行的容器

如何一次性删除所有已经停止的容器呢？

用 `docker container ls -a` 命令可以查看所有已经创建的包括停止运行的容器，如果数量太多要一个个删除会很麻烦，执行如下命令即可删除掉所有已经停止运行的容器：

```Bash
docker container prune
```

# 4. Docker 数据管理

# 5. Dockerfile

# 6. Docker Compose

# 7. 网络原理

# 实战案例

# idea整合docker

导入成功后，就可以看到新生成的镜像了：