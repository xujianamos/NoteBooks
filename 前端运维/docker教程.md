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

```sh
$ docker pull [IMAGE_NAME]:[TAG]
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

# 3.Docker容器

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

# 4.Docker数据管理

## 4.1什么是数据卷？

简单来说，数据卷是一个可供一个或多个容器使用的特殊目录，用于持久化数据以及共享容器间的数据，它以正常的文件或目录的形式存在于宿主机上。另外，其生命周期独立于容器的生命周期，即当你删除容器时，数据卷并不会被删除。

## 4.2为什么需要数据卷？

Docker 镜像由多个文件系统（只读层）叠加而成。Docker 会加载只读镜像层，并在镜像栈顶部添加一个读写层。当运行容器后，如果修改了某个已存在的文件，那么该文件将会从下面的只读层复制到上面的读写层，同时，该文件在只读层中仍然存在。**当我们删除 Docker 容器，并通过镜像重新启动容器时，之前的更改的文件将会丢失。**

## 4.3数据卷特性

- 数据卷可以在容器之间共享和重用；
- 对数据卷的修改会立刻生效；
- 更新数据卷不会影响镜像；
- 数据卷默认一直存在，即使容器被删除；

## 4.4挂载数据卷

Docker 提供了 3 种不同的方式将数据从宿主机挂载到容器中。

![Docker 挂载数据卷](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405202351589.jpeg)

### 4.4.1volume (最常用的方式)

volume : Docker 管理宿主机文件系统的一部分，默认位于 `/var/lib/docker/volumes` 目录下, 也是最常用的方式。

![Docker 查看本地数据卷](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210011242.jpeg)

看上图，所有的 Docker 容器数据都保存在 `/var/lib/docker/volumes` 目录下。若容器运行时未指定数据卷， Docker 创建容器时会使用默认的匿名卷（名称为一堆很长的 ID）。

> **注意：Mac 系统中， Docker 是基于虚拟机的 ，必须登录到虚拟机里面，登录后在目录 `/var/lib/docker/volumes/` 下即可找到数据卷。**

### 4.4.2.bind mount（比较常用的方式）

bind mount: 意为可以存储在宿主机中的任意位置。需要注意的是，bind mount 在不同的宿主机系统时不可移植的，比如 Windows 和 Linux 的目录结构是不一样的，bind mount 所指向的 host 目录也不一样。这也是为什么 bind mount 不能出现在 Dockerfile 中的原因所在，因为这样 Dockerfile 就不可移植了。

### 4.4.3.tmpfs mount (一般不用这种方式)

tmpfs mount : 挂载存储在宿主机的内存中，而不会写入宿主机的文件系统，一般不用此种方式。

## 4.5Volume 使用

### 4.5.1创建一个数据卷

执行如下命令创建数据卷：

```shell
$ docker volume create test-vol
```

### 4.5.2查看所有的数据卷

```shell
$ docker volume ls
```

### 4.5.3查看数据卷信息

执行如下命令，可以查看指定的数据卷信息：

```shell
# 查看数据卷名为 test-vol 的信息
$ docker volume inspect test-vol
```

### 4.5.4运行容器时挂载数据卷

数据卷 `test-vol`创建成功后，我们运行一个 Nginx 容器，并尝试挂载该数据卷，挂载命令支持两种：

> 1.`-v`

```shell
$ docker run -d -it --name=test-nginx -p 8011:80 -v test-vol:/usr/share/nginx/html nginx:1.13.12
```

参数说明：

- `-d` : 后台运行容器；
- `--name=test-nginx` : 指定容器名为 test-nginx;
- `-p 8011:80` : 将容器的 80 端口挂载到宿主机的 8011 端口；
- `-v test-vol:/usr/share/nginx/html` : 将 `test-vol` 数据卷挂载到容器中的 /usr/share/nginx/html 目录上；

> 2.`--mount`

```shell
$ docker run -d -it --name=test-nginx -p 8011:80 --mount source=test-vol,target=/usr/share/nginx/html nginx:1.13.12
```

参数说明：

- `--mount source=test-vol,target=/usr/share/nginx/html` : 将 `test-vol` 数据卷挂载到容器中的 /usr/share/nginx/html 目录上；

> 3.`-v` 和 `--mount` 有什么区别？

都是挂载命令，使用 `-v` 挂载时，如果宿主机上没有指定文件不会报错，会自动创建指定文件；当使用 `--mount`时，如果宿主机中没有这个文件会报错找不到指定文件，不会自动创建指定文件。

容器运行成功后，进入到 `/var/lib/docker/volumes` 目录下，验证数据是否挂载成功：

![验证数据卷是否挂载成功](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210029002.jpeg)

可以看到已经有了 `50x.html` 、 `index.html` 两个 Nginx 页面相关数据，说明数据卷挂载成功了。挂载成功后，我们不论是修改 `/var/lib/docker/volumes` 下的数据，还是进入到容器中修改 `/usr/share/nginx/html` 下的数据，都会同步修改对应的挂载目录，类似前端开发中双向绑定的作用。

下面，我们停止并删除刚刚运行的 Nginx 容器, 看看数据卷中的数据是否会跟着被删除：

![删除容器，验证数据卷是否还存在](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210030266.jpeg)

可以发现数据卷相关数据都还在，表明数据卷的生命周期独立于容器。另外，若下次再创建 Nginx 容器，还可以复用这个数据卷，复用性以及扩张性都非常不错。

### 4.5.5删除数据卷

由于数据卷的生命期独立于容器，想要删除数据卷，就需要我们手动来操作, 执行命令如下：

```shell
$ docker volume rm test-vol
```

1. 如果你需要在删除容器的同时移除数据卷，请使用 `docker rm -v` 命令。
2. 对于那些没有被使用的数据卷，可能会占用较多的磁盘空间，你可以通过如下命令统一删除：

```shell
$ docker volume prune
```

### 4.5.6bind mount 使用

通过 bind mount 模式可以挂载到宿主机的任意位置，示例如下：

```shell
$ docker run -d -it --name=test-nginx -p 8011:80 -v /docker/nginx1:/usr/share/nginx/html nginx:1.13.12
```

参数说明：

- `-v /docker/nginx1:/usr/share/nginx/html` : 将宿主机中的 `/docker/nginx1` 目录挂载到容器中的 `/usr/share/nginx/html` 目录；

容器运行成功后，进入容器中：

```shell
$ docker exec -it test-nginx /bin/bash
```

![docker 进入容器](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210033356.jpeg)

从上图可以看到，与 volume 不同，bind mount 这种方式会隐藏目录中的内容（非空情况下），这里的 `/usr/share/nginx/html` 目录下的 html 文件被隐藏了，所以我们看不到。

但是，我们可以将宿主机中该目录中的文件立刻挂载到容器中，下面验证一下：

1. 新建一个 `index.html`:

![创建 index.html 文件](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210033904.jpeg)

2. 再次进入容器，查看挂载目录内容：

![进入 docker 容器](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405210034494.jpeg)

## 4.6数据卷容器

如果你有一些需要持续更新的数据需要在容器之间共享，最佳实践是创建数据卷容器。**数据卷容器，其实就是一个正常的 Docker 容器，专门用于提供数据卷供其他容器挂载的**。

### 4.6.1创建数据卷容器

运行一个容器，并创建一个名为 `dbdata` 的数据卷：

```shell
$ docker run -d -v /dbdata --name dbdata training/postgres echo Data-only container for postgres
```

![Docker 创建数据卷容器](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405222224999.jpeg)

容器运行成功后，会发现该数据卷容器处于停止运行状态，这是因为数据卷容器并不需要处于运行状态，只需用于提供数据卷挂载即可。

### 4.6.2挂载数据卷

`--volumes-from` 命令支持从另一个容器挂载容器中已创建好的数据卷。

```shell
$ docker run -d --volumes-from dbdata --name db1 training/postgres
$ docker run -d --volumes-from dbdata --name db2 training/postgres
$ docker ps
CONTAINER ID       IMAGE                COMMAND                CREATED             STATUS              PORTS               NAMES
7348cb189292       training/postgres    "/docker-entrypoint.   11 seconds ago      Up 10 seconds       5432/tcp            db2
a262c79688e8       training/postgres    "/docker-entrypoint.   33 seconds ago      Up 32 seconds       5432/tcp            db1
```

还可以使用多个 `--volumes-from` 参数来从多个容器挂载多个数据卷。 也可以从其他已经挂载了数据卷的容器来挂载数据卷。

如果删除了挂载的容器（包括 dbdata、db1 和 db2），数据卷并不会被自动删除。如果想要删除一个数据卷，必须在删除最后一个还挂载着它的容器时使用 `docker rm -v` 命令来指定同时删除关联的容器。

## 4.7Docker 使用数据卷容器备份、恢复、迁移数据卷

### 4.7.1备份

首先使用 `--volumes-from` 命令创建一个加载 dbdata 的容器卷容器，并将宿主机当前目录挂载到容器的 /backup 目录，命令如下：

```shell
$ sudo docker run --volumes-from dbdata -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /dbdata
```

容器启动后，使用了 `tar` 命令来将 dbdata 数据卷备份为容器中 /backup/backup.tar 文件，因为挂载了的关系，宿主机的当前目录下也会生成 `backup.tar` 备份文件。

### 4.7.2恢复/迁移

如果要恢复数据到一个容器，首先创建一个带有空数据卷的容器 dbdata2。

```shell
$ sudo docker run -v /dbdata --name dbdata2 ubuntu /bin/bash
```

然后创建另一个容器，挂载 dbdata2 容器卷中的数据卷，并使用 `untar` 解压备份文件到挂载的容器卷中。

```shell
$ sudo docker run --volumes-from dbdata2 -v $(pwd):/backup busybox tar xvf
/backup/backup.tar
```

为了查看/验证恢复的数据，可以再启动一个容器挂载同样的容器卷来查看：

```shell
$ sudo docker run --volumes-from dbdata2 busybox /bin/ls /dbdata
```

# 5.Dockerfile

## 5.1什么是 Dockerfile ?

Dockerfile 是一个被用来构建 Docker 镜像的文本文件，该文件中包含了一行行的指令（Instruction），这些指令对应着修改、安装、构建、操作的命令，每一行指令构建一层（layer），层层累积，于是有了一个完整的镜像。

说的通俗些，大家可以这样理解： Dockerfile 是一张建筑施工图纸，工人基于这张图纸，一层一层的建造起了一座高楼大厦。

## 5.2为什么需要 Dockerfile ?

Dockfile 可以解决镜像如下问题：

### 5.2.1镜像透明性问题

通常情况下，我们下载镜像都是从 DockerHub 官方仓库拉取镜像，这些镜像都是安全可靠的。但是仓库中也有别人上传的镜像，可以说是完全的黑盒镜像了，镜像被植入了病毒都是有可能的。有了 Dockerfile 就很好的解决了这个问题, 通过它可以清楚的看到镜像每一层的构建指令，从而判断该镜像是否安全可靠。

### 5.2.2镜像 layer 层无法复用问题

镜像是由一层层的 layer 叠加而成，通过 Dockerfile 构建镜像时，如果发现本地存在可以重复利用的 layer，就不会重复下载，这样可以节省存储空间。

举个例子更容易理解🌰，比如你之前已经构建了一个基于 Centos 的，并在其上安装了 JDK 1.8 的镜像；后续，你又有了新的需求，想在之前的镜像基础上，再安装一个 Tomcat， 那么在通过 Dockfile 构建镜像时，前面的 Centos 和 JDK 1.8 层都是可以被复用的。

### 5.2.3镜像维护与分享问题

通过 Dockerfile 构建、定制的镜像也更易于被维护与分享，如果需要新的定制，直接改 Dockerfile 重新构建就好啦~

## 5.3Dockerfile 制作构建镜像

### 5.3.1开始制作镜像

新建一个空白目录，创建一个名为 `Dockerfile` 的文本文件：

```shell
$ mkdir mynginx
$ cd mynginx
$ touch Dockerfile
```

编辑 `Dockerfile`，添加如下指令：

```dockerfile
FROM nginx
RUN echo '<h1>Hello, Nginx by Docker!</h1>' > /usr/share/nginx/html/index.html
```

这个 `Dockerfile` 非常简单，总共也就运用了两条指令：`FROM` 和 `RUN` 。

### 5.3.2FROM 指定基础镜像

制作镜像必须要先声明一个基础镜像，基于基础镜像，才能在上层做定制化操作。

通过 **`FROM`指令可以指定基础镜像**，在 Dockerfile 中，`FROM` 是必备指令，且必须是第一条指令。比如，上面编写的 Dockerfile 文件第一行就是 `FROM nginx`, 表示后续操作都是基于 Ngnix 镜像之上。

> ### 特殊的镜像：scratch

通常情况下，基础镜像在 DockerHub 都能找到，如：

- **中间件相关**：`nginx`、`kafka`、`mongodb`、`redis`、`tomcat` 等；
- **开发语言环境** ：`openjdk`、`python`、`golang` 等；
- **操作系统**：`centos` 、`alpine` 、`ubuntu` 等；

除了这些常用的基础镜像外，还有个比较特殊的镜像 : `scratch` 。它表示一个空白的镜像：

```
FROM scratch
...
```

以 `scratch` 为基础镜像，表示你不以任何镜像为基础。

### 5.3.3RUN 执行命令

`RUN` 指令用于执行终端操作的 shell 命令，另外，`RUN` 指令也是编写 Dockerfile 最常用的指令之一。它支持的格式有如下两种：

- **1、`shell` 格式**: `RUN <命令>`，这种格式好比在命令行中输入的命令一样。举个栗子，上面编写的 Dockerfile 中的 `RUN` 指令就是使用的这种格式：

```dockerfile
RUN echo '<h1>Hello, Nginx by Docker!</h1>' > /usr/share/nginx/html/index.html
```

- **2、`exec` 格式**: `RUN ["可执行文件", "参数1", "参数2"]`, 这种格式好比编程中调用函数一样，指定函数名，以及传入的参数。

```dockerfile
RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
```

### 5.3.4新手构建镜像的体积太大？太臃肿？

初学 Docker 的小伙伴往往构建出来的镜像体积非常臃肿，这是什么原因导致的？

我们知道，Dockerfile 中每一个指令都会新建一层，过多无意义的层导致很多运行时不需要的东西，都被打包进了镜像内，比如编译环境、更新的软件包等，这就导致了构建出来的镜像体积非常大。

举个例子：

```dockerfile
FROM centos
RUN yum -y install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
```

执行以上 Dockerfile 会创建 3 层，另外，下载的 `redis.tar.gz`也没有删除掉，可优化成下面这样：

```dockerfile
FROM centos
RUN yum -y install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz \
    && rm redis.tar.gz
