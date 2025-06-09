---
title: 简化孤岛架构
date: 2024-10-27
authors:
  - reaper
translation_by:
  - zhi zheng
---

> 这是原始文章的略微修改版本，原文地址：https://barelyhuman.github.io/preact-islands-diy
 
# 孤岛架构

## 介绍

本指南是一个简单的教程，帮助你理解孤岛架构是如何工作的，并使用你已有的工具建立自己的孤岛架构。

首先，什么是孤岛？你可以从以下链接了解更多关于它的起源：

[孤岛架构 - Jason Miller &rarr;](https://jasonformat.com/islands-architecture/)

## 为什么使用孤岛架构？

对于许多长期使用服务器渲染的开发者来说，我们某种程度上期望前端技术在某个时间点转向服务器渲染，因为数据获取和处理在离数据更近的服务器上几乎总是更快。

这只是众多原因中的一个，还有其他原因整个网络社区正在争论，所以我们把这些留给聪明人去讨论。

让我们继续实现这个概念。

# 开始

## 基本实现

基本实现可以适用于大多数 SSR + 客户端水合的应用。

以下是概述：

1. 最初在服务器上将视图渲染为静态页面。
2. 在客户端水合应用程序。

详细解释每一步：

### 初始服务器渲染

在这一步中，你仍然使用任何 UI 库构建组件树，如 Vue、React、Preact、Solid 等。然后将组件树压平，只保留静态和可立即计算的数据。在这种情况下，不运行副作用(side-effects)和状态管理相关的代码。

输出是一个可以发送给客户端的静态 HTML 文档。

由于本指南与 [Preact](https://preactjs.com/) 相关，我们将使用 Preact 团队提供的库来帮助我们实现这一目标。

以下是在服务器上渲染组件的基本实现示例：

我们在这里使用 `express.js` 作为示例，因为它是大多数初学者的首选，但无论你选择哪个 Web 服务器引擎，过程基本相同。如 Hapi、Koa、Fastify 等。

```js
// server.js
import { h } from 'preact'
import preactRenderToString from 'preact-render-to-string'

// ...其余 express.js 设置

const HomePage = () => {
  return h('h1', {}, 'hello')
}

app.get('/', async (req, res) => {
  res.send(preactRenderToString(h(HomePage, {})))
})
```

这里大部分工作由 `preactRenderToString` 完成，我们只需要编写组件。通过一点打包魔法，我们应该能够使用 JSX 编写，使工作更加友好。

### 水合(Hydration)

好的，这是一个你会在网上看到聪明人经常使用的术语。

- 部分水合（Partial Hydration）
- 渐进式水合（Progressive Hydration）
- 随着他们发现更多类似方法，这个列表会继续增长

简单来说，就是将交互性绑定到具有state/effects/events的 DOM 元素上。

这些 state/effects/events 可能是从服务器发送的，但如果使用的组件可以处理自己的逻辑，并且逻辑很好地包含在组件中，你只需要在 DOM 上挂载组件并进行必要的绑定。

例如，这可能看起来像这样：

```js
// client.js
import { hydrate } from 'preact'
import Counter from './Counter'

const main = () => {
  // 假设服务器也使用以下 ID 渲染了组件
  const container = document.getElementById('counter')
  hydrate(h(Counter, {}), container)
}

main()
```

与服务器渲染阶段类似，我们使用 `preact` 的辅助函数来帮助水合组件。你可以使用 `render`，但实际的元素已经是由服务器渲染的，再次渲染它没有意义，所以我们只是要求 Preact 尝试添加所需的事件和状态数据。

我上面解释的称为部分水合(Partial Hydration)，因为你不是水合整个应用程序，而只是水合其中的特定部分。

## 深入探讨

要理解如何构建基于孤岛架构的应用程序，你不需要了解更多内容，但让我们继续实现这个概念。

# 代码

这种代码级架构与大多数 SSR 模型非常相似，Vite 对如何使用 Vite 编写自己的 SSR 有很好的解释：

[&rarr; Vite 指南 - 服务器端渲染](https://vitejs.dev/guide/ssr.html)

我们使用 webpack 代替，使其更加详细，便于解释。

> 注意：你可以从 [barelyhuman/preact-islands-diy](http://github.com/barelyhuman/preact-islands-diy/) 获取参考代码

## `server/app.js`

从 `server/app.js` 文件开始。如果你在本地打开了代码库，阅读时会有所帮助。

以下代码片段仅突出显示必要的区域：

```js
import preactRenderToString from 'preact-render-to-string'
import HomePage from '../pages/HomePage.js'
import { h } from 'preact'
import { withManifestBundles } from '../lib/html.js'

const app = express()

app.get('/', async (req, res) => {
  res.send(
    withManifestBundles({
      body: preactRenderToString(h(HomePage, {})),
    })
  )
})
```

查看导入，我们有与[开始](#getting-started)部分中提到的相同导入，没有太大变化。

唯一的新增内容是 `withManifestBundles` 辅助函数，这是我们接下来要讨论的内容。

## `lib/html.js`

HTML 辅助函数在不同模板的不同变体中有所不同，但我们只会介绍 `main` 分支上的 `webpack` 版本。

这个辅助函数的基本用例是能够遍历一个清单 JSON，该清单列出了 webpack 打包的文件及其在生产环境中使用时的哈希路径。

这是必需的，因为我们不会知道哈希值，需要以编程方式找出它。

这个清单是由 webpack 的客户端配置生成的，我们稍后会看一下。

```js
// 从客户端输出获取清单
import manifest from '../../dist/js/manifest.json'

export const withManifestBundles = ({ styles, body }) => {
  // 遍历清单中的每个键并为每个键构造
  // 一个脚本标签
  const bundledScripts = Object.keys(manifest).map(key => {
    const scriptPath = `/public/js/${manifest[key]}`
    return `<script src=${scriptPath}></script>`
  })

  return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style id="_goober">
        ${styles}
      </style>
    </head>

    <body>
      ${body}
    </body>
    ${bundledScripts.join('')}
  </html>`
}
```

如注释中所述，我们只是从清单中获取所需的所有文件，并将它们作为脚本标签插入到从服务器发送的最终 HTML 中。

接下来看看使这成为可能的配置。

## `webpack.config.*.js`

我尽量保持 webpack 配置尽可能简单，以避免吓跑人们，所以让我们看一下配置。

```js
// webpack.config.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: process.env.NODE_ENV != 'production' ? 'development' : 'production',
  target: 'node',
  entry: path.resolve(__dirname, './src/server/app.js'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, './dist'),
  },
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{ test: /\.jsx?$/, loader: 'babel-loader' }],
  },
  externals: [nodeExternals()],
}
```

大部分配置不需要解释，我们使用的唯一加载器是 `babel-loader`，因为我们使用的是 CSS-IN-JS 解决方案进行样式设计。

这里没有什么神奇的事情，我们只是给它提供 `server/app.js` 的入口点，并让它构建到与客户端输出相同的文件夹中。

接下来看看客户端配置，它比简单地提供入口点和获取输出添加了更多内容。

这是简化后的代码，用于解释相关部分：

```js
// webpack.config.client.js

