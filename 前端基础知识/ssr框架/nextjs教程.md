# 介绍

Next.js 是一个用于构建全栈 Web 应用程序的 React 框架。您可以使用 React 组件来构建用户界面，并使用 Next.js 来构建其他功能和优化。

# 安装

> 系统要求：node >= 18.18 或更高版本

## 1.创建新的项目

执行npm，按照提示创建项目，建议使用 `src` 目录来存放源码。

```bash
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

## 2.目录结构

之后会自动生成项目，进入项目目录，你会看到如下的目录结构。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041335045.avif" alt="folder-structure" style="zoom:50%;" />

- `app`: 后续所有代码存的放位置。
- `next.config.js`: next.config.js存放了next的开发、生产环境下的配置。

## 3.package.json

打开package.json, 找到 `scripts`，可以看到如下npm命令：

- `dev` ：运行 next dev 以在开发模式下启动Next.js。
- `build` ：运行 next build 以生成用于生产的应用程序。
- `start` ：运行 next start 以启动Next.js生产服务器。
- `lint` ：运行 next lint 以设置Next.js的内置 ESLint 配置。

# 路由

## 1.介绍

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041416903.avif" alt="terminology" style="zoom:50%;" />

> **路由规则，约定大于配置**

NextJs的路由系统是一个树形结构，最顶层是app目录，然后是路由文件，最后是具体的页面。

通过一张url和路由文件的映射关系图来直观的感受下：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041423817.avif" alt="terminology" style="zoom:50%;" />

**NextJs的路由系统遵循了约定大于配置的元素**，每个路由文件下可以包含如下的文件：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041424917.avif" alt="terminology" style="zoom:50%;" />

文件介绍：

- `page.js`: `必填` 文件，在页面渲染后加载该文件, 用于渲染页面内容.
- `layout.js`: 布局文件，在页面渲染前会先加载该文件, 用于渲染页面布局.
- `loading.js`: 加载文件，在页面渲染前会先加载该文件, 用于渲染页面加载状态.
- `error.js`: 错误文件，在页面渲染后加载该文件, 用于渲染页面错误状态.
- `not-found.js`: 404文件，在页面渲染后加载该文件, 用于渲染页面404状态.

## 2.可复用的布局

Next.js的layout是一个可复用的布局，不同的子页面可以共享布局容器，页面跳转时，layout容器不会重新渲染。

**children props**

```js
// app/layout.js
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header>头部不会重新渲染</header>
                <main>{children}</main>
                <footer>底部不会重新渲染</footer>
            </body>
        </html>
    )
}
```

children props是layout的一个参数，它接收一个React元素, 该元素其实就是page.js的渲染结果。

你可以根据你的需求，在layout中添加一些公共的布局元素，比如header, footer等，这些元素不会随着路由的切换而重新渲染。

**嵌套布局:**

layout组件也可以嵌套，例如：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041431791.avif" alt="nest-layout" style="zoom:50%;" />

app作为最外层的layout，嵌套了dashboard的子layout，dashboard的layout其实对应的就是app中的children。

而dashboard layout.js中的children则对应了dashboard的page页面。

## 3.404页面

当你访问一个未找到的路由时, 该页面将被呈现为NotFound的样式。

```js
// app/not-found.js
import Link from 'next/link'
 
export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
    )
}
```

## 4.loading加载

loading.js 可以帮助你使用React Suspense创建一个组件, 当你在加载路由内容时，它会显示该加载状态组件，渲染完成后，新的内容将会自动替换。

> 传统ssr渲染流程:

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041435602.avif" alt="ssr-render-process" style="zoom:50%;" />

传统的ssr渲染流程，当用户请求一个页面时，服务器会根据路由匹配到对应的组件，然后渲染该组件，最后将渲染后的html返回给用户。

如果组件中存在异步数据，那么服务端会等待异步数据加载完成之后再渲染，这样可能会导致页面白屏时间较长的问题。

而next.js提供了一种新的渲染方式，即流式渲染。

> 流式渲染

所谓的流式渲染，就是把一个组件拆分成多个小块，然后分块渲染。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408041435433.avif" alt="ssr-rendering-with-streaming" style="zoom:50%;" />

这样的话，当客户端请求页面时会优先展示静态内容，等到服务端异步数据加载完成并渲染成功后，客户端再继续渲染剩余的内容。

但是，需要注意一点，流式渲染并不会提高整个页面的加载速度，只是将白屏时间缩短了。

> Suspense

Next.js提供的Suspense组件和传统的spa中使用的Suspense组件是不同的。

- 传统spa中的Suspense组件需要搭配React提供的lazy函数一起使用，用于加载异步组件。
- Next.js中的Suspense组件则是用于加载异步数据的，不需要搭配lazy函数，当异步组件渲染完成时，会显示该组件中的内容。
- 还需要注意一点，Next.js中的Suspense并不会主动分包(如果想要分包，可以参考[lazy-load](https://blog.chdl.fun/ChBlog/docs/nextjs/client-api/lazy-load))，而spa中的会根据import函数中的path自动分包，这一点需要额外注意。

> 示例

app/post/page.js:

```js
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
    return (
        <section>
            <Suspense fallback={<p>Loading feed...</p>}>
                <PostFeed />
            </Suspense>
            <Suspense fallback={<p>Loading weather...</p>}>
                <Weather />
            </Suspense>
        </section>
    )
}
```

app/post/Components/PostFeed.js

```js
export default async function PostFeed() {
    const list = await fetch('https://xxx')
    return (<pre>list</pre>)
}
```

app/post/Components/Weather.js

```js
export default async function Weather() {
    const list = await fetch('https://xxx')
    return (<pre>list</pre>)
}
```

## 5.动态路由

如果您事先不知道确切的区段名称，并且想要从动态数据创建路由，则可以使用在请求时填充或在构建时预呈现的动态区段。

`app/blog/[slug]/page.js`

```js
export default function Page({ params }) {
    return <div>My Post: {params.slug}</div>
}
```

例如：

| Route                   | Example URL | params          |
| :---------------------- | :---------- | :-------------- |
| app/blog/[slug]/page.js | /blog/a     | `{ slug: 'a' }` |
| app/blog/[slug]/page.js | /blog/b     | `{ slug: 'b' }` |
| app/blog/[slug]/page.js | /blog/c     | `{ slug: 'c' }` |

## 6.链接和导航

Next.js 中有四种方式可以在路由之间导航：

- 使用`<link>`组件
- 使用`useRouter`钩子（客户端组件）
- 使用`redirect`函数（服务器组件）
- 使用原生`History API`

### 6.1 link组件

`<Link>`是一个内置组件，它扩展了 HTML`<a>`标签以提供路由之间的`prefetching`和客户端导航。这是 Next.js 中路由之间导航的主要和推荐方式。

您可以通过从`next/link`导入，并将`href`prop 传递给组件来使用它：

```tsx
// app/page.tsx
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

### 6.2 useRouter Hook

该`useRouter`钩子允许您以编程方式从客户端组件导入

```tsx
// app/page.tsx
'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

> **建议：**使用`<Link>`组件在路线之间导航，除非您对使用有特殊的要求`useRouter`。

### 6.3 redirect

对于服务器组件，使用`redirect`函数。

```tsx
// app/team/[id]/page.tsx
import { redirect } from 'next/navigation'
 
async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }
 
  // ...
}
```

> 注意：
>
> 1. `redirect`默认返回 307（临时重定向）状态代码。在服务器操作中使用时，它会返回 303（查看其他），这通常用于在 POST 请求后重定向到成功页面。
> 2. `redirect`内部会引发错误，因此应该在`try/catch`块外部调用它。
> 3. `redirect`可以在客户端组件中在渲染过程中调用，但不能在事件处理程序中调用。您可以改用`useRouter`钩子。
> 4. `redirect`也接受绝对 URL 并可用于重定向到外部链接。
> 5. 如果您想在渲染过程之前重定向，请使用[`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs)或中间件。

### 6.4使用原生 History API

Next.js 允许你使用原生`window.history.pushState`和`window.history.replaceState`无需重新加载页面即可更新浏览器历史记录堆栈的方法。

pushState和replaceState调用与Next.js路由集成，在其中允许您与usePathname和useSearchParams进行同步。

> 1.window.history.pushState

使用它来向浏览器的历史记录堆栈添加新条目。用户可以导航回上一个状态。例如，要对产品列表进行排序：

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

> 2.window.history.replaceState

使用它来替换浏览器历史记录堆栈上的当前条目。用户无法导航回先前的状态。例如，可以使用它来切换应用程序的区域设置。

