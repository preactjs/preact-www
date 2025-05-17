---
title: Context
prev: /tutorial/05-refs
next: /tutorial/07-side-effects
solvable: true
---

# Context

随着应用程序变得越来越大，其虚拟DOM树通常变得深度嵌套并由许多不同的组件组成。树中各个位置的组件有时需要访问共同的数据 - 通常是应用程序状态的片段，如身份验证、用户资料信息、缓存、存储等。虽然可以通过组件props将所有这些信息向下传递，但这意味着每个组件都需要了解所有这些状态 - 即使它只是将其转发到树中。

Context是一种让我们能够自动地将值向下传递的功能，组件不需要知道任何事情。这是通过Provider/Consumer方法实现的：

- `<Provider>` sets the context's value within a <abbr title="The Virtual DOM tree within <Provider>...</Provider>, including all children">subtree</abbr>
- `<Consumer>`获取由最近的父Provider设置的context值


首先，让我们看一个只有一个组件的简单例子。在这个例子中，我们提供"Username"context值并消费该值：

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

在实际使用中，context很少在同一个组件中提供和消费 - 组件状态通常是这种情况的最佳解决方案。

### 使用hooks

context的`<Consumer>`API对于大多数用例来说已经足够了，但由于它依赖于嵌套函数来实现作用域，所以写起来可能有点繁琐。函数组件可以选择使用Preact的`useContext()`钩子，它返回组件在虚拟DOM树中位置的`Context`的值。

这里再次展示前面的例子，这次分成了两个组件，并使用`useContext()`获取context的当前值：

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

如果你能想象`User`需要访问多个Context值的情况，更简单的`useContext()`API仍然更容易理解。

### 实际用法

Context的一个更实际的用法是存储应用程序的认证状态（用户是否已登录）。

为此，我们可以创建一个存储信息的context，我们称之为`AuthContext`。AuthContext的值将是一个对象，其中包含一个`user`属性，包含我们已登录的用户，以及一个`setUser`方法来修改该状态。

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

### 嵌套context

Context有一个隐藏的超能力，在大型应用程序中非常有用：context提供者可以嵌套，以在虚拟DOM子树中"覆盖"它们的值。想象一个基于网络的电子邮件应用程序，其中用户界面的各个部分基于URL路径显示：

> - `/inbox`：显示收件箱
> - `/inbox/compose`：显示收件箱和新消息
> - `/settings`：显示设置
> - `/settings/forwarding`：显示转发设置

我们可以创建一个`<Route path=".."`组件，只有当当前路径匹配给定的路径段时才渲染虚拟DOM树。为了简化嵌套路由的定义，每个匹配的路由可以在其子树中覆盖"当前路径"context值，以排除已匹配的路径部分。

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

现在我们可以使用这个新的`Route`组件来定义电子邮件应用程序的界面。注意`Inbox`组件不需要知道自己的路径，就可以为其子组件定义`<Route path="..">`匹配：

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

### 默认context值

嵌套context是一个强大的功能，我们经常在不知不觉中使用它。例如，在本章的第一个说明性示例中，我们使用`<Provider value="小明">`在树中定义了一个`Username`的context值。

然而，这实际上是在覆盖`Username`context的默认值。所有context都有一个默认值，该值是作为第一个参数传递给`createContext()`的值。在示例中，我们没有向`createContext`传递任何参数，所以默认值是`undefined`。

下面是第一个例子使用默认context值而不是Provider的样子：

```jsx
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const Username = createContext('Bob')

export default function App() {
  const username = useContext(Username) // returns "Bob"

  return <span>{username}</span>
}
```


## 试一试！

在本练习中，我们将使用Context在应用程序的不同部分之间共享一个主题。
我们已经创建了`ThemeContext`，它可以是`"light"`或`"dark"`。我们已经创建了
`ThemeContext.Provider`，它使用`theme`状态变量。
现在我们需要修改按钮组件，使其根据设置的主题改变其外观。

提示：你需要使用`useContext`钩子从`ThemeContext`获取当前主题，并使用它来
决定按钮的`className`。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你已经成功地使用Context在组件树中传递信息！</p>
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
    if (e.currentTarget.localName !== 'button') return;
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
