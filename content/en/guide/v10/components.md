---
name: Components
descriptions: 'Components are the heart of any Preact application. Learn how to create them and use them to compose UIs together'
---

# Components

Components represent the basic building block in Preact. They are fundamental in making it easy to build complex UIs from little building blocks. They're also responsible for attaching state to our rendered output.

There are two kinds of components in Preact, which we'll talk about in this guide.

---

<div><toc></toc></div>

---

## Functional Components

Functional components are plain functions that receive `props` as the first argument. The function name **must** start with an uppercase letter in order for them to work in JSX.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>My name is {props.name}.</div>;
}

// Usage
const App = <MyComponent name="John Doe" />;

// Renders: <div>My name is John Doe.</div>
render(App, document.body);
```

> Note in earlier versions they were known as `"Stateless Components"`. This doesn't hold true anymore with the [hooks-addon](/guide/v10/hooks).

## Class Components

Class components can have state and lifecycle methods. The latter are special methods, that will be called when a component is attached to the DOM or destroyed for example.

Here we have a simple class component called `<Clock>` that displays the current time:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Lifecycle Methods

In order to have the clock's time update every second, we need to know when `<Clock>` gets mounted to the DOM. _If you've used HTML5 Custom Elements, this is similar to the `attachedCallback` and `detachedCallback` lifecycle methods._ Preact invokes the following lifecycle methods if they are defined for a Component:

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount()`        | (deprecated) before the component gets mounted to the DOM
| `componentDidMount()`         | after the component gets mounted to the DOM
| `componentWillUnmount()`      | prior to removal from the DOM
| `componentWillReceiveProps(nextProps, nextState)` | before new props get accepted _(deprecated)_
| `getDerivedStateFromProps(nextProps)` | just before `shouldComponentUpdate`. Use with care.
| `shouldComponentUpdate(nextProps, nextState)` | before `render()`. Return `false` to skip render
| `componentWillUpdate(nextProps, nextState)` | before `render()` _(deprecated)_
| `getSnapshotBeforeUpdate(prevProps, prevState)` | called just before `render()`. return value is passed to `componentDidUpdate`.
| `componentDidUpdate(prevProps, prevState, snapshot)` | after `render()`

> See [this diagram](https://twitter.com/dan_abramov/status/981712092611989509) to get a visual overview of how they relate to each other.

#### componentDidCatch

There is one lifecycle method that deserves a special recognition and that is `componentDidCatch`. It's special because it allows you to handle any errors that happen during rendering. This includes errors that happened in a lifecycle hook but excludes any asynchronously thrown errors, like after a `fetch()` call.

When an error is caught, we can use this lifecycle to react to any errors and display a nice error message or any other fallback content.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class Catcher extends Component {
  
  constructor() {
    super();
    this.state = { errored: false };
  }

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
// --repl-after
render(<Catcher />, document.getElementById('app'));
```

## Fragments

A `Fragment` allows you to return multiple elements at once. They solve the limitation of JSX where every "block" must have a single root element. You'll often encounter them in combination with lists, tables or with CSS flexbox where any intermediate element would otherwise affect styling.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Renders:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Note that most modern transpilers allow you to use a shorter syntax for `Fragments`. The shorter one is a lot more common and is the one you'll typically encounter.

```jsx
// This:
const Foo = <Fragment>foo</Fragment>;
// ...is the same as this:
const Bar = <>foo</>;
```

You can also return arrays from your components:

```jsx
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```

Don't forget to add keys to `Fragments` if you create them in a loop:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without a key, Preact has to guess which elements have
        // changed when re-rendering.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