```tsx
'use client'
 
import { usePathname } from 'next/navigation'
 
export function LocaleSwitcher() {
  const pathname = usePathname()
 
  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
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

### 6.5路由和导航的工作原理

App Router 使用混合方法进行路由和导航。在服务器端，您的应用代码会根据路由段自动进行代码拆分。而在客户端，Next.js 预取并缓存路由段。这意味着，当用户导航到一个新的路由时，浏览器不会重新加载页面，只有变化的路由段会重新渲染，从而提高导航体验和性能。

#### 1.代码分割

代码分割可以将应用程序代码分成较小的包，供浏览器下载和执行。这样可以减少传输的数据量和每个请求的执行时间，提高性能。

服务器组件可以根据路由段自动对应用程序代码进行代码分割。这意味着只有当前路由所需的代码在导航时会被加载。

#### 2.Prefetching

预取是一种在用户访问之前在后台预加载路由的方法。

在 Next.js 中，有两种方式可以对路由进行预取：

- “<Link>” 组件： 当用户的视口内出现路由时，它们会自动预取。预取会在页面首次加载或通过滚动而进入视口时发生。
- router.prefetch()：可以使用 useRouter hook 来以编程方式预取路由。

<Link> 的默认预取行为（即当未指定预取属性或将其设置为 null 时）取决于 loading.js 的使用方式。只有在组件的 rendered 

"tree" 中，从共享布局开始，直到第一个 loading.js 文件之前的部分，会进行预取和缓存，缓存时间为30s。这降低了获取整个动态路

由的成本，也意味着可以显示即时的加载状态，以提供更好的视觉反馈给用户。

可以通过将预取属性设置为 false 来禁用预取。或者，可以通过将预取属性设置为 true 来预取超出加载边界的完整页面数据。

> 注意：预取功能在开发中未启用，仅在生产中启用。

#### 3.缓存

Next.js有一个名为Router Cache的内存客户端缓存。当用户在应用程序中导航时，预取的路由片段和访问的路由的React Server Component Payload会存储在缓存中。

这意味着在导航时，尽可能地重复使用缓存，而不是向服务器发出新请求——通过减少请求和传输的数据数量来提高性能。

#### 4.部分渲染

部分渲染意味着只有导航时发生变化的路线段才会在客户端重新渲染，并且任何共享的段都会被保留。

例如，在两个兄弟路由之间导航时，/dashboard/settings 和 /dashboard/analytics，将呈现设置和分析页面，并保留共享的仪表板布局。

![How partial rendering works](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409232336152.png)

没有局部渲染，每次导航都会导致客户端对整个页面进行重新渲染。只渲染变化部分可以减少传输的数据量和执行时间，从而提高性能。

#### 5.软导航

浏览器在页面间进行导航时会执行“硬导航”。Next.js 应用程序路由器实现了页面间的“软导航”，只重绘发生改变的路由部分（部分渲染）。这使得在导航过程中客户端 React 状态得以保留。

#### 6.后退和前进导航

默认情况下，Next.js会在后退和前进导航时保持滚动位置，并在路由缓存中重新使用路由段。

#### 7.pages/路由和app/之间的路由区别

当从pages/逐步迁移到app/时，Next.js路由器将自动处理两者之间的硬导航。为了检测从pages/到app/的过渡，有一个客户端路由器过

滤器，它利用了对app路由的概率检查，这可能偶尔会导致错误的结果。默认情况下，这种发生的情况应该非常罕见，因为我们将错误阳性的

可能性配置为0.01%。可以通过next.config.js中的experimental.clientRouterFilterAllowedRate选项自定义该可能性。重要的

是要注意，降低错误阳性率将增加生成的过滤器在客户端捆绑包中的大小。

或者，如果您更喜欢完全禁用此处理并手动管理页面和应用程序之间的路由，在next.config.js文件中，您可以将

experimental.clientRouterFilter设置为false。当禁用此功能时，默认情况下，页面中与应用程序路由重叠的任何动态路由不能正

确导航。

## 7.错误处理

错误可以分为两类：预期错误和未捕获异常：

- 将预期错误模型化为返回值：在服务器操作中，避免使用 try/catch 来处理预期错误。使用 useFormState 来管理这些错误，并将它们返回给客户端。

- 对于意外错误，请使用错误边界：使用 error.tsx 和 global-error.tsx 文件实现错误边界来处理意外错误，并提供替代的用户界面。

### 7.1预期错误

预期错误是在应用程序的正常操作过程中可能发生的错误，例如来自服务器端表单验证或失败请求的错误。这些错误应该明确地处理并返回给

客户端。

**a.处理服务器操作的预期错误**

使用useFormState钩子来管理服务器操作的状态，包括处理错误。这种方法避免了用于预期错误的try/catch块，这些错误应该被建模为

返回值而不是抛出异常。

```tsx
// app/actions.ts
'use server'
 
import { redirect } from 'next/navigation'
 
export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch('https://...')
  const json = await res.json()
 
  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }
 
  redirect('/dashboard')
}
```

然后，你可以将你的动作传递给useFormState钩子，并使用返回的状态来显示错误消息。

```tsx
// app/ui/signup.tsx
'use client'
 
import { useFormState } from 'react'
import { createUser } from '@/app/actions'
 
const initialState = {
  message: '',
}
 
export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState)
 
  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button>Sign up</button>
    </form>
  )
}
```

> 了解：以上示例使用了React的useFormState钩子，它与Next.js应用路由一起捆绑。如果你正在使用React 19，应使用useActionState。

您还可以使用返回的状态，从客户端组件显示一个toast消息。

**b.处理服务器组件的预期错误**

当在服务器组件内获取数据时，您可以使用响应来有条件地呈现错误消息或重定向。

```tsx
// app/page.tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
 
  if (!res.ok) {
    return 'There was an error.'
  }
 
  return '...'
}
```

### 7.2未捕获的异常

未捕获异常是意外错误，表示在应用程序正常流程中不应发生的错误或问题。应该通过抛出错误来处理这些异常，然后由错误边界捕获。

- 常见：使用error.js处理根布局下未捕获的错误。

- 可选：使用嵌套的error.js文件（例如：app/dashboard/error.js）处理精确的未捕获错误。

- 不常见：使用global-error.js处理根布局中的未捕获错误。

**a.使用错误边界**

Next.js 使用错误边界来处理未捕获的异常。错误边界会捕获其子组件中的错误，并显示备用的用户界面，而不是崩溃的组件树。

在一个路由段内添加一个error.tsx文件，并导出一个React组件，从而创建一个错误边界:

```tsx
// app/dashboard/error.tsx
'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

如果您希望错误传递到父级错误边界，您可以在渲染错误组件时抛出错误。

**b.处理嵌套路由中的错误**

错误会冒泡至最近的上级错误边界。这样可以通过在路由层次结构的不同级别上放置 error.tsx 文件来实现细粒度的错误处理。

![Nested Error Component Hierarchy](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240018581.png)

**c.处理全局错误**

尽管较少见，但在根布局中使用 app/global-error.js 可以处理错误，该文件位于根应用程序目录中，即使在使用国际化时也可以。全

局错误 UI 必须定义自己的 <html> 和 <body> 标签，因为它在激活时替代了根布局或模板。

```tsx
// app/global-error.tsx
'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

## 8.加载 UI 和流式传输

特殊文件 loading.js 可以帮助你使用 React Suspense 创建有意义的加载界面。通过这个约定，你可以在路由段加载内容时显示即时

的加载状态。一旦渲染完成，新的内容将会自动替换进来。

![Loading UI](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240038939.png)

### 8.1即时加载状态

一个即时加载状态是在导航过程中立即显示的备用用户界面。您可以预先渲染加载指示器，例如骨架屏和旋转图标，或者是未来屏幕的一个小

但有意义的部分，例如封面照片、标题等。这可以帮助用户理解应用正在响应，并提供更好的用户体验。

通过在文件夹内添加loading.js文件来创建一个加载状态:

![loading.js 特殊文件](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240040326.png)

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

在同一个文件夹中，loading.js 将被嵌套在 layout.js 中。它将自动将 page.js 文件和其下的任何子元素包装在 <Suspense> 边界中。

![loading.js overview](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240040864.png)

注意：

- [即使采用以服务器为中心的路由](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)，导航也是即时的。

- 导航可以中断，意味着在切换路线时不需要等待当前路线的内容完全加载就可以导航到另一条路线上。

- 共享布局在加载新路段时仍然保持交互性。

> 建议：在Next.js中使用loading.js约定来优化路由片段（布局和页面）的功能。

### 8.2使用 Suspense 进行流式传输

除了loading.js之外，您还可以手动为自己的UI组件创建暂停边界。应用程序路由器支持在Node.js和Edge运行时中使用暂停流技术。

- 扩展：

有些浏览器会缓冲流式响应。直到响应超过1024个字节，你才能看到流式响应。这通常只会影响“Hello World”类型的应用，而不会影响真实的应用程序。

**a.什么是流媒体？**

为了理解React和Next.js中的流媒体工作原理，了解服务器端渲染（SSR）及其限制是有帮助的。

在SSR中，需要完成一系列步骤，用户才能看到并与页面进行交互：

1. 首先，在服务器上获取给定页面的所有数据。
2. 然后服务器渲染该页面的 HTML。
3. 将页面的HTML、CSS和JavaScript发送到客户端。
4. 使用生成的 HTML 和 CSS 显示非交互式用户界面。
5. 最后，React使用户界面恢复活动状态，使其具有交互性。

![Chart showing Server Rendering without Streaming](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240046974.png)

这些步骤是按顺序进行且具有阻塞性，这意味着只有在获取完所有数据后，服务器才能渲染页面的HTML。而且，在客户端中，只有在下载完

页面中所有组件的代码后，才能补充 UI。

React和Next.js进行服务器端渲染（SSR）有助于通过尽快向用户展示非交互式页面来提高加载性能的感知效果。

![无流式传输的服务器渲染](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240048825.png)

然而，它仍然很慢，因为在向用户显示页面之前需要完成服务器上的所有数据提取。

**通过流式传输，**您可以将页面的 HTML 分解为更小的块，然后逐步将这些块从服务器发送到客户端。

![流式服务器渲染的工作原理](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240048193.png)

这使得页面的各个部分能够更快地显示，而无需等待所有数据加载后才能呈现任何 UI。

流式传输与 React 的组件模型配合得很好，因为每个组件都可以被视为一个块。优先级较高的组件（例如产品信息）或不依赖数据的组件可以先发送（例如布局），React 可以更早地开始水化。优先级较低的组件（例如评论、相关产品）可以在其数据被获取后在同一服务器请求中发送。

![图表展示了服务器流式渲染](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202409240049112.png)

当你想防止长数据请求阻止页面渲染时，流式传输特别有用，因为它可以减少[第一个字节的时间（TTFB）](https://web.dev/ttfb/)首次[内容绘制 (FCP)](https://web.dev/first-contentful-paint/). 它还有助于缩短[交互时间 (TTI)](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)，尤其是在速度较慢的设备上。

**c.例子**

`<Suspense>`其工作原理是包装一个执行异步操作（例如获取数据）的组件，在操作发生时显示后备 UI（例如骨架、微调器），然后在操作完成后交换组件。

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'
 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

通过使用Suspense，你可以获得以下好处：
- 流式服务器渲染： 从服务器逐步将 HTML 渲染到客户端。
- 选择性水合：React根据用户交互的优先级来确定哪些组件首先进行交互。

**d.SEO**

- Next.js 将等待内部数据提取[`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)完成后再将 UI 流式传输到客户端。这可确保流式响应的第一部分包含`<head>`标签。
- 由于流媒体是服务器呈现的，因此不会影响 SEO。您可以使用谷歌的Rich Results测试工具查看您的页面在谷歌网络爬虫中的呈现方式，并查看序列化的HTML源代码。

