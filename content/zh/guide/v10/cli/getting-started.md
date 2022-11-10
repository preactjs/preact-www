---
name: 快速入门
permalink: '/cli/getting-started'
description: 'Preact CLI 文档的快速入门指南'
---

# 快速入门

## 创建项目

### 模板

您可以使用下列官方模板之一创建项目：

- **默认** (Default)

此模板适合绝大多数应用，其自带 `preact-router` 与几个示例路由，且默认进行基于路由的代码切割。

- **简单** (Simple)

一个简单的模板，只有一个 "Hello World" 应用。如果您有自己想要加入的工具的话，您可以选用此模板。

- **Netlify CMS**

想要做一个博客吗？没问题！这个模板附带一个精致的 Preact 博客，您可以使用 [Netlify CMS](https://www.netlifycms.org/) 编辑。

要使用上述模板，请使用 `npx preact-cli create` 来创建一个新项目：

```sh
npx preact-cli create <模板英文名> <应用名>
```

您的项目现已设置就绪，您可以 `cd` 进项目目录并使用如下命令开启开发服务器：

```sh
cd <应用名>
npm run dev
```

开启您的编辑器，开始编辑吧！大多数模板的入口点位于 `src/index.js` 或 `src/components/app/index.js`。

## 生产模式构建

`npm run build` 命令会在项目根的 `build` 目录生成生产模式构建。

您可以提供参数来精调生产模式构建的输出结果，参数列表请参见[此处](https://github.com/preactjs/preact-cli#preact-build)。

**用例**

以下参数可生成 Webpack 的资产 JSON，可放入 Webpack 的[分析器](https://chrisbateman.github.io/webpack-visualizer/)中进行分析。

```sh
preact build --json
```

## 编辑 index.html

如果您想添加或编辑 `preact-cli` 生成的标记，添加元标签、自定义脚本或字体，您可以修改 `src/template.html`：
这是使用 `preact-cli` v3 自动生成，使用 [EJS](https://ejs.co/) 渲染的。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><% preact.title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <% preact.headEnd %>
  </head>
  <body>
    <% preact.bodyEnd %>
  </body>
</html>
```

> **小提示：**如果您从老版本更新而来，您需要先创建 `src/template.html` 文件。Preact 会在下次应用构建或开启开发服务器时自动使用此文件。
