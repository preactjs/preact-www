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

> **Tip:** Any GitHub repository with a `template/` folder can be used as a custom template:
>
> `preact create <username>/<repository> <project-name>`

### Getting ready for development

Now we're ready to start our application. To start a development server, run the following command inside your newly generated project folder (`my-project` from above):

```bash
# Go into the generated project folder
cd my-project

# Start a development server
npm run dev
```

Once the server has started, it will print a local development URL to open in your browser.
Now you're ready to start coding your app!

### Making a production build

There comes a time when you need to deploy your app somewhere. The CLI ships with a handy `build` command which will generate a highly-optimized production build.

```bash
npm run build
```

Upon completion, you'll have a new `build/` folder which can be deployed directly to a server.

> For a full list of all available commands, check out the [Preact CLI Documentation](https://github.com/preactjs/preact-cli#cli-options).

## Integrating Into An Existing Pipeline

If you already have an existing tooling pipeline set up, it's very likely that this includes a bundler. The most popular choices are [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) or [parcel](https://parceljs.org/). Preact works out of the box with all of them. No changes needed!

### Setting up JSX

To transpile JSX, you need a Babel plugin that converts it to valid JavaScript code. The one we all use is [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Once installed, you need to specify the function for JSX that should be used:

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

> [Babel](https://babeljs.io/) has some of the best documentation out there. We highly recommend checking it out for questions surrounding Babel and how to set it up.

### Aliasing React to Preact

At some point, you'll probably want to make use of the vast React ecosystem. Libraries and Components originally written for React work seamlessly with our compatibility layer. To make use of it, we need to point all `react` and `react-dom` imports to Preact. This step is called _aliasing._

#### Aliasing in webpack

To alias any package in webpack, you need to add the `resolve.alias` section
to your config. Depending on the configuration you're using, this section may
already be present, but missing the aliases for Preact.

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

#### Aliasing in Parcel

Parcel uses the standard `package.json` file to read configuration options under
an `alias` key.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Aliasing in Rollup

To alias within Rollup, you'll need to install [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
The plugin will need to be placed before your [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

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

#### Aliasing in Jest

[Jest](https://jestjs.io/) allows the rewriting of module paths similar to bundlers.
These rewrites are configured using regular expressions in your Jest configuration:

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

## TypeScript preact/compat configuration

Your project could need support for the wider React ecosystem.  To make your application
compile, you'll need to disable type checking on your `node_modules` like this.  This way,
your alias will work properly when libraries import React.

```json
{
  ...
  "skipLibCheck": true,
}
```
