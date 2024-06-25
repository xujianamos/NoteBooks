# 1.搭建rollup项目

## 1.1新建工程

新建一个空文件夹，比如rollup-base-project,执行项目初始化:

```shell
npm init -y
```

## 1.2安装rollup

```shell
npm install rollup --save-dev
```

添加`.gitignore`:

```
.DS_Store
node_modules
/dist


# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## 1.3创建rollup.config.js

我们也可以不用配置文件直接用cli命令来打包，但是如果添加更多的选项，这种命令行的方式就显得麻烦。为此，我们可以创建配置文件来囊括所需的选项。配置文件由 JavaScript 写成，比 CLI 更加灵活。（cli命令打包请看官网介绍）

配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做`rollup.config.js`，它通常位于项目的根目录,下面是一些基础配置选项:

```js
export default {
  input:'./src/main.js',//入口文件
  output:{
    file:'./dist/bundle.js',//打包后的存放文件
    format:'cjs',//输出格式 amd es6 iife umd cjs
    name:'bundleName'//如果iife,umd需要指定一个全局变量
  }
}
```

> 注意：当我们指定配置文件时,`package.json`的`type`要指定成`module`,当`node`版本大大于13时，默认是以`ES Module`方式，所以要给了提示，要么在`package.json`文件中加入`type: module`，要么把配置文件的后缀名改成`rollup.config.mjs`

## 1.4编写要打包的文件

### 1.4.1新建src文件夹，并新建main.js(应用程序入口)

```js
import { name } from './modules/myModole';
console.log('hello' + name);
```

### 1.4.2新建modules文件夹（代表模块文件）

> modules的作用的区分模块和主入口，modules中可根据你自己的js库设计文件目录结构。

src/modules/myModole.js 文件内容:

```js
export const name = 'jiaHang'
export const age = 18