**e.状态码**

在流媒体时，如果请求成功，服务器会返回200状态码来表示成功。

服务器仍然可以通过流式内容本身与客户端通信错误或问题，例如在使用重定向或未找到页面时。由于响应头已发送到客户端，因此无法更新响应的状态代码。这不会影响搜索引擎优化（SEO）。

## 9.重定向

## 10.路由组

## 11.项目结构

## 12.动态路由

## 13.静态路由

## 14.拦截路由

## 15.路由处理程序

## 16.中间件

## 17.国际化

# 数据获取

## 1.数据获取和缓存

以下是 Next.js 中数据获取的一个简单示例：

```tsx
// app/page.tsx
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

该示例演示了如何在异步React服务器组件中使用fetch API进行基本的服务器端数据获取。

### 1.1示例

#### 1.1.1使用fetch API获取服务器上的数据:

这个组件会获取并展示一系列博客文章。从 fetch 收到的响应将被自动缓存。

```tsx
// app/page.tsx
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

如果在此路由中没有使用任何动态函数，它将在下一次构建时被预先渲染为静态页面。数据可以使用增量静态再生成进行更新。

如果您*不想*缓存来自的响应`fetch`，您可以执行以下操作：

```tsx
let data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' })
```

#### 1.1.2使用 ORM 或数据库在服务器上获取数据

该组件将获取并显示博客文章列表。默认情况下不会缓存来自数据库的响应，但可以通过其他配置进行缓存。

```tsx
// app/page.tsx
import { db, posts } from '@/lib/db'
 
export default async function Page() {
  let allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

为了防止页面预渲染，您可以将以下内容添加到文件中：

```tsx
export const dynamic = 'force-dynamic'
```

但是，您通常会使用 cookies()、headers() 等函数，或从页面 props 读取传入的 searchParams，这将自动使页面动态渲染。在这种情况下，您不需要*明确*使用`force-dynamic`。

#### 1.1.3在客户端获取数据

> 我们建议首先尝试在服务器端获取数据。

但是，在某些情况下，客户端数据获取仍然有意义。在这些情况下，您可以手动调用`fetch`（`useEffect`不推荐），或者依靠社区中流行的 React 库（例如[SWR](https://swr.vercel.app/)或[React Query](https://tanstack.com/query/latest)) 供客户端获取。

```tsx
// app/page.tsx
'use client'
 
import { useState, useEffect } from 'react'
 
export function Posts() {
  const [posts, setPosts] = useState(null)
 
  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch('https://api.vercel.app/blog')
      let data = await res.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])
 
  if (!posts) return <div>Loading...</div>
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

#### 1.1.4使用 ORM 或数据库缓存数据

您可以使用`unstable_cache`API 来缓存响应，以允许页面在运行时进行预渲染`next build`。

```tsx
// app/page.tsx
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'
 
const getPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)
 
export default async function Page() {
  const allPosts = await getPosts()
 
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

此示例将数据库查询结果缓存 1 小时（3600 秒）。它还添加了缓存标签，然后可以使用[增量静态再生](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)`posts`使该标签失效。

#### 1.1.5在多个函数中重复使用数据

Next.js 使用类似的 API `generateMetadata`，`generateStaticParams`您需要在其中使用在 中提取的相同数据`page`。

如果您使用`fetch`，请求将自动[被记住](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)。这意味着您可以安全地使用相同的选项调用相同的 URL，并且只会发出一个请求。

```tsx
// app/page.tsx
import { notFound } from 'next/navigation'
 
interface Post {
  id: string
  title: string
  content: string
}
 
async function getPost(id: string) {
  let res = await fetch(`https://api.vercel.app/blog/${id}`)
  let post: Post = await res.json()
  if (!post) notFound()
  return post
}
 
export async function generateStaticParams() {
  let posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
 
  return posts.map((post: Post) => ({
    id: post.id,
  }))
}
 
export async function generateMetadata({ params }: { params: { id: string } }) {
  let post = await getPost(params.id)
 
  return {
    title: post.title,
  }
}
 
export default async function Page({ params }: { params: { id: string } }) {
  let post = await getPost(params.id)
 
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

如果您*不*使用`fetch`，而是直接使用 ORM 或数据库，则可以使用 React`cache`函数包装数据获取。这将删除重复数据并仅进行一次查询。

```tsx
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db' // Example with Drizzle ORM
import { notFound } from 'next/navigation'
 
export const getPost = cache(async (id) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
 
  if (!post) notFound()
  return post
})
```

### 1.2模式

#### 1.2.1并行和顺序数据获取

在组件内部获取数据时，您需要了解两种数据获取模式：并行和顺序。

![Sequential and Parallel Data Fetching](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fsequential-parallel-data-fetching.png&w=3840&q=75)

- **顺序性**：组件树中的请求相互依赖。这可能会导致更长的加载时间。
- **并行**：路由中的请求会立即发起，并同时加载数据。这减少了加载数据所需的总时间。

> 1.顺序数据获取

如果您有嵌套组件，并且每个组件都获取自己的数据，那么如果这些数据请求没有被记忆，数据获取将按顺序进行。

在某些情况下，您可能需要这种模式，因为一个提取依赖于另一个提取的结果。例如，组件仅在完成数据提取`Playlists`后才开始提取数据，因为取决于prop：`Artist``Playlists``artistID`

```tsx
// app/artist/[username]/page.tsx
export default async function Page({
  params: { username },
}: {
  params: { username: string }
}) {
  // Get artist information
  const artist = await getArtist(username)
 
  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
 
async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
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







### 1.3预加载数据























## 2.服务器操作

## 3.增量更新

# 样式

## 1.UI组件库的选择

> css-in-js组件库

其实我并不太推荐使用css-in-js组件库，因为css-in-js组件库的样式是使用js代码动态生成的，这会带来一些性能问题。

最为重要的一点就是，ssr渲染css-in-js组件是会出现 `页面闪烁!!!`，由于css-in-js的css样式是由js动态生成的，当你的js尚未加载完成时页面会显示一个没有样式的html内容, 当js加载并执行之后，页面才会显示完整的样式，`这一过程会导致页面闪烁!!!` , 如果你能接收当我没说。

很不幸，antd的样式就采用了css-in-js的方案，很难受啊，网上也有一些网友曾提到过antd的样式闪烁问题， 不过，antd官方也提供了一些解决方案，可以参考 [antd官方文档](https://ant.design/docs/react/server-side-rendering-cn)，简单说一下原理其实就是将样式代码提取出来，然后通过`style`标签插入到html中，但是我认为这种方案不好，虽然可以解决闪烁问题，但是没办法很好的利用link标签的预加载功能，而且antd的样式代码量比较大，提取出来之后，html文件会变得很大，同样官方也给出了该问题的处理办法，但是过程很繁琐，有兴趣的可以自行研究。

> 推荐的UI组件库

与其折腾antd那些繁琐的配置，不如我推荐大家直接使用 [react-bootstrap](https://react-bootstrap.netlify.app/) ，这个组件库的样式使用的是传统的scss预处理器，没有使用css-in-js的方案，因此不会出现样式闪烁的问题，而且使用起来非常简单，开箱即用。

1. 安装依赖

```bash
npm install react-bootstrap bootstrap
```

2. 导入样式

```css
import 'bootstrap/dist/css/bootstrap.min.css';
```

3. 使用组件

```react
import {Button} from 'react-bootstrap';

function Example() {
  return (
    <Button>Default</Button>
  );
}
```

## 2.css预处理器

CSS预处理器可以帮助我们编写更加可维护的CSS样式, CSS预处理器允许我们定义变量, 允许嵌套规则, 允许创建可重用的样式块.

> less

使用less十分简单，我们只需要安装less即可

```bash
npm install less -D
```

> scss

使用sass依然很简单，直接安装sass即可

```bash
npm install -D sass
```

## 3.Tailwind Css

Tailwind CSS是一个功能强大的CSS框架, 它提供了一组原子级的CSS类，用于快速构建定制化的界面。

1. 安装

安装 Tailwind CSS 依赖，并运行 init 命令，自动生成 tailwind.config.js、 postcss.config.js 文件，其中postcss是一款css插件，通过使用插件来对CSS语法进行转换，例如添加浏览器前缀、压缩代码、转换未来的CSS语法等，后续会介绍，这里不做详细介绍。

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. 配置

为了区分 Tailwind CSS 生成的类，我们可以在 tailwind.config.js 中添加前缀，例如 tw-。

```js
//tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'tw-',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: []
}
```

3. 导入样式

```css
/*src/styles/globals.css*/
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. 使用

全局导入样式，在根组件中引入即可。