const entryPoints = glob
  .sync(path.resolve(__dirname, './src/client') + '/**/*.js', {
    absolute: true,
  })
  .reduce((acc, path) => {
    const entry = path.match(/[^\/]+\.jsx?$/gm)[0].replace(/.jsx?$/, '')
    acc[entry] = path
    return acc
  }, {})
```

第一部分基本上是找到 `src/client` 中的所有文件，并为 webpack 创建一个入口对象。

例如：如果 `src/client/app.client.js` 是一个文件，那么上面代码的输出将是：

```json
{
  "app.client": "./src/client/app.client.js"
}
```

这没什么特别的，这只是 webpack 期望定义入口的方式。

其他部分是也存在于服务器端的通用配置：

```js
{
  plugins: [
    new WebpackManifestPlugin({
      publicPath: '',
      basePath: '',
      filter: file => {
        return /\.mount\.js$/.test(file.name)
      },
    }),
  ]
}
```

然后我们有清单插件，它检查文件名中是否包含 `mount` 字符串，这样做是为了确保只加载入口文件而不是随机文件，我们通过为文件指定特定的扩展类型来做到这一点。

一些框架使用 `islands` 文件夹来将孤岛与入口文件分开。而我们选择将入口文件与孤岛分开，让用户决定什么作为孤岛挂载，什么不挂载。

上面的 `WebpackManifestPlugin` 在 `dist/public/js` 中生成一个 `manifest.json` 文件，其中包含我们在 `lib/html.js` 文件中使用的打包文件名。

## `.babelrc`

这是配置的最后一部分，你需要让 babel 确保它使用的 JSX 运行时来自 preact 而不是 react。

这部分相当自解释，但如果你需要关于选项的详细信息，请查阅 [babel](https://babeljs.io/) 和 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) 的文档。

```json
// .babelrc
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      { "runtime": "automatic", "importSource": "preact" }
    ]
  ]
}
```

## 文件夹

现在我们可以了解每个文件夹的重要性。

> **注意**：请知道，如果需要，你可以混合搭配这些文件夹，只要确保配置已编辑以处理你所做的更改。如果不需要，当前结构对大多数应用程序来说已经足够好了。

## `client`

`main` 分支中的 `src/client` 用于编写与渲染的 HTML 一起发送的 `mount` 点代码。

你可以根据你希望使用的页面和选择器添加选择性挂载，即使它会获取多个 JS 文件，这些文件也不应该包含比挂载代码更多的内容，你的孤岛应该是自给自足的。然而，你可以从服务器以 `data-*` 属性的形式发送初始数据集，但这必须是可序列化的数据，否则会丢失。

你也可以添加一个包装器来手动创建孤岛，但 web 组件并未得到广泛支持，如果用于旧版支持系统，最好像上面提到的那样手动挂载。

示例：

```js
// src/client/index.mount.js

