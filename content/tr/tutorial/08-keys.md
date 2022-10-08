---
prev: /tutorial/07-side-effects
next: /tutorial/09-error-handling
title: Keys
solvable: true
---

In chapter one, we saw how Preact uses a Virtual DOM to calculate what
changed between two trees described by our JSX, then applies those
changes to the HTML DOM to update pages. This works well for most
scenarios, but occasionally requires that Preact "guesses" how
the shape of the tree has changed between two renders.

The most common scenario where Preact's guess is likely to be different
than our intent is when comparing lists. Consider a simple to-do list
component:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['wake up', 'make bed'])

  function wakeUp() {
    setTodos(['make bed'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
      <button onClick={wakeUp}>I'm Awake!</button>
    </div>
  )
}
```

The first time this component is rendered, two `<li>` list items will
be drawn. After clicking the __"I'm Awake!"__ button, our `todos` state
Array is updated to contain only the second item, `"make bed"`.

Here's what Preact "sees" for the first and second renders:

<table><thead><tr>
  <th>First Render</th>
  <th>Second Render</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li>wake up</li>
    <li>make bed</li>
  </ul>
  <button>I'm Awake!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>
    <li>make bed</li>

  </ul>
  <button>I'm Awake!</button>
</div>
```

</td></tr></tbody></table>

Notice a problem? While it's clear to us that the _first_ list item
("wake up") was removed, Preact doesn't know that. All Preact sees
is that there were two items, and now there is one. When applying this
update, it will actually remove the second item (`<li>make bed</li>`),
then update the text of the first item from `wake up` to `make bed`.

The result is technically correct – a single item with the text "make bed"
– the way we arrived at that result was suboptimal. Imagine if there
were 1000 list items and we removed the first item: instead of removing
a single `<li>`, Preact would update the text of the first 999 other items
and remove the last one.


### The **key** to list rendering

In situations like the previous example, items are changing _order_.
We need a way to help Preact know which items are which, so it can
detect when each item is added, removed or replaced. To do this, we
can add a `key` prop to each item.

The `key` prop is an identifier for a given element. Instead of comparing
the _order_ of elements between two trees, elements with a `key` prop are
compared by finding the previous element with that same `key` prop value.
A `key` can be any type of value, as long as it is "stable" between
renders: repeated renders of the same item should have the exact same
`key` prop value.

Let's add keys to the previous example. Since our todo list is a simple
Array of strings that don't change, we can use those strings as keys:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['wake up', 'make bed'])

  function wakeUp() {
    setTodos(['make bed'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo}>{todo}</li>
          //  ^^^^^^^^^^ adding a key prop
        ))}
      </ul>
      <button onClick={wakeUp}>I'm Awake!</button>
    </div>
  )
}
```

The first time we render this new version of the `<TodoList>` component,
two `<li>` items will be drawn. When clicking the "I'm Awake!" button,
our `todos` state Array is updated to contain only the second item,
`"make bed"`.

Here's what Preact sees now that we've added `key` to the list items:

<table><thead><tr>
  <th>First Render</th>
  <th>Second Render</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key="wake up">wake up</li>
    <li key="make bed">make bed</li>
  </ul>
  <button>I'm Awake!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>

    <li key="make bed">make bed</li>
  </ul>
  <button>I'm Awake!</button>
</div>
```

</td></tr></tbody></table>

This time, Preact can see that the first item was removed, because
the second tree is missing an item with `key="wake up"`. It will
remove the first item, and leave the second item untouched.


### When **not** to use keys

One of the most common pitfalls developers encounter with keys is
accidentally choosing keys that are _unstable_ between renders.
In our example, imagine if we had used the index argument from `map()`
as our `key` value rather than the `item` string itself:

`items.map((item, index) => <li key={index}>{item}</li>`

This would result in Preact seeing the following trees on the first
and second render:

<table><thead><tr>
  <th>First Render</th>
  <th>Second Render</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key={0}>wake up</li>
    <li key={1}>make bed</li>
  </ul>
  <button>I'm Awake!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>

    <li key={0}>make bed</li>
  </ul>
  <button>I'm Awake!</button>
</div>
```

</td></tr></tbody></table>

The problem is that `index` doesn't actually identify a _**value**_ in
our list, it identifies a _**position**_. Rendering this way actually
_forces_ Preact to match items in-order, which is what it would have
done if no keys were present. Using index keys can even force expensive
or broken output when applied to list items with differing type, since
keys cannot match elements with differing type.

> 🚙 **Analogy Time!** Imagine you leave your car with a valet car park.
>
> When you return to pick up your car, you tell the valet you drive
> a grey SUV. Unfortunately, over half of the parked cars are grey
> SUV's, and you end up with someone else's car. The next grey SUV
> owner gets the wrong one, and so on.
>
> If you instead tell the valet you drive a grey SUV with the license
> plate "PR3ACT", you can be sure that your own car will be returned.

<!--
> 🍫 **Chocolate Analogy:** Imagine a friend is holding a box of
> chocolates, and asks you if you'd like to try one. You have your eye
> on the mint truffle.
>
> If you reply "the fourth one", there is a risk that the chocolates
> have been switched or re-ordered, and you may end up with the wrong
> chocolate. (gasp!)
>
> If you reply "the mint truffle", it would be clear which chocolate
> you were interested in trying, regardless of order.
-->

As a general rule of thumb, never use an Array or loop index as a `key`.
Use the list item value itself, or generate a unique ID for items and use
that:

```jsx
const todos = [
  { id: 1, text: 'wake up' },
  { id: 2, text: 'make bed' }
]

export default function ToDos() {
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
```

Remember: if you genuinely can't find a stable key, it's better to omit
the `key` prop entirely than to use an index as a key.


## Try it!

For this chapter's exercise, we'll combine what we learned about keys
with our knowledge of side effects from the previous chapter.

Use an effect to call the provided `getTodos()` function after `<TodoList>`
is first rendered. Note that this function returns a Promise, which
you can obtain the value of by calling `.then(value => { })`. Once
you have the Promise's value, store it in the `todos` useState hook
by calling its associated `setTodos` method.

Finally, update the JSX to render each item from `todos` as an
`<li>` containing that todo item's `.text` property value.

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>
    You've completed the second last chapter,
    and learned how to render lists effectively.
  </p>
</solution>


```js:setup
useResult(function (result) {
  var out = result.output;
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
      store.setState({ solved: true });
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
