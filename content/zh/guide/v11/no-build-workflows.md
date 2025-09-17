---
title: 无构建工具工作流
description: 尽管 Webpack、Rollup 和 Vite 等构建工具功能强大且实用，但 Preact 完全支持在不使用这些工具的情况下构建应用。
---

# 无构建工具工作流

尽管 Webpack、Rollup 和 Vite 等构建工具功能强大且实用，但 Preact 完全支持在不使用这些工具的情况下构建应用。

无构建工具工作流是一种在放弃构建工具的情况下开发 Web 应用的方式，转而依赖浏览器来实现模块加载和执行。这是开始使用 Preact 的绝佳方式，并且无论项目规模大小，都能持续高效运作。

---

<toc></toc>

---

## 导入映射（Import Maps）

[导入映射](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap) 是一项较新的浏览器特性，允许您控制浏览器如何解析模块标识符，通常用于将裸模块标识符（如 `preact`）转换为 CDN URL（如 `https://esm.sh/preact`）。尽管许多人更倾向于导入映射带来的美观性，但依赖集中化也有客观优势，例如更简便的版本管理、减少/消除重复依赖，以及更好地利用更强大的 CDN 功能。

对于选择放弃构建工具的开发者，我们通常推荐使用导入映射，因为它们能解决在导入标识符中使用裸 CDN URL 时可能遇到的一些问题（下文将详述）。

### 基础用法

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap) 提供了大量关于如何使用导入映射的信息，以下是一个基础示例：

```html
<!DOCTYPE html>
<html>
	<head>
		<script type="importmap">
			{
				"imports": {
					"preact": "https://esm.sh/preact@10.23.1",
					"htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
				}
			}
		</script>
	</head>
	<body>
		<div id="app"></div>

		<script type="module">
			import { render } from 'preact';
			import { html } from 'htm/preact';

			export function App() {
				return html`
					<h1>你好，世界！</h1>
				`;
			}

			render(
				html`
					<${App} />
				`,
				document.getElementById('app')
			);
		</script>
	</body>
</html>
```

我们创建一个带有 `type="importmap"` 属性的 `<script>` 标签，并在其中以 JSON 格式定义要使用的模块。随后，在 `<script type="module">` 标签中，我们可以使用裸模块标识符导入这些模块，类似于 Node.js 中的用法。

> **重要提示：** 在上例中，我们使用了 `?external=preact`，因为 https://esm.sh 会贴心地提供所请求的模块及其依赖项——对于 `htm/preact`，这意味着同时提供一份 `preact` 副本。然而，Preact 必须作为单例使用，应用中只能包含唯一副本。
>
> 通过 `?external=preact`，我们告知 `esm.sh` 不应提供 `preact` 副本，我们会自行处理。因此，浏览器将通过导入映射解析 `preact`，确保代码使用同一份 Preact 实例。

### 示例与常见模式

虽非详尽列表，但以下是使用导入映射时可能遇到的一些常见模式和示例。若您有其他希望了解的方案，[请告知我们](https://github.com/preactjs/preact-www/issues/new)！

以下示例我们将使用 https://esm.sh 作为 CDN——这是一个出色的、专注于 ESM 的 CDN，相较于其他服务更灵活和强大，但您并非必须使用它。无论选择何种方式提供模块，请务必了解依赖策略：重复加载 `preact` 及其他某些库会导致（通常是微妙且意外的）问题。对于 `esm.sh`，我们通过 `?external` 查询参数解决此问题，但其他 CDN 可能有不同处理方式。

#### 含 Hooks、Signals 和 HTM 的 Preact

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
			"htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
		}
	}
</script>
```

#### 将 React 别名指向 Preact

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"react": "https://esm.sh/preact@10.23.1/compat",
			"react/": "https://esm.sh/preact@10.23.1/compat/",
			"react-dom": "https://esm.sh/preact@10.23.1/compat",
			"@mui/material": "https://esm.sh/@mui/material@5.16.7?external=react,react-dom"
		}
	}
</script>
```

## HTM

虽然 JSX 通常是编写 Preact 应用最流行的方式，但其需要构建步骤将非标准语法转换为浏览器及其他运行时原生可理解的代码。手动编写 `h`/`createElement` 调用可能较为繁琐且不够符合人体工学，因此我们推荐使用名为 [HTM](https://github.com/developit/htm) 的 JSX 替代方案。

HTM 无需构建步骤（尽管它可以使用，参见 [`babel-plugin-htm`](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm)），而是利用自 2015 年起存在并受所有现代浏览器支持的 [标签模板](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E6%A0%87%E7%AD%BE%E6%A8%A1%E6%9D%BF) 语法。这成为日益流行的 Preact 应用编写方式，尤其受放弃构建步骤的开发者青睐。

HTM 支持所有标准 Preact 功能，包括组件、Hooks、Signals 等，唯一区别在于编写 "JSX" 返回值的语法。

```js
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

function Button({ action, children }) {
	return html`
		<button onClick=${action}>${children}</button>
	`;
}

function Counter() {
	const [count, setCount] = useState(0);

	return html`
		<div class="counter-container">
			<${Button} action=${() => setCount(count + 1)}>增加<//>
			<input readonly value=${count} />
			<${Button} action=${() => setCount(count - 1)}>减少<//>
		</div>
	`;
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```
