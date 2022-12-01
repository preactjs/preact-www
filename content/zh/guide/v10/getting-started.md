---
name: 开始上手
description: "如何上手 Preact？我们会在此教程中详解如何安装工具和编写应用。"
---

# 开始上手

Preact 新人？初见虚拟 DOM？先去看看[教程](/tutorial)吧！

此教程会教您开发 Preact 应用的两种方式。

---

<div><toc></toc></div>

---

## 无构建工具方式

Preact 可在浏览器中直接使用，无需构建或任何工具：

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';

  // Create your app
  const app = h('h1', null, 'Hello World!');

  render(app, document.body);
</script>
```

[🔨 在 Glitch 上编辑](https://glitch.com/~preact-no-build-tools)

此方法的一大缺点是缺少需要构建的 JSX。我们会在下一小节中提供既符合人体工程学，又性能极高的 JSX 替代选项。

### JSX 的替代选项

手写 `h` 或 `createElement` 调用单调乏味。JSX 类似 HTML，这一优势让开发者能轻松理解其语法，但其需要构建步骤。所以，我们强烈推荐 [HTM][htm] 作为替代选项。

[HTM][htm] 是可在标准 JavaScript 中使用的类 JSX 语法，此语法于 2015 年添加且支持所有[主流浏览器](https://caniuse.com/#feat=template-literals)。它通过使用 JavaScript 自带的[标记模板](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E5%B8%A6%E6%A0%87%E7%AD%BE%E7%9A%84%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)语法替代构建步骤。这是一种正在变得热门的 Preact 应用编写方式，减轻了理解传统前端构建工具配置的负担。

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';
  import htm from 'https://unpkg.com/htm?module';

  // 为 Preact 初始化 htm
  const html = htm.bind(h);

  function App (props) {
    return html`<h1>Hello ${props.name}!</h1>`;
  }

  render(html`<${App} name="World" />`, document.body);
</script>
```

[🔨 在 Glitch 上编辑](https://glitch.com/~preact-with-htm)

> **小提示：**HTM 还提供了一键 import 的 Preact 版本：
>
> `import { html, render } from 'https://unpkg.com/htm/preact/index.mjs?module'`

要了解有关 HTM 的更多信息，请参阅其[文档][htm]。

## 整合进现有工具

如果您的项目已经有一些前端工具的话，那么您也可能安装了打包工具，可能是 [webpack](https://webpack.js.org/)、[rollup](https://rollupjs.org) 或 [parcel](https://parceljs.org/)。Preact 原生支持它们，无需您做出任何改动！

### 配置 JSX

您需要一款 Babel 插件才能将 JSX 转译为 JavaScript 代码。我们使用的是 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)。安装后，您需要为 JSX 指定该使用的函数：

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

> [Babel](https://babeljs.io/) 的教程很不错，我们强烈建议您在配置 Babel 或遇到其相关问题时参阅它。

### 将 React 替名为 Preact

某些时候，您可能会想使用一部分 React 生态。为 React 编写的第三方库或组件可通过兼容层无缝使用。为此，我们需要先将所有的 `react` 和 `react-dom` 导入指向 Preact。此流程我们称之为**替名** (Aliasing)。

> **小提示：**如果您使用 [Preact CLI] 的话，我们已自动为您处理替名步骤。

#### Webpack 中的替名

要在 Webpack 中为包替名，您需要在配置中添加 `resolve.alias` 一节。根据您配置的不同，此配置可能已经存在，但缺少 Preact 的替名。

```js
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // 必须放在 test-utils 下面
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  }
}
```

#### Node 中的替名

在 Node.JS 服务器 (如 Next.js) 上，Webpack 替名无法正常工作。我们需要在 `package.json` 中添加替名。

```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat",
  }
}
```

现在，Node 可以正确使用 Preact 取代 React 了。

#### Parcel 中的替名

Parcel 使用标准的 `package.json` 文件中的 `alias` 键来读取替名。

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

#### Rollup 中的替名

要在 Rollup 中替名，您需要先安装 [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias)。此插件需要放在 [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 前。

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

#### Jest 中的替名

[Jest](https://jestjs.io/) 可以类似打包器的方式重写模块路径。重写路径可在您的 Jest 配置中通过正则表达式实现。

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

#### Snowpack 中的别名

要在 [Snowpack](https://www.snowpack.dev/) 中添加别名，您需要在 `snowpack.config.mjs` 文件中添加包导入别名。

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

## 为 preact/compact 配置 TypeScript

您的项目可能需要更广的 React 生态的支持。为了让您的应用得以编译，您可能需要先关闭 `node_modules` 路径的类型检查，并以类似如下方式添加类型路径。这样，您的别名才能在第三方库导入 React 时正常被替换。

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
