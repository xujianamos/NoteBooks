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

### 2.1.1顶级文件夹

顶级文件夹用于组织应用程序的代码和静态资源。

![Route segments to path segments](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202511030041673.png)

|                                                              |                        |
| ------------------------------------------------------------ | ---------------------- |
| [`app`](https://nextjs.org/docs/app)                         | 应用路由器             |
| [`pages`](https://nextjs.org/docs/pages/building-your-application/routing) | 页面路由器             |
| [`public`](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) | 待提供的静态资源       |
| [`src`](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) | 可选的应用程序源文件夹 |

### 2.1.2 顶级文件

顶级文件用于配置应用程序、管理依赖项、运行代理、集成监控工具和定义环境变量。

|                                                              |                                |
| ------------------------------------------------------------ | ------------------------------ |
| **Next.js**                                                  |                                |
| [`next.config.js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) | Next.js 的配置文件             |
| [`package.json`](https://nextjs.org/docs/app/getting-started/installation#manual-installation) | 项目依赖项和脚本               |
| [`instrumentation.ts`](https://nextjs.org/docs/app/guides/instrumentation) | OpenTelemetry 和仪器文件       |
| [`proxy.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) | Next.js 请求代理               |
| [`.env`](https://nextjs.org/docs/app/guides/environment-variables) | 环境变量                       |
| [`.env.local`](https://nextjs.org/docs/app/guides/environment-variables) | 本地环境变量                   |
| [`.env.production`](https://nextjs.org/docs/app/guides/environment-variables) | 生产环境变量                   |
| [`.env.development`](https://nextjs.org/docs/app/guides/environment-variables) | 开发环境变量                   |
| [`eslint.config.mjs`](https://nextjs.org/docs/app/api-reference/config/eslint) | ESLint 的配置文件              |
| `.gitignore`                                                 | 要忽略的 Git 文件和文件夹      |
| `next-env.d.ts`                                              | Next.js 的 TypeScript 声明文件 |
| `tsconfig.json`                                              | TypeScript 的配置文件          |
| `jsconfig.json`                                              | JavaScript 配置文件            |

### 2.1.3 路由文件

添加页面以公开路由、共享 UI 的布局（例如页眉、导航或页脚）、骨架的加载、错误边界的错误以及 API 的路由。

|                                                              |                     |                  |
| ------------------------------------------------------------ | ------------------- | ---------------- |
| [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) | `.js` `.jsx` `.tsx` | 布局             |
| [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page) | `.js` `.jsx` `.tsx` | 页               |
| [`loading`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) | `.js` `.jsx` `.tsx` | 正在加载用户界面 |
| [`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) | `.js` `.jsx` `.tsx` | 未找到用户界面   |
| [`error`](https://nextjs.org/docs/app/api-reference/file-conventions/error) | `.js` `.jsx` `.tsx` | 错误用户界面     |
| [`global-error`](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error) | `.js` `.jsx` `.tsx` | 全局错误用户界面 |
| [`route`](https://nextjs.org/docs/app/api-reference/file-conventions/route) | `.js` `.ts`         | API 端点         |
| [`template`](https://nextjs.org/docs/app/api-reference/file-conventions/template) | `.js` `.jsx` `.tsx` | 重新渲染的布局   |
| [`default`](https://nextjs.org/docs/app/api-reference/file-conventions/default) | `.js` `.jsx` `.tsx` | 平行路由回退页面 |

### 2.1.4 嵌套路由

`page`文件夹定义 URL 段。嵌套文件夹会嵌套 URL 段。任何级别的布局都会包裹其子 URL 段。当路由或URL 文件存在时，路由将变为公共路由`route`。

| 小路                        | URL模式         | 笔记                  |
| --------------------------- | --------------- | --------------------- |
| `app/layout.tsx`            | —               | 根布局包含所有路由    |
| `app/blog/layout.tsx`       | —               | 包装纸`/blog`及其后代 |
| `app/page.tsx`              | `/`             | 公共路线              |
| `app/blog/page.tsx`         | `/blog`         | 公共路线              |
| `app/blog/authors/page.tsx` | `/blog/authors` | 公共路线              |

### 2.1.5 动态路线

使用方括号对段进行参数化。使用 [segment] 表示单个参数，[...segment] 表示所有参数，[[...segment]] 表示可选参数。通过 params 属性访问这些值。

| 小路                            | URL模式                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `app/blog/[slug]/page.tsx`      | `/blog/my-first-post`                                        |
| `app/shop/[...slug]/page.tsx`   | `/shop/clothing`，`/shop/clothing/shirts`                    |
| `app/docs/[[...slug]]/page.tsx` | `/docs`，，`/docs/layouts-and-pages``/docs/api-reference/use-router` |

### 2.1.6 路由组和私有文件夹

使用路由组 (group) 组织代码而不更改 URL，并将不可路由的文件与私有文件夹 _folder 放在一起。

| Path                            | URL模式 | 解释                                   |
| ------------------------------- | ------- | -------------------------------------- |
| `app/(marketing)/page.tsx`      | `/`     | URL 中省略了组                         |
| `app/(shop)/cart/page.tsx`      | `/cart` | 在共享布局内`(shop)`                   |
| `app/blog/_components/Post.tsx` | —       | 不可路由；用户界面实用程序的安全存放处 |
| `app/blog/_lib/data.ts`         | —       | 不可路由；公用设施的安全存放处         |

### 2.1.7 平行路线和截获路线

这些功能适用于特定的用户界面模式，例如基于插槽的布局或模态路由。

使用 @slot 为父布局渲染的命名槽位添加标签。使用拦截模式可以在当前布局中渲染另一个路由，而无需更改 URL，例如，在列表上方以模态框的形式显示详细信息视图。

| 模式（文档）                                                 | 意义     | 典型用例                       |
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
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon) | `.jpg` `.jpeg`，`.png`              | Apple App 图标文件    |
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`                  | 生成的 Apple 应用图标 |

2. Open Graph 和 Twitter 图片

|                                                              |                              |                        |
| ------------------------------------------------------------ | ---------------------------- | ---------------------- |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image) | `.jpg` `.jpeg` `.png` `.gif` | 打开 Graph 图像文件    |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`           | 生成的 Open Graph 图像 |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image) | `.jpg` `.jpeg` `.png` `.gif` | Twitter 图片文件       |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`           | 生成的推特图片         |

3.SEO

|                                                              |             |                  |
| ------------------------------------------------------------ | ----------- | ---------------- |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#sitemap-files-xml) | `.xml`      | 站点地图文件     |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts) | `.js` `.ts` | 生成的站点地图   |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt) | `.txt`      | 机器人文件       |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file) | `.js` `.ts` | 生成的机器人文件 |

## 2.2 组织你的项目

Next.js 对项目文件的组织和存放方式没有硬性规定。但它确实提供了一些功能来帮助你组织项目。









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

