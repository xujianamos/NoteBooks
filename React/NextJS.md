# 1.安装

## 1.1 使用 CLI 创建

创建新的 Next.js 应用最快捷的方法是使用 create-next-app，它会自动为您完成所有设置。要创建项目，请运行：

```bash
npx create-next-app@latest
```

安装过程中，您将看到以下提示：

```bash
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, Turbopack
    No, reuse previous settings
    No, customize settings - Choose your own preferences
```

如果您选择自定义设置，您将看到以下提示：

```bash
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

按照提示操作后，create-next-app 将创建一个以您的项目名称命名的文件夹，并安装所需的依赖项。

## 1.2 手动安装

要手动创建一个新的 Next.js 应用，请安装所需的软件包：

```bash
pnpm i next@latest react@latest react-dom@latest
#or
npm i next@latest react@latest react-dom@latest
#or
yarn add next@latest react@latest react-dom@latest
```

> 值得注意的是：应用路由内置了 React Canary 版本，其中包含了 React 19 的所有稳定版本变更，以及框架中正在验证的新功能。
>
> 页面路由则使用您在 package.json 中安装的 React 版本。

然后，将以下脚本添加到您的 package.json 文件中：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

这些脚本指的是应用程序开发的不同阶段：

- `next dev`: 使用 Turbopack（默认打包器）启动开发服务器。
- `next build`: 构建用于生产环境的应用程序。
- `next start`: 启动生产服务器。
- `eslint`: Runs ESLint.

`Turbopack` 现在是默认的打包工具。要使用 Webpack，请运行 `next dev --webpack` 或 `next build --webpack`。有关配置详情，请参阅 Turbopack 文档。

### 1.2.1 创建 app 目录

Next.js 使用文件系统路由，这意味着应用程序中的路由取决于文件的结构方式。

创建一个名为 app 的文件夹。然后在 app 文件夹内创建一个名为 layout.tsx 的文件。该文件是根布局文件，是必需的，并且必须包含 `<html>` 和 `<body>` 标签。

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

创建一个名为 app/page.tsx 的首页文件，并添加一些初始内容：

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

当用户访问应用程序的根目录（/）时，`layout.tsx` 和 `page.tsx` 都会被渲染。

![App Folder Structure](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511030030973.png)

> 值得了解：
>
> - 如果您忘记创建根布局，Next.js 将在使用 next dev 运行开发服务器时自动创建此文件。
> - 您还可以选择在项目根目录下使用 src 文件夹，将应用程序的代码与配置文件分开。

### 1.2.2 创建 public 目录

在项目根目录创建一个 public 文件夹，用于存储静态资源，例如图像、字体等。然后，代码可以从基本 URL (/) 开始引用 public 文件夹中的文件。

然后，您可以使用根路径 (/) 引用这些资源。例如，`public/profile.png` 可以引用为 `/profile.png`：

```tsx
// app/page.tsx
import Image from 'next/image'
 
export default function Page() {
  return <Image src="/profile.png" alt="Profile" width={100} height={100} />
}
```

## 1.3 运行开发服务器

1. 运行`npm run dev`以启动开发服务器。
2. 请访问`http://localhost:3000`此处查看您的申请。
3. 编辑`app/page.tsx`文件并保存，即可在浏览器中查看更新后的结果。

## 1.4 设置 TypeScript

> 最低 TypeScript 版本要求：`v5.1.0`

Next.js 内置了 TypeScript 支持。要将 TypeScript 添加到您的项目中，请将文件重命名为 .ts 或 .tsx，然后运行 `next dev` 

命令。Next.js 将自动安装必要的依赖项，并添加一个包含推荐配置选项的 `tsconfig.json` 文件。

## 1.5 设置绝对导入和模块路径别名

Next.js 内置了对 tsconfig.json 和 jsconfig.json 文件中的`paths`和`baseUrl`选项的支持。

这些选项允许您将项目目录别名化为绝对路径，从而简化模块导入过程，使其更加清晰易懂。例如：

```js
// Before
import { Button } from '../../../components/button'
 
// After
import { Button } from '@/components/button'
```

要配置绝对导入，请将 baseUrl 配置选项添加到您的 tsconfig.json 或 jsconfig.json 文件中。例如：

```json
{
  "compilerOptions": {
    "baseUrl": "src/"
  }
}
```

除了配置 baseUrl 路径之外，您还可以使用“paths”选项来“别名”模块路径。

例如，以下配置将 `@/components/*` 映射到 `components/*`：

