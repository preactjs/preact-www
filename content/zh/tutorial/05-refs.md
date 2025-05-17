---
title: Refs
prev: /tutorial/04-state
next: /tutorial/06-context
solvable: true
---

# Refs

正如我们在第一章中学到的，DOM提供了一个命令式API，它允许我们通过调用元素上的函数来进行更改。从Preact组件访问命令式DOM API的一个例子是自动将焦点移动到输入元素。

`autoFocus`属性（或`autofocus`属性）可以用来在第一次渲染输入时聚焦它，但在某些情况下，我们希望在特定时间或响应特定事件时将焦点移动到输入框。

对于这些需要直接与DOM元素交互的情况，我们可以使用一个称为"refs"的功能。ref是一个普通的JavaScript对象，它有一个`current`属性，可以指向任何值。JavaScript对象是按引用传递的，这意味着任何有权访问ref对象的函数都可以使用`current`属性获取或设置其值。Preact不跟踪ref对象的变化，因此它们可以用于在渲染期间存储信息，然后任何有权访问ref对象的函数都可以稍后访问这些信息。

我们可以看看不渲染任何内容的ref功能的直接使用是什么样子：

```js
import { createRef } from 'preact'

// 创建一个ref:
const ref = createRef('初始值')
// { current: '初始值' }

// 读取ref的当前值:
ref.current === '初始值'

// 更新ref的当前值:
ref.current = '新值'

// 传递refs:
console.log(ref) // { current: '新值' }
```

在Preact中使refs有用的是，可以在渲染期间将ref对象传递给虚拟DOM元素，Preact将设置ref的值（其`current`属性）为相应的HTML元素。设置后，我们可以使用ref的当前值来访问和修改HTML元素：

```jsx
import { createRef } from 'preact';

// 创建一个ref:
const input = createRef()

// 将ref作为prop传递给虚拟DOM元素:
render(<input ref={input} />, document.body)

// 访问关联的DOM元素:
input.current // 一个HTML <input>元素
input.current.focus() // 聚焦输入框！
```

不建议全局使用`createRef()`，因为多次渲染会覆盖ref的当前值。相反，最好将refs存储为类属性：

```jsx
import { createRef, Component } from 'preact';

export default class App extends Component {
  input = createRef()

  // 这个函数在<App>渲染后运行
  componentDidMount() {
    // 访问关联的DOM元素:
    this.input.current.focus();
  }

  render() {
    return <input ref={this.input} />
  }
}
```

对于函数组件，`useRef()`钩子提供了一种方便的方式来创建ref并在后续渲染中访问相同的ref。下面的例子还展示了如何使用`useEffect()`钩子在组件渲染后调用回调，此时我们的ref的当前值将被设置为HTML输入元素：

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  // 创建或获取我们的ref:（钩子插槽0）
  const input = useRef()

  // 这里的回调将在<App>渲染后运行:
  useEffect(() => {
    // 访问关联的DOM元素:
    input.current.focus()
  }, [])

  return <input ref={input} />
}
```

记住，refs不限于只存储DOM元素。它们可以用于在组件的多次渲染之间存储信息，而无需设置会导致额外渲染的状态。我们将在后面的章节中看到一些这方面的用途。


## 试一试！

现在让我们通过创建一个按钮来实践这一点，当点击该按钮时，通过使用ref访问输入字段并使其获得焦点。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p><code>pro = createRef()</code> → <code>pro.current = 'you'</code></p>
</solution>


```js:setup
function patch(input) {
  if (input.__patched) return;
  input.__patched = true;
  var old = input.focus;
  input.focus = function() {
    solutionCtx.setSolved(true);
    return old.call(this);
  };
}

useResult(function (result) {
  var expectedInput;
  var timer;
  [].forEach.call(result.output.querySelectorAll('input'), patch);

  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.currentTarget.localName !== 'button') return;
    clearTimeout(timer);
    var input = e.currentTarget.parentNode.parentNode.querySelector('input');
    expectedInput = input;
    if (input) patch(input);
    timer = setTimeout(function() {
      if (expectedInput === input) {
        expectedInput = null;
      }
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  function onClick() {

  }

  return (
    <div>
      <input defaultValue="你好，世界！" />
      <button onClick={onClick}>聚焦输入框</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  const input = useRef();

  function onClick() {
    input.current.focus();
  }

  return (
    <div>
      <input ref={input} defaultValue="你好，世界！" />
      <button onClick={onClick}>聚焦输入框</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
``` 