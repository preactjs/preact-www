---
title: 与 React 的差别
description: 本文详细说明了 Preact 和 React 之间的差别
---

# 与 React 的差别

Preact 本身并没有去重新实现一遍 React。它们之间有些不同之处。但大部份差别都是很细微的，而且可以通过一个轻量的 [preact/compat] Preact 层实现 100% 兼容 React。

Preact 并没有去尝试实现 React 的每一个特性，是因为它想保持**轻量**而**专注**—— 不然给 React 项目提交优化方案会更为明智和简单，而 React 本身也已经是一个非常复杂和良好设计的代码库。

---

<toc></toc>

---

## 主要差别

Preact 与 React 的主要差别是 Preact 并没有实现一个为了大小和性能而去实现合成事件系统（synthetic event system）。Preact 是使用浏览器标准 `addEventListener` 去注册事件函数，这意味着 Preact 中的事件名称和行为都是和原生 JavaScript/ DOM 行为一致的。参考 [MDN's Event Reference] 来了解所有的 DOM 事件句柄.

标准浏览器事件的工作方式与 React 中事件的工作方式非常相似，但有一些细微的差别。在 Preact 中：

- 事件不会冒泡到 `<Portal>` 组件
- 在表单输入中时应当使用标准的 `onInput` 来代替 React 的 `onChange` (**仅当不使用 `preact/compat` 的时候**)
- 应当用 `onDblClick` 来代替 React 的 `onDoubleClick` (**仅当不使用 `preact/compat` 的时候**)
- `<input type="search">` 应当使用 `onSearch`，因为在 IE11 上 "x" 按钮并不支持 `onInput` 

另一个显著的区别是 Preact 更严格地遵循 DOM 规范。支持像任何其他元素一样的自定义元素，并且支持区分大小写的自定义事件名称（就像它们在 DOM 中一样）。

## 版本兼容

对于 preact 和 [preact/compat]， 版本兼容通过_当前_和_之前_的 React 主要版本去衡量。当 React 团队公布新的特性的时候，若符合 [Project Goals] 它们可能会被添加到 Preact 的核心代码当中。这是一个相对民主的迭代过程，我们会持续使用 issues 和 pull request 来公开、持续进行讨论和决策。

> 因此当讨论兼容性和作对比的时候，官网和文档会指明 React `15.x` 和 `17.x`。

## 调试信息和错误

我们灵活的架构允许插件以任何他们想要的方式增强 Preact 体验。其中一个插件 `preact/debug` 添加了 [帮助性的警告和错误信息](/guide/v10/debugging)且附加了 [Preact Developer Tools](https://preactjs.github.io/preact-devtools/) 浏览器插件。这些能帮助你在开发 Preact 应用时更容易发现问题。你可以通过以下代码启用这些：

```js
import "preact/debug"; // <-- 在主入口文件的顶部添加此行
```

这与 React 不同：React 需要通过一个 bundler 检查 `NODE_ENV != "production"` 以便在构建时去除调试信息。

## Preact 独有功能

Preact 实际上添加了一些受 (P)React 社区工作启发的便捷功能：

### 原生支持 ES Modules

Preact 从一开始就考虑到了 ES Modules，并且是最早支持 ES 模块的框架之一。 您可以直接在浏览器中通过 `import` 关键字加载 Preact，而无需先通过 bundler。

### `Component.render()` 中的参数

方便起见，我们将 `this.props` 和 `this.state` 传给了类组件的 `render()` 方法。看一下这个使用了一个 prop 和一个 state 属性的组件。

```jsx
// 在 Preact 和 React 都能运行
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

在 Preact 里也可以这样写：

```jsx
// Only works in Preact
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

两段代码渲染的是完全相同的东西，提供渲染参数是为了方便。

### 原始 HTML attribute/property 名称

Preact 旨在遵守所有主流浏览器支持的 DOM 规范。当将 `props` 应用于元素时，Preact 会_检测_每个 prop 是否应设置为属性或 HTML 属性。这使得在自定义元素上设置复杂的属性成为可能，但这也意味着您可以在 JSX 中使用 `class` 等属性名称：

```jsx
// This:
<div class="foo" />

// ...和下面的一样:
<div className="foo" />
```

大多数 Preact 开发者喜欢使用 `class`，因为它更短，但是两者都是支持的。

### JSX 中的 SVG

当你看到 SVG 的 properties 和 attributes 的一些名称会感觉挺有趣的。SVG 对象上的一些 properties 和 attributes 是驼峰的比如 [clipPath 元素上的 clipPathUnits](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Attributes)，而一些 attributes 是短横线的（比如 [许多 SVG 元素上的 clip-path](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation), 剩下的一些 attributes (大多数继承自 DOM，比如 `oninput`) 都是小写的。

Preact 按原样应用 SVG 属性。这意味着可以直接复制未修改的 SVG 片段并粘贴到代码中，并让它们开箱即用。这使得与设计人员用来生成图标或 SVG 插图的工具具有更好的互操作性。

```jsx
// React
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" strokeWidth="2" strokeLinejoin="round" cx="24" cy="24" r="20" />
</svg>
// Preact (note stroke-width and stroke-linejoin)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" stroke-width="2" stroke-linejoin="round" cx="24" cy="24" r="20" />
</svg>
```

如果你之前使用 React，你可能习惯于以驼峰命名法指定所有属性。这时你可以将 [preact/compat] 添加到项目中来继续使用驼峰命名的 SVG 属性名称， Preact 会映射 React API 并格式化这些属性。

### 使用 `onInput` 而不是 `onChange`

由于历史原因，React 的 `onChange` 事件的语义实际上与所有浏览器提供并支持的 `onInput` 事件相同。 大多数情况下，当你希望当一个表单发生变化时做出响应时使用 `input` 事件是最合适的。 在 Preact 核心中，当元素的值被用户_提交_时会触发标准的 [DOM 更改事件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) `onChange`。

```jsx
// React
<input onChange={e => console.log(e.currentTarget.value)} />

// Preact
<input onInput={e => console.log(e.currentTarget.value)} />
```

如果你使用 [preact/compat]，大多数 `onChange` 事件会在内部被转换为 `onInput` 来模拟 React 行为。这是我们用来确保与 React 生态系统最大兼容性的技巧之一。

### JSX 构造器

JSX 是 JavaScript 的语法扩展，可转换为嵌套函数调用。使用这些嵌套调用来构建树结构的想法早在 JSX 之前就已存在，并且之前由 [hyperscript] 项目在 JavaScript 中普及。这种方法的价值远远超出了 React 生态系统的范围，因此 Preact 推广了最初的通用社区标准。 要更深入地讨论 JSX 及其与 Hyperscript 的关系，请[阅读这篇有关 JSX 如何工作的文章](https://jasonformat.com/wtf-is-jsx)。

**Source:** (JSX)

```jsx
<a href="/">
  <span>Home</span>
</a>
```

**Output:**

```js
// Preact:
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// React:
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

最后，如果您查看 Preact 应用程序生成的输出代码，很明显，较短的无命名空间 “JSX pragma” 既更易于阅读，也更适合压缩等优化。在大多数 Preact 应用程序中，您都会遇到 `h()`，尽管使用哪个名称并不重要，因为还提供了 `createElement` 别名导出。

### 无 contextTypes 需要

旧的 `Context` API 要求组件使用 React 的 `contextTypes` 或 `childContextTypes` 声明特定属性以便接收这些值。Preact 没有这个要求：默认情况下，所有组件都会接收由 `getChildContext()` 生成的所有 context 属性。

## `preact/compat` 的功能

`preact/compat` 是我们用来翻译 React 代码为 Preact 的 **兼容** 层。对于现有的 React 用户来说，通过在你的打包工具配置中[设置一些别名](/guide/v10/getting-started#aliasing-react-to-preact)，这是一种无需更改任何代码即可尝试 Preact 的简单方法。

### Children API

`Children` API 是一组专门用于处理 `props.children` 值的方法。对于 Preact 这通常是不必要的，我们建议使用内置的数组方法。在 Preact 中，`props.children` 可以是虚拟 DOM 节点、空值（如 `null`）或虚拟 DOM 节点数组。前两种情况是最简单和最常见的，因为可以按原样使用或返回 `children`：

```jsx
// React:
function App(props) {
  return <Modal content={Children.only(props.children)} />
}

// Preact: use props.children directly:
function App(props) {
  return <Modal content={props.children} />
}
```

对于需要迭代传递给组件的子级的特殊情况，Preact 提供了一个 `toChildArray()` 方法，该方法接受任何 `props.children` 值并返回一个扁平且规范化的虚拟 DOM 节点数组。

```jsx
// React
function App(props) {
  const cols = Children.count(props.children);
  return <div data-columns={cols}>{props.children}</div>
}

// Preact
function App(props) {
  const cols = toChildArray(props.children).length;
  return <div data-columns={cols}>{props.children}</div>
}
```
`preact/compat` 提供了与 React 兼容的 `Children` API，可与现有组件库无缝集成。

### ​专用组件

[preact/compat] 附带了并非每个应用程序都必需的专用组件。 这些包括：

- [PureComponent](/guide/v10/switching-to-preact#purecomponent): 仅当 `props` 或 `state` 改变时发生
- [memo](/guide/v10/switching-to-preact#memo)：与 `PureComponent` 类似，但允许使用自定义比较函数
- [forwardRef](/guide/v10/switching-to-preact#forwardref)：向指定的子组件提供 `ref`。
- [Portals](/guide/v10/switching-to-preact#portals)：将当前树渲染到不同的 DOM 容器中
- [Suspense](/guide/v10/switching-to-preact#suspense-experimental)：**实验性** 允许在树未准备好时显示 fallback 内容
- [lazy](/guide/v10/switching-to-preact#suspense-experimental)：**实验性** 延迟加载异步代码并相应地将树标记为就绪/未就绪。

[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/switching-to-preact
[MDN's Event Reference]: https://developer.mozilla.org/en-US/docs/Web/Events
