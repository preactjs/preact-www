---
name: External DOM Mutations
permalink: '/guide/external-dom-mutations'
---

# External DOM Mutations


## Overview

Sometimes there is a need to work with third-party libraries that expect to be able to freely mutate the DOM, persist state within it, or that have no component boundaries at all.  There are many great UI toolkits or re-usable elements that operate this way.  In Preact (and similarly in React), working with these types of libraries requires that you tell the Virtual DOM rendering/diffing algorithm that it shouldn't try to _undo_ any external DOM mutations performed within a given Component (or the DOM element it represents).


## Technique

This can be as simple as defining a `shouldComponentUpdate()` method on your component, and having it return `false`:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... or for shorthand:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

With this lifecycle hook in place and telling Preact not to re-render the Component when changes occur up the VDOM tree, your Component now has a reference to its root DOM element that can be treated as static until the Component is unmounted. As with any component that reference is simply called `this.base`, and corresponds to the root JSX Element that was returned from `render()`.

---

## Example Walk-Through

Here is an example of "turning off" re-rendering for a Component.  Note that `render()` is still invoked as part of creating and mounting the Component, in order to generate its initial DOM structure.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // do not re-render via diff:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // you can do something with incoming props here if you need
  }

  componentDidMount() {
    // now mounted, can freely modify the DOM:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // component is about to be removed from the DOM, perform any cleanup.
  }

  render() {
    return <div class="example" />;
  }
}
```


## Demonstration

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**View this demo on Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Real-World Examples

Alternatively, see this technique in action in [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - it uses a component as a foothold in the DOM, but then disables updates and lets [tags-input](https://github.com/developit/tags-input) take over from there.  A more complex example would be [preact-richtextarea](https://github.com/developit/preact-richtextarea), which uses this technique to avoid re-rendering an editable `<iframe>`.