```

如上，仅仅使用了一个 `RUN` 指令，并使用 `&&` 将各个命令串联起来。之前的 3 层被简化为了 1 层，同时删除了无用的压缩包。

> Dockerfile 支持 shell 格式命令末尾添加 `\` 换行，以及行首通过 `#` 进行注释。保持良好的编写习惯，如换行、注释、缩进等，可以让 Dockerfile 更易于维护。

### 5.3.5构建镜像

Dockerfile 文件编写好了以后，就可以通过它构建镜像了。接下来，我们来构建前面定制的 nginx 镜像，首先，进入到该 Dockerfile 所在的目录下，执行如下命令：

```
docker build -t nginx:test .
```

> 注意：命令的最后有个点 `.` , 很多小伙伴不注意会漏掉，`.`指定**上下文路径**，也表示在当前目录下。

!["通过 Dockerfile 构建 Docker 镜像"](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405222322631.jpeg)

构建命令执行完成后，执行 `docker images` 命令查看本地镜像是否构建成功：

![Docker 查看本地镜像列表](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405222322258.jpeg)

镜像构建成功后，运行 Nginx 容器：

```
docker run -d -p 80:80 --name nginx nginx:test
```

容器运行成功后，访问 `localhost:80`, 可以看到首页已经被成功修改了：

