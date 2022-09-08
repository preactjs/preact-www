---
prev: /tutorial/06-context
next: /tutorial/08-keys
title: Side Effects
solvable: true
---

Side effects are bits of code that run when changes happen in the Virtual
DOM tree. They don't follow the standard approach of accepting `props`
and returning a new Virtual DOM tree, and often reach out of the tree
to mutate state or invoke imperative code, like calling into DOM APIs.
Side effects are also often used as a way to trigger data fetching.

### Effects: side effects in function components

We've already seen one example of side effects in action in a previous
chapter, when learning about refs and the `useRef()` hook. Once our
ref was populated with a `current` property pointing to a DOM element,
we needed a way to "trigger" code that would then interact with that
element.

In order to trigger code after rendering, we used a `useEffect()` hook, which is the most common way to create a side effect from a function
component:

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  const input = useRef()

  // the callback here will run after <App> is rendered:
  useEffect(() => {
    // access the associated DOM element:
    input.current.focus()
  }, [])

  return <input ref={input} />
}
```

Notice the empty array being passed as a second argument to `useEffect()`.
Effect callbacks run when any value in that "dependencies" array changes
from one render to the next. For example, the first time a component is
rendered, all effect callbacks run because there are no previous
"dependencies" array values to compare to.

We can add values to the "dependencies" array to trigger an effect
callback based on conditions, rather than just when a component is first
rendered. This is typically used to run code in response to data changes,
or when a component is removed from the page ("unmounted").

Let's see an example:

```js
import { useEffect, useState } from 'preact/hooks';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('<App> was just rendered for the first time')
  }, [])

  useEffect(() => {
    console.log('count value was changed to: ', count)
  }, [count])
  //  ^ run this any time `count` changes, and on the first render

  return <button onClick={() => setCount(count+1)}>{count}</button>
}
```

### Lifecycle methods: class component side effects

Class components can also define side effects, by implementing any of
the available [lifecycle methods] provided by Preact. Here are a
few of the most commonly used lifecycle methods:

| Lifecycle method | When it runs: |
|:-----------------|:--------------|
| `componentWillMount` | just before a component is first rendered
| `componentDidMount` | after a component is first rendered
| `componentWillReceiveProps` | before a component is re-rendered
| `componentDidUpdate` | after a component is re-rendered

One of the most common examples of side effect usage in a class component
is to fetch data when a component is first rendered, then store that data
in state. The following example shows a component that requests user
information from a JSON API after the first time it gets rendered, then
shows that information.

```jsx
import { Component } from 'preact';

export default class App extends Component {
  // this gets called after the component is first rendered:
  componentDidMount() {
    // get JSON user info, store in `state.user`:
    fetch('/api/user')
      .then(response => response.json())
      .then(user => {
        this.setState({ user })
      })
  }

  render(props, state) {
    const { user } = state;

    // if we haven't received data yet, show a loading indicator:
    if (!user) return <div>Loading...</div>

    // we have data! show the username we got back from the API:
    return (
      <div>
        <h2>Hello, {user.username}!</h2>
      </div>
    )
  }
}
```

## Try it!

We'll keep this exercise simple: change the code sample on the right
to log every time `count` changes, rather than only when `<App>` is
first rendered.

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>You learned how to use side effects in Preact.</p>
</solution>


```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function(m, s) {
    if (/Count is now/.test(m) && s === 1) {
      store.setState({ solved: true });
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, []);
  // ^^ start here!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, [count]);
  // ^^ start here!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

[lifecycle methods]: http://localhost:8080/guide/v10/components#lifecycle-methods
