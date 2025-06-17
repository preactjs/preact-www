---
title: 调试 Preact 应用
description: 如何调试 Preact 应用。
---

# 调试 Preact 应用

Preact 自带一系列方便您调试的工具，您可以通过导入 `preact/debug` 包来使用。

我们为 Chrome 和 Firefox 提供 [Preact 开发工具]扩展程序，集成您的应用开发。

我们还会在错误发生时 (如 `<table>` 嵌套出错时) 输出警告信息。

---

<toc></toc>

---

## 安装

您可在您浏览器的扩展程序商店中下载安装 [Preact 开发工具]。

- [Chrome 版](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [Firefox 版](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)
- [Edge 版](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

安装后，您需要在您的代码中导入 `preact/debug` 包来初始化与扩展的连接。请确保此包为您整个应用程序中第一个导入的包。

> 如果你在使用 `@preact/preset-vite`，它会自动添加 `preact/debug` 包，你可以直接跳过安装和从生产中剥离的步骤！

下面是您的应用入口文件可能的样子：

```jsx
// 必须为第一个导入的包
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### 从生产环境中移除开发工具

大多数打包工具会在检测到 `if` 中存在不可达的分支时自动为您去除代码。我们仅会在开发环境中导入 `preact/debug` 包，在生产环境中则会使用此方法来删除此包、削减空间。

```jsx
// 必须为第一个导入的包
if (process.env.NODE_ENV==='development') {
  // 只能在此处使用 require 语句，import 语句仅支持顶级模块。
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

请确保您的构建工具为 `NODE_ENV` 变量设置了正确的值。

## 调试警告和错误

有时候您可能会在 Preact 检测到无效代码时遇到警告或错误，这些是为了确保您的应用能完美工作而发出的。

### `undefined` 父元素被传递进 `render()`

这意味着您的代码尝试渲染空内容，而非 DOM 节点，其区别在于：

```jsx
// Preact 实际收到的
render(<App />, undefined);

// 和您期望的
render(<App />, actualDomNode);
```

这个错误发生的主要原因是 DOM 节点在 `render()` 调用时暂不存在，请确保其存在后再调用。

### `undefined` 组件被传递至 `createElement()`

Preact 会在您传递 `undefined` 而非组件时抛出此错误，其常见原因是您混用了 `default` 和命名导出。

```jsx
// app.js
export default function App() {
  return <div>Hello World</div>;
}

// index.js：错误，因为 `app.js` 没有命名导出
import { App } from './app';
render(<App />, dom);
```

当您声明命名导出，并尝试将其作为 `default` 导出使用时此错误也会发生。您可以输出导入结果来快速检查 (假如您的编辑器没有自动为您检查的话)：

```jsx
// app.js
export function App() {
  return <div>Hello World</div>;
}

// index.js
import App from './app';

console.log(App);
// 日志：{ default: [Function] } 而非组件
```

### 两次将 JSX 字面值传递为 JSX

再次将 JSX 字面值或组件传递进 JSX 是无效的，将触发如下错误。

```jsx
const Foo = <div>foo</div>;
// 无效，Foo 已包含 JSX 元素
render(<Foo />, dom);
```

要修复此问题，我们可以直接传递变量。

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### 检测到表格中存在错误嵌套

HTML 对表格的结构有着严格规则，违反其中一条都会导致渲染错误，且很难调试。在 Preact 中，我们会检测此问题并输出错误。要了解表格结构，我们强烈推荐您参阅 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Tables/Basics)

> **注意:** 在这个语境中，“严格模式” 指的是 HTML 解析器的 输出，而非 输入。浏览器通常非常宽容，会尽可能尝试修正无效的 HTML 代码，以确保页面仍能正常显示。然而，对于 Preact 这类虚拟 DOM 库而言，这可能会引发问题。因为一旦浏览器修正了 HTML 代码，输入内容与输出内容可能会不一致，而 Preact 对此并不知情。
>
> 例如，根据规范，`<tr>` 元素必须始终作为 `<tbody>`、`<thead>` 或 `<tfoot>` 元素的子元素存在。但如果你直接将 `<tr>` 写在 `<table>` 内部，浏览器会尝试自动修正这一问题，为其添加一个 `<tbody>` 包装。此时，Preact 预期的 DOM 结构是 `<table><tr></tr></table>`，但浏览器实际构建的 DOM 结构却是 `<table><tbody><tr></tr></tbody></table>`。

### 无效 `ref` 属性

当 `ref` 属性包含异常值时我们将抛出此错误。这包括很久前即启用的字符串型 `refs`。

```jsx
// 有效
<div ref={e => {/* ... */)}} />

// 有效
const ref = createRef();
<div ref={ref} />

// 无效
<div ref="ref" />
```

### 无效事件处理程序

有些时候，您可能不小心传递了错误的事件处理程序。您必须传入 `function`，或传入 `null` 来移除，其他所有类型均无效。

```jsx
// 有效
<div onClick={() => console.log("click")} />

// 无效
<div onClick={console.log("click")} />
```

### 仅渲染方法可调用钩子

此错误会在您尝试在组件外使用钩子函数时发生，它们仅支持函数组件。

```jsx
// 无效，必须在组件内使用
const [value, setValue] = useState(0);

// 有效
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

### 已弃用获取 `vnode.[property]`

Preact X 中，我们对内部的 `vnode` 结构做出了重大变更。

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### 发现具有相同键的子元素

基于虚拟 DOM 的库一大独特性质是需要检测子元素何时被移动。但要知道何时被移动，我们先要标记它们。**注意，您仅需要在动态创建子元素时注意这点。**

```jsx
// 两个子元素都会有相同键值 "A"
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

正确的方法是为元素提供唯一键值。大多数情况下，您所遍历的数据会有一个 `id` 键。

```jsx
const persons = [
  { name: '张三', age: 22 },
  { name: '李四', age: 24}
];

// 您组件之后的操作
<div>
  {persons.map(({ name, age }) => {
    return <p key={name}>{name}, Age: {age}</p>;
  })}
</div>
```

[Preact 开发工具]: https://preactjs.github.io/preact-devtools/