```js
/**app/layout.jsx*/
import './globals.css'
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`app/page.jsx`

```js
export default function Page() {
  return <h1 className="tw-text-3xl tw-font-bold tw-underline">Hello, Next.js!</h1>
}
```

## 4.css module

CSS模块（CSS Modules）是一种用于解决CSS命名冲突和作用域隔离问题的技术。它通过在编译阶段为CSS样式表生成唯一的类名，以确保样式的作用范围仅限于其所属的组件或模块。 Next.js 内置了对使用扩展 .module.css 的 CSS 模块的支持。

next.js仅对 .module.css 扩展名的文件启用css module。

```jsx
// app/dashboard/layout.jsx
import styles from './styles.module.css'
 
export default function DashboardLayout({ children }) {
  return <section className={styles.dashboard}>{children}</section>
}
```

> typescript-plugin-css-modules

如果你的项目使用了 typescript，推荐一个插件 `typescript-plugin-css-modules`, 这个插件可以让你在编写 className 时，智能提示css module的类名。

使用步骤如下：

1. 安装插件：`npm i typescript-plugin-css-modules -D`
2. 配置tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "typescript-plugin-css-modules" }
    ]
  }
}
```

3. 配置.vscode/settings.json:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## 5.主题

通过CSS定制化主题可以很方便的改变页面的外观和样式，以实现不同的视觉效果和用户体验。通过定制主题，可以使网站、应用或界面适应不同的设计需求、品牌标识或用户偏好。

>  定义css主题变量

目前业界比较流行的主题切换方案是使用CSS变量，通过设置不同的CSS变量值来改变主题。

首先，你需要在global.css中定义CSS变量，并设置默认值。

global.css:

```css
:root {
    /* 全局主色、次要色 */
    --m-color-secondary: #e6f7ff; /* primary-1 */
    --m-color-primary: #1890ff; /* primary-6 */

    /* 基于主色衍生出的其他颜色 */
    --m-color-select: #e6f7ff; /* primary-1 */
    --m-color-hover: #40a9ff; /* primary-5 */
    --m-color-click: #096dd9; /* primary-7 */

    /* 功能色 */
    --m-color-link: #1890ff;
    --m-color-success: #1890ff;
    --m-color-waring: #faad14;
    --m-color-error: #ff4d4f;

    /* 中性色，一般用在文字上 */
    --m-color-title: rgb(0 0 0 / 0.9);
    --m-color-text-primary: rgb(0 0 0 / 0.9);
    --m-color-text-secondary: rgb(0 0 0 / 0.7);
    --m-color-disable: rgb(0 0 0 / 0.3);
    --m-color-border: rgb(0 0 0 / 0.2);
    --m-color-divider: rgb(0 0 0 / 0.1);
    --m-color-bg-primary: rgb(0 0 0 / 0.06);
    --m-color-bg-secondary: rgb(0 0 0 / 0.03);
}

.dark {
    --m-color-title: rgb(255 255 255 / 0.9);
    --m-color-text-primary: rgb(255 255 255 / 0.9);
    --m-color-text-secondary: rgb(255 255 255 / 0.7);
    --m-color-disable: rgb(255 255 255 / 0.3);
    --m-color-border: rgb(255 255 255 / 0.2);
    --m-color-divider: rgb(255 255 255 / 0.1);
    --m-color-bg-primary: rgb(255 255 255 / 0.08);
    --m-color-bg-secondary: rgb(255 255 255 / 0.04);
}
```

其实在切换主题色的时候，最主要的其实就是中性色的变化，因为中性色是页面中占据着很大比重的一块区域。 而主色其实再切换的时候，差距不是特别大，可以手动微调。

> 切换主题

切换主题其实很简单，只需要在页面中添加一个按钮，用来动态添加.dark类，就可以实现切换主题的功能。

```jsx
// app/header.jsx
export default function Header() {
    function switchTheme() {
        document.body.classList.toggle('dark')
    }
    return (
        <button onclick={switchTheme}>toggle</button>
    )
}
```

## 6.自适应页面

首先得区分自适应布局和响应式布局之间的区别。

自适应布局是指在同一设备类型下，页面可以根据窗口大小等比例缩放，以适应不同尺寸的屏幕。在自适应布局中，页面的布局和元素大小会根据浏览器窗口的大小进行调整，但不会改变元素的排列顺序。

响应式布局则更加灵活，它是指在不同设备类型下，页面可以通过隐藏、调整布局和改变元素的排列顺序等方式，以适应不同的屏幕尺寸和设备特性。在响应式布局中，可以使用媒体查询、弹性布局和其他技术手段，根据设备的特性和屏幕尺寸，调整页面的布局和样式。

> 1.postcss

本教程通过rem的方案来进行自适应，rem是相对根元素font-size的单位。为了简化编写rem单位，可以使用postcss插件进行转化。

首先安装postcss插件：

```bash
npm install postcss postcss-pxtorem autoprefixer -D
```

然后创建`postcss.config.js`文件，并写入以下内容：

```js
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        'postcss-pxtorem': {
            rootValue: 16,
            propList: ['*', '!font-size']
        }
    }
};
```

- rootValue，表示1rem等于多少px，这里设置为16px。
- propList，表示需要转化哪些属性。这里设置为*，表示所有属性都需要转化， 同时!font-size表示不转化font-size属性。

个人建议, 使用自适应布局和响应式布局混合搭配时，最好不要转化font-size为rem，避免出现字体大小过小的情况。

> 2.设置根元素fon-size

假设设计稿的宽度是1242px，那么根元素font-size的值为：屏幕宽度 * 16 / 1242

通过css设置根元素字体大小(推荐):

global.css

```css
/* 1242下，1rem = 16px */
html {
    font-size: calc(100vw * 16 / 1242);
}
```

当然，你也可以通过js设置根元素字体大小:

app/page.jsx

```js
function setFontSize() {
  // 获取屏幕宽度
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // 根据屏幕宽度和设计稿的尺寸比例计算字体大小
  var fontSize = screenWidth / 10; // 假设设计稿宽度为10rem

  // 设置HTML元素的字体大小
  document.documentElement.style.fontSize = fontSize + 'px';
}

setFontSize();
window.addEventListener('resize', setFontSize);
```

# 组件渲染

## 1.服务端组件

### 1.1 服务端渲染的优势

在服务器上进行渲染工作有几个好处，包括：

- **数据获取**：服务器组件允许您将数据获取移至更靠近数据源的服务器。这可以减少获取渲染所需数据的时间以及客户端需要发出的请求数量，从而提高性能。
- **安全性**：服务器组件允许您将敏感数据和逻辑（例如令牌和 API 密钥）保存在服务器上，而不会有将其暴露给客户端的风险。
- **缓存**：通过在服务器上渲染，结果可以被缓存并在后续请求和跨用户中重复使用。这可以通过减少每个请求的渲染和数据获取量来提高性能并降低成本。
- **性能**：服务器组件为您提供了额外的工具，可从基线优化性能。例如，如果您开始使用完全由客户端组件组成的应用，则将 UI 的非交互式部分移至服务器组件可以减少所需的客户端 JavaScript 数量。这对于网速较慢或设备性能较差的用户来说非常有利，因为浏览器需要下载、解析和执行的客户端 JavaScript 更少。
- **初始页面加载和首次内容绘制（FCP）**：在服务器上，我们可以生成 HTML 以允许用户立即查看页面，而无需等待客户端下载、解析和执行呈现页面所需的 JavaScript。
- **搜索引擎优化和社交网络可共享性**：搜索引擎机器人可以使用呈现的 HTML 来索引您的页面，社交网络机器人可以使用呈现的 HTML 为您的页面生成社交卡预览。
- **流式传输**：服务器组件允许您将渲染工作拆分为多个块，并在准备就绪时将其流式传输到客户端。这样，用户就可以提前看到页面的各个部分，而不必等待整个页面在服务器上渲染完成。

### 1.2服务端组件如何呈现的

在服务器上，Next.js 使用 React 的 API 来协调渲染。渲染工作被分成几个部分：按单个路由段和[Suspense Boundaries]。

每个块的渲染分为两个步骤：

1. React 将服务器组件渲染为一种特殊的数据格式，称为**React 服务器组件负载（RSC Payload）**。
2. Next.js 使用 RSC Payload 和客户端组件 JavaScript 指令在服务器上呈现**HTML 。**

然后，在客户端上：

