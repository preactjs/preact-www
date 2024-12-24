---
name: References
description: 'References are a way of creating stable values that are local to a component instance but exist outside of the normal component lifecycle.'
---

# References

References, or refs for short, are a way of creating and referencing stable values that are local to a component instance but exist outside of the normal component lifecycle.

There are many scenarios in which you may need to save a value within a component but updating it should not trigger rerenders like state or props would. This is where refs come in.

Most often you'll see refs used with DOM nodes to facilitate imperative manipulation of the DOM, but they can also be used to store stable, local values in a component. You may track a previous state value, or keep a reference to an interval or timeout ID. Importantly, refs should not be used for rendering, instead used in event handlers or side effects in most cases.

---

<div><toc></toc></div>

---

## createRef

The `createRef` function will return a plain object with just one property: `current`. Whenever the `render` method is called, Preact will assign the DOM node or component to `current`.

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }

  render() {
    return <div ref={this.ref}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> For those using hooks, you'll want [useRef](/guide/v10/hooks#useref) instead, which works very similarly.

## Callback Refs

Another way to get the reference to an element can be done by passing a function callback. It's a little more to type, but it works in a similar fashion as `createRef`.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  ref = null;
  setRef = (dom) => this.ref = dom;

  componentDidMount() {
    console.log(this.ref);
    // Logs: [HTMLDivElement]
  }

  render() {
    return <div ref={this.setRef}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> If the ref callback is defined as an inline function it will be called twice. Once with `null` and then with the actual reference. This is a common error and the `createRef` API makes this a little easier by forcing user to check if `ref.current` is defined.

## Putting it all together

Let's say we have a scenario where we need to get the reference to a DOM node to measure its width and height. We have a simple component where we need to replace the placeholder values with the actual measured ones.

```jsx
class Foo extends Component {
  // We want to use the real width from the DOM node here
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return <div>Width: {width}, Height: {height}</div>;
  }
}
```

Measurement only makes sense once the `render` method has been called and the component is mounted into the DOM. Before that the DOM node won't exist and there wouldn't make much sense to try to measure it.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // For safety: Check if a ref was supplied
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        Width: {width}, Height: {height}
      </div>
    );
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

That's it! Now the component will always display the width and height when it's mounted.
