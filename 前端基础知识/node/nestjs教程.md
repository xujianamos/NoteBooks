# 介绍

`Nest` 是一个用于构建高效，可扩展的 `Node.js `服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。

在底层，Nest使用强大的 HTTP Server 框架，如 Express（默认）和 Fastify。Nest 在这些框架之上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块。

## 1.安装

使用 [Nest CLI](https://docs.nestjs.cn/8/cli?id=overview) 建立新项目非常简单。 在安装好 npm 后，您可以使用下面命令在您的 OS 终端中创建 Nest 项目：

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

将会创建 `project-name` 目录， 安装 node_modules 和一些其他样板文件，并将创建一个 `src` 目录，目录中包含几个核心文件。

```
src
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.tsCopy to clipboardErrorCopied
```

以下是这些核心文件的简要概述：

|                        |                                                              |
| :--------------------- | ------------------------------------------------------------ |
| app.controller.ts      | 带有单个路由的基本控制器示例。                               |
| app.controller.spec.ts | 对于基本控制器的单元测试样例                                 |
| app.module.ts          | 应用程序的根模块。                                           |
| app.service.ts         | 带有单个方法的基本服务                                       |
| main.ts                | 应用程序入口文件。它使用 `NestFactory` 用来创建 Nest 应用实例。 |

`main.ts` 包含一个异步函数，它负责**引导**我们的应用程序：

> main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

# 控制器(Controller)

控制器负责处理传入的**请求**和向客户端返回**响应**。

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408062340520.png)

控制器的目的是接收应用的特定请求。**路由**机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

为了创建一个基本的控制器，我们使用类和`装饰器`。装饰器将类与所需的元数据相关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。

## 1.路由

在下面的例子中，我们使用 `@Controller()` 装饰器定义一个基本的控制器。可选 路由路径前缀设置为 `cats`。在 `@Controller()` 装饰器中使用路径前缀可以使我们轻松地对一组相关的路由进行分组，并最大程度地减少重复代码。例如，我们可以选择将一组用于管理与 `/customers` 下的客户实体进行互动的路由进行分组。这样，我们可以在 `@Controller()` 装饰器中指定路径前缀 `customers`，这样就不必为文件中的每个路由重复路径的那部分。

> cats.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

要使用 CLI 创建控制器，只需执行 `$ nest g controller cats` 命令。

## 2.Request