1. HTML 用于立即显示路线的快速非交互式预览 - 这仅适用于初始页面加载。
2. React Server Components Payload 用于协调客户端和服务器组件树，并更新 DOM。
3. JavaScript 指令用于[水合](https://react.dev/reference/react-dom/client/hydrateRoot)客户端组件并使应用程序具有交互性。

> 什么是 React 服务器组件有效负载 (RSC)？
>
> RSC Payload 是渲染的 React Server Components 树的紧凑二进制表示。React 在客户端使用它来更新浏览器的 DOM。RSC Payload 包含：
>
> - 服务器组件的渲染结果
> - 客户端组件应呈现的位置的占位符以及对其 JavaScript 文件的引用
> - 从服务器组件传递到客户端组件的任何 props

### 1.3服务器渲染策略

服务器渲染有三个子集：静态、动态和流式。

> **静态渲染（默认）**

默认情况下，所有服务端组件都是静态渲染的。 使用静态渲染时，next.js会将渲染结果缓存起来，并可以推送到CDN、redis等缓存中，以提高性能。

> **动态渲染**

所谓的动态渲染其实就是在渲染之前进行了数据请求，或者使用到了next.js的server api, 比如：

- fetch()，使用fetch()获取数据
- headers(), 使用headers()获取请求头中的信息
- cookies()，使用cookies()获取cookie中的信息
- searchParams，使用searchParams获取url中的query参数 这些api后续会单独讲解，这里先简单了解一下即可。

由于这些数据是运行时才能获取到的，并不能在编译阶段获取，所以这些数据没办法被静态缓存。

**切换到动态渲染**

在渲染过程中，如果发现动态函数或未缓存的数据请求，Next.js 将切换到动态渲染整个路由。下表总结了动态函数和数据缓存如何影响路由是静态渲染还是动态渲染：

| 动态函数 | 数据   | 路线     |
| -------- | ------ | -------- |
| 不       | 已缓存 | 静态渲染 |
| 是的     | 已缓存 | 动态渲染 |
| 不       | 未缓存 | 动态渲染 |
| 是的     | 未缓存 | 动态渲染 |

在上表中，要使路由完全静态，必须缓存所有数据。但是，您可以拥有一个使用缓存和非缓存数据提取的动态呈现路由。

作为开发人员，您无需在静态渲染和动态渲染之间做出选择，因为 Next.js 会根据所使用的功能和 API 自动为每条路由选择最佳渲染策略。相反，您可以选择何时缓存或重新验证特定数据，并且您可以选择流式传输UI 的各个部分。

**动态函数**

动态函数依赖于只能在请求时知道的信息，例如用户的 Cookie、当前请求标头或 URL 的搜索参数。在 Next.js 中，这些动态 API 包括：

- [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [`headers()`](https://nextjs.org/docs/app/api-reference/functions/headers)
- [`unstable_noStore()`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
- [`unstable_after()`](https://nextjs.org/docs/app/api-reference/functions/unstable_after)：
- [`searchParams`支柱](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)

使用其中任何一项功能都会在请求时将整个路线选择为动态渲染。

### 1.4流媒体

![该图显示了流式传输过程中路线段的并行化，显示了各个块的数据获取、渲染和水化。](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202410062335843.png)

流式传输可让您从服务器逐步渲染UI。工作被拆分成多个块，并在准备就绪时流式传输到客户端。这样，用户就可以在整个内容渲染完成之前立即看到页面的某些部分。

![图表显示了客户端上部分呈现的页面，并加载正在流式传输的块的 UI。](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202410062336153.png)

默认情况下，流式传输内置于 Next.js 应用路由器中。这有助于改善初始页面加载性能，以及依赖于较慢数据提取的 UI，因为较慢的数据提取会阻止渲染整个路由。例如，产品页面上的评论。

您可以使用React Suspense`loading.js`中的 UI 组件开始流式传输路线段。

### 1.5避免使用浏览器api

虽然next.js支持组件在服务端进行渲染，但是如果你在服务端组件中使用了浏览器api，那么会导致服务端组件无法正常渲染。

这一点在开发中很容易被忽略，各位小伙伴可以多注意一下。

### 1.6use server

next.js默认就是server component，但是并不会在编写代码时提示错误使用api的风险。为了避免我们使用浏览器api，next.js提供了use server关键字，它可以帮助我们检测到不安全的api使用。

```js
"use server"
export default function Home() {
    const [count, setCount] = useState(0);
    // 由于server端不允许使用react/client 相关的api，所以这里会报错

    useEffect(() => {
    }, [])

    return <div>{count}</div>;
}
```

## 2.客户端组件

客户端组件允许您在服务器上编写可交互的 UI，并可以使用浏览器api。

### 2.1客户端渲染优势

- **交互性**：客户端组件可以使用state、effects和事件监听器，这意味着它们可以向用户提供即时反馈并更新 UI。
- **浏览器 API**：客户端组件可以访问浏览器 API，例如geolocation或localStorage。

### 2.2在next中使用客户端组件

要使用客户端组件，您可以添加`"use client"`指令在文件最顶部，在导入内容之上。

`"use client"`用于声明服务器和客户端组件模块之间的边界`"use client"`。这意味着，通过在文件中定义，导入到其中的所有其他模块（包括子组件）都被视为客户端包的一部分。

```tsx
'use client'
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

下面的图表显示，如果没有定义"use client"指令，那么在嵌套组件（toggle.js）中使用onClick和useState将会引发错误。这是因为，默认情况下，App Router中的所有组件都是服务器组件，这些API是不可用的。通过在toggle.js中定义"use client"指令，你可以告诉React进入客户端边界，这样这些API就可用了。

![Use Client Directive and Network Boundary](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202410062351924.png)

> 使用建议：
>
> 您可以在React组件树中定义多个“use client”入口点。这使您可以将应用程序拆分为多个客户端捆绑包。
>
> 然而，不需要在需要在客户端渲染的每个组件中定义“use client”。一旦定义了边界，所有子组件和模块都被视为客户端捆绑包的一部分。

### 2.3客户端组件如何渲染

在Next.js中，客户端组件的渲染方式取决于请求是属于完整页面加载（即首次访问应用程序或由浏览器刷新触发的页面重新加载）还是后续导航。

> **整页加载**

为了优化初始页面加载，Next.js将使用React的API在服务器上渲染静态的HTML预览，用于客户端和服务器端组件。这意味着当用户首次访问您的应用程序时，他们将立即看到页面的内容，而无需等待客户端下载、解析和执行客户端组件的JavaScript包。

在服务器端：

1. React将服务器组件渲染为一种特殊的数据格式，称为React服务器组件有效载荷（RSC Payload），其中包含对客户端组件的引用。
2. Next.js使用RSC有效载荷和客户端组件的JavaScript指令，在服务器上渲染路由的HTML。

然后，在客户端：

1. 使用HTML来立即显示路由的快速非交互式初始预览。
2. 使用React服务器组件有效载荷来协调客户端和服务器组件树，并更新DOM。
3. 使用JavaScript指令来hydrate客户端组件并使其用户界面交互。

> 什么是hydration？
>
> Hydration是将事件监听器附加到DOM上，使静态HTML变得交互的过程。在幕后，通过使用hydrateRoot React API来完成hydration的操作。

> **后续导航**

在后续的导航中，客户端组件完全在客户端上渲染，而不是服务器上渲染的HTML。

这意味着客户端组件的JavaScript捆绑包被下载并解析。一旦捆绑包准备就绪，React将使用RSC Payload来协调客户端和服务器组件树，并更新DOM。

### 2.4回到服务器环境

有时，在声明了“使用客户端”边界后，你可能想返回到服务器环境。例如，你可能想减小客户端捆绑文件大小，在服务器上获取数据，或使

用仅在服务器上可用的API。

即使在理论上嵌套在客户端组件内，你仍可以在服务器上保留代码，通过交错使用客户端和服务器组件以及服务器操作。更多信息请参阅组合

模式页面。

### 2.5避免嵌套服务端组件

客户端组件中是禁止嵌套服务端组件的，但是服务端组件中是可以嵌套客户端组件。

## 3.混合组件模式

在构建React应用程序时，您需要考虑应该在服务器端或客户端呈现应用程序的哪些部分。本页面介绍了在使用服务器端和客户端组件时的一些推荐组合模式。

### 3.1服务端组件和客户端组件的使用时机

以下是服务器和客户端组件的不同使用情况的简要总结：

| 场景                       | 服务端 | 客户端 |
| :------------------------- | :----- | :----- |
| 请求接口                   | ✅      | ❌      |
| 操作node api               | ✅      | ❌      |
| 访问浏览器 api             | ❌      | ✅      |
| 使用react hooks            | ❌      | ✅      |
| 使用react class components | ❌      | ✅      |

2. 混合使用

```jsx
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
    let [isOpen, setIsOpen] = useState(false)
    
    return (
        <div>
            <button onClick={() => setIsOpen(true)}>View pictures</button>
            {isOpen && <Carousel />}
        </div>
    )
}
```

上述的代码其实会报错，因为默认情况下，所有的组件都是服务端组件，由于服务端组件不能使用react hooks, 所以会报错。 因此我们需要对此进行改造。

Gallery:

```jsx
import CarouselComponent from './CarouselComponent';
export default function Gallery() {
    return (
        <div>
            <CarouselComponent />
        </div>
    )
}
```

CarouselComponent:

```jsx
"use client"
import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function CarouselComponent() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpen(true)}>View pictures</button>
            {isOpen && <Carousel />}
        </>
    )
}
```

上述的改造中，其实就是一种服务端组件嵌套客户端组件的模式，这种方式是允许的，相反客户端组件嵌套服务端组件不被允许。

```jsx
'use client'
 import ServerComponent from './Server-Component'
 
export default function ClientComponent({ children }) {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ServerComponent />
    </>
  )
}
```

上述代码中，`ServerComponent` 是服务端组件，因此不能在客户端组件中引入，所以会报错。 我们也可以通过插槽的方式，将服务端组件嵌套在客户端组件中，这种方式是允许的。

客户端组件:

```jsx
'use client'
import { useState } from 'react'
export default function ClientComponent({ children }) {
    const [count, setCount] = useState(0)
    return (
        <>
            <button onClick={() => setCount(count + 1)}>{count}</button>
            {children}
        </>
    )
}
```

服务端组件：

```jsx
import ClientComponent from './client-component'
import ServerComponent from './server-component'

export default function Page() {
    return (
        <ClientComponent>
            <ServerComponent />
        </ClientComponent>
    )
}
```

# 内置组件

## 1.`Image`

- 布局稳定性：加载图像时布局不会发生偏移。
- 懒加载，只有当图片进入视口后，图片才会加载。

```jsx
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
  )
}
```

属性：

| Name              | Type       | Default | required | Description                      |
| :---------------- | :--------- | :------ | :------- | :------------------------------- |
| src               | `string`   | -       | 必填     | 图像的 URL                       |
| width             | `number`   | -       | -        | 图像的宽度（px）                 |
| height            | `number`   | -       | -        | 图像的高度（px）                 |
| alt               | `string`   | -       | -        | 图像的替代文本                   |
| loader            | `function` | -       | -        | 自定义加载器                     |
| fill              | `boolean`  | -       | -        | 图像是否应填充容器               |
| sizes             | `string`   | -       | -        | 图像的尺寸                       |
| quality           | `number`   | -       | -        | 图像质量（1-100）                |
| priority          | `boolean`  | -       | -        | 图像是否应具有高优先级           |
| placeholder       | `string`   | -       | -        | 占位符，在图像加载之前显示       |
| style             | `object`   | -       | -        | 图像的样式                       |
| onLoadingComplete | `function` | -       | -        | 图像加载完成时调用               |
| onLoad            | `function` | -       | -        | 图像加载时调用                   |
| onError           | `function` | -       | -        | 图像加载失败时调用               |
| loading           | `string`   | -       | -        | 图像加载时使用的 HTML 属性       |
| blurDataURL       | `string`   | -       | -        | 图像的占位符，在图像加载之前显示 |

## 2.`Link`

`<Link>` 是一个 React 组件，用于路由跳转。

```jsx
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

