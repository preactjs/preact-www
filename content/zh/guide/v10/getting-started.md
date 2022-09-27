---
name: Getting Started
description: "How to get started with Preact. We'll learn how to setup the tooling (if any) and get going with writing an application."
---

# 快速开始

Preact 新手？第一次接触 Virtual DOM？可以先查看[教程](/tutorial)

本指南将会使用 3 个常用的选项来帮助你启动并开始开发 Preact 应用程序。如果你是 Preact 新手，我们建议你从 [Preact CLI](#best-practices-powered-by-preact-cli) 开始。

---

<div><toc></toc></div>

---

## 无需构建

Preact 可以直接在浏览器中使用而不依赖任何构建工具。

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';

  // Create your app
  const app = h('h1', null, 'Hello World!');

  render(app, document.body);
</script>
```

[🔨 在 Glitch 中编辑](https://glitch.com/~preact-no-build-tools)

由于不需要构建，这种直接引用 Preact 的方式带来的最大问题是无法基于 JSX 进行开发。下一节将介绍一种可读性好并且高性能的 JSX 替代方案。

### 替代 JSX

使用原始的 `h` 或 `createElement` 方法开发组件可能比较乏味。JSX 的好处是看上去比较像 HTML，便于开发者理解。但是 JSX 需要额外的构建步骤，我们更推荐它的替代方案 [HTM][htm]。

[HTM][htm] 语法与 JSX 非常像并且可以直接运行在标准 JavaScript 中。它使用[所有现代浏览器](https://caniuse.com/#feat=template-literals)都支持的 JavaScript ES6 [模版字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)语法并且不需要额外的构建步骤。这是一种编写 Preact 应用程序越来越常用的方式，因为与设置传统的前端构建工具相比，这种方式需要理解的构建环节更少。

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';
  import htm from 'https://unpkg.com/htm?module';

  // Initialize htm with Preact
  const html = htm.bind(h);

  function App (props) {
    return html`<h1>Hello ${props.name}!</h1>`;
  }

  render(html`<${App} name="World" />`, document.body);
</script>
```

[🔨 在 Glitch 中编辑](https://glitch.com/~preact-with-htm)

> **小提示:** HTM 已经支持了 Preact 版本：
>
> `import { html, render } from 'https://unpkg.com/htm/preact/index.mjs?module'`

更多关于 HTM 的信息请参考它的[文档][htm]

## Preact CLI 最佳实践

[Preact CLI] 给针对现代 web 开发进行优化过的 Preact 应用构建提供了一种现成的解决方案。它基于一些标准工具如 Webpack，Babel 和 PostCSS 等。Preact CLI 不需要任何配置和经验就可以轻松启动，正因为如此，Preact CLI 是使用 Preact 的最常用方式。

就像它的名字那样，Preact CLI 是一款可以运行在你机器终端的命令行交互接口。在使用它的过程中，你可以运行 `create` 命令来构建一个新的应用：

```bash
npx preact-cli create default my-project
```

上述命令会基于我们的[默认模版](https://github.com/preactjs-templates/default)创建一个新应用。在创建过程中，需要设置一些关于你项目的基本信息，Preact CLI 会根据这些信息在你指定的目录（如本例中的 `my-project`）中进行项目初始化。

> **小提示：**任何包含 `template/` 文件夹的 Github 仓库都可以作为自定义的项目模版
>
> `npx preact-cli create <username>/<repository> <project-name>`

### 准备开发

现在我们可以启动应用了。在你新生成的项目目录（如本例的 `my-project`）中，执行如下命令会启动一个开发服务：

```bash
# Go into the generated project folder
cd my-project

# Start a development server
npm run dev
```

一旦开发服务启动了，它会向终端输出一个绑定你本地的开发 URL，你可以在浏览器中打开访问它。完成这步后你就可以开始为你的应用编写代码了。

### 生产构建

当你需要部署你的应用程序时，Preact CLI 提供了一个便捷的 `build` 命令，它会帮你生成一个高度优化过的生产构建产物。

```bash
npm run build
```

`build` 完成后，你就可以将新生成的 `build/` 文件夹直接部署到某个服务器上。

> Preact CLI 的完整命令请参考 [Preact CLI Documentation](https://github.com/preactjs/preact-cli#cli-options)。

## 工作流集成

如果你已经设置了一套工具链流程，那么其中极有可能包含有一个打包器。最常见的有 [webpack](https://webpack.js.org/)，[rollup](https://rollupjs.org) 或 [parcel](https://parceljs.org/)。Preact 完全兼容它们，不需要做任何修改。


### 设置 JSX

要转译 JSX，你需要一个 Babel 插件来将它转换成有效的 JavaScript 代码。我们都使用 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)。安装完成后，你需要告诉插件用来转换 JSX 的函数。

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> [Babel](https://babeljs.io/) 的文档十分齐全。我们非常推荐你去上面查看 Babel 周边及如何设置它的问题。

### 将 React 别名设为 Preact

有些时候，你可能想利用 React 庞大的生态。Preact 的兼容层可以适配用 React 编写的类库和组件。为了使用兼容层，我们需要将所有 `react` 和 `react-dom` 导入指向 Preact。这步称作 _aliasing。_


> **小提示：** 如果你使用的是 [Preact CLI]，默认会自动处理这些重命名操作。

#### webpack 别名

在 webpack 中重命名任何包都需要你在配置中添加 `resolve.alias` 字段。你的配置或许已经设置了该字段但可能并没有重命名 Preact。

```js
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  }
}
```

#### Node 别名

webpack 别名设置在 NODE.JS 服务上起不到作用，在 Next 等框架上会遇到这种情况，在这里我们不得不在 `package.json` 中配置别名。


```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat",
  }
}
```

这样 Node 就可以正确使用 Preact 来替换 React 了。

#### Parcel 别名

Parcel 可以通过标准的 `package.json` 文件来读取设置了 `alias` 字段的配置选项。

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime"
  },
}
```

#### Rollup 别名

用 Rollup 重命名 Preact 前，你需要安装 [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias) 并将它放置在 [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 前。


```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    })
  ]
};
```

#### Jest 别名

像其他打包工具一样，[Jest](https://jestjs.io/) 允许重写模块路径。
你可以通过正则表达式在 Jest 配置中设置它们：

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime"
  }
}
```

#### Snowpack 别名

在 [Snowpack](https://www.snowpack.dev/) 中，你可以通过向 `snowpack.config.mjs` 文件添加一个 alias 字段来进行重命名。

```js
// snowpack.config.mjs
export default {
  alias: {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime",
  }
}
```

[htm]: https://github.com/developit/htm
[Preact CLI]: https://github.com/preactjs/preact-cli

## TypeScript preact/compat 配置

你的项目可能需要支持更广泛的 React 生态。为了让你的应用通过编译，你需要禁止检查 `node_modules` 并添加如下的模块路径定义。只有这样，当类库引用 React 时，你配置的别名才能生效。

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```
