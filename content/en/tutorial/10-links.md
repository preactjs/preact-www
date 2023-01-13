---
prev: /tutorial/09-error-handling
title: Congratulations!
solvable: false
---

You've completed the Preact tutorial!

Feel free to play around a bit more with the demo code.

### Next Steps

- [Learn more about class components](/guide/v10/components)
- [Learn more about hooks](/guide/v10/hooks)
- [Create your own project](https://vite.new/preact)

> **We want your feedback!**
>
> Do you feel like you learned Preact? Did you get stuck?
>
> Feedback is welcome in [this discussion](https://github.com/preactjs/preact-www/discussions/815).



```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks'

const getTodos = async () => {
  try {
    return JSON.parse(localStorage.todos)
  } catch (e) {
    return [
      { id: 1, text: 'learn Preact', done: true },
      { id: 2, text: 'make an awesome app', done: false },
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

  // every time todos changes...
  useEffect(() => {
    // ...save the list to localStorage:
    localStorage.todos = JSON.stringify(todos)
    // (try reloading the page to see saved todos!)
  }, [todos])

  function toggle(id) {
    setTodos(todos => {
      return todos.map(todo => {
        // replace the matching todo item with a version where done is toggled
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
    // pass a callback to the `todos` state setter to update its value in-place:
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
        <input name="todo" placeholder="Add ToDo [enter]" />
      </form>
    </div>
  )
}

render(<ToDos />, document.getElementById("app"));
```