```

## 1.5编写package.json中的打包命令

在package.json中加一条script语句:

```json
{
  "name": "rollupDemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "rollup --config"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "rollup": "^2.45.2",
  }
}
```

## 1.6执行npm run build 查看文件输出结果

如果此时执行打包命令时，控制台报错：

![image-20240624225830172](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202406242258558.png)

错误大致意思：

Node 尝试将您的配置文件加载为 CommonJS，即使它很可能是 ES 模块。要解决此问题，请将配置的扩展名更改为“.mjs”，在 package.json 文件中设置“type”：“module”，或传递“--bundleConfigAsCjs”标志。

添加`--bundleConfigAsCjs`

```js
{
	"name": "rollup-tutorial",
	"version": "1.0.0",
	"scripts": {
		"build": "rollup --bundleConfigAsCjs -c"
	}
}
```

或添加`"type": "module",`

```js
{
	"name": "rollup-tutorial",
	"version": "1.0.0",
	"type": "module",
	"scripts": {
		"build": "rollup -c"
	}
}
```

# 2.rollup常用配置

## 2.1external

该选项用于匹配需要排除在 bundle 外部的模块，它的值可以是一个接收模块 `id` 参数并返回 `true` （表示外部依赖）或 `false` （表示非外部依赖）的函数，也可以是一个模块 ID 数组或者正则表达式。除此之外，它还可以只是单个的模块 ID 或正则表达式。被匹配的模块 ID 应该满足以下条件之一：

1. 外部依赖的名称，需要和引入语句中写法完全一致。例如，如果想标记 `import "dependency.js"` 为外部依赖，就需要使用 `"dependency.js"` 作为模块 ID；而如果要标记 `import "dependency"` 为外部依赖，则使用 `"dependency"`。
2. 解析过的模块 ID（如文件的绝对路径）。



## 2.2input

值类型：`string | string[] | { [entryName: string]: string }`

该选项用于指定 bundle 的入口文件（例如，你的 `main.js`，`app.js` 或 `index.js` 文件）。如果值为一个入口文件的数组或一个将名称映射到入口文件的对象，那么它们将被打包到单独的输出 chunks。除非使用 [`output.file`](https://www.rollupjs.com/configuration-options/#output-file) 选项，否则生成的 chunk 名称将遵循 [`output.entryFileNames`](https://www.rollupjs.com/configuration-options/#output-entryfilenames) 选项设置。当该选项的值为对象形式时，对象的属性名将作为文件名中的 `[name]`，而对于值为数组形式，数组的值将作为入口文件名。

请注意，当选项的值使用对象形式时，可以通过在名称中添加 `/` 来将入口文件放入不同的子文件夹。以下例子将根据 `entry-a.js` 和 `entry-b/index.js`，产生至少两个入口 chunks，即 `index.js`文件将输出在 `entry-b` 文件夹中：

```js
// rollup.config.js
export default {
    // ...
    input: {
        a: 'src/main-a.js',
        'b/index': 'src/main-b.js'
    },
    output: {
        // ...
        entryFileNames: 'entry-[name].js'
    }
};
```

## 2.3output

### 2.3.1dir

该选项用于指定所有生成的 chunk 被放置在哪个目录中。如果生成一个以上的 chunk，那么这个选项是必需的。否则，可以使用 `file` 选项来代替。

### 2.3.2file

该选项用于指定要写入的文件。如果适用的话，也可以用于生成 sourcemap。只有在生成的 chunk 不超过一个的情况下才可以使用。

### 2.3.3format

该选项用于指定生成的 bundle 的格式。满足以下其中之一：

- `amd` – 异步模块加载，适用于 RequireJS 等模块加载器
- `cjs` – CommonJS，适用于 Node 环境和其他打包工具（别名：`commonjs`）
- `es` – 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 `<script type=module>` 标签的浏览器。（别名：`esm`，`module`）
- `iife` – 自执行函数，适用于 `<script>` 标签（如果你想为你的应用程序创建 bundle，那么你可能会使用它）。`iife` 表示“自执行 [函数表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)”
- `umd` – 通用模块定义规范，同时支持 `amd`，`cjs` 和 `iife`
- `system` – SystemJS 模块加载器的原生格式（别名：`systemjs`）

### 2.3.4globals

该选项用于在 `umd` / `iife` bundle 中，使用 `id: variableName` 键值对指定外部依赖。例如，在这样的情况下：

```js
import $ from 'jquery';
```

我们需要告诉 Rollup `jquery` 是外部依赖，`jquery` 模块的 ID 为全局变量 `$`：

```js
// rollup.config.js
export default {
    // ...
    external: ['jquery'],
    output: {
        format: 'iife',
        name: 'MyBundle',
        globals: {
            jquery: '$'
        }
    }
};

/*
var MyBundle = (function ($) {
  // 这里编辑代码
}($));
*/
```

或者，可以提供一个函数，将外部模块的 ID 变成一个全局变量名。

### 2.3.5name

对于输出格式为 `iife` / `umd` 的 bundle 来说，若想要使用全局变量名来表示你的 bundle 时，该选项是必要的。同一页面上的其他脚本可以使用这个变量名来访问你的 bundle 输出。

```js
// rollup.config.js
export default {
    // ...
    output: {
        file: 'bundle.js',
        format: 'iife',
        name: 'MyBundle'
    }
};
```

### 2.3.6plugins

该选项用于指定输出插件。关于如何使用特定输出的插件，请查看 [使用输出插件](https://www.rollupjs.com/tutorial/#using-output-plugins)，关于如何编写自己的插件，请查看 [插件](https://www.rollupjs.com/plugin-development/)。对于从包中引入的插件，记得要调用引入的插件函数（即调用 `commonjs()`，而不仅仅是 `commonjs`）。返回值为假的插件将被忽略，这样可以用来灵活启用或禁用插件。嵌套的插件将扁平化。异步插件将等待和被解决。

并非所有的插件都可以通过该选项使用。`output.plugins` 仅限于在 `bundle.generate()` 或 `bundle.write()` 阶段，即在 Rollup 的主要分析完成后运行钩子的插件才可使用。如果你是一个插件作者，请查看 [输出生成钩子](https://www.rollupjs.com/plugin-development/#output-generation-hooks) 章节以了解哪些钩子可以使用。

以下是一个使用压缩插件作用于其中一个输出的例子：

```js
// rollup.config.js
import terser from '@rollup/plugin-terser';
export default {
    input: 'main.js',
    output: [
        {
            file: 'bundle.js',
            format: 'es'
        },
        {
            file: 'bundle.min.js',
            format: 'es',
            plugins: [terser()]
        }
    ]
};
```



## 2.4plugins

关于如何使用插件的更多信息，请查看 [使用插件](https://www.rollupjs.com/tutorial/#using-plugins)章节，关于如何编写你自己的插件，请查看 [插件](https://www.rollupjs.com/plugin-development/)章节（试试看吧，它并不像听起来那么困难，你可以通过 Rollup 插件做很多拓展）。对于从包中引入的插件，记住要调用引入的插件函数（即调用 `commonjs()`，而不仅仅是 `commonjs`）。返回值为假的插件将被忽略，这样可以用来灵活启用或禁用插件。嵌套的插件将扁平化。异步插件将等待和被解决。

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const isProduction = process.env.NODE_ENV === 'production';

// ---cut-start---
/** @type {Promise<import('rollup').RollupOptions>} */
// ---cut-end---
export default (async () => ({
    input: 'main.js',
    plugins: [
        resolve(),
        commonjs(),
        isProduction && (await import('@rollup/plugin-terser')).default()
    ],
    output: {
        file: 'bundle.js',
        format: 'cjs'
    }
}))();
```