import { h, hydrate } from 'preact'

// 设置 goober
import { setup } from 'goober'
setup(h)

// 可以移到一个工具文件中并从那里使用，
// 作为示例，暂时放在这个文件中。
const mount = async (Component, elm) => {
  if (elm?.dataset?.props) {
    const props = JSON.parse(elm.dataset.props)
    delete elm.dataset.props
    hydrate(<Component {...props} />, elm)
  }
}

const main = async () => {
  // 如果需要，延迟加载并重新挂载计数器作为客户端组件
  // 更好的方法是在导入组件之前检查 DOM 上是否存在 `counter` 元素，
  // 以避免不必要的 JS 下载。

  const Counter = (await import('../components/Counter.js')).default
  mount(Counter, document.getElementById('counter'))
}

main()
```

## components

这个名称是不言自明的，因为我们在这里不做任何关于什么是孤岛、什么不是孤岛的区分，你可以像平常一样将所有组件放在这里。

## layouts

这些被分开，因为我喜欢将布局远离组件，因为有时它们不仅仅包含渲染条件。在这个特定的情况下不需要，因为在大多数情况下，你会在服务器上运行你的布局，而不是在客户端。

## lib

包含客户端和服务器端共用的辅助函数，因为两者是分别打包的，需要时会内联依赖项。

## pages

这个文件夹作为模板的存储。所以服务器将渲染为页面的任何内容都会放在这里。像普通 preact 应用程序一样使用布局和其他组件的能力有助于构建可组合的模板，但仍然更容易将它们与实际的组件代码分开。

## public

需要由 express 静态传递的内容放在这里，webpack 会负责将整个内容复制到最终文件夹中。

## server

不言自明，服务器端文件，在大多数情况下，你可能想把路由移到单独的文件中，也许还需要添加中间件来为你提供一个帮助函数来渲染 preact 组件。

下面这种东西肯定是服务器的一部分，不会是客户端的，所以就把它放在这个文件夹里。

例如：

```js
app.use((req, res, next) => {
  res.render = (comp, data) => {
    return res.write(preactRenderToString(h(comp, { ...data })))
  }
})

// 在应用程序的其他地方

const handler = (req, res) => {
  return res.status(200).render(Homepage, { username: 'reaper' })
}
```

这实际上是所有有助于用 nodejs 设置自己的部分水合/孤岛风格水合的代码。

几乎所有的打包工具都可以实现这些，而且对配置生成方式进行一些修改，可以帮助你实现类似于 astro 的开发体验，不过如果你不喜欢维护配置，还是用 astro 比较好。 