---
name: References
description: 'References can be used to access raw DOM nodes that Preact has rendered'
---

# References

There will always be scenarios where you need a direct reference to the DOM-Element or Component that was rendered by Preact. Refs allow you to do just that.

A typical use case for it is measuring the actual size of a DOM node. While it's possible to get the reference to the component instance via `ref` we don't generally recommend it. It will create a hard coupling between a parent and a child which breaks the composability of the component model. In most cases it's more natural to just pass the callback as a prop instead of trying to call the method of a class component directly.

---

<div><toc></toc></div>

---

## `createRef`

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
