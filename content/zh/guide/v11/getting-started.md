---
title: 入门指南
description: 如何开始使用 Preact。我们将学习如何设置工具（如果需要）并开始编写应用程序
---

# 入门指南

刚接触 Preact？刚接触虚拟 DOM？请查看[教程](/tutorial)。

本指南帮助您启动并运行以开始开发 Preact 应用程序，使用 3 种流行选项。
如果您是 Preact 新手，我们推荐从 [Vite](#创建一个-vite-驱动的-preact-应用) 开始。

---

<toc></toc>

---

## 无构建工具路线

Preact 被打包为可在浏览器中直接使用，不需要任何构建或工具：

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';

	// 创建您的应用
	const app = h('h1', null, 'Hello World!');

	render(app, document.body);
</script>
```

[🔨 在 Glitch 上编辑](https://glitch.com/~preact-no-build-tools)

这种开发方式的主要缺点是缺乏 JSX，这需要构建步骤。JSX 的一个符合人体工程学且高性能的替代方案记录在下一节中。

### JSX 的替代方案

编写原始的 `h` 或 `createElement` 调用可能很繁琐。JSX 的优势在于它看起来类似于 HTML，这使得许多开发人员更容易理解。在我们的经验中，JSX 需要构建步骤，因此我们强烈推荐一个称为 [HTM][htm] 的替代方案。

[HTM][htm] 是一种类似 JSX 的语法，可以在标准 JavaScript 中工作。它不要求构建步骤，而是使用 JavaScript 自己的[标记模板](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)语法，该语法于 2015 年添加，并在[所有现代浏览器](https://caniuse.com/#feat=template-literals)中受支持。这是一种日益流行的编写 Preact 应用程序的方式，因为与传统的前端构建工具设置相比，需要理解的移动部件更少。

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';
	import htm from 'https://esm.sh/htm';

	// 使用 Preact 初始化 htm
	const html = htm.bind(h);

	function App(props) {
		return html`
			<h1>Hello ${props.name}!</h1>
		`;
	}

	render(
		html`
			<${App} name="World" />
		`,
		document.body
	);
</script>
```

[🔨 在 Glitch 上编辑](https://glitch.com/~preact-with-htm)

> **提示：** HTM 还提供了一个方便的单导入 Preact 版本：
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

对于更具可扩展性的解决方案，请参见[导入映射 -- 基本用法](/guide/v11/no-build-workflows#basic-usage)，有关 HTM 的更多信息，请查看其[文档][htm]。

[htm]: https://github.com/developit/htm

## 创建一个 Vite 驱动的 Preact 应用

[Vite](https://vitejs.dev) 在过去几年中已成为跨多个框架构建应用程序的非常流行的工具，Preact 也不例外。它建立在 ES 模块、Rollup 和 ESBuild 等流行工具之上。通过我们的初始化器或他们的 Preact 模板，Vite 无需配置或事先知识即可开始使用，这种简单性使其成为使用 Preact 的非常流行方式。

要快速启动 Vite，您可以使用我们的初始化器 `create-preact`。这是一个可以在您的机器终端中运行的交互式命令行界面 (CLI) 应用程序。使用它，您可以通过运行以下命令创建一个新应用程序：

```bash
npm init preact
```

这将引导您创建一个新的 Preact 应用程序，并为您提供一些选项，例如 TypeScript、路由（通过 `preact-iso`）和 ESLint 支持。

> **提示：** 这些决定都不需要是最终的，如果您改变主意，您可以随时在项目中添加或删除它们。

### 准备开发

现在我们准备启动应用程序。要启动开发服务器，请在新生成的项目的文件夹中运行以下命令：

```bash
# 进入生成的项目文件夹
cd my-preact-app

# 启动开发服务器
npm run dev
```

一旦服务器启动，它将打印一个本地开发 URL，您可以在浏览器中打开。
现在您已经准备好开始编写应用程序代码了！

### 创建生产构建

当您需要将应用程序部署到某个地方时，就会用到这个时刻。Vite 提供了一个方便的 `build` 命令，它将生成高度优化的生产构建。

```bash
npm run build
```

完成后，您将拥有一个新的 `dist/` 文件夹，可以直接部署到服务器上。

> 有关所有可用命令及其选项的完整列表，请查看 [Vite CLI 文档](https://vitejs.dev/guide/cli.html)。

## 集成到现有管道中

如果您已经设置了现有的工具管道，很可能其中包含一个打包器。最流行的选择是 [webpack](https://webpack.js.org/)、[rollup](https://rollupjs.org) 或 [parcel](https://parceljs.org/)。Preact 开箱即用地与所有这些工具配合使用，无需重大更改！

### 设置 JSX

要转译 JSX，您需要一个将它转换为有效 JavaScript 代码的 Babel 插件。我们都使用的是 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)。安装后，您需要指定应该使用的 JSX 函数：

```json
{
	"plugins": [
		[
			"@babel/plugin-transform-react-jsx",
			{
				"pragma": "h",
				"pragmaFrag": "Fragment"
			}
		]
	]
}
```

> [Babel](https://babeljs.io/) 拥有最好的文档之一。我们强烈推荐查看它来解决有关 Babel 设置的问题。

### 将 React 别名指向 Preact

在某个时候，您可能希望利用庞大的 React 生态系统。原本为 React 编写的库和组件与我们的兼容层无缝配合。要使用它，我们需要将所有 `react` 和 `react-dom` 导入指向 Preact。这个步骤称为*别名*。

> **注意：** 如果您使用 Vite（通过 `@preact/preset-vite`）、Preact CLI 或 WMR，这些别名默认会自动为您处理。

#### 在 Webpack 中设置别名

要在 Webpack 中为任何包设置别名，您需要在配置中添加 `resolve.alias` 部分。
根据您使用的配置，这个部分可能已经存在，但缺少 Preact 的别名。

```js
const config = {
	//...snip
	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat', // 必须在 test-utils 下面
			'react/jsx-runtime': 'preact/jsx-runtime'
		}
	}
};
```

#### 在 Node 中设置别名

在 Node 中运行时，打包器别名（Webpack、Rollup 等）将不起作用，就像在 NextJS 中一样。要修复这个问题，我们可以在 `package.json` 中直接使用别名：

```json
{
	"dependencies": {
		"react": "npm:@preact/compat",
		"react-dom": "npm:@preact/compat"
	}
}
```

#### 在 Parcel 中设置别名

Parcel 使用标准的 `package.json` 文件在 `alias` 键下读取配置选项。

```json
{
	"alias": {
		"react": "preact/compat",
		"react-dom/test-utils": "preact/test-utils",
		"react-dom": "preact/compat",
		"react/jsx-runtime": "preact/jsx-runtime"
	}
}
```

#### 在 Rollup 中设置别名

要在 Rollup 中设置别名，您需要安装 [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias)。
该插件需要放置在您的 [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 之前

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

#### 在 Jest 中设置别名

[Jest](https://jestjs.io/) 允许重写模块路径，类似于打包器。
这些重写使用正则表达式在您的 Jest 配置中进行配置：

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

#### 在 TypeScript 中设置别名

TypeScript，即使与打包器一起使用，也有自己的类型解析过程。
为了确保使用 Preact 的类型而不是 React 的类型，您需要在 `tsconfig.json`（或 `jsconfig.json`）中添加以下配置：

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

此外，您可能希望启用 `skipLibCheck`，就像我们在上面的示例中所做的那样。有些
React 库使用 `preact/compat` 可能不提供的类型（尽管我们尽力修复这些），因此，这些库可能是 TypeScript 编译
错误的来源。通过设置 `skipLibCheck`，您可以告诉 TS 它不需要对所有
`.d.ts` 文件进行完整检查（通常这些文件仅限于 `node_modules` 中的库），这将修复这些错误。

#### 使用导入映射设置别名

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"react": "https://esm.sh/preact@10.23.1/compat",
			"react/": "https://esm.sh/preact@10.23.1/compat/",
			"react-dom": "https://esm.sh/preact@10.23.1/compat"
		}
	}
</script>
```

另请参见[导入映射 -- 配方和常见模式](/guide/v11/no-build-workflows#recipes-and-common-patterns)以获取更多示例。