属性：

| Name     | Type             | Default | required     | Description                    |
| :------- | :--------------- | :------ | :----------- | :----------------------------- |
| href     | String or Object | Yes     | 字符串或对象 |                                |
| replace  | Boolean          | -       | 布尔         |                                |
| scroll   | Boolean          | -       | 布尔         | 跳转页面时是否滚动到顶部       |
| prefetch | Boolean or null  | -       | 布尔或null   | 当组件进入视口时是否预加载页面 |

## 3.`Script`

加载js脚本文件。

```jsx
import Script from 'next/script'
 
export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

属性：

| Name     | Type     | Default | required | Description                                                  |
| :------- | :------- | :------ | :------- | :----------------------------------------------------------- |
| src      | string   |         | true     | 脚本文件地址                                                 |
| strategy | string   |         | false    | 加载策略，可选值：`beforeInteractive`、`afterInteractive`、`lazyOnload`、`worker` |
| onLoad   | function |         | false    | 加载完成回调函数                                             |
| onReady  | function |         | false    | 加载完成回调函数                                             |
| onError  | function |         | false    | 加载失败回调函数                                             |

# API

# 客户端API

## 1.useParams

`useParams` 是一个客户端组件的hook，可以让你读取由当前 URL 路由的query参数。

```jsx
'use client'
 
import { useParams } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const params = useParams()
 
  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)
 
  return <></>
}
```

例如：

| Router             | Url       | Params                    |
| :----------------- | :-------- | :------------------------ |
| /shop              | /shop     | `{}`                      |
| /shop/[slug]       | /shop/1   | `{ slug: '1' }`           |
| /shop/[tag]/[item] | /shop/1/2 | `{ tag: '1', item: '2' }` |
| /shop/[...slug]    | /shop/1/2 | `{ slug: ['1', '2'] }`    |

## 2.usePathname

usePathname 是一个客户端组件的hook，可用于读取当前 URL 的路径。

```jsx
'use client'
 
import { usePathname } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>Current pathname: {pathname}</p>
}
```

例如：

| Url               | Value             |
| :---------------- | :---------------- |
| /                 | /                 |
| /dashboard        | /dashboard        |
| /dashboard?v=2    | /dashboard        |
| /blog/hello-world | /blog/hello-world |

## 3.useRouter

useRouter 允许你以编程方式更改客户端组件中的路由。

```jsx
'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

相关API：

- `router.push(href: string, { scroll: boolean })`: 跳转到新的路由。
- `router.replace(href: string, { scroll: boolean })`：跳转路由，不会添加到历史堆栈中。
- `router.refresh()`：刷新当前页面，并向服务器发出新请求、重新获取数据请求以及重新呈现服务器组件。
- `router.prefetch(href: string)` ：预加载指定的路由，以便更快地进行客户端转换。
- `router.back()` ：返回浏览器历史记录堆栈中的上一个路由。
- `router.forward()` ：向前跳转到浏览器历史记录堆栈中的下一页。

## 4.延迟加载

next.js 允许你延迟加载客户端组件和导入的库，仅在需要时才会加载它们。

1. dynamic()

```tsx
'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
 
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
 
export default function ClientComponentExample() {
    const [showMore, setShowMore] = useState(false)

    return (
        <div>
            <ComponentA />
        
            {showMore && <ComponentB />}
            <button onClick={() => setShowMore(!showMore)}>Toggle</button>

            <ComponentC />
        </div>
    )
}
```

上述代码动态加载了三个组件，ComponentA、ComponentB 和 ComponentC。

其中 ComponentA 和 ComponentB 是在 SSR 阶段进行的渲染，ComponentC 则是在客户端运行时进行的渲染。

2. ssr 阶段延迟加载的意义

默认情况下，dynamic 的组件是在 SSR 阶段进行渲染，可能有的小伙伴会问，这样做的意义是什么呢？

- 流式加载，首先，ssr延迟加载，可以避免因为某个组件加载时间过长，而导致整个页面加载时间过长。
- 代码分割，其次，可以将客户端组件的 bundle 进行更细粒度的拆分，避免单个 bundle 过大，进而影响页面的加载速度。

3. 跳过 ssr

其实某些情况下，我们并不希望组件在 SSR 阶段进行渲染，而是期望在客户端运行时进行渲染，进而减少 SSR 阶段的渲染时间，提高页面的加载速度，我们可以使用 ssr 参数来进行控制。

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

4. 自定义加载动画

我们也可以自定义加载动画，通过 dynamic 的 loading 参数来进行设置。

```jsx
import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
    () => import('../components/WithCustomLoading'),
    {
        loading: () => <p>Loading...</p>,
    }
)

export default function Page() {
    return (
        <div>
            <WithCustomLoading />
        </div>
    )
}
```

5. 加载第三方库

上边我们介绍了如何延迟加载客户端组件，那么如何延迟加载第三方库呢？

很简单，通过 `import()` 函数就能实现第三方库的延迟加载，进而避免在 SSR 阶段加载不必要的第三方库。

```jsx
'use client'
import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']
 
export default function Page() {
    const [results, setResults] = useState()
    
    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                onChange={async e => {
                    const { value } = e.currentTarget

                    const Fuse = (await import('fuse.js')).default

                    const fuse = new Fuse(names)
                    setResults(fuse.search(value))
                }}
            />
            <pre>Results: {JSON.stringify(results, null, 2)}</pre>
        </div>
    )
}
```

# 服务端API



## 1.fetch

Next.js 扩展了 Web api 的 fetch() API，允许服务器上的每个请求设置自己的持久性缓存。

```jsx
export default async function Page() {
  // `force-cache` 是默认的参数，可以忽略
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })
 
  // 这个请求不会被缓存
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })
 
  // 此请求会被缓存10秒
  const revalidatedData = await fetch(`https://...`, {next: { revalidate: 10 }})
 
  return <div>...</div>
}
```

> options配置

1. options.cache

```jsx
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

- `force-cache`: (默认)，强制缓存。
- `no-store`: 不缓存。

2. options.next.revalidate

```jsx
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

设置资源的缓存生存期（以秒为单位）。

- `false`, 无限期缓存资源。
- `0`, 防止资源被缓存。
- `number`, （以秒为单位）指定资源的缓存生存期应为最多 n 秒。

3. options.next.tags

```jsx
fetch(`https://...`, { next: { tags: ['collection'] } })
```

设置资源的缓存标签。可以使用 revalidateTag 重新验证数据。自定义标签的最大长度为 256 个字符。

## 2.cookies

next.js允许你通过 `cookies()` 函数从服务器组件读取 HTTP 传入请求 cookie，同时也支持写入 cookie。

1. cookies().get(name)

从cookies中获取指定名称的cookie值。

```jsx
import { cookies } from 'next/headers'
 
