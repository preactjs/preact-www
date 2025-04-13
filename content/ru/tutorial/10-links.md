---
title: Поздравляем!
prev: /tutorial/09-error-handling
solvable: false
---

# Поздравляем!

Вы завершили обучение Preact!

Не стесняйтесь поработать с демонстрационным кодом.

### Следующие шаги

- [Подробнее о классовых компонентах](/guide/v10/components)
- [Подробнее о хуках](/guide/v10/hooks)
- [Создать собственный проект](https://vite.new/preact)

> **Мы хотим получить ваши отзывы!**
>
> Чувствуете ли вы, что освоили Preact? Или вы застряли?
>
> Приветствуется обратная связь в [этом обсуждении](https://github.com/preactjs/preact-www/discussions/815).

```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks'

const getTodos = async () => {
  try {
    return JSON.parse(localStorage.todos)
  } catch (e) {
    return [
      { id: 1, text: 'изучить Preact', done: true },
      { id: 2, text: 'сделать потрясающее приложение', done: false },
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

  // каждый раз, когда меняются задачи...
  useEffect(() => {
    // ...сохранять список в localStorage:
    localStorage.todos = JSON.stringify(todos)
    // (попробуйте перезагрузить страницу, чтобы увидеть сохраненные задачи!)
  }, [todos])

  function toggle(id) {
    setTodos(todos => {
      return todos.map(todo => {
        // заменить соответствующий элемент todo версией, в которой переключатель done установлен
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
    // передать обратный вызов установщику состояния `todos` для обновления его значения in-place:
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
        <input name="todo" placeholder="Добавить задачу [enter]" />
      </form>
    </div>
  )
}

render(<ToDos />, document.getElementById("app"));
```
