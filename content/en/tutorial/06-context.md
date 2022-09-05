---
prev: /tutorial/05-refs
next: /tutorial/07-side-effects
title: Context
solvable: true
---

As an application grows larger, its Virtual DOM tree often becomes deeply
nested and composed of many different components. Components at various
locations within the tree sometimes need to access common data - typically
pieces of application state like authentication, user profile info, caches,
storage, etc. While it's possible to pass all of that information down through
the tree as component props, doing so means every component needs to have
some awareness of all of that state - even if all it does is forward it on
through the tree.

Context is a feature that lets us pass values down through the tree
_automatically_, without components needing to be aware of anything.
This is done using a Provider/Consumer approach:


- `<Provider>` sets the context's value within a <abbr title="The Virtual DOM tree within <Provider>...</Provider>, including all children">subtree</abbr>
- `<Consumer>` gets the context value set by the nearest parent Provider


To start off, let's look at a simple example with only one component. In this
case, we're providing a "Username" context value _and_ consuming that value:

```jsx
import { createContext } from 'preact'

const Username = createContext()

export default function App() {
  return (
    // provide the username value to our subtree:
    <Username.Provider value="Bob">
      <div>
        <p>
          <Username.Consumer>
            {username => (
              // access the current username from context:
              <span>{username}</span>
            )}
          </Username.Consumer>
        </p>
      </div>
    </Username.Provider>
  )
}
```

In actual usage, context is rarely provided and consumed within the same
component - component state is usually the best solution for that.

### Usage with hooks

The context `<Consumer>` API is sufficient for most use-cases, but can be
a bit tedious to write since it relies on nested functions for scope.
Function components can choose to instead use Preact's `useContext()` hook,
which returns the value of a `Context` at the component's location in the
Virtual DOM tree.

Here's the previous example again, this time split split into two components
and using `useContext()` to get the context's current value:

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Username = createContext()

export default function App() {
  return (
    <Username.Provider value="Bob">
      <div>
        <p>
          <User />
        </p>
      </div>
    </Username.Provider>
  )
}

function User() {
  // access the current username from context:
  const username = useContext(Username) // "Bob"
  return <span>{username}</span>
}
```

If you can imagine a case where `User` needs to access the value of
multiple Contexts, the simpler `useContext()` API remains much easier
to follow.

### Realistic usage

A more realistic usage of context would be to store an application's
authentication state (whether the user is logged in or not).

To do this, we can create a context to hold the information, which
we'll call `AuthContext`. The value for AuthContext will be an object
with a `user` property containing our signed-in user, along with
a `setUser` method to modify that state.

```jsx
import { createContext } from 'preact'
import { useState, useMemo, useContext } from 'preact/hooks'

const AuthContext = createContext()

export default function App() {
  const [user, setUser] = useState(null)

  const auth = useMemo(() => {
    return { user, setUser }
  }, [user])

  return (
    <AuthContext.Provider value={auth}>
      <div class="app">
        {auth.user && <p>Welcome {auth.user.name}!</p>}
        <Login />
      </div>
    </AuthContext.Provider>
  )
}

function Login() {
  const { user, setUser } = useContext(AuthContext)

  if (user) return (
    <div class="logged-in">
      Logged in as {user.name}.
      <button onClick={() => setUser(null)}>
        Log Out
      </button>
    </div>
  )

  return (
    <div class="logged-out">
      <button onClick={() => setUser({ name: 'Bob' })}>
        Log In
      </button>
    </div>
  )
}
```

### Nested context

Context has a hidden superpower that becomes quite useful in large applications:
context providers can be nested to "override" their value within a Virtual DOM
subtree. Imagine a web-based email app, where various parts of the user interface
are shown based on URL paths:

> - `/inbox`: show the inbox
> - `/inbox/compose`: show inbox and a new message
> - `/settings`: show settings
> - `/settings/forwarding`: show forwarding settings

We can create a `<Route path="..">` component that renders a Virtual DOM tree
only when the current path matches a given path segment. To simplify defining
nested Routes, each matched Route can override the "current path" context value
within its subtree to exclude the part of the path that was matched.

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Path = createContext(location.pathname)

function Route(props) {
  const path = useContext(Path) // the current path
  const isMatch = path.startsWith(props.path)
  const innerPath = path.substring(props.path.length)
  return isMatch && (
    <Path.Provider value={innerPath}>
      {props.children}
    </Path.Provider>
  )
}
```

Now we can use this new `Route` component to define the email app's interface.
Notice how the `Inbox` component doesn't need to know its own path in order
to define `<Route path"..">` matching for its children:

```jsx
export default function App() {
  return (
    <div class="app">
      <Route path="/inbox">
        <Inbox />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
    </div>
  )
}

function Inbox() {
  return (
    <div class="inbox">
      <div class="messages"> ... </div>
      <Route path="/compose">
        <Compose />
      </Route>
    </div>
  )
}

function Settings() {
  return (
    <div class="settings">
      <h1>Settings</h1>
      <Route path="/forwarding">
        <Forwarding />
      </Route>
    </div>
  )
}
```

### The default context value

Nested context is a powerful feature, and we often use it without realizing.
For example, in the very first illustrative example of this chapter, we used
`<Provider value="Bob">` to define a `Username` context value within the tree.

However, this was actually overriding the default value of the `Username`
context. All contexts have a default value, which is whatever value was
passed as the first argument to `createContext()`. In the example, we didn't pass any arguments to `createContext`, so the default value was `undefined`.

Here's what the first example would have looked like using the default context
value instead of a Provider:

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Username = createContext('Bob')

export default function App() {
  const username = useContext(Username) // returns "Bob"

  return <span>{username}</span>
}
```


## Try it!

As an exercise, let's create a _synchronized_ version of the counter we
created in the previous chapter. To do this, you'll want to use the
`useMemo()` technique from the authentication example in this chapter.
Alternatively, you could also define _two_ contexts: one to share the
`count` value, and another to share an `increment` function that
updates the value.


<solution>
  <h4>🎉 Congratulations!</h4>
  <p>You learned how to use context in Preact.</p>
</solution>


```js:setup
var output = useRef();

function getCounts() {
  var counts = [];
  var text = output.current.innerText;
  var r = /Count:\s*([\w.-]*)/gi;
  while (t = r.exec(text)) {
    var num = Number(t[1]);
    counts.push(isNaN(num) ? t[1] : num);
  }
  return counts;
}

useResult(function (result) {
  output.current = result.output;

  if (getCounts().length !== 3) {
    console.warn('It looks like you haven\'t initialized the `count` value to 0.');
  }
  
  var timer;
  var count = 0;
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.target.localName !== 'button') return;
    clearTimeout(timer);
    timer = setTimeout(function() {
      var counts = getCounts();
      if (counts.length !== 3) {
        return console.warn('We seem to be missing one of the counters.');
      }
      if (counts[0] !== counts[2] || counts[0] !== counts[1]) {
        return console.warn('It looks like the counters aren\'t in sync.');
      }
      var solved = counts[0] === ++count;
      store.setState({ solved: solved });
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```


```jsx:repl-initial
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Count: {'MISSING'}</p>
      <button>Add</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  const { count, increment } = useContext(CounterContext);

  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Count: {count}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  const counter = useMemo(() => {
    return { count, increment };
  }, [count]);

  return (
    <CounterContext.Provider value={counter}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Counter />
        <Counter />
        <Counter />
      </div>
    </CounterContext.Provider>
  )
}

render(<App />, document.getElementById("app"));
```