export default function Page() {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

2. cookies().getAll()

从cookies中获取所有cookie值。

3. cookies().has(name)

判断指定名称的cookie是否存在。

4. cookies().set(name, value, options)

设置指定名称的cookie值。

```jsx
'use server'
 
import { cookies } from 'next/headers'
 
async function create(data) {
  cookies().set('name', 'lee')
  cookies().set('name', 'lee', { secure: true })
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```



- `options.maxAge`: 设置cookie的过期时间，单位为秒。
- `options.expires`: 设置cookie的过期时间戳，相比maxAge，expires是一个绝对时间，但是可能会收到时区影响。

5. cookies().delete(name)

删除指定名称的cookie。

## 3.headers

next.js允许你通过 `headers()` 函数从服务器组件读取 HTTP 头，同时支持操作响应头。

```jsx
import { headers } from 'next/headers'
 
export default function Page() {
  const headersList = headers()
  const referer = headersList.get('referer')
 
  return <div>Referer: {referer}</div>
}
```

headers 返回一个只读的 Web Headers 对象。

- `Headers.entries()`: 返回一个 iterator 允许遍历此对象中包含的所有键/值对的权限。
- `Headers.forEach()`: ：为此 Headers 对象中的每个键/值对执行一次提供的函数。
- `Headers.get()`: 返回具有给定名称的 Headers 对象中标头的所有值 String 的序列。
- `Headers.has()`: 返回一个布尔值，说明 Headers 对象是否包含某个标头。
- `Headers.keys()`: 返回一个 iterator 允许您遍历此对象中包含的键/值对的所有键。
- `Headers.values()`: 返回允许您 iterator 遍历此对象中包含的键/值对的所有值。

## 4.middleware

next.js允许你在请求完成之前，编写中间件。你可以重写、重定向、修改请求或响应标头。

1. 目录结构

middleware.js 文件必须放放在和app目录同级的目录中。

```txt
src
├── app
├── middleware.ts
```



```jsx
import { NextResponse } from 'next/server'
 
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: '/about/:path*',
}
```

2. config.matcher

你可以使用config.matcher来匹配请求, 只有匹配的请求才会执行中间件。

```jsx
export const config = {
    // 只有/about和/contact请求才会执行中间件
    matcher: ['/about', '/contact'],
    // 正则匹配，排除api、_next/static、_next/image、*.png请求
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
```

3. 修改请求

重写请求

```jsx
import { NextResponse } from 'next/server'
 
export function middleware(request) {
    const {pathname} = request.nextUrl;

    // 重写请求
    if (pathname.startsWith('/tk/')) {
        return NextResponse.rewrite(new URL(pathname.replace(/^\/tk/, ''), request.url));
    }
}

export const config = {
    matcher: '*'
}
```

修改请求头

```jsx
export function middleware(request: NextRequest) {
    // 修改请求头
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Language', 'zh');
    return NextResponse.next(
        {request: {headers: requestHeaders}}
    );
}

export const config = {
    matcher: '*'
}
```

## 5.RESTful API

RESTful API 是一种用于构建网络应用程序的软件架构风格, 基于REST原则设计的应用程序接口，用于在客户端和服务器之间进行通信。 这里不做过多介绍，有兴趣的读者可以自行搜索。

NestJS 提供了开箱即用的 RESTful API, 我们只需要定义好路由文件，就可以直接使用。

1. route.js

route.js 和 page.js 文件一样，都是用来定义路由的， 不同之处在于 route.js 文件是用来定义 RESTful API，而 page.js 文件是用来定义页面UI的。

一般，我们会将所有的route.js文件放在 `src/app/api` 目录下，

```txt
src
├── app
│   ├── api
│   │   ├── user
|   │   │   └── route.ts
│   └── layout.tsx
```

当我们访问 `/api/user` 的时候，就会自动执行 `src/app/api/user/route.ts` 文件内部的代码。

src/app/api/user/route.ts

```ts
export async function GET(request: Request) {}
 
export async function HEAD(request: Request) {}
 
export async function POST(request: Request) {}
 
export async function PUT(request: Request) {}
 
export async function DELETE(request: Request) {}
 
export async function PATCH(request: Request) {}
 
export async function OPTIONS(request: Request) {}
```

以get请求为例，

src/app/api/user/[id]/route.ts

```ts
export async function GET(request, context: { params }) {
    const id = params.id
    const user = await db.user.findOne({ id })
    return NextResponse.json(user, { status: 200 })
}
```

route.js 也支持动态路由`src/app/api/user/[id]/route.ts`， 当用户请求 `/api/user/1` 的时候，就会执行上述的 `GET` 函数, `params.id` 就会等于 `1`， 然后可以通过 `params.id` 获取到用户信息，最后使用 `NextResponse.json` 返回给前端。

## 6.NextResponse

1. new NextResponse()

new NextResponse(body, options) 构造函数创建了一个新的 Response 对象。 body 可以是:

- Blob
- Buffer
- FormData
- ReadableStream
- URLSearchParams
- String

```ts
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    return new NextResponse('Hello world', {status: 200})
}
```

2. NextResponse.json()

返回json格式的响应

```ts
import { NextResponse } from 'next/server'
 
export async function middleware(request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

3. NextResponse.redirect()

重定向到指定url

```ts
import { NextResponse } from 'next/server'
 
export async function middleware(request) {
    return NextResponse.redirect(new URL('/new', request.url))
}
```

4. NextResponse.rewrite()

重写请求

```ts
import { NextResponse } from 'next/server'
 
export async function middleware(request) {
    return NextResponse.rewrite(new URL('/proxy', request.url))
}
```

5. NextResponse.next()

继续执行下一个中间件，同时返回响应

```ts
import { NextResponse } from 'next/server'
 
export async function GET(request) {
    const response = NextResponse.next()
    response.cookies.set('show-banner', 'false')
    return response;
}
```

## 7.notFound

调用该 `notFound()` 函数会引发 `NEXT_NOT_FOUND` 错误，并终止后续的路由处理。 通过指定一个 `not-found` 文件，当触发 `NEXT_NOT_FOUND` 错误时，会使用 `not found` UI 来优雅地处理此类错误。

```tsx
"use server"
import { notFound } from 'next/navigation'
 
async function fetchUser(id) {
    const res = await fetch('https://...')
    if (!res.ok) return undefined
    return res.json()
}

export default async function Profile({ params }) {
    const user = await fetchUser(params.id)
    
    if (!user) {
        notFound()
    }
    //   ...
}
```

## 8.redirect

该 `redirect()` 允许你将用户重定向到另一个 URL。 redirect 可以在服务器组件、路由处理程序和服务器操作中使用。

例如：

```tsx
// app/team/[id]/page.js
import { redirect } from 'next/navigation'
 
async function fetchTeam(id) {
    const res = await fetch('https://...')
    if (!res.ok) return undefined
    return res.json()
}

export default async function Profile({ params }) {
    const team = await fetchTeam(params.id)
    if (!team) {
        redirect('/login')
    }

    // ...
}
```

> 重定向状态码

先来帮助大家复习一下常见的重定向状态码：

- 301：表示请求的资源已永久移动到新位置。
- 302：表示请求的资源临时移动到新位置。
- 307：与302类似，表示请求的资源临时移动到新位置。
- 308：与301类似，表示请求的资源永久移动到新位置。

我们发现301和307，302和308很相似，但是也存在一些本质的差别，这也是面试中经常会被问到的问题：

许多浏览器在使用 301、302 时会将将重定向的请求方法从 POST 更改为 GET，而不管源请求方法如何, 最严重的是 POST 的body会丢失。 而 307 和 308 不会改变请求的方法，请求是POST, 重定向后还是POST。

```
而在 next.js 中的redirect()方法默认采用的是307临时重定向
```

# 服务端数据

## 1.generateMetadata

Next.js允许你使用 `generateMetadata` 生成metadata，以提高 SEO。

app/layout.tsx|page.tsx

```tsx
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
    title: '...',
    description: '...',
}

export default function Page() {}
```

> 动态 metadata

有时候，我们希望 metadata 根据当前页面的特定信息来动态生成，例如当前路由参数、外部数据等信息，通过 generateMetadata 函数即可实现。

```tsx
// app/[id]/layout.tsx|page.tsx
export async function generateMetadata({ params }) {
    const id = params.id

    const product = await fetch(`https://.../${id}`).then((res) => res.json())

    return {
        title: product.title,
        description: product.description
    }
}

export default function Page({ params }) {}
```

## 2.generateSitemaps

Sitemap（网站地图）是一个XML文件，用于向搜索引擎提供有关网站上所有可访问页面的信息。 它列出了网站中的各个页面，帮助搜索引擎了解网站的结构和内容，以更好地进行索引和排名。

```js
// app/sitemap.xml
import { BASE_URL } from '@/app/lib/constants'
 
