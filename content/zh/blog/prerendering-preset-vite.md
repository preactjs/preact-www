---
title: 使用 `@preact/preset-vite` 进行预渲染
date: 2024-08-06
authors:
  - Ryan Christian
translation_by:
  - zhi zheng
---

# 使用 Preset Vite 进行预渲染

自从我们的预渲染插件在半年前悄然登陆 `@preact/preset-vite` 以来，让我们来谈谈它、我们的历史以及整个生态系统。

在我们社区中待了一段时间的人都知道我们有多喜欢预渲染；它是 Preact-CLI 中的一级功能，然后是 WMR，现在是我们的 Vite 预设。当它做得好时，它是对典型 SPA 的无痛添加，大大改善了用户体验，而我们的预渲染插件旨在促进这一点。

## 什么是预渲染？

在本文的上下文中，"预渲染"是指在构建时使用服务器端渲染 (SSR) 从你的应用生成 HTML；有时这也可能被称为静态站点生成 (SSG)。

虽然我们不会在这里深入探讨 SSR 的优点，甚至不会争论你是否应该使用它，但在初始导航（根据路由策略，可能在后续导航中也是如此）向用户发送完全填充的 HTML 文档通常比发送一个空壳（客户端 JS 最终会渲染）更有优势。用户将更快地访问文档，并可以在 JS 仍在后台下载时开始使用页面（尽管功能通常会有所减少）。

## 我们在这个领域的历史

自从 Preact-CLI 在 2017 年 5 月首次公开发布以来，内置预渲染一直是我们构建工具的主要功能；我们很高兴在 2020 年将其带入 WMR，当我们转向推荐 Vite 时，这是我们和社区成员非常怀念的功能。

虽然每次迭代都有所不同，但所有迭代都围绕着同一个核心理念：用户越容易设置预渲染，包括对现有代码库的有限更改，他们就越容易采用预渲染。在 Preact-CLI 中，这意味着提供一个根组件的默认导出，并带有一些 JSON 数据来填充它；在 WMR 和现在的 Vite 中，这意味着导出一个简单的 `prerender()` 函数，返回该路由的 HTML，预渲染器会自己遍历应用，无需提前提供 JSON。

任何在大规模工作过 SSR 的人都知道，有一座复杂性的山永远无法完全抽象掉，我们不会争辩这一点。然而，几乎每个 SPA 如果预渲染后都会提供更好的体验，因此我们希望让尽可能多的用户上船——降低入门门槛在我们的社区中已被证明非常成功，因此我们的设计理念的关键部分是尽可能地实现"即插即用"。

## 现有的 Vite 生态系统

在为我们的 Vite 预设创建自己的预渲染实现之前，我们查看了现有的 Vite 生态系统，看看提供了什么，但没有完全找到我们想要的选项。预渲染在尽可能接近"即插即用"时效果最好，最少的修改就能从你现有的应用生成 HTML，但现有的解决方案比我们希望的"即插即用"程度更远，主要分为两类：

1. 多重构建
	- 分离的客户端/服务器构建，通常还有单独的入口点
	- 不太同构，在不同环境下你的应用有不同的分支
2. 框架 / Vite 包装器
	- 不再直接使用 Vite，而是使用抽象层
	- 一定程度的买入/锁定
	- 对不同 Vite 配置选项、插件等的支持矩阵可能复杂且不够清晰

虽然这些解决方案绝对有其优点，并在生态系统中有其地位，但考虑到我们在这一领域的历史产品，对我们的生态系统来说，它们感觉都不够好。"最佳情况"的开发体验常常被牺牲，以满足更复杂或特定的需求——这是完全有效的权衡。

然而，对于即插即用的预渲染，我们认为我们可以提供一些与现有选项不同的东西，或者至少是对我们用户来说更熟悉的东西。

## 在 `@preact/preset-vite` 中的实现

