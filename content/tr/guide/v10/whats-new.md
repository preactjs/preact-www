---
name: What's new in Preact X
description: 'New features and changes in Preact X'
---

# What's new in Preact X

Preact X is a huge step forward from Preact 8.x. We've rethought every bit and byte of our code and added a plethora of major features in the process. Same goes for compatibility enhancements to support more third-party libraries.

In a nutshell Preact X is what we always wanted Preact to be: A tiny, fast and feature-packed library. And speaking of size, you'll be happy to hear that all the new features and improved rendering fit into the same size footprint as `8.x`!

---

<div><toc></toc></div>

---

## Fragments

`Fragments` are a major new feature of Preact X, and one of the main motivations for rethinking Preact's architecture. They are a special kind of component that renders children elements inline with their parent, without an extra wrapping DOM element. On top of that they allow you to return multiple nodes from `render`.

[Fragment docs →](/guide/v10/components#fragments)

```jsx
// --repl
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

We all wish errors wouldn't happen in our applications, but sometimes they do. With `componentDidCatch`, it's now possible to catch and handle any errors that occur within lifecycle methods like `render`, including exceptions deep in the component tree. This can be used to display user-friendly error messages, or write a log entry to an external service in case something goes wrong.

[Lifecycle docs →](/guide/v10/components#componentdidcatch)

```jsx
// --repl
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Something went badly wrong</p>;
    }
    return props.children;
  }
}
```

## Hooks

`Hooks` are a new way to make sharing logic easier between components. They represent an alternative to the existing class-based component API. In Preact they live inside an addon which can be imported via `preact/hooks`

[Hooks Docs →](/guide/v10/hooks)

```jsx
// --repl
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## createContext

The `createContext`-API is a true successor for `getChildContext()`. Whereas `getChildContext` is fine when you're absolutely sure to never change a value, it falls apart as soon as a component in-between the provider and consumer blocks an update via `shouldComponentUpdate` when it returns `false`. With the new context API this problem is now a thing of the past. It is a true pub/sub solution to deliver updates deep down the tree.

[createContext Docs →](/guide/v10/context#createcontext)

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>Active theme: {theme}</div>}
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
```

## CSS Custom Properties

Sometimes it's the little things that make a huge difference. With the recent advancements in CSS you can leverage [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) for styling:

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## Compat lives in core

Although we were always keen on adding new features and pushing Preact forward, the `preact-compat` package didn't receive as much love. Up until now it has lived in a separate repository making it harder to coordinate large changes spanning Preact and the compatibility layer. By moving compat into the same package as Preact itself, there's nothing extra to install in order to use libraries from the React ecosystem.

The compatibility layer is now called [preact/compat](/guide/v10/differences-to-react#features-exclusive-to-preactcompat), and has learned several new tricks such as `forwardRef`, `memo` and countless compatibility improvements.

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## Many compatibility fixes

These are too many to list, but we've grown bounds and leaps on the compatibility front with libraries from the React ecosystem. We specifically made sure to include several popular packages in our testing process to make sure that we can guarantee full support for them.

If you came across a library that didn't work well with Preact 8, you should give it another go with X. The chances are high that everything works as expected ;)
