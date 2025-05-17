---
title: Keys
prev: /tutorial/07-side-effects
next: /tutorial/09-error-handling
solvable: true
---

# 键

在第一章中，我们看到了Preact如何使用虚拟DOM来计算我们的JSX描述的两棵树之间的变化，然后将这些变化应用到HTML DOM上以更新页面。这在大多数情况下都能很好地工作，但有时需要Preact"猜测"树的形状在两次渲染之间是如何变化的。

Preact的猜测可能与我们的意图不同的最常见场景是比较列表时。考虑一个简单的待办事项列表组件：

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['起床', '整理床铺'])

  function wakeUp() {
    setTodos(['整理床铺'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
      <button onClick={wakeUp}>我醒了！</button>
    </div>
  )
}
```

这个组件第一次渲染时，将绘制两个`<li>`列表项。点击__"我醒了！"__按钮后，我们的`todos`状态数组更新为只包含第二项，`"整理床铺"`。

以下是Preact在第一次和第二次渲染时"看到"的内容：

<table><thead><tr>
  <th>第一次渲染</th>
  <th>第二次渲染</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li>起床</li>
    <li>整理床铺</li>
  </ul>
  <button>我醒了！</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>
    <li>整理床铺</li>

  </ul>
  <button>我醒了！</button>
</div>
```

</td></tr></tbody></table>

注意到问题了吗？虽然对我们来说很明显是移除了_第一个_列表项（"起床"），但Preact不知道这一点。Preact只看到之前有两个项目，现在只有一个。在应用这个更新时，它实际上会移除第二个项目（`<li>整理床铺</li>`），然后将第一个项目的文本从`起床`更新为`整理床铺`。

结果在技术上是正确的 - 一个带有文本"整理床铺"的单个项目 - 但我们达到这个结果的方式是次优的。想象一下，如果有1000个列表项，而我们移除了第一个项目：Preact不会仅移除一个`<li>`，而是会更新其他999个项目的文本并移除最后一个。


### 列表渲染的**key**

在像前面例子那样的情况下，项目的_顺序_正在改变。我们需要一种方法来帮助Preact知道哪些项目是哪些，这样它就可以检测到每个项目何时被添加、移除或替换。为此，我们可以向每个项目添加一个`key`属性。

`key`属性是给定元素的标识符。Preact在比较两棵树之间的元素时，不是比较元素的_顺序_，而是通过查找具有相同`key`属性值的前一个元素来比较带有`key`属性的元素。`key`可以是任何类型的值，只要它在渲染之间是"稳定的"：同一项目的重复渲染应该具有完全相同的`key`属性值。

让我们在前面的例子中添加键。由于我们的待办事项列表是一个简单的不会改变的字符串数组，我们可以使用这些字符串作为键：

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['起床', '整理床铺'])

  function wakeUp() {
    setTodos(['整理床铺'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo}>{todo}</li>
          //  ^^^^^^^^^^ 添加key属性
        ))}
      </ul>
      <button onClick={wakeUp}>我醒了！</button>
    </div>
  )
}
```

第一次渲染这个新版本的`<TodoList>`组件时，将绘制两个`<li>`项目。当点击"我醒了！"按钮时，我们的`todos`状态数组更新为只包含第二项，`"整理床铺"`。

以下是我们添加了`key`到列表项后Preact看到的内容：

<table><thead><tr>
  <th>第一次渲染</th>
  <th>第二次渲染</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key="起床">起床</li>
    <li key="整理床铺">整理床铺</li>
  </ul>
  <button>我醒了！</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>

    <li key="整理床铺">整理床铺</li>
  </ul>
  <button>我醒了！</button>
</div>
```

</td></tr></tbody></table>

这次，Preact可以看到第一项被移除了，因为第二棵树中缺少一个带有`key="起床"`的项目。它将移除第一项，并保持第二项不变。


### 何时**不**使用键

