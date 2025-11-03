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

> 值得注意的是：应用路由内置了 React Canary 版本，其中包含了 React 19 的所有稳定版本变更，以及框架中正在验证的新功能。页面路由则使用您在 package.json 中安装的 React 版本。

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

Turbopack 现在是默认的打包工具。要使用 Webpack，请运行 `next dev --webpack` 或 `next build --webpack`。有关配置详情，请参阅 Turbopack 文档。

### 1.2.1 创建 app 目录

Next.js 使用文件系统路由，这意味着应用程序中的路由取决于文件的结构方式。

创建一个名为 app 的文件夹。然后在 app 文件夹内创建一个名为 layout.tsx 的文件。该文件是根布局文件，是必需的，并且必须包含 <html> 和 <body> 标签。

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

然后，您可以使用根路径 (/) 引用这些资源。例如，public/profile.png 可以引用为 /profile.png：

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

Next.js 内置了 TypeScript 支持。要将 TypeScript 添加到您的项目中，请将文件重命名为 .ts 或 .tsx，然后运行 `next dev` 命令。Next.js 将自动安装必要的依赖项，并添加一个包含推荐配置选项的 tsconfig.json 文件。

## 1.5 设置绝对导入和模块路径别名

Next.js 内置了对 tsconfig.json 和 jsconfig.json 文件中的“paths”和“baseUrl”选项的支持。

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

3.布局和页面

4.链接和导航

服务器和客户端组件

缓存组件

获取数据

更新数据

缓存和重新验证

错误处理

css

图像优化

字体优化

元数据和 OG 图像

路由处理程序