![测试新构建的 Docker 容器](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405222323194.jpeg)

### 5.3.6镜像构建之上下文路径

前面的构建命令最后有一个 `.`, 它表示上下文路径，它又是个啥？

```
docker build -t nginx:test .
```

理解它之前，我们要知道 Docker 在运行时分为 Docker 引擎和客户端工具，是一种 C/S 架构。看似我们在命令收入了一行 Docker 命令，立即就执行了，背后其实是将命令提交给了客户端，然后客户端通过 API 与 Docker 引擎交互，真正干活的其实是 Docker 引擎。

话说回来，在构建镜像时，经常会需要通过 `COPY` 、`ADD` 指令将一些本地文件复制到镜像中。而刚才我们也说到了，执行 `docker build` 命令并非直接在本地构建，而是通过 Docker 引擎来完成的，那么要如何解决 Docker 引擎获取本地文件的问题呢？

于是引入了上下文的概念。构建镜像时，指定上下文路径，客户端会将路径下的所有内容打包，并上传给 Docker 引擎，这样它就可以获取构建镜像所需的一切文件了。

> 注意：上下文路径下不要放置一些无用的文件，否则会导致打包发送的体积过大，速度缓慢而导致构建失败。当然，我们也可以想编写 `.gitignore` 一样的语法写一个 `.dockerignore`, 通过它可以忽略上传一些不必要的文件给 Docker 引擎。