多年后，我们仍然非常喜欢 WMR 预渲染的简单性和可扩展性，觉得它在我们的 Vite 预设中非常缺乏，所以我们考虑将其移植过来，并做一些小调整以解决我们的担忧。稍作努力后，瞧，通过插件实现预渲染！

首先，这里是预渲染"Hello World"应用的示例。

> 提示：我们的 Vite 初始化器（`$ npm create preact`）可以为你设置这个，还有一些其他补充选项，如路由、TypeScript 等。如果你有兴趣尝试我们的预渲染，这是最快速上手的方式。

首先，通过在 `@preact/preset-vite` 的插件选项中设置 `prerender: { enabled: true }` 来启用预渲染：

```diff
// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact({
+			prerender: { enabled: true }
		}),
	],
});
```

...然后在包含我们 `prerender()` 函数的脚本中添加 `prerender` 属性——这让插件知道在哪里找到它。虽然你可以将其设置为任何你喜欢的脚本，但在我们的示例中，它始终在我们的应用根目录中。

```diff
// index.html
-<script type="module" src="/src/index.jsx"></script>
+<script prerender type="module" src="/src/index.jsx"></script>
```

...最后，对我们的应用根目录做几处调整：

1. 将 `render` 切换为 `hydrate`
	* 来自 `preact-iso` 的 `hydrate` 是一个非常小的工具，它决定是渲染应用还是水合，取决于它是否能在文档上找到现有的标记。在开发中它会使用 `render`，但在生产中，使用预渲染的 HTML，它会使用 `hydrate`。
	* 我们需要添加一个窗口检查（`typeof window !== undefined`），以确保我们在 SSR 期间不会在 Node 中尝试访问浏览器全局变量 `document`。

2. 添加我们的 `prerender()` 导出
	* 这是预渲染的促进者，它完全由用户控制。你决定如何渲染你的应用，向根组件传递哪些 props，对 HTML 进行任何调整，运行你想要的任何后处理等。插件只需要返回一个包含你的 HTML 字符串的 `html` 属性的对象。
	* 对于我们这里的示例，我们将使用来自 `preact-iso` 的 `prerender`，它是 `preact-render-to-string` 中 `renderToStringAsync` 的一个薄包装，有一个主要优势：它自动收集并返回它在你预渲染的页面中找到的相对链接。然后预渲染插件可以使用这些链接来"遍历"你的应用，自行发现页面。我们稍后会进一步展示这一点。

```diff
// src/index.jsx
-import { render } from 'preact';
+import { hydrate, prerender as ssr } from 'preact-iso';

function App() {
    return <h1>Hello World!</h1>
}

-render(<App />, document.getElementById('app'));
+if (typeof window !== 'undefined') {
+	hydrate(<App />, document.getElementById('app'));
+}

+export async function prerender(data) {
+    return await ssr(<App {...data} />)
+}
```

设置完成后，你将拥有一个预渲染的应用。然而，没有应用真的这么简单，所以让我们看看几个更复杂的例子。

### 完整 API 示例

```jsx
// src/index.jsx

// ...

export async function prerender(data) {
	const { html, links: discoveredLinks } = ssr(<App />);

	return {
		html,
		// 可选添加应该预渲染的其他链接
		// （如果它们尚未预渲染 —— 这些将被去重）
		links: new Set([...discoveredLinks, '/foo', '/bar']),
		// 可选配置并添加元素到预渲染的 HTML 文档的 `<head>` 中
		head: {
			// 设置"lang"属性：`<html lang="en">`
			lang: 'en',
			// 为当前页面设置标题：`<title>My cool page</title>`
			title: 'My cool page',
			// 设置你想注入到 `<head>` 中的任何其他元素：
			//   <link rel="stylesheet" href="foo.css">
			//   <meta property="og:title" content="Social media title">
			elements: new Set([
				{ type: 'link', props: { rel: 'stylesheet', href: 'foo.css' } },
				{ type: 'meta', props: { property: 'og:title', content: 'Social media title' } }
			])
		}
	}
}
```

