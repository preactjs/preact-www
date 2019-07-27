---
name: Context
---

# Context<!-- omit in toc -->

Context allows you to pass a value to a child deep down the tree without having to pass it through every component inbetween via props. A very popular use case for this is theming. In a nutshell context can be thought of a way to do pup-sub-style updates in Preact.

There are two different ways to use context: Via the newer `createContext` API and the legacy context API. The difference between the two is that the legacy one can't update a child when a component inbetween aborts rendering via `shouldComponentUpdate`. That's why we highly recommend to always use `createContext`.

---

- [createContext](#createcontext)
- [Legacy Context API](#legacy-context-api)

---

## createContext

First we need to create a context object we can pass around. This is done via the `createContext(initialValue)` function. It returns a `Provider` component that is used to set the context value and a `Consumer` one which retrieves the value from the context.

```jsx
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
    <Theme.Provider />
  );
}
```

> An easier way to use context is via the [useContext](/guide/v10/hooks#context) hook.

## Legacy Context API

We include the legacy API mainly for backwards-compatibility reasons. It has been superseeded by the `createContext` API. The legacy API has known issues like blocking updates if there are components inbetween that return `false` in `shouldComponentUpdate`. If you nonetheless need to use it, keep reading.

To pass down a custom variable through the context a component needs to have the `getChildContext` method. There you return the new values you want to store in the context. The context can be accessed via the second argument in function components or `this.context` in a class-based component.

```jsx
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Themed Button
    </button>;
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
```
