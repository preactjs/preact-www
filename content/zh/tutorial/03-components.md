---
title: 组件
prev: /tutorial/02-events
next: /tutorial/04-state
solvable: true
---

# 组件

正如我们在本教程第一部分中提到的，虚拟DOM应用程序中的关键构建块是组件。组件是应用程序的一个独立部分，可以像HTML元素一样作为虚拟DOM树的一部分进行渲染。你可以将组件视为函数调用：两者都是允许代码重用和间接调用的机制。

为了说明这一点，让我们创建一个简单的组件，名为`MyButton`，它返回一个描述HTML`<button>`元素的虚拟DOM树：

```jsx
function MyButton(props) {
  return <button class="my-button">{props.text}</button>
}
```

我们可以通过在JSX中引用它来在应用程序中使用这个组件：

```js
let vdom = <MyButton text="点击我！" />

// 还记得createElement吗？上面那行代码会被编译成：
let vdom = createElement(MyButton, { text: "点击我！" })
```

在任何使用JSX描述HTML树的地方，你也可以描述组件树。区别在于组件在JSX中使用大写字母开头的名称来描述，该名称对应于组件的名称（一个JavaScript变量）。

当Preact渲染由JSX描述的虚拟DOM树时，它遇到的每个组件函数都将在树中的那个位置被调用。例如，我们可以通过将描述该组件的JSX元素传递给`render()`，将我们的`MyButton`组件渲染到网页的主体中：

```jsx
import { render } from 'preact';

render(<MyButton text="点击我！" />, document.body)
```

### 嵌套组件

组件可以在它们返回的虚拟DOM树中引用其他组件。这创建了一个组件树：

```jsx
function MediaPlayer() {
  return (
    <div>
      <MyButton text="播放" />
      <MyButton text="停止" />
    </div>
  )
}

render(<MediaPlayer />, document.body)
```

我们可以使用这种技术为不同的场景渲染不同的组件树。让我们让`MediaPlayer`在没有声音播放时显示"播放"按钮，在有声音播放时显示"停止"按钮：

```jsx
function MediaPlayer(props) {
  return (
    <div>
      {props.playing ? (
        <MyButton text="停止" />
      ) : (
        <MyButton text="播放" />
      )}
    </div>
  )
}

render(<MediaPlayer playing={false} />, document.body)
// 渲染 <button>播放</button>

render(<MediaPlayer playing={true} />, document.body)
// 渲染 <button>停止</button>
```

> **记住：** JSX中的`{花括号}`让我们可以回到普通JavaScript。
> 这里我们使用[三元]表达式根据`playing` prop的值显示不同的按钮。


### 组件子元素

组件也可以像HTML元素一样嵌套。组件之所以是一个强大的原语，原因之一是它们让我们可以应用自定义逻辑来控制组件内嵌套的虚拟DOM元素应该如何渲染。

这种工作方式简单得令人难以置信：在JSX中嵌套在组件内的任何虚拟DOM元素都会以特殊的`children` prop传递给该组件。组件可以选择在何处放置其子元素，方法是在JSX中使用`{children}`表达式引用它们。或者，组件可以简单地返回`children`值，Preact将在组件在虚拟DOM树中的位置渲染这些虚拟DOM元素。

```jsx
<Foo>
  <a />
  <b />
</Foo>

function Foo(props) {
  return props.children  // [<a />, <b />]
}
```

回想一下前面的例子，我们的`MyButton`组件需要一个`text` prop，作为它的显示文本插入到`<button>`元素中。如果我们想显示一个图像而不是文本呢？

让我们重写`MyButton`以允许使用`children` prop进行嵌套：

```jsx
function MyButton(props) {
  return <button class="my-button">{props.children}</button>
}

function App() {
  return (
    <MyButton>
      <img src="icon.png" />
      点击我！
    </MyButton>
  )
}

render(<App />, document.body)
```

现在我们已经看到了一些组件渲染其他组件的例子，希望嵌套组件如何让我们从许多更小的单独部分组装复杂应用程序的概念已经开始变得清晰。

---

### 组件类型

到目前为止，我们看到的组件都是函数。函数组件将`props`作为输入，并返回虚拟DOM树作为输出。组件也可以写成JavaScript类，由Preact实例化并提供一个`render()`方法，该方法的工作方式很像函数组件。

类组件是通过扩展Preact的`Component`基类创建的。在下面的例子中，注意`render()`如何将`props`作为输入并返回虚拟DOM树作为输出 - 就像函数组件一样！

```jsx
import { Component } from 'preact';

class MyButton extends Component {
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>点击我！</MyButton>, document.body)
```

我们可能使用类来定义组件的原因是为了跟踪组件的_生命周期_。每次Preact在渲染虚拟DOM树时遇到组件，它都会创建我们类的新实例（`new MyButton()`）。

然而，如果你还记得第一章的内容 - Preact可以重复接收新的虚拟DOM树。每次我们给Preact一个新树，它都会与前一个树进行比较，以确定两者之间的变化，并将这些变化应用到页面上。

当组件使用类定义时，树中对该组件的任何_更新_都将重用相同的类实例。这意味着可以在类组件内部存储数据，这些数据在下次调用其`render()`方法时将可用。

类组件还可以实现许多[生命周期方法]，Preact将在响应虚拟DOM树中的变化时调用这些方法：

```jsx
class MyButton extends Component {
  componentDidMount() {
    console.log('你好，来自新的<MyButton>组件！')
  }
  componentDidUpdate() {
    console.log('<MyButton>组件已更新！')
  }
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>点击我！</MyButton>, document.body)
// 日志："你好，来自新的<MyButton>组件！"

render(<MyButton>点击我！</MyButton>, document.body)
// 日志："<MyButton>组件已更新！"
```

类组件的生命周期使它们成为构建应用程序中响应变化的部分的有用工具，而不仅仅是严格地将`props`映射到树。它们还提供了一种方法，可以在虚拟DOM树中放置它们的每个位置分别存储信息。在下一章中，我们将看到组件如何在想要更改树时更新它们的部分。

---

## 试一试！

为了练习，让我们将我们学到的关于组件的知识与前两章的事件技能结合起来！

创建一个`MyButton`组件，它接受`style`、`children`和`onClick` props，并返回一个应用了这些props的HTML `<button>`元素。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你正在成为组件专家的路上！</p>
</solution>


```js:setup
useRealm(function (realm) {
  var options = require('preact').options;
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  var hasComponent = false;
  var check = false;

  win.console.log = function() {
    if (hasComponent && check) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  var e = options.event;
  options.event = function(e) {
    if (e.type === 'click') {
      check = true;
      setTimeout(() => check = false);
    }
  };

  var r = options.__r;
  options.__r = function(vnode) {
    if (typeof vnode.type === 'function' && /MyButton/.test(vnode.type)) {
      hasComponent = true;
    }
  }

  return function () {
    options.event = e;
    options.__r = r;
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from "preact";

function MyButton(props) {
  // start here!
}

function App() {
  const clicked = () => {
    console.log('Hello!')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <button style={{ color: 'purple' }} onClick={clicked}>Click me</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    console.log('Hello!')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Click me</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v10/components#lifecycle-methods