开发者遇到的最常见的一个陷阱是无意中选择了在渲染之间_不稳定_的键。在我们的例子中，想象一下，如果我们使用`map()`的索引参数作为我们的`key`值，而不是`item`字符串本身：

`items.map((item, index) => <li key={index}>{item}</li>`

这将导致Preact在第一次和第二次渲染时看到以下树：

<table><thead><tr>
  <th>第一次渲染</th>
  <th>第二次渲染</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key={0}>起床</li>
    <li key={1}>整理床铺</li>
  </ul>
  <button>我醒了！</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>

    <li key={0}>整理床铺</li>
  </ul>
  <button>我醒了！</button>
</div>
```

</td></tr></tbody></table>

问题是`index`实际上并不标识列表中的一个_**值**_，它标识的是一个_**位置**_。这种方式的渲染实际上_强制_Preact按顺序匹配项目，这与没有key存在时它会做的事情相同。当应用于具有不同类型的列表项时，使用索引键甚至可能导致昂贵或错误的输出，因为键不能匹配具有不同类型的元素。

> 🚙 **类比时间！** 想象你把车留给代客泊车。
>
> 当你回来取车时，你告诉代客你开的是一辆灰色SUV。不幸的是，停车场里有一半以上的车都是灰色SUV，你最终得到了别人的车。下一个灰色SUV的车主也拿到了错误的车，依此类推。
>
> 如果你告诉代客你开的是一辆带有车牌"PR3ACT"的灰色SUV，你可以确定会拿回自己的车。

<!--
> 🍫 **巧克力类比：** 想象一个朋友拿着一盒巧克力，问你是否愿意尝试一个。你看中了薄荷松露巧克力。
>
> 如果你回答"第四个"，那么如果巧克力被调换或重新排序，你可能会拿到错误的巧克力。（惊讶！）
>
> 如果你回答"薄荷松露巧克力"，无论顺序如何，都很清楚你对哪个巧克力感兴趣。
-->

作为一般经验法则，永远不要使用数组或循环索引作为`key`。使用列表项值本身，或为项目生成唯一ID并使用它：

```jsx
const todos = [
  { id: 1, text: '起床' },
  { id: 2, text: '整理床铺' }
]

export default function ToDos() {
  const [todos, setTodos] = useState([
    { id: 1, text: '起床' },
    { id: 2, text: '整理床铺' }
  ])

  function wakeUp() {
    setTodos([
      { id: 2, text: '整理床铺' }
    ])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <button onClick={wakeUp}>我醒了！</button>
    </div>
  )
}
```

## 试一试！

下面的示例显示了一个ToDo列表，你可以通过点击复选框来完成每个项目。当前，完成一个项目会从列表中移除它，但由于我们没有使用`key`属性，Preact会更新所有待办事项的文本并移除最后一个，而不是移除被点击的那个。

添加一个`key`属性到`<li>`元素，使Preact可以正确识别哪个todo被点击并从列表中移除。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你学会了如何使用键进行高效的列表渲染！</p>
</solution>


```js:setup
useRealm(function (realm) {
  // the app element
  var out = realm.globalThis.document.body.firstElementChild;
  var options = require('preact').options;

  var oldRender = options.__r;
  var timer;
  options.__r = function(vnode) {
    timer = setTimeout(check, 10);
    if (oldRender) oldRender(vnode);
  };

  function check() {
    timer = null;
    var c = out.firstElementChild.children;
    if (
      c.length === 2 &&
      /learn preact/i.test(c[0].textContent) &&
      /make an awesome app/i.test(c[1].textContent)
    ) {
      solutionCtx.setSolved(true);
    }
  }

  return () => {
    options.__r = oldRender;
  };
});
```


```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'learn Preact', done: false },
    { id: 2, text: 'make an awesome app', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  return (
    <ul>
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'learn Preact', done: false },
    { id: 2, text: 'make an awesome app', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getTodos().then(todos => {
      setTodos(todos)
    })
  }, [])

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));
```