```json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

每个“路径”都是相对于 baseUrl 位置的。

# 2.项目结构与组织

本页面概述了 Next.js 中的所有文件夹和文件约定，并就如何组织项目提出了建议。

## 2.1 文件夹和文件规范

### 2.1.1 顶层文件夹

顶级文件夹用于组织应用程序的代码和静态资源。

![Route segments to path segments](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511030041673.png)

|                                                              |                        |
| ------------------------------------------------------------ | ---------------------- |
| [`app`](https://nextjs.org/docs/app)                         | App Router             |
| [`pages`](https://nextjs.org/docs/pages/building-your-application/routing) | Pages Router           |
| `public`                                                     | 要提供的静态资源       |
| `src`                                                        | 可选的应用程序源文件夹 |

### 2.1.2 顶层文件

顶层文件用于配置应用程序、管理依赖项、运行代理、集成监控工具和定义环境变量。

|                                                              |                                       |
| ------------------------------------------------------------ | ------------------------------------- |
| **Next.js**                                                  |                                       |
| [`next.config.js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) | Next.js 的配置文件                    |
| [`package.json`](https://nextjs.org/docs/app/getting-started/installation#manual-installation) | 项目依赖项和脚本                      |
| [`instrumentation.ts`](https://nextjs.org/docs/app/guides/instrumentation) | OpenTelemetry 和 Instrumentation 文件 |
| [`proxy.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) | Next.js 请求代理                      |
| [`.env`](https://nextjs.org/docs/app/guides/environment-variables) | 环境变量                              |
| [`.env.local`](https://nextjs.org/docs/app/guides/environment-variables) | 本地环境变量                          |
| [`.env.production`](https://nextjs.org/docs/app/guides/environment-variables) | 生产环境变量                          |
| [`.env.development`](https://nextjs.org/docs/app/guides/environment-variables) | 开发环境变量                          |
| [`eslint.config.mjs`](https://nextjs.org/docs/app/api-reference/config/eslint) | ESLint 的配置文件                     |
| `.gitignore`                                                 | 要忽略的 Git 文件和文件夹             |
| `next-env.d.ts`                                              | Next.js 的 TypeScript 声明文件        |
| `tsconfig.json`                                              | TypeScript 的配置文件                 |
| `jsconfig.json`                                              | JavaScript 配置文件                   |

### 2.1.3 路由文件

添加 `page` 来暴露路由，`layout` 用于共享 UI（如 header、nav 或 footer），`loading` 用于骨架屏，`error` 用于错误边界，`route` 用于 API。

|                                                              |                     |                  |
| ------------------------------------------------------------ | ------------------- | ---------------- |
| [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) | `.js` `.jsx` `.tsx` | 布局             |
| [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page) | `.js` `.jsx` `.tsx` | 页面             |
| [`loading`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) | `.js` `.jsx` `.tsx` | 加载 UI          |
| [`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) | `.js` `.jsx` `.tsx` | 未找到 UI        |
| [`error`](https://nextjs.org/docs/app/api-reference/file-conventions/error) | `.js` `.jsx` `.tsx` | 错误 UI          |
| [`global-error`](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error) | `.js` `.jsx` `.tsx` | 全局错误 UI      |
| [`route`](https://nextjs.org/docs/app/api-reference/file-conventions/route) | `.js` `.ts`         | API 端点         |
| [`template`](https://nextjs.org/docs/app/api-reference/file-conventions/template) | `.js` `.jsx` `.tsx` | 重新渲染的布局   |
| [`default`](https://nextjs.org/docs/app/api-reference/file-conventions/default) | `.js` `.jsx` `.tsx` | 并行路由回退页面 |

### 2.1.4 嵌套路由

文件夹定义 URL 段。嵌套文件夹会嵌套段。任何级别的布局都会包裹其子段。当存在 `page` 或 `route` 文件时，路由会变为公开的。

| 路径                        | URL模式         | 说明                  |
| --------------------------- | --------------- | --------------------- |
| `app/layout.tsx`            | —               | 根布局包裹所有路由    |
| `app/blog/layout.tsx`       | —               | 包裹 `/blog` 及其后代 |
| `app/page.tsx`              | `/`             | 公开路由              |
| `app/blog/page.tsx`         | `/blog`         | 公开路由              |
| `app/blog/authors/page.tsx` | `/blog/authors` | 公开路由              |

### 2.1.5 动态路由

使用方括号对段进行参数化。使用 `[segment]` 表示单个参数，`[...segment]` 表示捕获所有，`[[...segment]]` 表示可选的捕获所有。通过 [`params`](https://nextjscn.org/docs/app/api-reference/file-conventions/page#params-optional) prop 访问值。

| 路径                            | URL模式                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `app/blog/[slug]/page.tsx`      | `/blog/my-first-post`                                        |
| `app/shop/[...slug]/page.tsx`   | `/shop/clothing`，`/shop/clothing/shirts`                    |
| `app/docs/[[...slug]]/page.tsx` | `/docs`，，`/docs/layouts-and-pages``/docs/api-reference/use-router` |

### 2.1.6 路由组和私有文件夹

使用路由组 [`(group)`](https://nextjscn.org/docs/app/api-reference/file-conventions/route-groups#convention) 组织代码而不改变 URL，使用私有文件夹 [`_folder`](https://nextjscn.org/docs/app/getting-started/project-structure#private-folders) 放置不可路由的文件。

| Path                            | URL模式 | 解释                         |
| ------------------------------- | ------- | ---------------------------- |
| `app/(marketing)/page.tsx`      | `/`     | 组在 URL 中被省略            |
| `app/(shop)/cart/page.tsx`      | `/cart` | 在 `(shop)` 内共享布局       |
| `app/blog/_components/Post.tsx` | —       | 不可路由；UI 工具的安全位置  |
| `app/blog/_lib/data.ts`         | —       | 不可路由；实用工具的安全位置 |

### 2.1.7 并行路由和拦截路由

这些功能适用于特定的用户界面模式，例如基于插槽的布局或模态路由。

使用 `@slot` 表示由父布局渲染的命名插槽。使用拦截模式在当前布局内渲染另一个路由而不改变 URL，例如，在列表上以模态框显示详情视图。

| 模式（文档）                                                 | 含义     | 典型用例                       |
| ------------------------------------------------------------ | -------- | ------------------------------ |
| [`@folder`](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#slots) | 命名槽   | 侧边栏 + 主要内容              |
| [`(.)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 截距相同 | 在模态框中预览同级路由         |
| [`(..)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 拦截父级 | 将父对象的子对象以覆盖方式打开 |
| [`(..)(..)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 截距两级 | 深度嵌套覆盖层                 |
| [`(...)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 从根截距 | 在当前视图中显示任意路径       |

### 2.1.8 元数据文件约定

1. 应用图标

|                                                              |                                     |                       |
| ------------------------------------------------------------ | ----------------------------------- | --------------------- |
| [`favicon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#favicon) | `.ico`                              | 网站图标文件          |
| [`icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#icon) | `.ico` `.jpg` `.jpeg` `.png` `.svg` | 应用图标文件          |
| [`icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`                  | 生成的应用图标        |
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon) | `.jpg` `.jpeg`，`.png`              | Apple 应用图标文件    |
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`                  | 生成的 Apple 应用图标 |

2. Open Graph 和 Twitter 图片

|                                                              |                              |                        |
| ------------------------------------------------------------ | ---------------------------- | ---------------------- |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image) | `.jpg` `.jpeg` `.png` `.gif` | Open Graph 图片文件    |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`           | 生成的 Open Graph 图像 |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image) | `.jpg` `.jpeg` `.png` `.gif` | Twitter 图片文件       |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`           | 生成的 Twitter 图片    |

3.SEO

|                                                              |             |                   |
| ------------------------------------------------------------ | ----------- | ----------------- |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#sitemap-files-xml) | `.xml`      | 站点地图文件      |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts) | `.js` `.ts` | 生成的站点地图    |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt) | `.txt`      | Robots 文件       |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file) | `.js` `.ts` | 生成的Robots 文件 |

## 2.2 组织你的项目

Next.js 对项目文件的组织和存放方式没有硬性规定。但它确实提供了一些功能来帮助你组织项目。

### 2.2.1 组件层次结构

特殊文件中定义的组件按特定层次结构渲染：

- `layout.js`
- `template.js`
- `error.js`（React 错误边界）
- `loading.js`（React suspense 边界）
- `not-found.js`（"未找到" UI 的 React 错误边界）
- `page.js` 或嵌套的 `layout.js`

![Component Hierarchy for File Conventions](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040008697.png)

在嵌套路由中，组件会递归渲染，这意味着路由段的组件将嵌套在其父段的组件**内部**。

![Nested File Conventions Component Hierarchy](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040009694.png)

### 2.2.2 文件放置

在 `app` 目录中，嵌套文件夹定义路由结构。每个文件夹代表一个路由段，该段映射到 URL 路径中的相应段。

然而，即使通过文件夹定义了路由结构，在将 `page.js` 或 `route.js` 文件添加到路由段之前，该路由**不会公开访问**。

![A diagram showing how a route is not publicly accessible until a page.js or route.js file is added to a route segment.](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040010895.png)

而且，即使路由被公开访问，也只有 `page.js` 或 `route.js` **返回的内容**会发送到客户端。

![A diagram showing how page.js and route.js files make routes publicly accessible.](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040010108.png)

这意味着**项目文件**可以**安全地放置**在 `app` 目录的路由段内，而不会意外地变为可路由。

![A diagram showing colocated project files are not routable even when a segment contains a page.js or route.js file.](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040011235.png)

> **值得注意的是**：虽然你**可以**将项目文件放置在 `app` 中，但你不**必须**这样做。如果你愿意，可以[将它们保留在 `app` 目录之外](https://nextjscn.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app)。

### 2.2.3 私有文件夹

可以通过在文件夹前加下划线来创建私有文件夹：`_folderName`

这表示该文件夹是私有实现细节，路由系统不应考虑它，从而**使该文件夹及其所有子文件夹**退出路由。

![An example folder structure using private folders](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040012499.png)

由于 `app` 目录中的文件可以[默认安全地放置](https://nextjscn.org/docs/app/getting-started/project-structure#colocation)，因此文件放置不需要私有文件夹。但是，它们可用于：

- 将 UI 逻辑与路由逻辑分离。
- 在项目和 Next.js 生态系统中一致地组织内部文件。
- 在代码编辑器中对文件进行排序和分组。
- 避免与未来的 Next.js 文件约定产生潜在的命名冲突。

> **值得注意的是**：
>
> - 虽然不是框架约定，但你也可以考虑使用相同的下划线模式将私有文件夹外的文件标记为"私有"。
> - 你可以通过在文件夹名称前加上 `%5F`（下划线的 URL 编码形式）来创建以下划线开头的 URL 段：`%5FfolderName`。
> - 如果你不使用私有文件夹，了解 Next.js [特殊文件约定](https://nextjscn.org/docs/app/getting-started/project-structure#routing-files)会有所帮助，以防止意外的命名冲突。

### 2.2.4 路由组

可以通过用括号包裹文件夹来创建路由组：`(folderName)`

这表示该文件夹用于组织目的，**不应包含**在路由的 URL 路径中。

![An example folder structure using route groups](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040014787.png)

路由组对以下情况很有用：

- 按站点部分、意图或团队组织路由。例如，营销页面、管理页面等。
- 在同一路由段级别启用嵌套布局：
  - [在同一段中创建多个嵌套布局，包括多个根布局](https://nextjscn.org/docs/app/getting-started/project-structure#creating-multiple-root-layouts)
  - [将布局添加到公共段中的路由子集](https://nextjscn.org/docs/app/getting-started/project-structure#opting-specific-segments-into-a-layout)

### 2.2.5 src文件夹

Next.js 支持将应用程序代码（包括 `app`）存储在可选的 [`src` 文件夹](https://nextjscn.org/docs/app/api-reference/file-conventions/src-folder)中。这将应用程序代码与主要位于项目根目录的项目配置文件分离。

![An example folder structure with the `src` folder](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040024096.png)

## 2.3 示例

以下部分列出了常见策略的高级概述。最简单的要点是选择一个适合你和你的团队的策略，并在整个项目中保持一致。

> **值得注意的是**：在下面的示例中，我们使用 `components` 和 `lib` 文件夹作为通用占位符，它们的命名没有特殊的框架意义，你的项目可能使用其他文件夹，如 `ui`、`utils`、`hooks`、`styles` 等。

### 2.3.1 将项目文件存储在app之外

此策略将所有应用程序代码存储在**项目根目录**的共享文件夹中，并将 `app` 目录纯粹用于路由目的。

![An example folder structure with project files outside of app](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040028998.png)

### 2.3.2 将项目文件存储在 `app` 内的顶层文件夹中

此策略将所有应用程序代码存储在 **`app` 目录根目录**的共享文件夹中。

![An example folder structure with project files inside app](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040029263.png)

### 2.3.3 按功能或路由拆分项目文件

此策略将全局共享的应用程序代码存储在根 `app` 目录中，并将更具体的应用程序代码**拆分**到使用它们的路由段中。

![An example folder structure with project files split by feature or route](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040029513.png)

### 2.3.4 组织路由而不影响 URL 路径

要在不影响 URL 的情况下组织路由，请创建一个组以将相关路由保持在一起。括号中的文件夹将从 URL 中省略（例如 `(marketing)` 或 `(shop)`）。

![Organizing Routes with Route Groups](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040030963.png)

即使 `(marketing)` 和 `(shop)` 内的路由共享相同的 URL 层次结构，你也可以通过在它们的文件夹内添加 `layout.js` 文件来为每个组创建不同的布局。

![Route Groups with Multiple Layouts](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040031738.png)

### 2.3.5 将特定段选择加入布局

要将特定路由选择加入布局，请创建一个新的路由组（例如 `(shop)`），并将共享相同布局的路由移动到该组中（例如 `account` 和 `cart`）。组外的路由将不会共享该布局（例如 `checkout`）。

![Route Groups with Opt-in Layouts](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040032776.png)

### 2.3.6 在特定路由上选择加入加载骨架屏

要通过 `loading.js` 文件将[加载骨架屏](https://nextjscn.org/docs/app/api-reference/file-conventions/loading)应用于特定路由，请创建一个新的路由组（例如 `/(overview)`），然后将你的 `loading.tsx` 移动到该路由组内。

![Folder structure showing a loading.tsx and a page.tsx inside the route group](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040033597.png)

现在，`loading.tsx` 文件将仅应用于你的 dashboard → overview 页面，而不是所有 dashboard 页面，而不会影响 URL 路径结构。

### 2.3.7 创建多个根布局

要创建多个[根布局](https://nextjscn.org/docs/app/api-reference/file-conventions/layout#root-layout)，请删除顶层的 `layout.js` 文件，并在每个路由组内添加一个 `layout.js` 文件。这对于将应用程序划分为具有完全不同 UI 或体验的部分很有用。需要将 `<html>` 和 `<body>` 标签添加到每个根布局。

![Route Groups with Multiple Root Layouts](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511040036635.png)

在上面的示例中，`(marketing)` 和 `(shop)` 都有自己的根布局。

# 3.布局和页面

Next.js 使用**基于文件系统的路由**，这意味着你可以使用文件夹和文件来定义路由。

## 3.1创建页面

**页面**是在特定路由上渲染的 UI。要创建页面，请在 `app` 目录中添加一个 `page.tsx`文件并默认导出一个 React 组件。例如，要创建索引页面（`/`）：

![page.js special file](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080010139.png)

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

## 3.2创建布局

布局是在多个页面之间**共享**的 UI。在导航时，布局会保留状态，保持交互性，并且不会重新渲染。

你可以通过从 [`layout` 文件](https://nextjscn.org/docs/app/api-reference/file-conventions/layout)默认导出一个 React 组件来定义布局。该组件应接受一个 `children` prop，它可以是页面或另一个[布局](https://nextjscn.org/docs/app/getting-started/layouts-and-pages#nesting-layouts)。

例如，要创建一个接受索引页面作为子元素的布局，请在 `app` 目录中添加一个 `layout` 文件：

![layout.js special file](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080012310.png)

```tsx
// app/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* 布局 UI */}
        {/* 将 children 放在你想要渲染页面或嵌套布局的位置 */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

上面的布局称为[根布局](https://nextjscn.org/docs/app/api-reference/file-conventions/layout#root-layout)，因为它定义在 `app` 目录的根目录。根布局是**必需的**，并且必须包含 `html` 和 `body` 标签。

## 3.3创建嵌套路由

嵌套路由是由多个 URL 段组成的路由。例如，`/blog/[slug]` 路由由三个段组成：

- `/`（根段）
- `blog`（段）
- `[slug]`（叶段）

在 Next.js 中：

- **文件夹**用于定义映射到 URL 段的路由段。
- **文件**（如 `page` 和 `layout`）用于创建为段显示的 UI。

要创建嵌套路由，你可以将文件夹嵌套在彼此内部。例如，要添加 `/blog` 路由，请在 `app` 目录中创建一个名为 `blog` 的文件夹。然后，为了使 `/blog` 可公开访问，添加一个 `page.tsx` 文件：

![File hierarchy showing blog folder and a page.js file](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080015984.png)

```tsx
// app/blog/page.tsx
// 示例导入
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'
 
export default async function Page() {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

你可以继续嵌套文件夹来创建嵌套路由。例如，要为特定博客文章创建路由，请在 `blog` 中创建一个新的 `[slug]` 文件夹并添加一个 `page` 文件：

![File hierarchy showing blog folder with a nested slug folder and a page.js file](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080016830.png)

```tsx
// app/blog/[slug]/page.tsx
function generateStaticParams() {}
 
export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

将文件夹名称包裹在方括号中（例如 `[slug]`）会创建一个[动态路由段](https://nextjscn.org/docs/app/api-reference/file-conventions/dynamic-routes)，用于从数据生成多个页面。例如博客文章、产品页面等。

## 3.4嵌套布局

默认情况下，文件夹层次结构中的布局也是嵌套的，这意味着它们通过 `children` prop 包裹子布局。你可以通过在特定路由段（文件夹）内添加 `layout` 来嵌套布局。

例如，要为 `/blog` 路由创建布局，请在 `blog` 文件夹内添加一个新的 `layout` 文件。

![File hierarchy showing root layout wrapping the blog layout](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080018013.png)

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

如果你将上面的两个布局组合在一起，根布局（`app/layout.js`）会包裹博客布局（`app/blog/layout.js`），后者会包裹博客页面（`app/blog/page.js`）和博客文章页面（`app/blog/[slug]/page.js`）。

## 3.5创建动态段

[动态段](https://nextjscn.org/docs/app/api-reference/file-conventions/dynamic-routes)允许你创建从数据生成的路由。例如，无需为每篇博客文章手动创建路由，你可以创建一个动态段来根据博客文章数据生成路由。

要创建动态段，请将段（文件夹）名称包裹在方括号中：`[segmentName]`。例如，在 `app/blog/[slug]/page.tsx` 路由中，`[slug]` 是动态段。

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
 
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

## 3.6使用搜索参数进行渲染

在 Server Component **页面**中，你可以使用 [`searchParams`](https://nextjscn.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop 访问搜索参数：

```tsx
// app/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

使用 `searchParams` 会使你的页面选择进入[**动态渲染**](https://nextjscn.org/docs/app/guides/caching#dynamic-rendering)，因为它需要传入的请求来读取搜索参数。

Client Components 可以使用 [`useSearchParams`](https://nextjscn.org/docs/app/api-reference/functions/use-search-params) hook 读取搜索参数。

> 何时使用：
>
> - 当你需要搜索参数来**为页面加载数据**时（例如分页、从数据库过滤），使用 `searchParams` prop。
> - 当搜索参数**仅在客户端使用**时（例如过滤已通过 props 加载的列表），使用 `useSearchParams`。
> - 作为一个小优化，你可以在**回调或事件处理程序**中使用 `new URLSearchParams(window.location.search)` 来读取搜索参数而不触发重新渲染。

## 3.7在页面之间链接

你可以使用Link组件在路由之间导航。`<Link>` 是一个内置的 Next.js 组件，它扩展了 HTML `<a>` 标签以提供预取和[客户端导航](https://nextjscn.org/docs/app/getting-started/linking-and-navigating#client-side-transitions)。

例如，要生成博客文章列表，从 `next/link` 导入 `<Link>` 并将 `href` prop 传递给组件：

```tsx
// app/ui/post.tsx
import Link from 'next/link'
 
export default async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

> **值得注意的是**：`<Link>` 是在 Next.js 中在路由之间导航的主要方式。你也可以使用 [`useRouter` hook](https://nextjscn.org/docs/app/api-reference/functions/use-router) 进行更高级的导航。

## 3.8Route Props 辅助类型

Next.js 公开了实用类型，可以从你的路由结构推断 `params` 和命名插槽：

- [**PageProps**](https://nextjscn.org/docs/app/api-reference/file-conventions/page#page-props-helper)：`page` 组件的 Props，包括 `params` 和 `searchParams`。
- [**LayoutProps**](https://nextjscn.org/docs/app/api-reference/file-conventions/layout#layout-props-helper)：`layout` 组件的 Props，包括 `children` 和任何命名插槽（例如像 `@analytics` 这样的文件夹）。

这些是全局可用的辅助类型，在运行 `next dev`、`next build` 或 [`next typegen`](https://nextjscn.org/docs/app/api-reference/cli/next#next-typegen-options) 时生成。

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```



```tsx
// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* 如果你有 app/dashboard/@analytics，它会作为类型化插槽出现： */}
      {/* {props.analytics} */}
    </section>
  )
}
```

> **值得注意的是**
>
> - 静态路由将 `params` 解析为 `{}`。
> - `PageProps`、`LayoutProps` 是全局辅助类型——无需导入。
> - 类型在 `next dev`、`next build` 或 `next typegen` 期间生成。

# 4.链接和导航

在 Next.js 中，路由默认在服务器上渲染。这通常意味着客户端必须等待服务器响应才能显示新路由。Next.js 内置了**预取、流式传输和客户端转换**，确保导航保持快速和响应。

## 4.1 导航的工作原理

要理解 Next.js 中导航的工作原理，熟悉以下概念会有所帮助：

- 服务器渲染
- 预取
- 流式传输
- 客户端转换

### 4.1.1 服务器渲染

在 Next.js 中，布局(layout.js)和页面(page.js)默认是 `React Server Components`。在初始导航和后续导航中，`Server Component Payload` 在发送到客户端之前会在服务器上生成。

服务器渲染有两种类型，基于*何时*发生：

- **静态渲染（或预渲染）**发生在构建时或重新验证期间，结果会被缓存。
- **动态渲染**发生在请求时，响应客户端请求。

服务器渲染的权衡是客户端必须等待服务器响应才能显示新路由。Next.js 通过预取用户可能访问的路由和执行客户端转换来解决这种延迟。

> **值得注意的是**：HTML 也会为初始访问生成。

### 4.1.2 预取

预取是在用户导航到路由之前在后台加载路由的过程。这使得应用程序中路由之间的导航感觉即时，因为当用户点击链接时，

渲染下一个路由的数据已经在客户端可用。

当使用 `link` 组件链接的路由进入用户的视口时，Next.js 会自动预取这些路由。

```tsx
// app/layout.tsx
import Link from 'next/link'
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* 当链接被悬停或进入视口时预取 */}
          <Link href="/blog">Blog</Link>
          {/* 无预取 */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

预取路由的多少取决于它是静态的还是动态的：

- **静态路由**：完整路由被预取。
- **动态路由**：预取被跳过，或者如果存在 [`loading.tsx`](https://nextjscn.org/docs/app/api-reference/file-conventions/loading)，路由会被部分预取。

通过跳过或部分预取动态路由，Next.js 避免了对用户可能永远不会访问的路由在服务器上进行不必要的工作。然而，在导航

前等待服务器响应可能会给用户留下应用程序无响应的印象。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080049160.png" alt="Server Rendering without Streaming" style="zoom:50%;" />

要改善对动态路由的导航体验，你可以使用**流式传输**。

### 4.1.3 流式传输

流式传输允许服务器在动态路由的各个部分准备就绪后立即将其发送到客户端，而不是等待整个路由渲染完成。这意味着用户

能更快看到内容，即使页面的某些部分仍在加载。

对于动态路由，这意味着它们可以被**部分预取**。也就是说，共享布局和加载骨架可以提前请求。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080050351.png" alt="How Server Rendering with Streaming Works" style="zoom:50%;" />

要使用流式传输，在路由文件夹中创建一个 `loading.tsx`：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511080051117.png" alt="loading.js special file" style="zoom:50%;" />

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  // 添加在路由加载时显示的后备 UI。
  return <LoadingSkeleton />
}
```

在幕后，Next.js 会自动将 `page.tsx` 的内容包装在 `<Suspense>` 边界中。预取的后备 UI 将在路由加载时显示，

并在准备就绪后替换为实际内容。

> **值得注意的是**：你也可以使用 `<Suspense>` 为嵌套组件创建加载 UI。

`loading.tsx` 的好处：

- 为用户提供即时导航和视觉反馈。
- 共享布局保持交互性，导航可中断。
- 改善核心 Web 指标：**TTFB**、**FCP** 和 **TTI**。

为了进一步改善导航体验，Next.js 使用 `<Link>` 组件执行客户端转换。

### 4.1.4 客户端转换

传统上，导航到服务器渲染的页面会触发完整的页面加载。这会清除状态、重置滚动位置并阻止交互。

Next.js 使用 `<Link>` 组件通过客户端转换避免了这种情况。它不会重新加载页面，而是通过以下方式动态更新内容：

- 保留任何共享布局和 UI。
- 用预取的加载状态或新页面（如果可用）替换当前页面。

客户端转换使服务器渲染的应用程序*感觉*像客户端渲染的应用程序。当与**预取**和**流式传输**配合时，即使对于动态路由也能

实现快速转换。

## 4.2 是什么让转换变慢

这些 Next.js 优化使导航快速且响应迅速。然而，在某些条件下，转换仍然可能*感觉*缓慢。以下是一些常见原因以及如何改善用户体验：

### 4.2.1 没有 `loading.tsx` 的动态路由

当导航到动态路由时，客户端必须等待服务器响应才能显示结果。这可能会给用户留下应用程序无响应的印象。

我们建议为动态路由添加 `loading.tsx` 以启用部分预取、触发即时导航并在路由渲染时显示加载 UI。

```tsx
// app/blog/[slug]/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

> **值得注意的是**：在开发模式下，你可以使用 Next.js Devtools 来识别路由是静态的还是动态的。

### 4.2.2 没有 `generateStaticParams` 的动态段

如果动态段本可以被预渲染但因为缺少 `generateStaticParams` 而没有预渲染，该路由将在请求时回退到动态渲染。

通过添加 `generateStaticParams` 确保路由在构建时静态生成：

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
 
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

### 4.2.3 慢速网络

在慢速或不稳定的网络上，预取可能在用户点击链接之前无法完成。这会影响静态和动态路由。在这些情况下，`loading.js` 

后备可能不会立即出现，因为它还没有被预取。

为了改善感知性能，你可以使用 `useLinkStatus` hook 在转换进行中时显示即时反馈。

```tsx
// app/ui/loading-indicator.tsx
'use client'
 
import { useLinkStatus } from 'next/link'
 
export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

你可以通过添加初始动画延迟（例如 100ms）并以不可见状态开始（例如 `opacity: 0`）来"防抖"提示。这意味着只有当

导航时间超过指定延迟时，才会显示加载指示器。

> **值得注意的是**：你可以使用其他视觉反馈模式，如进度条。

### 4.2.4 禁用预取

你可以通过在 `<Link>` 组件上将 `prefetch` prop 设置为 `false` 来选择退出预取。这对于在渲染大量链接列表（例

如无限滚动表格）时避免不必要的资源使用很有用。

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

然而，禁用预取也有权衡：

- **静态路由**只会在用户点击链接时才被获取。
- **动态路由**需要首先在服务器上渲染，然后客户端才能导航到它。

要减少资源使用而不完全禁用预取，你可以仅在悬停时预取。这将预取限制在用户更*可能*访问的路由，而不是视口中的所有链接。

```tsx
// app/ui/hover-prefetch-link.tsx
'use client'
 
import Link from 'next/link'
import { useState } from 'react'
 
function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)
 
  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

### 4.2.5 水合未完成

`<Link>` 是一个 Client Component，必须在水合后才能预取路由。在初始访问时，大型 JavaScript 包可能会延迟水合，从而阻止预取立即开始。

React 通过选择性水合来缓解这个问题，你可以通过以下方式进一步改进：

- 使用 `@next/bundle-analyzer` 插件识别并通过删除大型依赖项来减少包大小。
- 尽可能将逻辑从客户端移到服务器。有关指导，请参阅 Server and Client Components 文档。

## 4.3示例

### 4.3.1 原生 History API

Next.js 允许你使用原生 `window.history.pushState` 和 `window.history.replaceState` 方法来更新浏览

器的历史记录堆栈而不重新加载页面。

`pushState` 和 `replaceState` 调用集成到 Next.js Router 中，允许你与 `usePathname` 和 

`useSearchParams`同步。

1.`window.history.pushState`

使用它向浏览器的历史记录堆栈添加新条目。用户可以导航回到之前的状态。例如，对产品列表进行排序：

```tsx
'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SortProducts() {
  const searchParams = useSearchParams()
 
  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }
 
  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```



2.window.history.replaceState

使用它替换浏览器历史记录堆栈上的当前条目。用户无法导航回到之前的状态。例如，切换应用程序的语言环境：

```tsx
'use client'
 
import { usePathname } from 'next/navigation'
 
export function LocaleSwitcher() {
  const pathname = usePathname()
 
  function switchLocale(locale: string) {
    // 例如 '/en/about' 或 '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }
 
  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

# 5.Server 和 Client 组件

默认情况下，布局和页面是 Server Components，这使你可以在服务器上获取数据并渲染 UI 的各个部分，可选地缓存结

果，并将其流式传输到客户端。当你需要交互性或浏览器 API 时，可以使用 Client Components 来分层添加功能。

## 5.1 何时使用 Server 和 Client 组件？

客户端和服务器环境具有不同的能力。Server 和 Client 组件允许你根据用例在每个环境中运行逻辑。

当你需要以下情况时使用 **Client Components**：

- 状态和事件处理程序。例如 `onClick`、`onChange`。
- 生命周期逻辑。例如 `useEffect`。
- 仅浏览器 API。例如 `localStorage`、`window`、`Navigator.geolocation` 等。
- 自定义 hooks。

当你需要以下情况时使用 **Server Components**：

- 从数据库或靠近数据源的 API 获取数据。
- 使用 API 密钥、令牌和其他密钥而不将它们暴露给客户端。
- 减少发送到浏览器的 JavaScript 量。
- 改善 [First Contentful Paint (FCP)](https://web.dev/fcp/)，并逐步将内容流式传输到客户端。

例如，`<Page>` 组件是一个 Server Component，它获取有关文章的数据，并将其作为 props 传递给处理客户端交互的 `<LikeButton>`。

```tsx
// app/[id]/page.tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```



```tsx
// app/ui/like-button.tsx
'use client'
 
import { useState } from 'react'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

## 5.2 Server 和 Client 组件在 Next.js 中如何工作？

### 5.2.1在服务器上

在服务器上，Next.js 使用 React 的 API 来编排渲染。渲染工作按各个路由段（布局和页面）被分割成块：

- **Server Components** 被渲染成一种称为 React Server Component Payload（RSC Payload）的特殊数据格式。
- **Client Components** 和 RSC Payload 用于预渲染 HTML。

> **什么是 React Server Component Payload（RSC）？**
>
> RSC Payload 是已渲染的 React Server Components 树的紧凑二进制表示。它被 React 在客户端用于更新浏览器的 DOM。RSC Payload 包含：
>
> - Server Components 的渲染结果
> - Client Components 应该渲染的位置的占位符以及对其 JavaScript 文件的引用
> - 从 Server Component 传递到 Client Component 的任何 props

### 5.2.1在客户端（首次加载）

然后，在客户端：

1. **HTML** 用于立即向用户显示路由的快速非交互式预览。
2. **RSC Payload** 用于协调 Client 和 Server Component 树。
3. **JavaScript** 用于水合 Client Components 并使应用程序具有交互性。

> **什么是水合（hydration）？**
>
> 水合是 React 将[事件处理程序](https://react.dev/learn/responding-to-events)附加到 DOM 的过程，以使静态 HTML 具有交互性。

### 5.2.3后续导航

在后续导航中：

- **RSC Payload** 被预取并缓存以实现即时导航。
- **Client Components** 完全在客户端渲染，无需服务器渲染的 HTML。

## 5.3示例

### 5.3.1 使用 Client Components

你可以通过在文件顶部、导入语句之上添加 [`"use client"`](https://react.dev/reference/react/use-client) 指令来创建 Client Component。

```tsx
// app/ui/counter.tsx
'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

`"use client"` 用于声明 Server 和 Client 模块图（树）之间的**边界**。

一旦文件被标记为 `"use client"`，**其所有导入和子组件都被视为客户端包的一部分**。这意味着你不需要为每个面向客户端的组件添加该指令。

### 5.3.2 减少JS包大小

为了减少客户端 JavaScript 包的大小，将 `'use client'` 添加到特定的交互式组件，而不是将 UI 的大部分标记为 Client Components。

例如，`<Layout>` 组件主要包含静态元素，如徽标和导航链接，但包含一个交互式搜索栏。`<Search />` 是交互式的，需要成为 Client Component，但是布局的其余部分可以保持为 Server Component。

```tsx
// app/layout.tsx
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'
 
// Layout 默认是 Server Component
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

`app/ui/search.tsx:`

```tsx
'use client'
 
export default function Search() {
  // ...
}
```

### 5.3.3 从 Server 向 Client 组件传递数据

你可以使用 props 将数据从 Server Components 传递到 Client Components。

`app/[id]/page.tsx:`

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return <LikeButton likes={post.likes} />
}
```

`app/ui/like-button.tsx:`

```tsx
'use client'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

或者，你可以使用 [`use` Hook](https://react.dev/reference/react/use) 将数据从 Server Component 流式传输到 Client Component。见获取数据章节。

> **值得注意的是**：传递给 Client Components 的 Props 需要能够被 React [序列化](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)。

### 5.3.4 交错 Server 和 Client 组件

你可以将 Server Components 作为 prop 传递给 Client Component。这允许你在 Client 组件中视觉上嵌套服务器渲染的 UI。

一个常见的模式是使用 `children` 在 `<ClientComponent>` 中创建一个_插槽_。例如，在服务器上获取数据的 `<Cart>` 组件，位于使用客户端状态切换可见性的 `<Modal>` 组件内部。

`app/ui/modal.tsx:`

```tsx
'use client'
 
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

然后，在父 Server Component（例如 `<Page>`）中，你可以将 `<Cart>` 作为 `<Modal>` 的子元素传递：

`app/page.tsx:`

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'
 
export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

在这种模式中，所有 Server Components 都将提前在服务器上渲染，包括作为 props 的那些。生成的 RSC payload 将包含 Client Components 应在组件树中渲染的位置的引用。

### 5.3.5 Context providers

`React context` 通常用于共享全局状态，如当前主题。但是，Server Components 不支持 React context。

要使用 context，创建一个接受 `children` 的 Client Component：

`app/theme-provider.tsx:`

```tsx
'use client'
 
import { createContext } from 'react'
 
export const ThemeContext = createContext({})
 
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

然后，将其导入到 Server Component（例如 `layout`）中：

`app/layout.tsx:`

```tsx
import ThemeProvider from './theme-provider'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

你的 Server Component 现在将能够直接渲染你的 provider，并且整个应用程序中的所有其他 Client Components 都将能够使用此 context。

> **值得注意的是**：你应该在树中尽可能深地渲染 providers——注意 `ThemeProvider` 只包裹 `{children}` 而不是整个 `<html>` 文档。这使得 Next.js 更容易优化 Server Components 的静态部分。

### 5.3.6 第三方组件

当使用依赖于仅客户端功能的第三方组件时，你可以将其包装在 Client Component 中以确保它按预期工作。

例如，`<Carousel />` 可以从 `acme-carousel` 包中导入。这个组件使用 `useState`，但它还没有 `"use client"` 指令。

如果你在 Client Component 中使用 `<Carousel />`，它将按预期工作:

`app/gallery.tsx:`

```tsx
'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* 可以工作，因为 Carousel 在 Client Component 中使用 */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

但是，如果你尝试直接在 Server Component 中使用它，你会看到错误。这是因为 Next.js 不知道 `<Carousel />` 使用仅客户端功能。

要解决这个问题，你可以将依赖于仅客户端功能的第三方组件包装在你自己的 Client Components 中：

`app/carousel.tsx:`

```tsx
'use client'
 
import { Carousel } from 'acme-carousel'
 
export default Carousel
```

现在，你可以直接在 Server Component 中使用 `<Carousel />`：

`app/page.tsx:`

```tsx
import Carousel from './carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* 可以工作，因为 Carousel 是 Client Component */}
      <Carousel />
    </div>
  )
}
```

### 5.3.7 防止环境污染

JavaScript 模块可以在 Server 和 Client Components 模块之间共享。这意味着有可能意外地将仅服务器代码导入到客户端。例如，考虑以下函数：

`lib/data.ts:`

```tsx
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

此函数包含一个永远不应暴露给客户端的 `API_KEY`。

在 Next.js 中，只有以 `NEXT_PUBLIC_` 为前缀的环境变量才会包含在客户端包中。如果变量没有前缀，Next.js 会将它们替换为空字符串。

因此，即使 `getData()` 可以在客户端导入和执行，它也不会按预期工作。

要防止在 Client Components 中意外使用，你可以使用 `server-only` 包。

然后，将该包导入到包含仅服务器代码的文件中：

`lib/data.js:`

```tsx
import 'server-only'
 
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

现在，如果你尝试将该模块导入到 Client Component 中，将会出现构建时错误。

相应的 `client-only` 包可用于标记包含仅客户端逻辑的模块，例如访问 `window` 对象的代码。

在 Next.js 中，安装 `server-only` 或 `client-only` 是**可选的**。但是，如果你的 linting 规则标记了无关依赖项，你可以安装它们以避免问题。

```bash
npm install server-only
```

Next.js 在内部处理 `server-only` 和 `client-only` 导入，以在模块在错误环境中使用时提供更清晰的错误消息。来自 NPM 的这些包的内容不被 Next.js 使用。

Next.js 还为 `server-only` 和 `client-only` 提供了自己的类型声明，适用于激活了 `noUncheckedSideEffectImports` 的 TypeScript 配置。

# 6.缓存组件

Cache Components 是 Next.js 中一种新的渲染和缓存方法，它提供了对缓存内容和时机的精细控制，同时通过 **Partial Prerendering (PPR)** 确保出色的用户体验。

在开发动态应用程序时，你必须在两种主要方法之间取得平衡：

- **完全静态的页面**加载速度快，但无法显示个性化或实时数据
- **完全动态的页面**可以显示最新数据，但需要在每次请求时渲染所有内容，导致初始加载速度较慢

启用 Cache Components 后，Next.js **默认将所有路由视为动态的**。每次请求都使用最新的可用数据进行渲染。然而，大多数页面都由静态和动态部分组成，并非所有动态数据都需要在每次请求时从源解析。

Cache Components 允许你将数据甚至 UI 的部分标记为可缓存，这会将它们与页面的静态部分一起包含在预渲染过程中。

> **在 Cache Components 之前**，Next.js 尝试自动静态优化**整个**页面，这可能在添加动态代码时导致意外行为。

Cache Components 实现了 **Partial Prerendering (PPR)** 和 `use cache`，为你提供两全其美的解决方案：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511091531841.png" alt="部分重新渲染的产品页面，显示静态导航和产品信息，以及动态购物车和推荐产品" style="zoom:50%;" />

当用户访问路由时：

- 服务器发送包含缓存内容的**静态外壳**，确保快速的初始加载
- 包裹在 `Suspense` 边界中的动态部分在外壳中显示后备 UI
- 只有动态部分进行渲染以替换其后备内容，在准备就绪时并行流式传输
- 你可以通过使用 `use cache` 缓存原本动态的数据，将其包含在初始外壳中

## 6.1 工作原理

> **值得注意的是：** Cache Components 是一个可选功能。通过在 Next 配置文件中将 `cacheComponents` 标志设置为 `true` 来启用它。

Cache Components 为你提供三个关键工具来控制渲染：

### 6.1.1 使用 Suspense 处理运行时数据

某些数据仅在实际用户发出请求时的运行时才可用。诸如 [`cookies`](https://nextjscn.org/docs/app/api-reference/functions/cookies)、[`headers`](https://nextjscn.org/docs/app/api-reference/functions/headers) 和 [`searchParams`](https://nextjscn.org/docs/app/api-reference/file-conventions/page#searchparams-optional) 等 API 访问特定于请求的信息。将使用这些 API 的组件包裹在 `Suspense` 边界中，以便页面的其余部分可以作为静态外壳进行预渲染。

**运行时 API 包括：**

- [`cookies`](https://nextjscn.org/docs/app/api-reference/functions/cookies)
- [`headers`](https://nextjscn.org/docs/app/api-reference/functions/headers)
- `searchParams` 
- `params`  - 这是运行时数据，除非你通过 [`generateStaticParams`](https://nextjscn.org/docs/app/api-reference/functions/generate-static-params) 提供至少一个示例值。提供后，这些特定的参数值对于预渲染路径被视为静态，而其他值保持运行时

### 6.1.2 使用 Suspense 处理动态数据

动态数据，如 [`fetch`](https://nextjscn.org/docs/app/api-reference/functions/fetch) 调用或数据库查询（`db.query(...)`），可能在请求之间发生变化，但不是用户特定的。[`connection`](https://nextjscn.org/docs/app/api-reference/functions/connection) API 是元动态的——它表示等待用户导航，即使没有实际数据要返回。将使用这些的组件包裹在 `Suspense` 边界中以启用流式传输。

**动态数据模式包括：**

- [`fetch`](https://nextjscn.org/docs/app/api-reference/functions/fetch) 请求
- 数据库查询
- `connection`

### 6.1.3 使用 `use cache` 缓存数据

将 `use cache` 添加到任何 Server Component 以使其被缓存并包含在预渲染的外壳中。你不能在缓存组件内部使用运行时 API。你还可以将工具函数标记为 `use cache` 并从 Server Components 调用它们。

```tsx
export async function getProducts() {
  'use cache'
  const data = await db.query('SELECT * FROM products')
  return data
}
```

## 6.2 使用 Suspense 边界

React Suspense 边界允许你定义在包裹动态或运行时数据时使用的后备 UI。

边界外的内容（包括后备 UI）作为静态外壳进行预渲染，而边界内的内容在准备就绪时流式传输。

以下是如何将 `Suspense` 与 Cache Components 一起使用：

`app/page.tsx:`

```tsx
import { Suspense } from 'react'
 
export default function Page() {
  return (
    <>
      <h1>这将被预渲染</h1>
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </>
  )
}
 
async function DynamicContent() {
  const res = await fetch('http://api.cms.com/posts')
  const { posts } = await res.json()
  return <div>{/* ... */}</div>
}
```

在构建时，Next.js 预渲染静态内容和 `fallback` UI，而动态内容将推迟到用户请求路由时。

> **值得注意的是**：将组件包裹在 `Suspense` 中不会使其变为动态；你的 API 使用会。`Suspense` 充当封装动态内容并启用流式传输的边界。

### 6.2.1 缺失的 Suspense 边界

Cache Components 强制要求动态代码必须包裹在 `Suspense` 边界中。如果你忘记了，你会看到 在 `<Suspense>` 外部访问了未缓存的数据 错误：

> **在 `<Suspense>` 外部访问了未缓存的数据**
>
> 这会延迟整个页面的渲染，导致用户体验缓慢。Next.js 使用此错误来确保你的应用在每次导航时都能立即加载。
>
> 要解决此问题，你可以：
>
> **将组件包裹在 `<Suspense>` 边界中**。这允许 Next.js 在内容准备就绪时立即将其流式传输给用户，而不会阻塞应用的其余部分。
>
> 或
>
> **将异步 await 移至 Cache Component（"use cache"）**。这允许 Next.js 将组件作为 HTML 文档的一部分进行静态预渲染，因此用户可以立即看到它。
>
> 请注意，特定于请求的信息，如 params、cookies 和 headers，在静态预渲染期间不可用，因此必须包裹在 `<Suspense>` 中。

此错误有助于防止出现这样的情况：用户不是立即获得静态外壳，而是遇到阻塞运行时渲染且没有任何内容显示。要解决此问题，请添加 `Suspense` 边界或使用 `use cache` 来缓存工作。

### 6.2.2 流式传输的工作原理

流式传输将路由分割成块，并在准备就绪时逐步将它们流式传输到客户端。这允许用户在整个内容完成渲染之前立即看到页面的部分内容。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511091641832.png" alt="显示客户端上部分渲染的页面的图表，正在流式传输的块显示加载 UI" style="zoom:50%;" />

通过部分预渲染，初始 UI 可以立即发送到浏览器，同时动态部分进行渲染。这减少了 UI 的时间，并且可能会减少总请求时间，具体取决于预渲染的 UI 量。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511091642037.png" alt="显示流式传输期间路由段并行化的图表，显示各个块的数据获取、渲染和水合" style="zoom:50%;" />

为了减少网络开销，完整响应（包括静态 HTML 和流式动态部分）在**单个 HTTP 请求**中发送。这避免了额外的往返，并改善了初始加载和整体性能。

## 6.3 使用 `use cache`

虽然 `Suspense` 边界管理动态内容，但 [`use cache`](https://nextjscn.org/docs/app/api-reference/directives/use-cache) 指令可用于缓存不经常更改的数据或计算。

### 6.3.1 基本用法

添加 `use cache` 来缓存页面、组件或异步函数，并使用 [`cacheLife`](https://nextjscn.org/docs/app/api-reference/functions/cacheLife) 定义生命周期：

`app/page.tsx:`

```tsx
import { cacheLife } from 'next/cache'
 
export default async function Page() {
  'use cache'
  cacheLife('hours')
  // fetch 或计算
  return <div>...</div>
}
```

### 6.3.2 注意事项

使用 `use cache` 时，请记住这些限制：

1. 参数必须可序列化

与 Server Actions 一样，缓存函数的参数必须可序列化。这意味着你可以传递原始类型、普通对象和数组，但不能传递类实例、函数或其他复杂类型。

2. 接受不可序列化的值而不进行内省

只要不对其进行内省，你就可以接受不可序列化的值作为参数。但是，你可以返回它们。这允许缓存组件接受 Server 或 Client Components 作为 children 的模式：

`app/cached-wrapper.tsx:`

```tsx
import { ReactNode } from 'react'
 
export async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache'
  // 不要内省 children，只需传递它
  return (
    <div className="wrapper">
      <header>缓存的头部</header>
      {children}
    </div>
  )
}
```

3. 避免传递动态输入

除非你避免对其进行内省，否则不得将动态或运行时数据传递到 `use cache` 函数中。将来自 `cookies()`、`headers()` 或其他运行时 API 的值作为参数传递将导致错误，因为无法在预渲染时确定缓存键。

### 6.3.3 标记和重新验证

使用 [`cacheTag`](https://nextjscn.org/docs/app/api-reference/functions/cacheTag) 标记缓存数据，并在 Server Actions 中使用 [`updateTag`](https://nextjscn.org/docs/app/api-reference/functions/updateTag) 进行变更后立即更新，或者如果可以接受延迟更新，则使用 [`revalidateTag`](https://nextjscn.org/docs/app/api-reference/functions/revalidateTag)。

1. 使用 `updateTag`

当你需要在同一请求中使缓存数据过期并立即刷新时，使用 `updateTag`：

`app/actions.ts:`

```tsx
import { cacheTag, updateTag } from 'next/cache'
 
export async function getCart() {
  'use cache'
  cacheTag('cart')
  // 获取数据
}
 
export async function updateCart(itemId: string) {
  'use server'
  // 使用 itemId 写入数据
  // 更新用户购物车
  updateTag('cart')
}
```

2. 使用 `revalidateTag`

当你只想使具有 stale-while-revalidate 行为的正确标记的缓存条目失效时，使用 `revalidateTag`。这对于可以容忍最终一致性的静态内容来说是理想的。

`app/actions.ts:`

```tsx
import { cacheTag, revalidateTag } from 'next/cache'
 
export async function getPosts() {
  'use cache'
  cacheTag('posts')
  // 获取数据
}
 
export async function createPost(post: FormData) {
  'use server'
  // 使用 FormData 写入数据
  revalidateTag('posts', 'max')
}
```

## 6.4 启用 Cache Components

你可以通过在 Next 配置文件中添加 [`cacheComponents`](https://nextjscn.org/docs/app/api-reference/config/next-config-js/cacheComponents) 选项来启用 Cache Components（包括 PPR）：

`next.config.ts`

```ts
import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  cacheComponents: true,
}
 
export default nextConfig
```

### 6.4.1 对路由段配置的影响

启用 Cache Components 后，几个路由段配置选项不再需要或不再受支持。以下是变化内容以及如何迁移：

1. `dynamic = "force-dynamic"`

**不再需要。** 启用 Cache Components 后，所有页面默认都是动态的，因此此配置是不必要的。

```tsx
// 之前 - 不再需要
export const dynamic = 'force-dynamic'
 
export default function Page() {
  return <div>...</div>
}
```

```tsx
// 之后 - 只需删除它，页面默认是动态的
export default function Page() {
  return <div>...</div>
}
```

2. `dynamic = "force-static"`

**替换为 `use cache`。** 你必须为关联路由的每个 Layout 和 Page 添加 `use cache`。

注意：`force-static` 以前允许使用运行时 API，如 `cookies()`，但现在不再支持。如果你添加 `use cache` 并看到与运行时数据相关的错误，则必须删除运行时 API 的使用。

```tsx
// 之前
export const dynamic = 'force-static'
 
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```



```tsx
// 之后 - 改用 'use cache'
export default async function Page() {
  'use cache'
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

3. `revalidate`

**替换为 `cacheLife`。** 使用 `cacheLife` 函数来定义缓存持续时间，而不是路由段配置。

```tsx
// 之前
export const revalidate = 3600 // 1 小时
 
export default async function Page() {
  return <div>...</div>
}
```



```tsx
// 之后 - 使用 cacheLife
import { cacheLife } from 'next/cache'
 
export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

4. `fetchCache`

**不再需要。** 使用 `use cache` 时，缓存范围内的所有数据获取都会自动缓存，使 `fetchCache` 变得不必要。

```tsx
// 之前
export const fetchCache = 'force-cache'
```



```tsx
// 之后 - 使用 'use cache' 来控制缓存行为
export default async function Page() {
  'use cache'
  // 这里的所有 fetch 都会被缓存
  return <div>...</div>
}
```

5. `runtime = 'edge'`

**不受支持。** Cache Components 需要 Node.js 运行时，使用 `Edge Runtime` 时会抛出错误。

## 6.5 Cache Components 之前与之后

### 6.5.1 Cache Components 之前

- **默认静态**：Next.js 尝试为你预渲染和缓存尽可能多的内容，除非你选择退出
- **路由级控制**：像 `dynamic`、`revalidate`、`fetchCache` 这样的开关控制整个页面的缓存
- **`fetch` 的局限性**：单独使用 `fetch` 是不完整的，因为它不涵盖直接数据库客户端或其他服务器端 IO。嵌套的 `fetch` 切换到动态（例如，`{ cache: 'no-store' }`）可能会无意中改变整个路由行为

### 6.5.2 使用 Cache Components

- **默认动态**：所有内容默认都是动态的。你通过在有帮助的地方添加 [`use cache`](https://nextjscn.org/docs/app/api-reference/directives/use-cache) 来决定缓存哪些部分
- **精细控制**：文件/组件/函数级别的 [`use cache`](https://nextjscn.org/docs/app/api-reference/directives/use-cache) 和 [`cacheLife`](https://nextjscn.org/docs/app/api-reference/functions/cacheLife) 可以精确控制你需要的缓存位置
- **流式传输保持**：使用 `<Suspense>` 或 `loading.(js|tsx)` 文件来流式传输动态部分，同时外壳立即显示
- **超越 `fetch`**：使用 `use cache` 指令，缓存可以应用于所有服务器 IO（数据库调用、API、计算），而不仅仅是 `fetch`。嵌套的 `fetch` 调用不会静默翻转整个路由，因为行为由显式缓存边界和 `Suspense` 控制

## 6.6示例

### 6.6.1 动态 API

访问运行时 API（如 `cookies()`）时，Next.js 只会预渲染此组件上方的后备 UI。

在此示例中，我们没有定义后备内容，因此 Next.js 显示错误，指示我们提供一个。`<User />` 组件需要包裹在 `Suspense` 中，因为它使用 `cookies` API：

`app/user.tsx:`

```tsx
import { cookies } from 'next/headers'
 
export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
```

现在我们在 User 组件周围有了 `Suspense` 边界，我们可以使用 Skeleton UI 预渲染 Page，并在特定用户发出请求时流式传输 `<User />` UI

`app/page.tsx:`

```tsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'
 
export default function Page() {
  return (
    <section>
      <h1>这将被预渲染</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

### 6.6.2 传递动态 props

组件仅在访问值时才选择动态渲染。例如，如果你从 `<Page />` 组件读取 `searchParams`，则可以将此值作为 prop 转发到另一个组件：

`app/page.tsx:`

```tsx
import { Table, TableSkeleton } from './table'
import { Suspense } from 'react'
 
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  return (
    <section>
      <h1>这将被预渲染</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams.then((search) => search.sort)} />
      </Suspense>
    </section>
  )
}
```

在 table 组件内部，从 `searchParams` 访问值将使组件变为动态，而页面的其余部分将被预渲染。

`app/table.tsx:`

```tsx
export async function Table({ sortPromise }: { sortPromise: Promise<string> }) {
  const sort = (await sortPromise) === 'true'
  return '...'
}
```

## 6.7 常见问题

### 6.7.1 这会替代 Partial Prerendering (PPR) 吗？

不会。Cache Components **实现了** PPR 作为一个功能。旧的实验性 PPR 标志已被移除，但 PPR 将继续存在。

PPR 提供静态外壳和流式传输基础设施；`use cache` 让你在有益时将优化的动态输出包含在该外壳中。

### 6.7.2 我应该首先缓存什么？

你缓存的内容应该是你希望 UI 加载状态的函数。如果数据不依赖于运行时数据，并且你可以接受在一段时间内为多个请求提供缓存值，请使用 `use cache` 与 `cacheLife` 来描述该行为。

对于具有更新机制的内容管理系统，考虑使用具有更长缓存持续时间的标签，并依赖 `revalidateTag` 将静态初始 UI 标记为准备重新验证。此模式允许你提供快速的缓存响应，同时仍在内容实际更改时更新内容，而不是提前使缓存过期。

### 6.7.3 如何快速更新缓存内容？

使用 [`cacheTag`](https://nextjscn.org/docs/app/api-reference/functions/cacheTag) 标记你的缓存数据，然后触发 [`updateTag`](https://nextjscn.org/docs/app/api-reference/functions/updateTag) 或 [`revalidateTag`](https://nextjscn.org/docs/app/api-reference/functions/revalidateTag)。



# 7.获取数据

## 7.1 Server Components

你可以在 Server Components 中使用以下方式获取数据：

1. `fetch` API
2. ORM 或数据库

#### 7.1.1 使用 `fetch` API

要使用 `fetch` API 获取数据，将你的组件转换为异步函数，并 await `fetch` 调用。例如：

`app/blog/page.tsx:`

```tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

> **值得注意的是**：
>
> - 默认情况下，`fetch` 响应不会被缓存。然而，Next.js 会预渲染路由，输出将被缓存以提高性能。如果你想选择进入动态渲染，使用 `{ cache: 'no-store' }` 选项。参见 `fetch` API 参考。
> - 在开发过程中，你可以记录 `fetch` 调用以获得更好的可见性和调试。参见 [`logging` API 参考](https://nextjscn.org/docs/app/api-reference/config/next-config-js/logging)。

#### 7.1.2 使用 ORM 或数据库

由于 Server Components 在服务器上渲染，你可以安全地使用 ORM 或数据库客户端进行数据库查询。将你的组件转换为异步函数，并 await 调用：

`app/blog/page.tsx:`

```tsx
import { db, posts } from '@/lib/db'
 
export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 7.2 Client Components

有两种方式在 Client Components 中获取数据，使用：

1. React 的 `use` hook
2. 社区库，如 [SWR](https://swr.vercel.app/) 或 [React Query](https://tanstack.com/query/latest)

### 7.2.1 使用 `use` hook 流式传输数据

你可以使用 React 的 [`use` hook](https://react.dev/reference/react/use) 从服务器到客户端[流式传输](https://nextjscn.org/docs/app/getting-started/fetching-data#streaming)数据。首先在 Server 组件中获取数据，并将 promise 作为 prop 传递给 Client Component：

`app/blog/page.tsx:`

```tsx
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'
 
export default function Page() {
  // 不要 await 数据获取函数
  const posts = getPosts()
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

然后，在你的 Client Component 中，使用 `use` hook 读取 promise：

`app/ui/posts.tsx:`

```tsx
'use client'
import { use } from 'react'
 
export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)
 
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

在上面的示例中，`<Posts>` 组件被包裹在 `<Suspense>` 边界中。这意味着在 promise 解析时将显示后备内容。

### 7.2.2 社区库

你可以使用社区库，如 `SWR` 或 `React Query` 在 Client Components 中获取数据。这些库具有自己的缓存、流式传输和其他功能的语义。例如，使用 SWR：

`app/blog/page.tsx:`

```tsx
'use client'
import useSWR from 'swr'
 
const fetcher = (url) => fetch(url).then((r) => r.json())
 
export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )
 
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
 
  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 7.3 去重请求和缓存数据

去重 `fetch` 请求的一种方法是使用请求记忆化。通过这种机制，在单个渲染过程中使用相同 URL 和选项的 `GET` 或 `HEAD` 的 `fetch` 调用会被合并为一个请求。这是自动发生的，你可以通过向 `fetch` 传递 Abort 信号来选择退出。

请求记忆化的作用域限定在请求的生命周期内。

你也可以通过使用 Next.js 的 Data Cache去重 `fetch` 请求，例如在你的 `fetch` 选项中设置 `cache: 'force-cache'`。

Data Cache 允许在当前渲染过程和传入请求之间共享数据。

如果你*没有*使用 `fetch`，而是直接使用 ORM 或数据库，你可以使用 React `cache` 函数包装你的数据访问。

`app/lib/data.ts:`

```tsx
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'
 
export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

## 7.4 流式传输

> **警告**：以下内容假设你的应用程序中启用了 `cacheComponents` 配置选项。该标志在 Next.js 15 canary 中引入。

当你在 Server Components 中获取数据时，数据会在服务器上为每个请求获取和渲染。如果你有任何慢速数据请求，整个路由将被阻止渲染，直到所有数据都被获取。

为了改善初始加载时间和用户体验，你可以使用流式传输将页面的 HTML 分解为更小的块，并逐步将这些块从服务器发送到客户端。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511100039978.png" alt="How Server Rendering with Streaming Works" style="zoom:50%;" />

有两种方式可以在你的应用程序中实现流式传输：

1. 使用 [`loading.js` 文件](https://nextjscn.org/docs/app/getting-started/fetching-data#with-loadingjs)包裹页面
2. 使用 `<Suspense>` 包裹组件

### 7.4.1 使用 `loading.js`

你可以在与页面相同的文件夹中创建一个 `loading.js` 文件，以在获取数据时流式传输**整个页面**。例如，要流式传输 `app/blog/page.js`，请在 `app/blog` 文件夹内添加该文件。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511100040238.png" alt="Blog folder structure with loading.js file" style="zoom:50%;" />

`app/blog/loading.tsx:`

```tsx
export default function Loading() {
  // 在这里定义加载 UI
  return <div>Loading...</div>
}
```

在导航时，用户将立即看到布局和[加载状态](https://nextjscn.org/docs/app/getting-started/fetching-data#creating-meaningful-loading-states)，同时页面正在渲染。一旦渲染完成，新内容将自动替换。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511100041089.png" alt="Loading UI" style="zoom:50%;" />

在后台，`loading.js` 将嵌套在 `layout.js` 内部，并将自动将 `page.js` 文件和下面的任何子元素包裹在 `<Suspense>` 边界中。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511100041163.png" alt="loading.js overview" style="zoom:50%;" />

这种方法适用于路由段（布局和页面），但对于更细粒度的流式传输，你可以使用 `<Suspense>`。



### 7.4.2 使用 `<Suspense>` 

`<Suspense>` 允许你更精细地控制页面的哪些部分进行流式传输。例如，你可以立即显示 `<Suspense>` 边界之外的任何页面内容，并在边界内流式传输博客文章列表。

`app/blog/page.tsx:`

```tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'
 
export default function BlogPage() {
  return (
    <div>
      {/* 此内容将立即发送到客户端 */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* 任何包裹在 <Suspense> 边界中的内容都将被流式传输 */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

### 7.4.3 创建有意义的加载状态

即时加载状态是在导航后立即向用户显示的后备 UI。为了获得最佳用户体验，我们建议设计有意义的加载状态，帮助用户了解应用正在响应。例如，你可以使用骨架屏和加载动画，或者未来屏幕的一小部分但有意义的部分，如封面照片、标题等。

在开发过程中，你可以使用 [React Devtools](https://react.dev/learn/react-developer-tools) 预览和检查组件的加载状态。

## 7.5 示例 

### 7.5.1 顺序数据获取

当树中的嵌套组件各自获取自己的数据且请求未被[去重](https://nextjscn.org/docs/app/guides/caching#request-memoization)时，会发生顺序数据获取，导致响应时间更长。

![Sequential and Parallel Data Fetching](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511100050327.png)

在某些情况下，你可能希望使用这种模式，因为一个获取依赖于另一个的结果。

例如，`<Playlists>` 组件只有在 `<Artist>` 组件完成数据获取后才会开始获取数据，因为 `<Playlists>` 依赖于 `artistID` prop：

`app/artist/[username]/page.tsx:`

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  // 获取艺术家信息
  const artist = await getArtist(username)
 
  return (
    <>
      <h1>{artist.name}</h1>
      {/* 在 Playlists 组件加载时显示后备 UI */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* 将艺术家 ID 传递给 Playlists 组件 */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
 
async function Playlists({ artistID }: { artistID: string }) {
  // 使用艺术家 ID 获取播放列表
  const playlists = await getArtistPlaylists(artistID)
 
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

为了改善用户体验，你应该使用 React `<Suspense>` 在获取数据时显示 `fallback`。这将启用流式传输并防止整个路由被顺序数据请求阻止。

### 7.5.2 并行数据获取

当路由中的数据请求被急切地启动并同时开始时，会发生并行数据获取。

默认情况下，[布局和页面](https://nextjscn.org/docs/app/getting-started/layouts-and-pages)是并行渲染的。因此每个段都会尽快开始获取数据。

然而，在*任何*组件内，如果多个 `async`/`await` 请求放置在其他请求之后，仍然可能是顺序的。例如，`getAlbums` 将被阻止，直到 `getArtist` 解析：

`app/artist/[username]/page.tsx:`

```tsx
import { getArtist, getAlbums } from '@/app/lib/data'
 
export default async function Page({ params }) {
  // 这些请求将是顺序的
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
```

通过调用 `fetch` 启动多个请求，然后使用 [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) await 它们。请求在调用 `fetch` 时立即开始。

`app/artist/[username]/page.tsx:`

```tsx
import Albums from './albums'
 
async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}
 
async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}
 
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
 
  // 启动请求
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)
 
  const [artist, albums] = await Promise.all([artistData, albumsData])
 
  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

> **值得注意的是**：使用 `Promise.all` 时，如果一个请求失败，整个操作都会失败。要处理这种情况，你可以使用 [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 方法代替。

### 7.5.3 预加载数据

你可以通过创建一个在阻塞请求之前急切调用的实用函数来预加载数据。`<Item>` 根据 `checkIsAvailable()` 函数有条件地渲染。

你可以在 `checkIsAvailable()` 之前调用 `preload()` 以急切地启动 `<Item/>` 数据依赖项。在 `<Item/>` 渲染时，其数据已经被获取。

`app/item/[id]/page.tsx:`

```tsx
import { getItem, checkIsAvailable } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // 开始加载项目数据
  preload(id)
  // 执行另一个异步任务
  const isAvailable = await checkIsAvailable()
 
  return isAvailable ? <Item id={id} /> : null
}
 
export const preload = (id: string) => {
  // void 计算给定的表达式并返回 undefined
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

此外，你可以使用 React 的 [`cache` 函数](https://react.dev/reference/react/cache)和 [`server-only` 包](https://www.npmjs.com/package/server-only)创建可重用的实用函数。这种方法允许你缓存数据获取函数并确保它仅在服务器上执行。

`utils/get-item.ts:`

```tsx
import { cache } from 'react'
import 'server-only'
import { getItem } from '@/lib/data'
 
export const preload = (id: string) => {
  void getItem(id)
}
 
export const getItem = cache(async (id: string) => {
  // ...
})
```

# 8.更新数据

你可以使用 React 的 Server Functions 在 Next.js 中更新数据。

**Server Function** 是在服务器上运行的异步函数。它们可以通过网络请求从客户端调用，这就是为什么它们必须是异步的。

在 `action` 或变更上下文中，它们也被称为 **Server Actions**。

按照惯例，Server Action 是与 `startTransition` 一起使用的异步函数。当函数满足以下条件时，这会自动发生：

- 使用 `action` prop 传递给 `<form>`。
- 使用 `formAction` prop 传递给 `<button>`。

在 Next.js 中，Server Actions 与框架的缓存架构集成。当调用一个 action 时，Next.js 可以在单个服务器往返中返回更新的 UI 和新数据。

在幕后，actions 使用 `POST` 方法，并且只有这个 HTTP 方法可以调用它们。

## 8.1 创建 Server Functions

可以使用 `use server` 指令来定义 Server Function。你可以将指令放在**异步**函数的顶部以将函数标记为 Server Function，或放在单独文件的顶部以标记该文件的所有导出。

`app/lib/actions.ts:`

```tsx
export async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')
 
  // 更新数据
  // 重新验证缓存
}
 
export async function deletePost(formData: FormData) {
  'use server'
  const id = formData.get('id')
 
  // 更新数据
  // 重新验证缓存
}
```

### 8.1.1 Server Components

可以通过在函数体顶部添加 `"use server"` 指令，在 Server Components 中内联 Server Functions：

`app/page.tsx:`

```tsx
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }
 
  return <></>
}
```

> **值得注意的是**： Server Components 默认支持渐进增强，这意味着即使 JavaScript 尚未加载或被禁用，调用 Server Actions 的表单也会被提交。

### 8.1.2 Client Components

无法在 Client Components 中定义 Server Functions。但是，你可以通过从顶部带有 `"use server"` 指令的文件中导入它们，在 Client Components 中调用它们：

`app/actions.ts:`

```tsx
'use server'
 
export async function createPost() {}
```

`app/ui/button.tsx:`

```tsx
'use client'
 
import { createPost } from '@/app/actions'
 
export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

> **值得注意的是**： 在 Client Components 中，如果 JavaScript 尚未加载，调用 Server Actions 的表单将排队提交，并将优先进行水合。水合后，浏览器不会在表单提交时刷新。

### 8.1.3 将 actions 作为 props 传递

你还可以将 action 作为 prop 传递给 Client Component：

```tsx
<ClientComponent updateItemAction={updateItem} />
```

`app/client-component.tsx:`

```tsx
'use client'
 
export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

## 8.2 调用 Server Functions

有两种主要方式可以调用 Server Function：

1. Server 和 Client Components 中的表单
2. Client Components 中的事件处理程序和 useEffect

> **值得注意的是**： Server Functions 是为服务器端变更而设计的。客户端目前一次调度并等待一个。这是一个实现细节，可能会改变。如果你需要并行数据获取，请在 Server Components 中使用数据获取，或在单个 Server Function 或 Route Handler 内执行并行工作。

### 8.2.1 表单

React 扩展了 HTML `<form>` 元素，允许使用 HTML `action` prop 调用 Server Function。

当在表单中调用时，函数会自动接收 [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) 对象。你可以使用原生 `FormData` 方法提取数据：

`app/ui/form.tsx:`

```tsx
import { createPost } from '@/app/actions'
 
export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

`app/actions.ts:`

```tsx
'use server'
 
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  // 更新数据
  // 重新验证缓存
}
```

### 8.2.2 事件处理程序

你可以在 Client Component 中使用事件处理程序（如 `onClick`）来调用 Server Function。

`app/like-button.tsx:`

```tsx
'use client'
 
import { incrementLike } from './actions'
import { useState } from 'react'
 
export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
 
  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

## 8.3 示例

### 8.3.1 显示待处理状态

在执行 Server Function 时，你可以使用 React 的 [`useActionState`](https://react.dev/reference/react/useActionState) hook 显示加载指示器。该 hook 返回一个 `pending` 布尔值：

`app/ui/button.tsx:`

```tsx
'use client'
 
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'
 
export function Button() {
  const [state, action, pending] = useActionState(createPost, false)
 
  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

### 8.3.2 重新验证

在执行更新后，你可以通过在 Server Function 中调用 [`revalidatePath`](https://nextjscn.org/docs/app/api-reference/functions/revalidatePath) 或 [`revalidateTag`](https://nextjscn.org/docs/app/api-reference/functions/revalidateTag) 来重新验证 Next.js 缓存并显示更新的数据：

`app/lib/actions.ts:`

```tsx
import { revalidatePath } from 'next/cache'
 
export async function createPost(formData: FormData) {
  'use server'
  // 更新数据
  // ...
 
  revalidatePath('/posts')
}
```

### 8.3.3 重定向

你可能希望在执行更新后将用户重定向到不同的页面。你可以通过在 Server Function 中调用 [`redirect`](https://nextjscn.org/docs/app/api-reference/functions/redirect) 来实现。

`app/lib/actions.ts:`

```tsx
'use server'
 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // 更新数据
  // ...
 
  revalidatePath('/posts')
  redirect('/posts')
}
```

调用 `redirect` 会抛出一个框架处理的控制流异常。之后的任何代码都不会执行。如果你需要新鲜数据，请提前调用 [`revalidatePath`](https://nextjscn.org/docs/app/api-reference/functions/revalidatePath) 或 [`revalidateTag`](https://nextjscn.org/docs/app/api-reference/functions/revalidateTag)。

### 8.3.4 Cookies

你可以使用 [`cookies`](https://nextjscn.org/docs/app/api-reference/functions/cookies) API 在 Server Action 中 `get`、`set` 和 `delete` cookies。

当你在 Server Action 中设置或删除 cookie 时，Next.js 会在服务器上重新渲染当前页面及其布局，以便 **UI 反映新的 cookie 值**。

> **值得注意的是**： 服务器更新应用于当前 React 树，根据需要重新渲染、挂载或卸载组件。重新渲染的组件会保留客户端状态，如果依赖项发生变化，effects 会重新运行。

`app/actions.ts:`

```tsx
'use server'
 
import { cookies } from 'next/headers'
 
export async function exampleAction() {
  const cookieStore = await cookies()
 
  // 获取 cookie
  cookieStore.get('name')?.value
 
  // 设置 cookie
  cookieStore.set('name', 'Delba')
 
  // 删除 cookie
  cookieStore.delete('name')
}
```

### 8.3.5 useEffect

你可以使用 React [`useEffect`](https://react.dev/reference/react/useEffect) hook 在组件挂载或依赖项更改时调用 Server Action。这对于依赖全局事件或需要自动触发的变更非常有用。例如，应用快捷键的 `onKeyDown`、用于无限滚动的交叉观察器 hook，或者当组件挂载时更新查看次数：

`app/view-count.tsx:`

```tsx
'use client'
 
import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'
 
export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()
 
  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])
 
  // 你可以使用 `isPending` 向用户提供反馈
  return <p>Total Views: {views}</p>
}
```

# 9.缓存和重新验证

缓存是一种存储数据获取和其他计算结果的技术，这样对相同数据的未来请求可以更快地提供服务，而无需再次执行相同的工作。而重新验证允许你更新缓存条目，而无需重新构建整个应用程序。

## 9.1 `fetch`

默认情况下，[`fetch`](https://nextjscn.org/docs/app/api-reference/functions/fetch) 请求不会被缓存。你可以通过将 `cache` 选项设置为 `'force-cache'` 来缓存单个请求。

`app/page.tsx:`

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

> **值得注意的是**：虽然 `fetch` 请求默认不会被缓存，但 Next.js 会[预渲染](https://nextjscn.org/docs/app/guides/caching#static-rendering)包含 `fetch` 请求的路由并缓存 HTML。如果你想确保路由是[动态的](https://nextjscn.org/docs/app/guides/caching#dynamic-rendering)，请使用 [`connection` API](https://nextjscn.org/docs/app/api-reference/functions/connection)。

要重新验证 `fetch` 请求返回的数据，你可以使用 `next.revalidate` 选项。

```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

这将在指定的秒数后重新验证数据。

## 9.2 `unstable_cache`

`unstable_cache` 允许你缓存数据库查询和其他异步函数的结果。要使用它，请用 `unstable_cache` 包装函数。例如：

```tsx
// app/lib/data.ts
import { db } from '@/lib/db'
export async function getUserById(id: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0])
}
```

```tsx
// app/page.tsx
import { unstable_cache } from 'next/cache'
import { getUserById } from '@/app/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
 
  const getCachedUser = unstable_cache(
    async () => {
      return getUserById(userId)
    },
    [userId] // 将用户 ID 添加到缓存键中
  )
}
```

该函数接受第三个可选对象来定义缓存应如何重新验证。它接受：

- `tags`：Next.js 用于重新验证缓存的标签数组。
- `revalidate`：缓存应重新验证的秒数。

```tsx
const getCachedUser = unstable_cache(
  async () => {
    return getUserById(userId)
  },
  [userId],
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

## 9.3 `revalidateTag`

`revalidateTag` 用于根据标签和事件重新验证缓存条目。该函数现在支持两种行为：

- **使用 `profile="max"`**：使用 stale-while-revalidate 语义，在后台获取新内容的同时提供过期内容
- **不使用第二个参数**：立即使缓存过期的旧行为（已弃用）

要与 `fetch` 一起使用，首先使用 `next.tags` 选项标记函数：

```tsx
// app/lib/data.ts
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: {
      tags: ['user'],
    },
  })
}
```

或者，你可以使用 `tags` 选项标记 `unstable_cache` 函数：

```tsx
// app/lib/data.ts
export const getUserById = unstable_cache(
  async (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  },
  ['user'], // 如果变量未作为参数传递，则需要
  {
    tags: ['user'],
  }
)
```

然后，在 [Route Handler](https://nextjscn.org/docs/app/api-reference/file-conventions/route) 或 Server Action 中调用 `revalidateTag`：

```tsx
// app/lib/actions.ts
import { revalidateTag } from 'next/cache'
 
export async function updateUser(id: string) {
  // 修改数据
  revalidateTag('user', 'max') // 推荐：使用 stale-while-revalidate
}
```

你可以在多个函数中重用相同的标签，以便一次性重新验证它们

## 9.4 `revalidatePath`

`revalidatePath` 用于在事件发生后重新验证路由。要使用它，在 [Route Handler](https://nextjscn.org/docs/app/api-reference/file-conventions/route) 或 Server Action 中调用它：

```tsx
//app/lib/actions.ts
import { revalidatePath } from 'next/cache'
 
export async function updateUser(id: string) {
  // 修改数据
  revalidatePath('/profile')
```

## 9.5 `updateTag`

`updateTag` 专为 Server Actions 设计，用于在读取自己写入的场景中立即使缓存数据过期。与 `revalidateTag` 不同，它只能在 Server Actions 中使用，并且会立即使缓存条目过期。

```tsx
// app/lib/actions.ts
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // 在数据库中创建文章
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })
 
  // 立即使缓存过期，以便新文章可见
  updateTag('posts')
  updateTag(`post-${post.id}`)
 
  redirect(`/posts/${post.id}`)
}
```

`revalidateTag` 和 `updateTag` 之间的主要区别：

- **`updateTag`**：仅在 Server Actions 中使用，立即使缓存过期，用于读取自己写入的场景
- **`revalidateTag`**：在 Server Actions 和 Route Handlers 中使用，支持使用 `profile="max"` 的 stale-while-revalidate

# 10.错误处理

错误可以分为两类：[预期错误](https://nextjscn.org/docs/app/getting-started/error-handling#handling-expected-errors)和[未捕获的异常](https://nextjscn.org/docs/app/getting-started/error-handling#handling-uncaught-exceptions)。

## 10.1 处理预期错误

预期错误是指在应用程序正常运行过程中可能发生的错误，例如来自服务端表单验证或失败的请求。这些错误应该被明确处理并返回给客户端。

### 10.1.1 Server Functions

你可以使用 [`useActionState`](https://react.dev/reference/react/useActionState) hook 来处理 Server Functions 中的预期错误。

对于这些错误，避免使用 `try`/`catch` 块和抛出错误。相反，将预期错误建模为返回值。

```tsx
// app/actions.ts
'use server'
 
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()
 
  if (!res.ok) {
    return { message: '创建文章失败' }
  }
}
```

你可以将你的 action 传递给 `useActionState` hook，并使用返回的 `state` 来显示错误消息。

```tsx
// app/ui/form.tsx
'use client'
 
import { useActionState } from 'react'
import { createPost } from '@/app/actions'
 
const initialState = {
  message: '',
}
 
export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)
 
  return (
    <form action={formAction}>
      <label htmlFor="title">标题</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">内容</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>创建文章</button>
    </form>
  )
}
```

### 10.1.2 Server Components

在 Server Component 内部获取数据时，你可以使用响应来有条件地渲染错误消息或 [`redirect`](https://nextjscn.org/docs/app/api-reference/functions/redirect)。

```tsx
// app/page.tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
 
  if (!res.ok) {
    return '发生了一个错误。'
  }
 
  return '...'
}
```

### 10.1.3 Not found

你可以在路由段内调用 [`notFound`](https://nextjscn.org/docs/app/api-reference/functions/not-found) 函数，并使用 [`not-found.js`](https://nextjscn.org/docs/app/api-reference/file-conventions/not-found) 文件来显示 404 UI。

```tsx
// app/blog/[slug]/page.tsx
import { getPostBySlug } from '@/lib/posts'
 
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
 
  if (!post) {
    notFound()
  }
 
  return <div>{post.title}</div>
}
```

```tsx
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return <div>404 - 页面未找到</div>
}
```

## 10.2 处理未捕获的异常

未捕获的异常是指示 bug 或问题的意外错误，这些错误不应在应用程序的正常流程中发生。这些应该通过抛出错误来处理，然后由错误边界捕获。

### 10.2.1 嵌套错误边界

Next.js 使用错误边界来处理未捕获的异常。错误边界捕获其子组件中的错误，并显示回退 UI，而不是崩溃的组件树。

通过在路由段内添加 [`error.js`](https://nextjscn.org/docs/app/api-reference/file-conventions/error) 文件并导出一个 React 组件来创建错误边界：

```tsx
// app/dashboard/error.tsx
'use client' // 错误边界必须是客户端组件
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 将错误记录到错误报告服务
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>出错了！</h2>
      <button
        onClick={
          // 尝试通过重新渲染段来恢复
          () => reset()
        }
      >
        重试
      </button>
    </div>
  )
}
```

错误将冒泡到最近的父错误边界。这允许通过在路由层次结构的不同级别放置 `error.tsx` 文件来实现精细的错误处理。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511110034580.png" alt="嵌套错误组件层次结构" style="zoom:50%;" />

错误边界不会捕获事件处理程序内部的错误。它们旨在捕获[渲染期间](https://react.dev/reference/react/Component#static-getderivedstatefromerror)的错误，以显示**回退 UI**，而不是使整个应用程序崩溃。

一般来说，事件处理程序或异步代码中的错误不会被错误边界处理，因为它们在渲染之后运行。

要处理这些情况，手动捕获错误并使用 `useState` 或 `useReducer` 存储它，然后更新 UI 以通知用户。

```tsx
'use client'
 
import { useState } from 'react'
 
export function Button() {
  const [error, setError] = useState(null)
 
  const handleClick = () => {
    try {
      // 做一些可能失败的工作
      throw new Error('异常')
    } catch (reason) {
      setError(reason)
    }
  }
 
  if (error) {
    /* 渲染回退 UI */
  }
 
  return (
    <button type="button" onClick={handleClick}>
      点击我
    </button>
  )
}
```

> 注意，来自 `useTransition` 的 `startTransition` 内部的未处理错误将冒泡到最近的错误边界。

```tsx
'use client'
 
import { useTransition } from 'react'
 
export function Button() {
  const [pending, startTransition] = useTransition()
 
  const handleClick = () =>
    startTransition(() => {
      throw new Error('异常')
    })
 
  return (
    <button type="button" onClick={handleClick}>
      点击我
    </button>
  )
}
```

### 10.2.2 全局错误

虽然不太常见，但你可以使用位于根应用程序目录中的 [`global-error.js`](https://nextjscn.org/docs/app/api-reference/file-conventions/error#global-error) 文件来处理根布局中的错误，即使在利用国际化时也是如此。全局错误 UI 必须定义自己的 `<html>` 和 `<body>` 标签，因为它在激活时会替换根布局或模板。

```tsx
// app/global-error.tsx
'use client' // 错误边界必须是客户端组件
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error 必须包含 html 和 body 标签
    <html>
      <body>
        <h2>出错了！</h2>
        <button onClick={() => reset()}>重试</button>
      </body>
    </html>
  )
}
```

# 11. css

## 11.1 Tailwind CSS

`Tailwind CSS` 是一个实用优先的 CSS 框架，提供了低级别的实用类来构建自定义设计。

安装 Tailwind CSS：

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

将 PostCSS 插件添加到你的 `postcss.config.mjs` 文件中：

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

在全局 CSS 文件中导入 Tailwind：

```css
/* app/globals.css*/
@import 'tailwindcss';
```

在根布局中导入 CSS 文件：

```tsx
// app/layout.tsx
import './globals.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

现在你可以开始在应用中使用 Tailwind 的实用类了：

```tsx
// app/page.tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

> **值得注意的是**： 如果你需要对非常旧的浏览器提供更广泛的支持，请参阅 [Tailwind CSS v3 设置说明](https://nextjscn.org/docs/app/guides/tailwind-v3-css)。

## 11.2 CSS Modules

CSS Modules 通过生成唯一的类名来局部作用域化 CSS。这使你可以在不同文件中使用相同的类名而不用担心命名冲突。

要开始使用 CSS Modules，创建一个扩展名为 `.module.css` 的新文件，并将其导入到 `app` 目录内的任何组件中：

```css
/*app/blog/blog.module.css*/
.blog {
  padding: 24px;
}
```

```tsx
// app/blog/page.tsx
import styles from './blog.module.css'
 
export default function Page() {
  return <main className={styles.blog}></main>
}
```

## 11.3 Global CSS

你可以使用全局 CSS 在整个应用中应用样式。

创建一个 `app/global.css` 文件并在根布局中导入它，以将样式应用到应用中的**每个路由**：

```css
/*app/global.css*/
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// app/layout.tsx
// 这些样式应用于应用中的每个路由
import './global.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

> **值得注意的是**： 全局样式可以导入到 `app` 目录内的任何布局、页面或组件中。然而，由于 Next.js 使用 React 内置的样式表支持来与 Suspense 集成，目前在路由之间导航时不会移除样式表，这可能导致冲突。我们建议对_真正_全局的 CSS（如 Tailwind 的基础样式）使用全局样式，对组件样式使用 [Tailwind CSS](https://nextjscn.org/docs/app/getting-started/css#tailwind-css)，并在需要时对自定义作用域 CSS 使用 [CSS Modules](https://nextjscn.org/docs/app/getting-started/css#css-modules)。

## 11.4 External stylesheets

外部包发布的样式表可以在 `app` 目录的任何地方导入，包括并置的组件：

```tsx
// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **值得注意的是**： 在 React 19 中，也可以使用 `<link rel="stylesheet" href="..." />`。

## 11.5 Ordering and Merging

Next.js 在生产构建期间通过自动分块（合并）样式表来优化 CSS。**CSS 的顺序**取决于**你在代码中导入样式的顺序**。

例如，`base-button.module.css` 将排在 `page.module.css` 之前，因为 `<BaseButton>` 在 `page.module.css` 之前导入：

```tsx
// page.tsx
import { BaseButton } from './base-button'
import styles from './page.module.css'
 
export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```tsx
// base-button.tsx
import styles from './base-button.module.css'
 
export function BaseButton() {
  return <button className={styles.primary} />
}
```

为了保持 CSS 顺序的可预测性：

- 尝试将 CSS 导入限制在单个 JavaScript 或 TypeScript 入口文件中
- 在应用的根部导入全局样式和 Tailwind 样式表。
- **使用 Tailwind CSS** 满足大多数样式需求，因为它通过实用类涵盖了常见的设计模式。
- 当 Tailwind 实用类不足时，使用 CSS Modules 处理组件特定的样式。
- 为你的 CSS 模块使用一致的命名约定。例如，使用 `<name>.module.css` 而不是 `<name>.tsx`。
- 将共享样式提取到共享组件中以避免重复导入。
- 关闭自动排序导入的 linter 或格式化工具，如 ESLint 的 [`sort-imports`](https://eslint.org/docs/latest/rules/sort-imports)。
- 你可以在 `next.config.js` 中使用 [`cssChunking`](https://nextjscn.org/docs/app/api-reference/config/next-config-js/cssChunking) 选项来控制 CSS 的分块方式。

## 11.6 Development vs Production

- 在开发模式（`next dev`）中，CSS 更新通过 [Fast Refresh](https://nextjscn.org/docs/architecture/fast-refresh) 即时应用。
- 在生产模式（`next build`）中，所有 CSS 文件会自动连接成**多个经过压缩和代码分割的** `.css` 文件，确保为路由加载最少量的 CSS。
- 在生产环境中，即使禁用 JavaScript，CSS 仍会加载，但在开发环境中需要 JavaScript 才能实现 Fast Refresh。
- CSS 顺序在开发环境中的表现可能有所不同，始终确保检查构建（`next build`）以验证最终的 CSS 顺序。

# 12. 图像优化

Next.js 的 `<Image>` 组件扩展了 HTML `<img>` 元素，提供了以下功能：

- **尺寸优化：** 使用 WebP 等现代图片格式，自动为每个设备提供正确尺寸的图片。
- **视觉稳定性：** 在图片加载时自动防止[布局偏移](https://web.dev/articles/cls)。
- **更快的页面加载：** 使用原生浏览器懒加载，仅在图片进入视口时加载，并可选模糊占位符。
- **资源灵活性：** 按需调整图片大小，甚至可以调整存储在远程服务器上的图片。

要开始使用 `<Image>`，从 `next/image` 导入它并在你的组件中渲染。

```tsx
// app/page.tsx
import Image from 'next/image'
 
export default function Page() {
  return <Image src="" alt="" />
}
```

> `src` 属性可以是[本地](https://nextjscn.org/docs/app/getting-started/images#local-images)或[远程](https://nextjscn.org/docs/app/getting-started/images#remote-images)图片。

## 12.1 本地图片

你可以在根目录下名为 [`public`](https://nextjscn.org/docs/app/api-reference/file-conventions/public-folder) 的文件夹中存储静态文件，如图片和字体。`public` 内的文件可以从基础 URL（`/`）开始被你的代码引用。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511120009041.png" alt="显示 app 和 public 文件夹的文件夹结构" style="zoom:50%;" />

```tsx
// app/page.tsx
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```

如果图片是静态导入的，Next.js 将自动确定固有的 [`width`](https://nextjscn.org/docs/app/api-reference/components/image#width-and-height) 和 [`height`](https://nextjscn.org/docs/app/api-reference/components/image#width-and-height)。这些值用于确定图片比例，并在图片加载时防止[累积布局偏移](https://web.dev/articles/cls)。

```tsx
// app/page.tsx
import Image from 'next/image'
import ProfileImage from './profile.png'
 
export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="作者的照片"
      // width={500} 自动提供
      // height={500} 自动提供
      // blurDataURL="data:..." 自动提供
      // placeholder="blur" // 可选的加载时模糊效果
    />
  )
}
```

## 12.2 远程图片

要使用远程图片，你可以为 `src` 属性提供一个 URL 字符串。

```tsx
// app/page.tsx
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```

由于 Next.js 在构建过程中无法访问远程文件，你需要手动提供 [`width`](https://nextjscn.org/docs/app/api-reference/components/image#width-and-height)、[`height`](https://nextjscn.org/docs/app/api-reference/components/image#width-and-height) 和可选的 [`blurDataURL`](https://nextjscn.org/docs/app/api-reference/components/image#blurdataurl) 属性。`width` 和 `height` 用于推断图片的正确宽高比，并避免图片加载时的布局偏移。或者，你可以使用 [`fill` 属性](https://nextjscn.org/docs/app/api-reference/components/image#fill)使图片填充父元素的大小。

为了安全地允许来自远程服务器的图片，你需要在 [`next.config.js`](https://nextjscn.org/docs/app/api-reference/config/next-config-js) 中定义支持的 URL 模式列表。尽可能具体以防止恶意使用。例如，以下配置将仅允许来自特定 AWS S3 存储桶的图片：

```ts
// next.config.ts
import type { NextConfig } from 'next'
 
const config: NextConfig = {``
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
 
export default config
```

# 13.字体优化

[`next/font`](https://nextjscn.org/docs/app/api-reference/components/font) 模块会自动优化你的字体，并移除外部网络请求以提升隐私保护和性能。

它为任何字体文件提供**内置的自托管**功能。这意味着你可以无布局偏移地最优加载 Web 字体。

要开始使用 `next/font`，从 [`next/font/local`](https://nextjscn.org/docs/app/getting-started/fonts#local-fonts) 或 [`next/font/google`](https://nextjscn.org/docs/app/getting-started/fonts#google-fonts) 导入它，使用适当的选项作为函数调用，并将 `className` 设置到你想要应用字体的元素上。例如：

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google'
 
const geist = Geist({
  subsets: ['latin'],
})
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

字体的作用域限定在使用它们的组件内。要将字体应用到整个应用程序，请将其添加到 `Root Layout`。

## 13.1 Google 字体

你可以自动自托管任何 Google 字体。字体会作为静态资源存储，并从与你的部署相同的域名提供服务，这意味着当用户访问你的网站时，浏览器不会向 Google 发送任何请求。

要开始使用 Google 字体，从 `next/font/google` 导入你选择的字体：

```tsx
// app/layout.tsx
import { Geist } from 'next/font/google'
 
const geist = Geist({
  subsets: ['latin'],
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

我们建议使用[可变字体](https://fonts.google.com/variablefonts)以获得最佳性能和灵活性。但如果你无法使用可变字体，则需要指定字重：

```tsx
// app/layout.tsx
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

## 13.2 本地字体

要使用本地字体，从 `next/font/local` 导入你的字体，并指定本地字体文件的 [`src`](https://nextjscn.org/docs/app/api-reference/components/font#src)。字体可以存储在 [`public`](https://nextjscn.org/docs/app/api-reference/file-conventions/public-folder) 文件夹中，或与 `app` 文件夹放在一起。例如：

```tsx
// app/layout.tsx
import localFont from 'next/font/local'
 
const myFont = localFont({
  src: './my-font.woff2',
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

如果你想为单个字体系列使用多个文件，`src` 可以是一个数组：

```tsx
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

# 14.元数据和 OG 图像

Metadata API 可用于定义你的应用程序元数据，以改善 SEO 和网页可分享性，包括：

1. 静态 `metadata` 对象
2. 动态 `generateMetadata` 函数
3. 特殊的文件约定，可用于添加静态或动态生成的 favicons 和 OG 图像。

通过上述所有选项，Next.js 将自动为你的页面生成相关的 `<head>` 标签，可以在浏览器的开发者工具中检查。

`metadata` 对象和 `generateMetadata` 函数导出仅在服务器组件中支持。

## 14.1 默认字段

有两个默认的 `meta` 标签始终会被添加，即使路由没有定义元数据：

- meta charset 标签设置网站的字符编码。
- meta viewport 标签设置网站的视口宽度和缩放比例，以适应不同的设备。

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

其他元数据字段可以使用 `Metadata` 对象（用于静态元数据）或 `generateMetadata` 函数（用于生成的元数据）来定义。

## 14.2 静态元数据

要定义静态元数据，从静态的 [`layout.js`](https://nextjscn.org/docs/app/api-reference/file-conventions/layout) 或 [`page.js`](https://nextjscn.org/docs/app/api-reference/file-conventions/page) 文件中导出一个 [`Metadata` 对象](https://nextjscn.org/docs/app/api-reference/functions/generate-metadata#metadata-object)。例如，为博客路由添加标题和描述：

```tsx
// app/blog/layout.tsx
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}
 
export default function Layout() {}
```

你可以在 `generateMetadata` 文档中查看完整的可用选项列表。

## 14.3 生成的元数据

你可以使用 [`generateMetadata`](https://nextjscn.org/docs/app/api-reference/functions/generate-metadata) 函数来 `fetch` 依赖于数据的元数据。例如，为特定博客文章获取标题和描述：

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // 获取文章信息
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )
 
  return {
    title: post.title,
    description: post.description,
  }
}
 
export default function Page({ params, searchParams }: Props) {}
```

### 14.3.1 流式传输元数据

对于动态渲染的页面，Next.js 会单独流式传输元数据，一旦 `generateMetadata` 解析完成就将其注入到 HTML 中，而不会阻塞 UI 渲染。

流式传输元数据通过允许视觉内容首先流式传输来提高感知性能。

对于期望元数据在 `<head>` 标签中的机器人和爬虫（例如 `Twitterbot`、`Slackbot`、`Bingbot`），流式传输元数据是**禁用的**。这些通过使用传入请求的 User Agent 头来检测。

你可以在 Next.js 配置文件中使用 [`htmlLimitedBots`](https://nextjscn.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots#disabling) 选项自定义或**完全禁用**流式传输元数据。

静态渲染的页面不使用流式传输，因为元数据在构建时就已解析。

### 14.3.2 记忆化数据请求

在某些情况下，你可能需要为元数据和页面本身获取**相同**的数据。为了避免重复请求，你可以使用 React 的 [`cache` 函数](https://react.dev/reference/react/cache)来记忆化返回值，只获取一次数据。例如，为元数据和页面获取博客文章信息：

```tsx
// app/lib/data.ts
import { cache } from 'react'
import { db } from '@/app/lib/db'
 
// getPost 将被使用两次，但只执行一次
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```



```tsx
// app/blog/[slug]/page.tsx
import { getPost } from '@/app/lib/data'
 
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.description,
  }
}
 
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <div>{post.title}</div>
}
```

## 14.4 基于文件的元数据

以下特殊文件可用于元数据：

- favicon.ico、apple-icon.jpg 和 icon.jpg
- opengraph-image.jpg 和 twitter-image.jpg
- robots.txt
- sitemap.xml

你可以将这些用于静态元数据，或者可以使用代码以编程方式生成这些文件。

## 14.5 Favicons

Favicons 是在书签和搜索结果中代表你网站的小图标。要向你的应用程序添加 favicon，创建一个 `favicon.ico` 并将其添加到 app 文件夹的根目录。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511130006062.png" alt="Favicon Special File inside the App Folder with sibling layout and page files" style="zoom:50%;" />

## 14.6 静态 Open Graph 图像

Open Graph (OG) 图像是在社交媒体上代表你网站的图像。要向你的应用程序添加静态 OG 图像，在 app 文件夹的根目录创建一个 `opengraph-image.png` 文件。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511130007174.png" alt="OG image special file inside the App folder with sibling layout and page files" style="zoom:50%;" />

你还可以通过在文件夹结构中更深的位置创建 `opengraph-image.png` 来为特定路由添加 OG 图像。例如，要创建特定于 `/blog` 路由的 OG 图像，在 `blog` 文件夹内添加一个 `opengraph-image.jpg` 文件。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511130008667.png" alt="OG image special file inside the blog folder" style="zoom:50%;" />

更具体的图像将优先于文件夹结构中其上方的任何 OG 图像。

> 也支持其他图像格式，如 `jpeg`、`png` 和 `gif`。

## 14.7 生成的 Open Graph 图像

[`ImageResponse` 构造函数](https://nextjscn.org/docs/app/api-reference/functions/image-response)允许你使用 JSX 和 CSS 生成动态图像。这对于依赖于数据的 OG 图像很有用。

例如，要为每篇博客文章生成唯一的 OG 图像，在 `blog` 文件夹内添加一个 `opengraph-image.tsx` 文件，并从 `next/og` 导入 `ImageResponse` 构造函数：

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'
 
// 图像元数据
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// 图像生成
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
 
  return new ImageResponse(
    (
      // ImageResponse JSX 元素
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

`ImageResponse` 支持常见的 CSS 属性，包括 flexbox 和绝对定位、自定义字体、文本换行、居中和嵌套图像。

> **值得注意的是**：
>
> - 示例可在 [Vercel OG Playground](https://og-playground.vercel.app/) 中找到。
> - `ImageResponse` 使用 [`@vercel/og`](https://vercel.com/docs/og-image-generation)、[`satori`](https://github.com/vercel/satori) 和 `resvg` 将 HTML 和 CSS 转换为 PNG。
> - 仅支持 flexbox 和 CSS 属性的子集。高级布局（例如 `display: grid`）将不起作用。

# 15.路由处理程序

Route Handlers 允许你使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 为给定路由创建自定义请求处理器。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511130011487.png" alt="Route.js Special File" style="zoom:50%;" />

> **值得注意的是**：Route Handlers 仅在 `app` 目录内可用。它们相当于 `pages` 目录内的 [API Routes](https://nextjscn.org/docs/pages/building-your-application/routing/api-routes)，这意味着你**不**需要同时使用 API Routes 和 Route Handlers。

## 15.1 约定

Route Handlers 在 `app` 目录内的 [`route.js|ts` 文件](https://nextjscn.org/docs/app/api-reference/file-conventions/route)中定义：

```ts
// app/api/route.ts
export async function GET(request: Request) {}
```

Route Handlers 可以嵌套在 `app` 目录内的任何位置，类似于 `page.js` 和 `layout.js`。但**不能**在与 `page.js` 相同的路由段级别上存在 `route.js` 文件。

## 15.2 支持的 HTTP 方法

支持以下 [HTTP 方法](https://developer.mozilla.org/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。如果调用了不支持的方法，Next.js 将返回 `405 Method Not Allowed` 响应。

## 15.3 扩展的 `NextRequest` 和 `NextResponse` API

除了支持原生的 [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 外，Next.js 还通过 [`NextRequest`](https://nextjscn.org/docs/app/api-reference/functions/next-request) 和 [`NextResponse`](https://nextjscn.org/docs/app/api-reference/functions/next-response) 对它们进行了扩展，为高级用例提供便捷的辅助函数。

## 15.4 缓存

Route Handlers 默认不会被缓存。但是，你可以选择对 `GET` 方法进行缓存。其他支持的 HTTP 方法**不会**被缓存。要缓存 `GET` 方法，请在你的 Route Handler 文件中使用[路由配置选项](https://nextjscn.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)，例如 `export const dynamic = 'force-static'`。

```ts
// app/items/route.ts
export const dynamic = 'force-static'
 
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
```

> **值得注意的是**：其他支持的 HTTP 方法**不会**被缓存，即使它们与被缓存的 `GET` 方法放在同一个文件中。

## 15.5 特殊的 Route Handlers

特殊的 Route Handlers，如 [`sitemap.ts`](https://nextjscn.org/docs/app/api-reference/file-conventions/metadata/sitemap)、[`opengraph-image.tsx`](https://nextjscn.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) 和 [`icon.tsx`](https://nextjscn.org/docs/app/api-reference/file-conventions/metadata/app-icons)，以及其他[元数据文件](https://nextjscn.org/docs/app/api-reference/file-conventions/metadata)，除非它们使用 Dynamic API 或动态配置选项，否则默认保持静态。

## 15.6 路由解析

你可以将 `route` 视为最底层的路由原语。

- 它们**不**参与布局或客户端导航，如 `page`。
- 在与 `page.js` 相同的路由上**不能**有 `route.js` 文件。

| Page                 | Route              | Result |
| -------------------- | ------------------ | ------ |
| `app/page.js`        | `app/route.js`     | 冲突   |
| `app/page.js`        | `app/api/route.js` | 有效   |
| `app/[user]/page.js` | `app/api/route.js` | 有效   |

每个 `route.js` 或 `page.js` 文件接管该路由的所有 HTTP 动词。

```ts
//app/page.ts
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
 
// 冲突
// `app/route.ts`
export async function POST(request: Request) {}
```

## 15.7 Route Context Helper

在 TypeScript 中，你可以使用全局可用的 [`RouteContext`](https://nextjscn.org/docs/app/api-reference/file-conventions/route#route-context-helper) 辅助函数为 Route Handlers 的 `context` 参数添加类型：

```ts
// app/users/[id]/route.ts
import type { NextRequest } from 'next/server'
 
export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> **值得注意的是**
>
> - 类型在 `next dev`、`next build` 或 `next typegen` 期间生成。