## 5.4`docker build` 的其他用法

### 5.4.1通过 Git repo 构建镜像

除了通过 Dockerfile 来构建镜像外，还可以直接通过 URL 构建，比如从 Git repo 中构建：

```shell
# $env:DOCKER_BUILDKIT=0
# export DOCKER_BUILDKIT=0

$ docker build -t hello-world https://github.com/docker-library/hello-world.git#master:amd64/hello-world

Step 1/3 : FROM scratch
 --->
Step 2/3 : COPY hello /
 ---> ac779757d46e
Step 3/3 : CMD ["/hello"]
 ---> Running in d2a513a760ed
Removing intermediate container d2a513a760ed
 ---> 038ad4142d2b
Successfully built 038ad4142d2b
```

上面的命令指定了构建所需的 Git repo, 并且声明分支为 `master`, 构建目录为 `amd64/hello-world`。运行命令后，Docker 会自行 `git clone` 这个项目，切换分支，然后进入指定目录开始构建。

### 5.4.2通过 tar 压缩包构建镜像

```shell
$ docker build http://server/context.tar.gz
```

如果给定的 URL 是个 `tar` 压缩包，那么 Docker 会自动下载这个压缩包，并自动解压，以其作为上下文开始构建。

### 5.4.3从标准输入中读取 Dockerfile 进行构建

