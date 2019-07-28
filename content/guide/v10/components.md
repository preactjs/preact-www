---
name: Components
---

# Components <!-- omit in toc -->

Components represent the basic building block in Preact. They are fundamental in making it easy to build complex UIs from little building blocks. They're also responsible for attaching state to our rendered output.

There are two kinds of components in Preact, which we'll talk about in this guide.

---

- [Functional Components](#functional-components)
- [Class Components](#class-components)
  - [Lifecycle Methods](#lifecycle-methods)

---

## Functional Components

Functional components are plain functions that receive `props` as the first argument. The function name **must** start with an uppercase letter in order for them to work in JSX.

```jsx
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

```js
class Clock extends Component {
  state = { time: Date.now() }

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
```

### Lifecycle Methods

In order to have the clock's time update every second, we need to know when `<Clock>` gets mounted to the DOM. _If you've used HTML5 Custom Elements, this is similar to the `attachedCallback` and `detachedCallback` lifecycle methods._ Preact invokes the following lifecycle methods if they are defined for a Component:

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | (deprecated) before the component gets mounted to the DOM     |
| `componentDidMount`         | after the component gets mounted to the DOM      |
| `componentWillUnmount`      | prior to removal from the DOM                    |
| `componentWillReceiveProps` | (deprecated) before new props get accepted                    |
| `getDerivedStateFromProps` | just before `shouldComponentUpdate`. Use with care. |
| `shouldComponentUpdate`     | before `render()`. Return `false` to skip render |
| `componentWillUpdate`       | (deprecated) before `render()`                                |
| `getSnapshotBeforeUpdate` | called just before `render()` |
| `componentDidUpdate`        | after `render()`                                 |

> See [this diagram](https://twitter.com/dan_abramov/status/981712092611989509) to get a visual overview of how they relate to each other.