### 使用基于 Suspense 的获取同构地获取内容

```jsx
// src/use-fetch.js
import { useState } from "preact/hooks";

const cache = new Map();

async function load(url) {
	const res = await fetch(url);
	if (res.ok) return await res.text();
	throw new Error(`Failed to fetch ${url}!`);
}

// 带缓存的简单基于 suspense 的获取机制
export function useFetch(url) {
	const [_, update] = useState({});

	let data = cache.get(url);
	if (!data) {
		data = load(url);
		cache.set(url, data);
		data.then(
			(res) => update((data.res = res)),
			(err) => update((data.err = err)),
		);
	}

	if (data.res) return data.res;
	if (data.err) throw data.err;
	throw data;
}
```

```jsx
// src/index.jsx
import { hydrate, prerender as ssr } from 'preact-iso';
import { useFetch } from './use-fetch.js';

function App() {
    return (
        <div>
            <Suspense fallback={<p>Loading...</p>}>
                <Article />
            </Suspense>
        </div>
    );
}

function Article() {
	const data = useFetch("/my-local-article.txt");
	return <p>{data}</p>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    return await ssr(<App {...data} />)
}
```

### 使用 `globalThis` 传递数据

```js
// src/title-util.js
import { useEffect } from 'preact/hooks';

/**
 * 设置 `document.title` 或 `globalThis.title`
 * @param {string} title
 */
export function useTitle(title) {
	if (typeof window === 'undefined') {
		globalThis.title = createTitle(title);
	}
	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title]);
}
```

```jsx
// src/index.jsx
import { LocationProvider, Router, hydrate, prerender as ssr } from 'preact-iso';

import { useTitle } from './title-util.js'

function App() {
    return (
        <LocationProvider>
            <main>
                <Home path="/" />
                <NotFound default />
            </main>
        </LocationProvider>
    );
}

function Home() {
    useTitle('Preact - Home');
    return <h1>Hello World!</h1>;
}

function NotFound() {
    useTitle('Preact - 404');
    return <h1>页面未找到</h1>;
}

if (typeof window !== 'undefined') {
    hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    const { html, links } = await ssr(<App {...data} />);

    return {
        html,
        links,
        head: {
            title: globalThis.title,
            elements: new Set([
                { type: 'meta', props: { property: 'og:title', content: globalThis.title } },
            ])
        }
    };
}
```

虽然不太常见，但你也可以使用这种模式的变体来初始化并将预渲染数据深入传递到你的应用中，跳过对全局存储/上下文(store/context)的需求。

```jsx
// src/some/deep/Component.jsx
function MyComponent({ myFetchData }) {
	const [myData, setMyData] = useState(myFetchData || 'some-fallback');
	// ...
}
```

```js
let initialized = false;
export async function prerender(data) {
    const init = async () => {
        const res = await fetch(...);
        if (res.ok) globalThis.myFetchData = await res.json();

        initialized = true;
    }
    if (!initialized) await init();

    const { html, links } = await ssr(<App {...data} />);
    // ...
}
```

---

对于好奇"这一切是如何工作的"的人，可以分为三个简单步骤：

1. 设置

	我们将包含你导出的 `prerender()` 函数的脚本设置为额外输入，并告诉 Rollup 保留入口签名，使我们能够在构建后访问和调用该函数。

2. 构建

	我们让 Vite 像往常一样构建你的应用：编译 JSX，运行插件，优化资产等。

3. 预渲染

  在插件的 `generateBundle` 阶段，我们开始生成 HTML。从 `/` 开始，我们开始在 Node 中执行构建好的 JS 包，调用你的 `prerender()` 函数，并将其返回的 HTML 插入到你的 `index.html` 文档中，最后将结果写入指定的输出目录。你的 `prerender()` 函数返回的任何新链接都会被排队，下一步处理。

  当我们用完了要反馈给你的应用的 URL 时，预渲染就完成了。之后，Vite 将继续完成构建过程，运行你可能拥有的任何其他插件。你的预渲染应用将立即可用，无需后续构建或脚本。