```shell
$ docker build - < Dockerfile
```

或

```shell
$ cat Dockerfile | docker build -
```

标准输入模式下，如果传入的是文本文件，Docker 会将其视为 `Dockerfile`，并开始构建。需要注意的是，这种模式是没有上下文的，它无法像其他方法那样将本地文件通过 `COPY` 指令打包进镜像。

### 5.4.4从标准输入中读取上下文压缩包进行构建

```shell
$ docker build - < context.tar.gz
```

标准输入模式下，如果传入的是压缩文件，如 `tar.gz` 、`gzip` 、 `bzip2` 等，Docker 会解压该压缩包，并进入到里面，将里面视为上下文，然后开始构建。

## 5.5Dockerfile 常用指令汇总

想要熟练使用 Dockerfile 制作构建镜像 ，就需要熟悉 Dockerfile 常用的一些指令，除了前面小节中提到的 `COPY` 、`ADD` 指令外，Dockerfile 还额外提供了十多个指令。下面是 Dockerfile 常用指令汇总：

- [COPY 复制文件](https://www.quanxiaoha.com/docker/dockerfile-copy-file.html) ；
- [ADD 更高级的复制文件](https://www.quanxiaoha.com/docker/dockerfile-add-file.html) ；
- [CMD 容器启动命令](https://www.quanxiaoha.com/docker/dockerfile-cmd.html) ；
- [ENTRYPOINT 入口点](https://www.quanxiaoha.com/docker/dockerfile-entrypoint.html) ；
- [ENV 设置环境变量](https://www.quanxiaoha.com/docker/dockerfile-env.html) ；
- [ARG 构建参数](https://www.quanxiaoha.com/docker/dockerfile-arg.html) ；
- [VOLUMN 定义匿名数](https://www.quanxiaoha.com/docker/dockerfile-volumn.html) ；
- [EXPOSE 暴露端口](https://www.quanxiaoha.com/docker/dockerfile-expose.html) ；
- [WORKDIR 指定工作目录](https://www.quanxiaoha.com/docker/dockerfile-workdir.html) ；
- [USER 指定当前用户](https://www.quanxiaoha.com/docker/dockerfile-user.html) ；
- [HEALTHCHECK 健康检查](https://www.quanxiaoha.com/docker/dockerfile-healthcheck.html) ；
- [ONBUILD 二次构建](https://www.quanxiaoha.com/docker/dockerfile-onbuild.html) ；
- [LABEL 为镜像添加元数据](https://www.quanxiaoha.com/docker/dockerfile-label.html) ；
- [SHELL 指令](https://www.quanxiaoha.com/docker/dockerfile-shell.html) ；

# 6.Docker Compose

## 6.1Docker Compose 是干什么的？

**`Docker Compose` 是 Docker 官方的开源项目，能够实现对 Docker 容器集群的快速编排，以保证快速部署分布式应用。**

### 6.1.1Docker Compose 解决了什么问题？

在实际的生产环境中，往往需要多个容器配合工作，才能称的上一个完整的应用服务。

举个栗子，你想搭建一个 Web 服务，除了 Web 服务容器本身，若涉及数据存储，就需要依赖数据库容器（Mysql、Mongdb 等）；若想实现分词搜索，就需要依赖搜索引擎容器（Elasticsearch、Solor 等）；其他诸如缓存容器、负载均衡容器等。

同时，部署和管理繁多的容器服务是非常困难的。有了 `Docker Compose` ，就能很好的解决这个问题！`Docker Compose` 通过一个声明式的配置文件 `docker-compose.yml` 来描述整个应用，使用一条命令即可完成部署。应用部署成功后，还可以通过一系列简单的命令实现对应用生命周期的管理。甚至，配置文件还可以置于版本控制系统中进行存储和管理。

### 6.1.2Compose 中的核心概念

`Compose` 中有两个重要的概念：

- 服务 (`service`)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。
- 项目 (`project`)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义

## 6.2Docker Compose 安装与卸载

### 6.2.1Linux & MacOS 系统安装

Linux & MacOS 系统中，Docker Compose 可以通过如下两种方式来安装：

- 1、通过二进制包安装；
- 2、通过 PIP 安装；

a. 通过二进制包安装

从 [官方 GitHub Release](https://github.com/docker/compose/releases) 直接下载编译好的二进制文件即可，例如，在 Linux 64 位系统上直接下载对应的二进制包：

```shell
$ sudo curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

# 国内用户可以使用以下方式加快下载
$ sudo curl -L https://download.fastgit.org/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
```

b. 通过 PIP 安装

> 注意：`x86_64` 架构的 Linux 建议按照上边的方法下载二进制包进行安装，如果您计算机的架构是 `ARM` (例如，树莓派)，再使用 `pip` 安装。

如果你的机器安装了 Python 环境，还可以将 Compose 当作一个 Python 应用来从 pip 源中安装，安装命令如下：

```shell
$ sudo pip install -U docker-compose
```

若输出类似如下信息，表明安装成功：

```shell
Collecting docker-compose
  Downloading docker-compose-1.27.4.tar.gz (149kB): 149kB downloaded
...
Successfully installed docker-compose cached-property requests texttable websocket-client docker-py dockerpty six enum34 backports.ssl-match-hostname ipaddress
```

### 6.2.2卸载 Docker Compose

如果是二进制包方式安装的，删除二进制文件即可。

```shell
$ sudo rm /usr/local/bin/docker-compose
```

如果是通过 `pip` 安装的，则执行如下命令即可删除。

```shell
$ sudo pip uninstall docker-compose
```

# 7.网络原理



# 实战案例



# idea整合docker

