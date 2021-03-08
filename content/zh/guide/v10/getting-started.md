---
name: Getting Started
description: "How to get started with Preact. We'll learn how to setup the tooling (if any) and get going with writing an application."
---

# 开始

开始开发Preact应用

Preact有三种方式接入项目。 如果使用Preact新开发一个项目, 我们推荐使用[Preact CLI](#best-practices-powered-by-preact-cli).

---

<div><toc></toc></div>

---

## 不使用打包工具的方式

Preact 是经过打包的，可以直接在浏览器中使用, 不需要引入任何额外的构建和工具:

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';

  // Create your app
  const app = h('h1', null, 'Hello World!');

  render(app, document.body);
</script>
```

[🔨 Edit on Glitch](https://glitch.com/~preact-no-build-tools)

这种方式主要的缺点是无法使用JSX. 在此方式中使用JSX的替代选择在下一章节中说明.

### JSX 替代方式

书写原生的 `h` 或者 `createElement` 调用 是繁琐的. JSX 有类似于HTML的特点，这有利于开发者的理解. 但是 JSX 需要经过编译, 所以我们强烈推荐使用替代方案 [HTM][htm].

[HTM][htm] 是一种可在标准JavaScript中执行的 类JSX 语法. 作为编译步骤的替代方案, 它使用了JavaScript自身的 [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) 语法, 这种语法于2015年被添加并被 [所有现代浏览器](https://caniuse.com/#feat=template-literals)支持. 这是一种越来越受欢迎的编写Preact 应用的方式, 相比于传统的前端打包工具安装的方式这种方式需要理解的配置部分更少。

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

[🔨 Edit on Glitch](https://glitch.com/~preact-with-htm)

> **提示:** HTM 也提供了Preact版本的引入方式 :
>
> `import { html, render } from 'https://unpkg.com/htm/preact/index.mjs?module'`

查看更多HTM的信息, 点击跳转 [说明][htm].

## 最佳实践方式 Preact CLI

[Preact CLI] 是一个构建Prect应用的现成解决方案. 它是基于标准工具项目如：Webpack，Babel 和 PostCSS 打造的. Preact CLI 不需要任何的配置和前置知识, 这种简单的方式是最受欢迎的使用Preact的方式.

见名知意，Preact CLI 是一个命令行工具. 通过如下方式进行全局安装:

```bash
npm install -g preact-cli
```

之后, `preact`命令会被添加在运行环境中. 你可以使用 `preact create` 命令创建新项目:

```bash
preact create default my-project
```

这会创建一个基于 [默认模板](https://github.com/preactjs-templates/default)的新项目. 创建过程中会要求填写一些项目所需信息, 项目会被创建在你规定的目录下(在这个例子中目录是 `my-project`).

> **提示:** 任何 GitHub 仓库有 `template/` 文件目录都可被用作自定义模板:
>
> `preact create <username>/<repository> <project-name>`

### 开始开发

现在我们可以开始开发我们的项目了. 为了启动开发服务, 在你创建的项目目录中运行如下命令 (`my-project` 同上文所创建):

```bash
# Go into the generated project folder
cd my-project

# Start a development server
npm run dev
```

一旦服务已经启动, 会打印一个本地开发URL，在浏览器中打开这个这个URL.
现在你可以开始编写你的应用了！

### 进行生产环境打包构建

如果你需要发布你的应用. Preact CLI 有方便的 `build`命令，可以生成一个高度优化的生产环境构建物.

```bash
npm run build
```

构建完成后, 项目中会生成一个 `build/` 目录，可以直接部署在服务器上.

> 查看全部的可用命令列表, 点击查看 [Preact CLI 文档](https://github.com/preactjs/preact-cli#cli-options).

## 在已有项目中集成

如果你已经有一个现有的打包流程. 例如最受欢迎的选择 [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) or [parcel](https://parceljs.org/). Preact 可以完美兼容，无需任何改变。

### 配置 JSX

为了转译 JSX, 你需要一个Babel插件将JSX转换为有效的JavaScript 代码. 我们使用 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). 安装后, 你需要指定JSX使用的方法:

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

> 这里有[Babel](https://babeljs.io/) 官方的文档. 我们强烈推荐点击查看有关Babel的问题以及如何设置Babel.

### 配置Preact别名React，以使用React生态

有时, 你可能需要使用庞大的React生态.为React写的库和组件可以无缝的再Preact平台中使用. 为了使用这些, 我们需要指定 `react` 和 `react-dom` 引入 为 Preact. 这个过程就叫做 _aliasing._

#### 在 webpack 中配置别名

在webpack中添加依赖包别名, 你需要添加 `resolve.alias` 到
你的配置中. 取决于你所使用的配置, 配置可能已经存在, 、但是缺少preact配置

```js
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
}
```

#### 在 Parcel 中配置别名

Parcel 使用标准的 `package.json` 文件 读取其中 键名为`alias`配置 .

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### 在 Rollup 中配置别名

在 Rollup 中配置别名, 你需要安装 [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
这个插件需要被放在 [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)插件之前

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' }
      ]
    })
  ]
};
```

#### 在 Jest在 中配置别名

[Jest](https://jestjs.io/) 允许改写包路径类似于打包工具.
重写配置使用正则表达式:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat"
  }
}
```

[htm]: https://github.com/developit/htm
[Preact CLI]: https://github.com/preactjs/preact-cli

## TypeScript preact/compat 配置

您的项目可能需要对更广泛的React生态系统的支持. 为了是您的项目能正常编译, 您需要在 `node_modules` 中禁止类型检查.  这样,
您所配置的别名就能正确的在引入React时生效.

```json
{
  ...
  "skipLibCheck": true,
}
```
