---
title: State
prev: /tutorial/03-components
next: /tutorial/05-refs
solvable: true
---

# 状态

现在我们已经知道如何创建HTML元素和组件，以及如何使用JSX向两者传递props和事件处理程序，是时候学习如何更新虚拟DOM树了。

正如我们在上一章中提到的，函数组件和类组件都可以有**状态**——组件存储的用于更改其虚拟DOM树的数据。当组件更新其状态时，Preact使用更新后的状态值重新渲染该组件。对于函数组件，这意味着Preact将重新调用该函数，而对于类组件，它只会重新调用类的`render()`方法。让我们看看每种情况的例子。

### 类组件中的状态

类组件有一个`state`属性，它是一个对象，存储组件在调用其`render()`方法时可以使用的数据。组件可以调用`this.setState()`来更新其`state`属性并请求Preact重新渲染它。

```jsx
class MyButton extends Component {
  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: true })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.clicked ? '已点击' : '尚未点击'}
      </button>
    )
  }
}
```

点击按钮调用`this.setState()`，这会导致Preact再次调用类的`render()`方法。现在`this.state.clicked`是`true`，`render()`方法返回包含文本"已点击"而不是"尚未点击"的虚拟DOM树，导致Preact更新DOM中按钮的文本。

### 使用钩子的函数组件中的状态

函数组件也可以有状态！虽然它们没有像类组件那样的`this.state`属性，但Preact包含了一个小型附加模块，提供了在函数组件内存储和处理状态的函数，称为"钩子"。

钩子是可以从函数组件内部调用的特殊函数。它们之所以特殊，是因为它们**在渲染之间记住信息**，有点像类上的属性和方法。例如，`useState`钩子返回一个数组，包含一个值和一个"设置器"函数，可以调用该函数来更新那个值。当一个组件被多次调用（重新渲染）时，它所做的任何`useState()`调用每次都会返回完全相同的数组。

> ℹ️ **_钩子实际上是如何工作的？_**
>
> 在幕后，像`setState`这样的钩子函数通过存储与虚拟DOM树中的每个组件相关联的一系列"插槽"中的数据来工作。调用钩子函数会使用一个插槽，并增加内部"插槽编号"计数器，以便下一次调用使用下一个插槽。Preact在调用每个组件之前重置这个计数器，所以当一个组件被多次渲染时，每个钩子调用都与相同的插槽相关联。
>
> ```js
> function User() {
>   const [name, setName] = useState("Bob")    // 插槽 0
>   const [age, setAge] = useState(42)         // 插槽 1
>   const [online, setOnline] = useState(true) // 插槽 2
> }
> ```
>
> 这被称为调用站点排序，这就是为什么钩子必须始终在组件内以相同的顺序调用，并且不能在条件语句或循环内调用的原因。

让我们看一个`useState`钩子的实际例子：

```jsx
import { useState } from 'preact/hooks'

const MyButton = () => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
  }

  return (
    <button onClick={handleClick}>
      {clicked ? '已点击' : '尚未点击'}
    </button>
  )
}
```

点击按钮调用`setClicked(true)`，这会更新由我们的`useState()`调用创建的状态字段，从而导致Preact重新渲染此组件。当组件第二次被渲染（调用）时，`clicked`状态字段的值将为`true`，返回的虚拟DOM将具有文本"已点击"而不是"尚未点击"。这将导致Preact更新DOM中按钮的文本。

---

## 试一试！

让我们尝试创建一个计数器，从我们在上一章中编写的代码开始。我们需要在状态中存储一个`count`数字，并在点击按钮时将其值增加`1`。

由于我们在上一章中使用了函数组件，使用钩子可能是最简单的，尽管你可以选择你喜欢的任何存储状态的方法。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你学会了如何使用状态！</p>
</solution>


```js:setup
useResult(function () {
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (oe) oe.apply(this, arguments);

    if (e.currentTarget.localName !== 'button') return;
    var root = e.currentTarget.parentNode.parentNode;
    var text = root.innerText.match(/Count:\s*([\w.-]*)/i);
    if (!text) return;
    if (!text[1].match(/^-?\d+$/)) {
      return console.warn('提示：看起来你没有在任何地方渲染{count}。');
    }
    setTimeout(function() {
      var text2 = root.innerText.match(/Count:\s*([\w.-]*)/i);
      if (!text2) {
        return console.warn('提示：你记得渲染{count}了吗？');
      }
      if (text2[1] == text[1]) {
        return console.warn('提示：记得调用"设置器"函数来更改`count`的值。');
      }
      if (!text2[1].match(/^-?\d+$/)) {
        return console.warn('提示：看起来`count`被设置为了数字以外的东西。');
      }

      if (Number(text2[1]) === Number(text[1]) + 1) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  }

  return function () {
    options.event = oe;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    // 在这里将count加1
  }

  return (
    <div>
      <p class="count">计数：</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>点击我</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const [count, setCount] = useState(0)

  const clicked = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p class="count">计数：{count}</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>点击我</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v10/components#lifecycle-methods
</rewritten_file> 