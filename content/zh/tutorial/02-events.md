---
prev: /tutorial/01-vdom
next: /tutorial/03-components
title: 事件
solvable: true
---

事件是应用对用户交互 (如键盘、鼠标输入或图像载入) 做出反馈的关键，您可以在 Preact 中使用所有 DOM 事件或行为 (参见 [MDN])。举个例子，下面是使用 DOM API 注册事件处理程序的方式：

```js
function clicked() {
  console.log('clicked')
}
const myButton = document.getElementById('my-button')
myButton.addEventListener('click', clicked)
```

但 Preact 与 DOM API 注册事件处理程序的的方式不同，我们会将事件处理程序传递为元素的属性，就像 `style` 和 `class` 一样。通常来说，以 "on" 为开头的属性都是事件处理程序，传递进去的值则是实际的事件处理函数。

举例来说，我们可以通过为元素添加 `onClick` 属性并传入处理函数来监听按钮按下事件：

```jsx
function clicked() {
  console.log('clicked')
}
<button onClick={clicked}>
```

事件处理程序的名称和属性名称一样，均区分大小写。但是，Preact 会检测您是不是在为元素注册标准事件类型 (click、change、touchmove 等等)，并在幕后自动为您选择正确的函数。这就是为什么可以使用 `<button onClick={..}>` 来监听小写的 `“click”` 事件。

---

## 动手试试！

最后，我们请您来试试为右侧的按钮元素添加自己的按下事件处理程序。在您的函数中，您需要像上例一样使用 `console.log()` 来输出一条日志信息。

如果您的代码能运行了，那就按下按钮调用您的函数，开始下一章吧！

<solution>
  <h4>🎉 恭喜！</h4>
  <p>您学会了如何在 Preact 中处理事件！</p>
</solution>


```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function() {
    store.setState({ solved: true });
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from "preact";

function App() {
  return (
    <div>
      <p class="count">计数：</p>
      <button>点我！</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function App() {
  const clicked = () => {
    console.log('hi')
  }

  return (
    <div>
      <p class="count">计数：</p>
      <button onClick={clicked}>点我！</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[MDN]: https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events