# 3.外部插件使用

## 3.1rollup-plugin-babel

为了正确解析我们的模块并使其与旧版浏览器兼容，我们应该包括babel来编译输出。许多开发人员在他们的项目中使用 Babel ，以便他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。

1. 安装

```bash
npm install rollup-plugin-babel --save-dev
```

2. 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
```

3. 添加Babel配置文件.babelrc

在src文件夹下添加.babelrc。

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "modules": false // 设置为false,否则babel会在rollup有机会执行其操作之前导致我们的模块转化为commonjs
      }
    ]
  ]
}
```

4. 注意

> 1. 首先，我们设置 "modules": false ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。

> 2. 我们将 .babelrc 文件放在 src 中，而不是根目录下。 这允许我们对于不同的任务有不同的 .babelrc 配置，比如像测试，如果我们以后需要的话 - 通常为单独的任务单独配置会更好。

5. 安装@babel/core 和 @babel/preset-env

>  @babel/core是babel的核心，我们看到babelrc配置了 preset env，所以要安装这两个插件

```bash
npm install @babel/core @babel/preset-env --save-dev
```

## 3.2引入外部资源

在某些时候，您的项目可能取决于从NPM安装到node_modules文件夹中的软件包。

1. 安装

```bash
npm install @rollup/plugin-node-resolve  --save-dev
```

2. rollup.config.js

```js
import resolve from "@rollup/plugin-node-resolve";
export default {
  plugins: [resolve()],
};
```

3. 使用一个第三方库lodash

```js
// src/main.js
import foo from "./foo.js";

import { sum } from "lodash-es";

export default function () {
  console.log(foo);
  console.log(sum[(1, 2)]);
}
```

> #### 第二种配置：external 属性

有些场景下，虽然我们使用了 resolve 插件，但可能我们仍然想要某些库保持外部引用状态，这时我们就需要使用 external 属性，来告诉 rollup.js 哪些是外部的类库。

```js
// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "esm",
    name: "test",
  },
  plugins: [nodeResolve(), commonjs()],
  external: ["react"],
};
```

- external 插件

每个类库都要手动添加至 externals 未免太麻烦，这时候可以用 `rollup-plugin-node-externals` 插件，自动将外部类库声明为 externals。

安装：

```bash
npm install rollup-plugin-node-externals -D
```

更新 `rollup.config.js`：

```js
import externals from "rollup-plugin-node-externals";

export default [
  {
    plugins: [
      externals({
        devDeps: false, // devDependencies 类型的依赖就不用加到 externals 了。
      }),
    ],
  },
];
```

## 3.3引入 CommonJs 模块

rollup.js 编译源码中的模块引用默认只支持 ES6+的模块方式 import/export。然而大量的 npm 模块是基于 CommonJS 模块方式，这就导致了大量 npm 模块不能直接编译使用。

