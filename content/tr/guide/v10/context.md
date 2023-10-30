---
name: Context
description: 'Context allows you to pass props through intermediate components. This documents describes both the new and the old API'
---

# Context

Context allows you to pass a value to a child deep down the tree without having to pass it through every component in-between via props. A very popular use case for this is theming. In a nutshell context can be thought of a way to do pub-sub-style updates in Preact.

There are two different ways to use context: Via the newer `createContext` API and the legacy context API. The difference between the two is that the legacy one can't update a child when a component inbetween aborts rendering via `shouldComponentUpdate`. That's why we highly recommend to always use `createContext`.

---

<div><toc></toc></div>

---

## createContext

First we need to create a context object we can pass around. This is done via the `createContext(initialValue)` function. It returns a `Provider` component that is used to set the context value and a `Consumer` one which retrieves the value from the context.

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => {
        return <button {...props} class={'btn ' + theme}>Themed Button</button>;
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

> An easier way to use context is via the [useContext](/guide/v10/hooks#usecontext) hook.

## Legacy Context API

We include the legacy API mainly for backwards-compatibility reasons. It has been superseded by the `createContext` API. The legacy API has known issues like blocking updates if there are components in-between that return `false` in `shouldComponentUpdate`. If you nonetheless need to use it, keep reading.

To pass down a custom variable through the context, a component needs to have the `getChildContext` method. There you return the new values you want to store in the context. The context can be accessed via the second argument in function components or `this.context` in a class-based component.

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Themed Button
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light'
    }
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
// --repl-after
render(<App />, document.getElementById("app"));
```
