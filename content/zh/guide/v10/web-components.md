---
title: Web Components
description: How to use web components with Preact
---

# Web Components

Preact 的微小体积和标准优先的方法使其成为构建 web components 的绝佳选择。

Web Components 是一套标准，使得构建新的 HTML 元素类型成为可能 - 自定义元素如 `<material-card>` 或 `<tab-bar>`。
Preact [完全支持这些标准](https://custom-elements-everywhere.com/#preact)，允许无缝使用自定义元素的生命周期、属性和事件。

Preact 被设计为可以渲染完整应用和页面的独立部分，使其自然适合构建 Web Components。许多公司使用它来构建组件或设计系统，然后将其封装成一组 Web Components，从而实现跨多个项目和其他框架的重用。

Preact 和 Web Components 是互补的技术：Web Components 提供了一组用于扩展浏览器的低级原语，而 Preact 提供了可以建立在这些原语之上的高级组件模型。

---

<toc></toc>

---

## 渲染 Web Components

在 Preact 中，web components 的工作方式就像其他 DOM 元素一样。它们可以使用其注册的标签名进行渲染：

```jsx
customElements.define('x-foo', class extends HTMLElement {
  // ...
});

function Foo() {
  return <x-foo />;
}
```

### 属性和特性

JSX 不提供区分属性（properties）和特性（attributes）的方式。自定义元素通常依赖于自定义属性，以支持设置无法通过特性表达的复杂值。这在 Preact 中运行良好，因为渲染器通过检查受影响的 DOM 元素自动确定是使用属性还是特性设置值。当自定义元素为给定属性定义了[设置器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)时，Preact 会检测其存在并使用设置器而不是特性。

```jsx
customElements.define('context-menu', class extends HTMLElement {
  set position({ x, y }) {
    this.style.cssText = `left:${x}px; top:${y}px;`;
  }
});

function Foo() {
  return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

> **注意：** Preact 不对命名方案做任何假设，也不会尝试强制转换 JSX 或其他方式中的名称为 DOM 属性。如果自定义元素有一个属性名 `someProperty`，则需要使用 `someProperty=...` 而不是 `some-property=...` 来设置它。

当使用 `preact-render-to-string`（"SSR"）渲染静态 HTML 时，复杂的属性值如上面的对象不会自动序列化。它们在客户端对静态 HTML 进行水合后应用。

### 访问实例方法

要能够访问自定义 web 组件的实例，我们可以利用 `refs`：

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

### 触发自定义事件

Preact 规范化了标准内置 DOM 事件的大小写，这些事件通常是区分大小写的。这就是为什么可以向 `<input>` 传递 `onChange` 属性，尽管实际的事件名称是 `"change"`。自定义元素经常触发自定义事件作为其公共 API 的一部分，但是无法知道可能会触发什么自定义事件。为了确保在 Preact 中无缝支持自定义元素，传递给 DOM 元素的无法识别的事件处理程序属性会使用其完全按指定的大小写进行注册。

```jsx
// 内置 DOM 事件：监听 "click" 事件
<input onClick={() => console.log('click')} />

// 自定义元素：监听 "TabChange" 事件（区分大小写！）
<tab-bar onTabChange={() => console.log('tab change')} />

// 修正：监听 "tabchange" 事件（小写）
<tab-bar ontabchange={() => console.log('tab change')} />
```

## 创建 Web Component

任何 Preact 组件都可以通过 [preact-custom-element](https://github.com/preactjs/preact-custom-element) 转变为 web 组件，这是一个非常轻量级的包装器，遵循自定义元素 v1 规范。

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => (
  <p>Hello, {name}!</p>
);

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      HTML 标签名       |       使用 shadow-dom
//   组件定义            观察的属性
```

> 注意：根据[自定义元素规范](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname)，标签名必须包含连字符（`-`）。

在 HTML 中使用新的标签名，属性键和值将作为 props 传递：

```html
<x-greeting name="Billy Jo"></x-greeting>
```

输出：

```html
<p>Hello, Billy Jo!</p>
```

### 观察的属性

Web Components 要求明确列出你想要观察的属性名称，以便在它们的值发生变化时做出响应。这些可以通过传递给 `register()` 函数的第三个参数指定：

```jsx
// 监听 `name` 属性的变化
register(Greeting, 'x-greeting', ['name']);
```

如果你省略 `register()` 的第三个参数，要观察的属性列表可以使用组件上的静态 `observedAttributes` 属性指定。自定义元素的名称也可以使用静态 `tagName` 属性指定：

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
  // 注册为 <x-greeting>：
  static tagName = 'x-greeting';

  // 跟踪这些属性：
  static observedAttributes = ['name'];

  render({ name }) {
    return <p>Hello, {name}!</p>;
  }
}
register(Greeting);
```

如果没有指定 `observedAttributes`，如果组件上存在 `propTypes`，它们将从 `propTypes` 的键中推断：

```jsx
// 另一种选择：使用 PropTypes：
function FullName({ first, last }) {
  return <span>{first} {last}</span>
}

FullName.propTypes = {
  first: Object,   // 你可以使用 PropTypes，或者这个
  last: Object     // 技巧来定义无类型的属性。
};

register(FullName, 'full-name');
```

### 将插槽作为属性传递

`register()` 函数有第四个参数用于传递选项；目前，只支持 `shadow` 选项，它将 shadow DOM 树附加到指定的元素。启用时，这允许使用命名的 `<slot>` 元素将自定义元素的子元素转发到 shadow 树中的特定位置。

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

用法：

```html
<text-section>
  <span slot="heading">漂亮的标题</span>
  <span slot="content">很棒的内容</span>
</text-section>
``` 