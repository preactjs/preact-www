---
name: References
description: 'Refs are a way of creating stable values that are local to a component instance and persist across renders.'
---

# References

References, or refs for short, are stable, local values that persist across component renders but don't trigger rerenders like state or props would when they change.

Most often you'll see refs used to facilitate imperative manipulation of the DOM but they can be used to store any arbitrary local value that you need to be kept stable. You may use them to track a previous state value, keep a reference to an interval or timeout ID, or simply a counter value. Importantly, refs should not be used for rendering logic, instead, consumed in lifecycle methods and event handlers only.

---

<div><toc></toc></div>

---

## Creating a Ref

There are two ways to create refs in Preact, depending on your preferred component style: `createRef` (class components) and `useRef` (function components/hooks). Both APIs fundamentally work the same way: they create a stable, plain object with a `current` property, optionally initialized to a value.

```jsx
// Class components
import { createRef } from "preact";

class MyComponent extends Component {
  countRef = createRef();
  inputRef = createRef(null);

  // ...
}
```

```jsx
// Function components
import { useRef } from "preact/hooks";

function MyComponent() {
  const countRef = useRef();
  const inputRef = useRef(null);

  // ...
}
```

## Using Refs to Access DOM Nodes

The most common use case for refs is to access the underlying DOM node of a component. This is useful for imperative DOM manipulation, such as measuring elements, calling native methods on various elements (such as `.focus()` or `.play()`), and integrating with third-party libraries written in vanilla JS. In the following examples, upon rendering, Preact will assign the DOM node to the `current` property of the ref object, making it available for use after the component has mounted.

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class MyInput extends Component {
  ref = createRef(null);

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLInputElement]
  }

  render() {
    return <input ref={this.ref} />;
  }
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useRef, useEffect } from "preact/hooks";
// --repl-before
function MyInput() {
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current);
    // Logs: [HTMLInputElement]
  }, []);

  return <input ref={ref} />;
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

### Callback Refs

Another way to use references is by passing a function to the `ref` prop, where the DOM node will be passed as an argument.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyInput extends Component {
  render() {
    return (
      <input ref={(dom) => {
        console.log('Mounted:', dom);

        // As of Preact 10.23.0, you can optionally return a cleanup function
        return () => {
          console.log('Unmounted:', dom);
        };
      }} />
    );
  }
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
// --repl-before
function MyInput() {
  return (
    <input ref={(dom) => {
      console.log('Mounted:', dom);

      // As of Preact 10.23.0, you can optionally return a cleanup function
      return () => {
        console.log('Unmounted:', dom);
      };
    }} />
  );
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

> If the provided ref callback is unstable (such as one that's defined inline, as shown above), and _does not_ return a cleanup function, **it will be called twice** upon all rerenders: once with `null` and then once with the actual reference. This is a common issue and the `createRef`/`useRef` APIs make this a little easier by forcing the user to check if `ref.current` is defined.
>
> A stable function, for comparison, could be a method on the class component instance, a function defined outside of the component, or a function created with `useCallback`, for example.

## Using Refs to Store Local Values

Refs aren't limited to storing DOM nodes, however; they can be used to store any type of value that you may need.

In the following example, we store the ID of an interval in a ref to be able to start & stop it independently.

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class SimpleClock extends Component {
  state = {
    time: Date.now(),
  };
  intervalId = createRef(null);

  startClock = () => {
    this.setState({ time: Date.now() });
    this.intervalId.current = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  };

  stopClock = () => {
    clearInterval(this.intervalId.current);
  };


  render(_, { time }) {
    const formattedTime = new Date(time).toLocaleTimeString();

    return (
      <div>
        <button onClick={this.startClock}>Start Clock</button>
        <time dateTime={formattedTime}>{formattedTime}</time>
        <button onClick={this.stopClock}>Stop Clock</button>
      </div>
    );
  }
}
// --repl-after
render(<SimpleClock />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
function SimpleClock() {
  const [time, setTime] = useState(Date.now());
  const intervalId = useRef(null);

  const startClock = () => {
    setTime(Date.now());
    intervalId.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);
  };

  const stopClock = () => {
    clearInterval(intervalId.current);
  };

  const formattedTime = new Date(time).toLocaleTimeString();

  return (
    <div>
      <button onClick={startClock}>Start Clock</button>
      <time dateTime={formattedTime}>{formattedTime}</time>
      <button onClick={stopClock}>Stop Clock</button>
    </div>
  );
}
// --repl-after
render(<SimpleClock />, document.getElementById("app"));
```