需要添加 @rollup/plugin-commonjs 插件来支持基于 CommonJS 模块方式 npm 包。

1. 安装

```bash
npm install @rollup/plugin-commonjs -D
```

2. rollup.config.js

```js
import commonjs from "@rollup/plugin-commonjs";

export default {
  plugins: [commonjs()],
};
```

3. 使用

此时使用这种导出方式就能正常打包。

```js
// src/foo.js：
module.exports = {
  text: "hello world!",
};
```

## 3.3使用typescript

1. 安装@rollup/plugin-typescript

```bash
npm install @rollup/plugin-typescript --save-dev
```

安装后发现有报错,提示我们要安装tslib和typescript

```bash
npm install tslib typescript --save-dev
```

2. 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-typescript'
import typescript from '@rollup/plugin-commonjs'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['lodash']
}
```

3. 配置tsconfig.json

如果不配置直接运行npm run build 会有提示让我们新建tsconfig配置,简单配置下tsconfig

 ```json
 {
   "compilerOptions": {
     "lib": [
       "es6"
     ],
     "module": "ESNext",
     "allowJs": true
   },
   "exclude": [
     "node_modules"
   ],
   "include": [
     "src/**/*"
   ]
 }
 ```

## 3.4压缩代码

1. 安装rollup-plugin-terser

```bash
npm install rollup-plugin-terser --save-dev
```

2. 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-typescript'
import typescript from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
    terser()
  ],
  external: ['lodash']
}
```

## 3.5开启本地服务器

在实际开发过程中，我们肯定要运行代码，查看页面，这时有个本地服务器就很重要，这样可以调试代码。

1. 安装rollup-plugin-serve

```bash
npm install rollup-plugin-serve --save-dev
```

2. 配置rollup.config.js

记得配置sourcemap: true,这样调试代码方便。

```js
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-typescript'
import typescript from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    terser(),
    postcss(),
    serve({
      open: true,
      contentBase: 'dist'
    })
  ],
  external: ['lodash']
}
```

## 3.6开启热更新

现在本地服务器有了，但是每次修改代码，还要重新启动才能生效，很不方便，所以需要热更新。

1. 安装rollup-plugin-livereload

```bash
npm install rollup-plugin-livereload --save-dev
```

2. 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-typescript'
import typescript from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    terser(),
    postcss(),
    livereload(),
    serve({
      open: true,
      contentBase: 'dist'
    })
  ],
  external: ['lodash']
}
```

3. 增加script语句

```json
{
  "name": "rollupDemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "rollup --config",
    "dev": "rollup --config -w"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.13.16",
    "@babel/preset-env": "^7.13.15",
    "@rollup/plugin-commonjs": "^18.0.0",
    "@rollup/plugin-node-resolve": "^11.2.1",
    "@rollup/plugin-typescript": "^8.2.1",
    "lodash": "^4.17.21",
    "postcss": "^8.2.13",
    "rollup": "^2.45.2",
    "rollup-plugin-babel": "^4.4.0",
    "rollup-plugin-livereload": "^2.0.0",
    "rollup-plugin-postcss": "^4.0.0",
    "rollup-plugin-serve": "^1.1.0",
    "rollup-plugin-terser": "^7.0.2",
    "tslib": "^2.2.0",
    "typescript": "^4.2.4"
  }
}
```

## 3.7区分开发环境和生产环境

在开发环境我们需要sourcemap开启，配置热更新和本地服务，在生产环境我们需要sourcemap关闭，不需要热更新和本地服务，需要代码压缩等，所以需要区分。

将rollup.config.js拆分成两个rollup.config.dev.js和rollup.config.build.js,再结合我们项目实际情况来编写配置文件。

## 3.8打包产物清除调试代码

插件 `@rollup/plugin-strip` 用于从代码中删除 debugger 语句和函数。包括 assert.equal、console.log 等等。

1. 安装

```bash
npm install @rollup/plugin-strip -D
```

2. rollup.config.js

```js
import strip from "@rollup/plugin-strip";
export default [
  {
    plugins: [
        strip()
    ];
  }
];
```



