---
prev: /tutorial/09-error-handling
title: 恭喜您！
solvable: false
---

您完成了 Preact 教程！

我们欢迎您继续捣鼓捣鼓示例代码。

### 下一步

- [深入了解类组件](/guide/v10/components)
- [深入了解钩子](/guide/v10/hooks)
- [创建您的项目](https://vite.new/preact)

> **我们渴望您的反馈！**
>
> 您觉得您学会 Preact 了吗？中途卡在某个教程了吗？
>
> 我们欢迎您在[此讨论](https://github.com/preactjs/preact-www/discussions/815)中提出建议。

```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks'

const getTodos = async () => {
  try {
    return JSON.parse(localStorage.todos)
  } catch (e) {
    return [
      { id: 1, text: '学习 Preact', done: true },
      { id: 2, text: '做个好玩的应用', done: false },
    ]
  }
}

function ToDos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getTodos().then(todos => {
      setTodos(todos)
    })
  }, [])

  // 在待办事项更改时
  useEffect(() => {
    // 将列表保存进 localStorage：
    localStorage.todos = JSON.stringify(todos)
    // (试试刷新页面后能不能看到保存的待办事项！)
  }, [todos])

  function toggle(id) {
    setTodos(todos => {
      return todos.map(todo => {
        // 将匹配的待办事项替换为完成值切换后的待办事项
        if (todo.id === id) {
          todo = { ...todo, done: !todo.done }
        }
        return todo
      })
    })
  }

  function addTodo(e) {
    e.preventDefault()
    const form = e.target
    const text = form.todo.value
    // 为 `todos` 状态 setter 设置回调函数来就地更新值：
    setTodos(todos => {
      const id = todos.length + 1
      const newTodo = { id, text, done: false }
      return todos.concat(newTodo)
    })
    form.reset()
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id}>
            <label style={{ display: 'block' }}>
              <input type="checkbox" checked={todo.done} onClick={() => toggle(todo.id)} />
              {' ' + todo.text}
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={addTodo}>
        <input name="todo" placeholder="添加待办 [回车]" />
      </form>
    </div>
  )
}

render(<ToDos />, document.getElementById("app"));
```
