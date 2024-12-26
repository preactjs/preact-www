---
name: Context
description: 'Context allows you to pass props through intermediate components. This documents describes both the new and the old API'
---

# Context

Context is a way to pass data through the component tree without having to pass it through every component in-between via props. In a nutshell, it allows components anywhere in the hierarchy to subscribe to a value and get notified when it changes, bringing pub-sub-style updates to Preact.

It's not uncommon to run into situations in which a value from a grandparent component (or higher) needs to be passed down to a child, often without the intermediate component needing it. This process of passing down props is often referred to as "prop drilling" and can be cumbersome, error-prone, and just plain repetitive, especially as the application grows and more values have to be passed through more layers. This is one of the key issues Context aims to address by providing a way for a child to subscribe to a value higher up in the component tree, accessing the value without it being passed down as a prop.

There are two different ways to use context in Preact: via the newer `createContext` API and the legacy context API. These days there's very few reasons to ever reach for the legacy API but it's documented here for completeness.

---

<div><toc></toc></div>

---

## Modern Context API

<!-- Load bearing comment, else marked eats the following heading -->

### Creating a Context

To create a new context, we use the `createContext` function. This function takes an initial state as an argument and returns an object with two component properties: `Provider`, to make the context available to descendants, and `Consumer`, to access the context value (primarily in class components).

```jsx
import { createContext } from "preact";

export const Theme = createContext("light");
export const User = createContext({ name: "Guest" });
export const Locale = createContext(null);
```

### Setting up a Provider

Once we've created a context, we must make it available to descendants using the `Provider` component. The `Provider` must be given a `value` prop, representing the initial value of the context.

> The initial value set from `createContext` is only used in the absence of a `Provider` above the consumer in the tree. This may be helpful for testing components in isolation, as it avoids the need for creating a wrapping `Provider` around your component.

```jsx
import { createContext } from "preact";

export const Theme = createContext("light");

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent />
    </Theme.Provider>
  );
}
```

> **Tip:** You can have multiple providers of the same context throughout your app but only the closest one to the consumer will be used.

### Using the Context

There are two ways to consume a context, largely depending on your preferred component style: `Consumer` (class components) and the `useContext` hook (function components/hooks).

<tab-group tabstring="Consumer, useContext">

```jsx
// --repl
import { render, createContext } from "preact";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext("#673ab8");

function ThemedButton() {
  return (
    <ThemePrimary.Consumer>
      {theme => <button style={{ background: theme }}>Themed Button</button>}
    </ThemePrimary.Consumer>
  );
}

function App() {
  return (
    <ThemePrimary.Provider value="#8f61e1">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

```jsx
// --repl
import { render, createContext } from "preact";
import { useContext } from "preact/hooks";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext("#673ab8");

function ThemedButton() {
  const theme = useContext(ThemePrimary);
  return <button style={{ background: theme }}>Themed Button</button>;
}

function App() {
  return (
    <ThemePrimary.Provider value="#8f61e1">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

</tab-group>

### Updating the Context

Static values can be useful, but more often than not, we want to be able to update the context value dynamically. To do so, we leverage standard component state mechanisms:

```jsx
// --repl
import { render, createContext } from "preact";
import { useContext, useState } from "preact/hooks";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext(null);

function ThemedButton() {
  const { theme } = useContext(ThemePrimary);
  return <button style={{ background: theme }}>Themed Button</button>;
}

function ThemePicker() {
  const { theme, setTheme } = useContext(ThemePrimary);
  return (
    <input
      type="color"
      value={theme}
      onChange={e => setTheme(e.currentTarget.value)}
    />
  );
}

function App() {
  const [theme, setTheme] = useState("#673ab8");
  return (
    <ThemePrimary.Provider value={{ theme, setTheme }}>
      <SomeComponent>
        <ThemedButton />
        {" - "}
        <ThemePicker />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

## Legacy Context API

This API is considered legacy and should be avoided in new code, it has known issues and only exists for backwards-compatibility reasons.

One of the key differences between this API and the new one is that this API cannot update a child when a component in-between the child and the provider aborts rendering via `shouldComponentUpdate`. When this happens, the child **will not** received the updated context value, often resulting in tearing (part of the UI using the new value, part using the old).

To pass down a value through the context, a component needs to have the `getChildContext` method, returning the intended context value. Descendants can then access the context via the second argument in function components or `this.context` in class-based components.

```jsx
// --repl
import { render } from "preact";

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(_props, context) {
  return (
    <button style={{ background: context.theme }}>
      Themed Button
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: "#673ab8"
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