### 一些不错的功能

- 基于文件系统的 `fetch()` 实现（如"同构获取"示例所示）
	- 在你拿起你的干草叉之前，请听我们说！在预渲染期间（仅在预渲染期间），我们修补 `fetch()` 以允许直接从文件系统读取文件。这允许你在预渲染期间使用静态文件（文本、JSON、Markdown 等），而无需启动服务器来使用它。你可以在预渲染期间使用与浏览器中相同的文件路径。
	- 事实上，这就是我们构建你正在阅读的页面的方式！`fetch('/content/blog/preact-prerender.json')`，当你导航到这个页面时触发的，在预渲染期间大致转换为 `new Response(await fs.readFile('/content/blog/preact-prerender.json'))`。我们读取文件，将其包装在 `Response` 中以模拟网络请求，并将其提供回你的应用 —— 你的应用可以在预渲染和客户端使用相同的 `fetch()` 请求。
	- 将其与 suspense 和异步 SSR 实现配对，提供了非常棒的开发体验。

- 爬取链接
	- 部分由用户提供的 `prerender()` 函数导出支持，部分由插件支持，你可以在预渲染页面时返回一组链接（`preact-iso` 使这变得非常简单），这些链接将被添加到插件的待预渲染 URL 列表中。这将允许插件在构建时爬取你的网站，自然地找到更多要预渲染的页面。
	- 你也可以通过插件选项手动提供链接，或者在 `preact-iso` 返回的链接中附加一些，如我们在完整 API 示例中所示。这对于错误页面特别有用，如 `/404`，可能没有链接但你仍然希望预渲染。

...也许最大的优势是：

- 通过在配置文件中翻转布尔值(Boolean)来切换它
	- 因为我们不是包装器，并且因为你不需要更改源代码来支持它（除了一些窗口检查），所以根本没有锁定。如果你决定离开，或者你想对你的输出做一些测试，你只需要翻转一个布尔值，你就又回到了带有 Vite 的普通 SPA。
	- 正如我们多次提到的，预渲染在尽可能接近"即插即用"时效果最好，这包括能够随心所欲地退出。对我们来说，重要的是你可以以最小的努力从 SPA 到预渲染再返回。

## 最后说明

Vite 团队可能希望我们提到，这个插件确实对生成的客户端代码引入了一个小补丁，而且他们（Vite 团队）不一定认可在 Node 中运行浏览器捆绑包。

问题中的补丁如下：

```diff
// src/node/plugins/importAnalysisBuild.ts
-if (__VITE_IS_MODERN__ && deps && deps.length > 0) {,
+if (__VITE_IS_MODERN__ && deps && deps.length > 0 && typeof window !== 'undefined') {,
	 const links = document.getElementsByTagName('link')
	 ...
```

由于尝试执行 `document.getElementsByTagName` 在没有 `document` 的 Node 中会出错，我们只是向预加载器添加了一个额外条件，使其不会在 Node 中尝试运行，就是这样。只是这一行的部分更改，在预渲染期间本来就没什么用。

我们对这种风险水平非常满意，并且已经在没有任何问题的情况下大量使用它一段时间了，但是，这有点超出了工具的预期用途，这是我们想要披露的。

对于任何非 Preact 用户，好消息：我们的插件完全与框架无关！为了使其在任何其他框架中稍微更容易使用，它也以 [`vite-prerender-plugin`](https://npm.im/vite-prerender-plugin) 的形式提供。功能相同，与 `@preact/preset-vite` 保持同步，但删除了 Preact 预设插件中附带的其他 Preact 特定实用程序。