export default async function sitemap() {
    return [
        {
            url: 'https://tk.chdl.com',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://tk.chdl.com/zh',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://tk.chdl.com/en',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }
    ]
}
```

## 3.generateStaticParams

generateStaticParams 函数在构建时会生成静态路由，而不是在请求时按需生成路由。

可能有人会问，使用 generateStaticParams 函数有什么好处？

- 由于在构建构建阶段就生成了静态路由，所以可以使用缓存，提升页面加载速度。
- 同时，相比于动态路由，静态路由可以提升路由匹配的效率。

1. 单个路由段

```tsx
// app/blog/[slug]/layout.js
export async function generateStaticParams() {
    const posts = await fetch('https://.../posts').then((res) => res.json())
    
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export default function Layout({ params }) {
    const { slug } = params
}
```

2. 嵌套路由段

```tsx
// app/products/[category]/[product].js
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// - /products/a/1
// - /products/b/2
// - /products/c/3
export default function Page({params}) {
    const { category, product } = params
    // ...
}
```

# SEO

## 1.metadata

在搜索引擎优化（SEO）中，Metadata（元数据）是指在网页的代码中提供的用于描述网页内容的一些标签和属性。 这些元数据对于搜索引擎来理解网页内容和显示搜索结果非常重要。

以下是与SEO相关的一些常见元数据：

- Title（标题）：在`<title>`标签中定义，是网页的标题。搜索引擎会将标题作为搜索结果的标题显示，同时也是搜索引擎确定网页主题的重要指标。
- Meta Description（描述）：在 `<meta name="description" content="描述内容">` 标签中定义，是对网页内容的简短描述。搜索引擎会将描述显示在搜索结果中,对于吸引用户点击非常重要。
- Meta Keywords（关键词）：在 `<meta name="keywords" content="关键词1, 关键词2, ...">` 标签中定义，是用于描述网页关键词的列表。虽然大多数搜索引擎不再重视关键词元数据，但仍有一些搜索引擎会参考它们。

> 如何在next.js中添加元数据

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '...',
    description: '...',
    keywords: '...'
}

export default function Page() {}
```

上述代码中，`metadata` 变量是一个对象，用于定义网页的元数据。

## 2.sitemap.xml

Sitemap（网站地图）是一个XML文件，用于向搜索引擎提供有关网站上所有可访问页面的信息。 它列出了网站中的各个页面，帮助搜索引擎了解网站的结构和内容，以更好地进行索引和排名。

> 如何在next.js中添加sitemap.xml

```tsx
// app/sitemap.xml
import { BASE_URL } from '@/app/lib/constants'
 
export default async function sitemap() {
    return [
        {
            url: 'https://tk.chdl.com',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://tk.chdl.com/zh',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://tk.chdl.com/en',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }
    ]
}
```

## 3.robots.txt

Robots.txt是一个文本文件，用于告诉搜索引擎爬虫如何访问和抓取网站的内容。它位于网站的根目录下，通过指定特定的规则来控制搜索引擎爬虫的行为。

Robots.txt文件允许网站管理员指定哪些页面可以被搜索引擎爬取，以及哪些页面应该被忽略。 它的作用是帮助搜索引擎了解网站的结构，并根据指令来决定是否抓取和索引特定页面。

以下是一个简单的Robots.txt文件的示例：

public/robots.txt

```
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

Sitemap: https://example.com/sitemap.xml
```

robots.txt文件一般放在 `public` 目录下，打包后可以直接通过URL访问。

在上面的示例中，

- User-agent: *表示适用于所有搜索引擎爬虫。
- Disallow指令用于指定不希望搜索引擎抓取的页面或目录，例如/admin/和/private/。
- Allow指令用于指定允许搜索引擎抓取的页面或目录，例如/public/。

Robots.txt文件还可以包含其他指令，并且可以针对不同的搜索引擎爬虫指定不同的规则。 此外，文件中可以包含一个或多个Sitemap指令，用于指定网站的Sitemap文件的URL，帮助搜索引擎发现和索引网站的内容。

需要注意的是，robots.txt文件仅作为一个建议，而不是强制性规则。一些搜索引擎爬虫可能会尊重Robots.txt文件，但也有一些爬虫会忽略它。 因此，敏感信息或重要内容不应仅依赖于Robots.txt文件来保护，建议使用其他措施来确保其安全性。

# 配置

## 1.next.config.js

Next.js可以通过项目目录根目录中的 next.config.js 文件进行项目配置。

1. assetPrefix

用于配置静态资源的前缀。

```js
const isProd = process.env.NODE_ENV === 'production'
 
module.exports = {
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
}
```

2. basePath

用于配置部署项目的前缀。

```js
module.exports = {
  basePath: '/docs',
}
```

3. compress

当使用next start启动项目时，默认会开启gzip压缩。

```js
module.exports = {
  compress: true
}
```

4. distDir

用于配置编译后的文件输出目录。

```js
module.exports = {
  distDir: 'dist',
}
```

5. eslint

```js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // 忽略在构建时出现的错误
  }
}
```

6. generateEtags

用于配置是否生成ETag, 默认是开启的。

```js
module.exports = {
  generateEtags: true,
}
```

7. output

用于配置编译后的文件输出类型, 默认是standalone表示使用next.js的内嵌式运行时; export表示生成静态化文件，然后通过nginx等服务进行静态化文件的部署。

```js
module.exports = {
  output: 'standalone | export',
}
```

8. typescript

用于配置typescript的编译。

```js
module.exports = {
    typescript: {
        ignoreBuildErrors: true // 忽略ts构建错误
    },
}
```

## 2.环境变量

Next.js 内置了对从 .env.local 环境变量的支持。

.env.local

```.env
TWITTER_USER=nextjs
TWITTER_URL=https://twitter.com/$TWITTER_USER
```

1. 区分生产环境与开发环境

Next.js允许您在 .env.development(开发环境) 和 .env.production(生产环境)中设置默认值。

> 需要注意的是： .env、 .env.development 和 .env.production 应该包含在您的存储库中，因为它们一般定义的是默认值。 .env*.local 则应添加到 .gitignore 中，因为 .env.local 一般用来存储敏感信息。

2. 浏览器环境

如果你需要访问浏览器环境中的变量，请使用 NEXT_PUBLIC_ 前缀。 非 NEXT_PUBLIC_ 环境变量仅在Node.js环境中可用，这意味着浏览器无法访问它们。

.env:

```.env
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

然后，你可以在客户端代码中使用它们。

```jsx
import setupAnalyticsService from '../lib/my-analytics-service'
 
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)
 
function HomePage() {
    return <h1>Hello World</h1>
}

export default HomePage
```

# 构建

构建 Next.js 应用可以直接使用 `npm run build` 命令，构建完成后，会在根目录下生成一个 `.next`(该输出目录可以手动修改) 文件夹。

以下是我在实践过程中总结的一些构建优化配置，仅供参考。

next.config.js

```js
import bundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';

// 用于分析 Next.js 应用打包后的文件大小（可选）
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
    analyzerMode: 'static'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: isProd ? 'dist' : '.next',
    assetPrefix: isProd ? '/next' : '/next',
    cacheMaxMemorySize: 60 * 1024, // 设置缓存最大内存为60MB，可以根据实际情况调整
    typescript: {
        ignoreBuildErrors: true // 忽略ts构建错误
    },
    eslint: {
        ignoreDuringBuilds: true // 忽略eslint构建错误
    }
};

export default withBundleAnalyzer(nextConfig);
```

上述代码中，我使用了 `@next/bundle-analyzer` 插件，可以分析 Next.js 应用打包后的文件大小。 其实 Next.js 本身的代码分割功能已经足够强大，不需要我们再做额外的优化，但是不排除有用户关心打包后的文件大小，所以这里给出了一个简单的配置。

1. 安装 `@next/bundle-analyzer` 插件：`npm i @next/bundle-analyzer`
2. 在 `package.json` 中添加 `"analyze": "ANALYZE=true next build"` 命令，用于开启分析功能
3. 运行 `npm run analyze` 命令，查看分析结果

# 部署

## 1.静态部署

静态部署的前提是，你的网站是静态的，在代码中没有使用特定的server api。

如果您的网站是静态的，那么您可以使用静态部署

1. 首先，在 next.config.js 中配置output为export模式，表示静态导出资源。
2. 将输出的资源部署到静态服务器上，比如nginx，简单配置如下：

```nginx


http {
    map $sent_http_content_type $cache_control {
        ~.*html 'no-cache, no-store';
        ~.*(css|javascript) 'max-age=31536000';
        default 'no-cache';
    }

    server {
        # 开启gzip压缩
        gzip        on;
        gzip_min_length 10k;
        gzip_http_version 1.1;
        gzip_buffers 32 4k;
        gzip_types  *;

        # 我们需要将seo相关的静态资源放在根路径下，否则无法被搜索引擎收录
        location ~ ^/(robots.txt|sitemap.xml) {
            rewrite /(.*) /prefix/$1 break;
            proxy_pass http://localhost:3000;
        }

        location /prefix/ {
            add_header Cache-Control $cache_control;
            alias /home/nginx/project/dist/;
        }
    }
}
```

`map $sent_http_content_type $cache_control` 其实是使用了nginx的变量，用于控制缓存，上述是http cache的最佳配置，可以放心使用。 简单介绍一下，如果请求的资源是html，那么将缓存设置为no-cache, no-store，表示不缓存; css、js资源设置为max-age=31536000，即缓存一年。

可能有的朋友会问为什么这么缓存呢？首先，需要知道的是，尽可能的使用http强缓存可以减少网络传输的损耗，但是不能无限制使用强缓存，如果资源更新了，那么会导致浏览器无法获取到最新的资源。

那么如何尽可能解决http强缓存这个问题呢？很简单，html资源始终不缓存，css、js资源缓存一年即可。当html资源更新了，那么浏览器会去请求最新的html资源，然后html会间接请求最新的css、js资源，因为css、js文件每次构建都会生成一个唯一的hash，只要确保了html是最新的，那么css、js资源也一定是最新的。这样就可以解决http强缓存的问题。

nginx其实还有很多其他的优化配置，比如http2、proxy cache、负载均衡等，这里就不一一介绍了，后续如果有读者感兴趣，我会单独写一篇文章介绍。

## 2.pm2部署

PM2 是一个守护进程管理器，可帮助您管理和保持应用程序 24小时 在线。

1. 安装：`npm install pm2 -g`

2. 构建next.js应用：`npm run build`

3. 启动程序：

```
pm2 start npm --name nextApp -- run start
```

- 具体的格式为：`pm2 start npm --name <应用名> -- <npm后接命令>`

4. 查看进程：`pm2 ls`, 然后你将会看到如下输出： ![pm2 ls](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202408042352213.png)

5. 停止进程：`pm2 stop <应用名>`

6. 设置开机启动：`pm2 startup`

## 3.docker部署

>  dockerfile

```
FROM node:18-alpine as build-stage
RUN npm install pnpm -g
WORKDIR /app
COPY package.json package-lock.json pnpm-lock.yaml /app/
RUN pnpm install
COPY . .
RUN npm run build \
    & rm -rf src node_modules \
    & pnpm install --only=production
EXPOSE 3000
CMD [ "npm", "run", "start"]
```

简单讲解一下几个注意的点：

1. 将install和build分开，这样可以最大限度的利用缓存，提升构建速度。如果package.json、package-lock.json pnpm-lock.yaml这三个文件没有变化，那么pnpm install 这一步就可以直接使用缓存。
2. 为什么要删除src、node_modules？其实在生产环境下，我们只会使用到.next目录，所以我们需要删除一些体积较大的文件，比如src、node_modules。
3. 为什么又要使用 `pnpm install --only=production`, 因为只安装生产环境依赖，可以进一步减少构建的体积。

> 构建并启动容器

1. 构建镜像：`docker build -t next-app:1.0 .`

2. 启动容器：

   ```bash
   docker run \
       -d \
       --name my-next-app \
       -u root \
       -p 3000:3000 \
       --restart=always \
       next-app:1.0
   ```

   

3. 查看日志：`docker logs -f my-next-app`

4. 查看容器：`docker ps`



# 日志

## 日志等级

- Log：通用日志，按需进行记录（打印）
- Warning：警告日志，比如：尝试多次进行数据库操作
- Error：严重日志，比如：数据库异常
- Debug：调试日志，比如：加载数据日志
- Verbose：详细日志，所有的操作与详细信息（非必要不打印）

## 日志按照功能分类

- 错误日志：方便定位问题，给用户友好的提示
- 调试日志：方便开发
- 请求日志：记录敏感行为

## 日志记录位置

- 控制台日志：方便监看（调试用）
- 文件日志：方便回溯与追踪（24小时滚动）
- 数据库日志：敏感操作，敏感数据记录























