---
prev: /tutorial
next: /tutorial/02-events
title: 虚拟 DOM
solvable: true
---

你可能已经听到不少人提到过 "虚拟 DOM"，你想知道:
它到底是怎么"虚拟"的？ 虚拟 DOM 与我们在编程时使用的真实 DOM 有什么不同？

虚拟 DOM 是使用一个个对象拼接成树状结构的对象的概述。

```js
let vdom = {
  type: 'p',         // 一个 <p> 元素
  props: {
    class: 'big',    // 带有 class="big"
    children: [
      'Hello World!' // 和文字 "Hello World!"
    ]
  }
}
```

类似 Preact 这样的库提供了一种方式构筑这些描述，然后使用这些描述构成的虚拟 DOM 树和浏览器中真实DOM 树进行比较。
当出现不一致的情况时,浏览器中真实 DOM 树中的描述会更新为虚拟 DOM 树中的描述

这是很有用的工具，因为它让我们可以 _声明式_ 组成用户界面，而不是 _命令式_ 组成用户界面。
我们不需要描述 _如何_ 更新 DOM 来响应键盘或鼠标的输入, 我们只需要描述 DOM 在收到输入后应该是 _什么_ 样子
也就是说我们可以不断的描述给 Preact 不同的树结构，Preact 也会不断的更新浏览器的 真实 DOM 树中的描述，来匹配我们描述的树结构  - 不用管当前树结构是什么样

在本章中，我们将学习如何创建虚拟 DOM 树，以及如何才能让 Preact 对真实 DOM 进行更新用来匹配那些树结构。

### 创建虚拟 DOM 树

有几种方法来创建虚拟 DOM 树:

- `createElement()`: Preact 提供的方法

- [JSX] :类似于 HTML 的语法，可以被编译成 JavaScript

- [HTM] :类似于 HTML 的语法，可以直接编写 JavaScript

我们可以先从最简单的方法开始，那就是直接调用 Preact 的`createElement()`函数。

```jsx
import { createElement, render } from 'preact';

let vdom = createElement(
  'p',              // 一个 <p> 元素
  { class: 'big' }, // 带有 class="big"
  'Hello World!'    // 和文字 "Hello World!"
);

render(vdom, document.body);
```

上面的代码创建了一个段落元素的虚拟 DOM "描述"。createElement 中
第一个参数是 HTML 元素的名称。
第二个参数是元素的 "props" - 一个包含 attributes(或 properties)的对象，用来设置该元素。
任何其他参数都是该元素的子元素，可以是字符串（如`'Hello World!'`）或来自其他`createElement()`调用的虚拟 DOM 元素。

最后一行告诉 Preact 建立一个真实 DOM 树，与我们的虚拟 DOM 的描述相匹配,并将该 DOM 树插入网页的`<body>`中。

### 现在是JSX!


我们可以使用[JSX]重写前面的例子而不改变其功能。
JSX 让我们使用类似 HTML 的语法来描述我们的段落元素，
这有助于我们在描述更复杂的树时保证可读性。但 JSX 的缺点是
我们的代码不再是用 JavaScript 写的，而必须由像[Babel]这样的工具进行编译。
编译器的工作是将下面的 JSX 例子转换为我们之前例子看到的代码

```jsx
import { createElement, render } from 'preact';

let vdom = <p class="big">Hello World!</p>;

render(vdom, document.body);
```

它现在看起来更像HTML了!

关于 JSX 还有一件事要记住：JSX 元素内的代码(在角括号内)是特殊的语法，而不是 JavaScript。
要使用 JavaScript 语法，你首先需要从 JSX 中 "跳 "出来，使用一个`{表达式}` - 类似于模板中的字段。
下面的例子显示了两个表达式：一个是将`class`设置为一个随机字符串，另一个是计算数字。

```jsx
let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = <p class={maybeBig}>Hello {40 + 2}!</p>;
                 // ^---JS---^       ^--JS--^
```

如果我们调用了`render(vdom, document.body)`，文本 "Hello 42!"将被显示出来。

### 这一次是HTM

[HTM] 是 JSX 的一个替代品，它使用标准的 JavaScript 标记模板。
消除了对编译器的需求。如果你还没有遇到过标签模板。
它们是一种特殊的 String literal，可以包含`${expression}`字段。
```js
let str = `Quantity: ${40 + 2} units`;  // "Quantity: 42 units"
```

HTM 使用`${expression}`而不是 JSX 的`{expression}`语法，这可以使你知道你的代码中哪些部分是 HTM/JSX 元素，哪些部分是普通的 JavaScript。

```js
import { html } from 'htm/preact';

let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = html`<p class=${maybeBig}>Hello ${40 + 2}!</p>`;
                        // ^--JS--^          ^-JS-^
```


所有这些例子都产生了相同的结果：一个虚拟的 DOM 树，可以交给 Preact 用来创建或更新现有的 DOM 树。

---

### 绕行: 组件

我们将在本教程的后半部分对组件进行更详细的介绍，但现在重要的是要知道像`<p>`这样的 HTML 元素仅仅是 _两_ 种类型的其中一种虚拟 DOM 元素。另一种类型是组件，
它是一个虚拟 DOM 元素，它的类型是一个函数，而不是像`p`那样的字符串。

组件是 Virtual DOM 应用程序的构建块。现在，我们将
创建一个非常简单的组件，将我们的 JSX 移到一个函数中，这个函数将被我们渲染，所以不需要再写最后的 `render()` 行。

```jsx
import { createElement } from 'preact';

export default function App() {
	return (
		<p class="big">Hello World!</p>
	)
}
```

## 试试吧!

在这个页面的右侧，你会看到我们之前的例子中的代码位于顶部。下面是运行该代码的结果的方框。你可以编辑代码，看看你的改动是如何影响（或破坏！）结果的。


为了检验你在本章中所学到的知识，请尝试给文本添加一些更多的精彩吧
使用 HTML 标签:`<em>`和`</em>` 让文本`World`更加突出

然后，通过添加`style`属性，使所有的文本变<span style="color:purple">紫色</span>。`style`属性很特别，它允许设置一个对象,其中带有一个或多个 CSS 属性的值。
要使用一个对象作为属性值，你需要使用一个`{表达式}`，比如`style={{属性：'值'}}`。

<solution>
  <h4>🎉 恭喜!</h4>
  <p>我们已经让东西出现在屏幕上。接下来，我们将让它更具有互动性</p>
</solution>


```js:setup
useResult(function(result) {
  var hasEm = result.output.innerHTML.match(/<em>World\!?<\/em>/gi);
  var p = result.output.querySelector('p');
  var hasColor = p && p.style && p.style.color === 'purple';
  if (hasEm && hasColor) {
    store.setState({ solved: true });
  }
}, []);
```


```jsx:repl-initial
import { createElement } from 'preact';

export default function App() {
  return (
    <p class="big">Hello World!</p>
  )
}
```

```jsx:repl-final
import { createElement } from 'preact';

export default function App() {
  return (
    <p class="big" style={{ color: 'purple' }}>
      Hello <em>World</em>!
    </p>
  )
}
```

[JSX]: https://en.wikipedia.org/wiki/JSX_(JavaScript)
[HTM]: https://github.com/developit/htm
[Babel]: https://babeljs.io
