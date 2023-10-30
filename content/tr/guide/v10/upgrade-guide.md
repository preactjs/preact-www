---
name: Upgrading from Preact 8.x
description: 'Upgrade your Preact 8.x application to Preact X'
---

# Upgrading from Preact 8.x

This document is intended to guide you through upgrading an existing Preact 8.x application to Preact X and is divided in 3 main sections

Preact X brings many new exciting features such as `Fragments`, `hooks` and much improved compatibility with the React ecosystem. We tried to keep any breaking changes to the minimum possible, but couldn't eliminate all of them completely without compromising on our feature set.

---

<div><toc></toc></div>

---

## Upgrading dependencies

_Note: Throughout this guide we'll be using the `npm` client and the commands should be easily applicable to other package managers such as `yarn`._

Let's begin! First install Preact X:

```bash
npm install preact
```

Because compat has moved to core, there is no need for `preact-compat` anymore. Remove it with:

```bash
npm remove preact-compat
```

### Updating preact-related libraries

To guarantee a stable ecosystem for our users (especially for our enterprise users) we've released major version updates to Preact X related libraries. If you're using `preact-render-to-string` you need to update it to the version that works with X.

| Library                   | Preact 8.x | Preact X |
| ------------------------- | ---------- | -------- |
| `preact-render-to-string` | 4.x        | 5.x      |
| `preact-router`           | 2.x        | 3.x      |
| `preact-jsx-chai`         | 2.x        | 3.x      |
| `preact-markup`           | 1.x        | 2.x      |

### Compat has moved to core

To make third-party React libraries work with Preact we ship a **compat**ibility layer that can be imported via `preact/compat`. It was previously available as a separate package, but to make coordination easier we've moved it into the core repository. So you'll need to change existing import or alias declarations from `preact-compat` to `preact/compat` (note the slash).

Be careful not to introduce any spelling errors here. A common one seems to be to write `compact` instead of `compat`. If you're having trouble with that, think of `compat` as the `compatibility` layer for react. That's where the name is coming from.

> If you're using `preact-cli` than this step is already done for you :tada:

### Third party libraries

Due to the nature of the breaking changes, some existing libraries may cease to work with X. Most of them have been updated already following our beta schedule but you may encounter one where this is not the case.

#### preact-redux

`preact-redux` is one of such libraries that hasn't been updated yet. The good news is that `preact/compat` is much more React-compliant and works out of the box with the React bindings called `react-redux`. Switching to it will resolve the situation. Make sure that you've aliased `react` and `react-dom` to `preact/compat` in your bundler.

1. Remove `preact-redux`
2. Install `react-redux`

#### mobx-preact

Due to our increased compatibility with the react-ecosystem this package isn't needed anymore. Use `mobx-react` instead.

1. Remove `mobx-preact`
2. Install `mobx-react`

#### styled-components

Preact 8.x only worked up to `styled-components@3.x`. With Preact X this barrier is no more and we work with the latest version of `styled-components`. Make sure that you've [aliased react to preact](/guide/v10/getting-started#aliasing-react-to-preact) correctly.

#### preact-portal

The `Portal` component is now part of `preact/compat`.

1. Remove `preact-portal`
2. Import `createPortal` from `preact/compat`

## Getting your code ready

### Using named exports

To better support tree-shaking we don't ship with a `default` export in preact core anymore. The advantage of this approach is that only the code you need will be included in your bundle.

```js
// Preact 8.x
import Preact from "preact";

// Preact X
import * as preact from "preact";

// Preferred: Named exports (works in 8.x and Preact X)
import { h, Component } from "preact";
```

_Note: This change doesn't affect `preact/compat`. It still has both named and a default export to remain compatible with react._

### `render()` always diffs existing children

In Preact 8.x, the calls to `render()` would always append the elements to the container.

```jsx
// Existing markup:
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact 8.x output:
<body>
  <div>hello</div>
  <p>foo</p>
  <p>bar</p>
</body>
```

In order to diff existing children in Preact 8, an existing DOM node had to be provided.

```jsx
// Existing markup:
<body>
  <div>hello</div>
</body>

let element;
element = render(<p>foo</p>, document.body);
element = render(<p>bar</p>, document.body, element);

// Preact 8.x output:
<body>
  <div>hello</div>
  <p>bar</p>
</body>
```

In Preact X, `render()` always diffs DOM children inside of the container. So if your container contains DOM that was not rendered by Preact, Preact will try to diff it with the elements you pass it. This new behavior more closely matches the behavior of other VDOM libraries.

```jsx
// Existing markup:
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact X output:
<body>
  <p>bar</p>
  <div>hello</div>
</body>
```

If you are looking for behavior that exactly matches how React's `render` method works, use the `render` method exported by `preact/compat`.

### `props.children` is not always an `array`

In Preact X we can't guarantee `props.children` to always be of type `array` anymore. This change was necessary to resolve parsing ambiguities in regards to `Fragments` and components that return an `array` of children. In most cases you may not even notice it. Only in places where you'll use array methods on `props.children` directly need to be wrapped with `toChildArray`. This function will always return an array.

```jsx
// Preact 8.x
function Foo(props) {
  // `.length` is an array method. In Preact X when `props.children` is not an
  // array, this line will throw an exception
  const count = props.children.length;
  return <div>I have {count} children </div>;
}

// Preact X
import { toChildArray } from "preact";

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children </div>;
}
```

### Don't access `this.state` synchronously

In Preact X the state of a component will no longer be mutated synchronously. This means that reading from `this.state` right after a `setState` call will return the previous values. Instead you should use a callback function to modify state that depends on the previous values.

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter + 1 });

// Preact X
this.setState(prevState => {
  // Alternatively return `null` here to abort the state update
  return { counter: prevState.counter + 1 };
});
```

### `dangerouslySetInnerHTML` will skip diffing of children

When a `vnode` has the property `dangerouslySetInnerHTML` set Preact will skip diffing the `vnode's` children.

```jsx
<div dangerouslySetInnerHTML="foo">
  <span>I will be skipped</span>
  <p>So will I</p>
</div>
```

## Notes for library authors

This section is intended for library authors who are maintaining packages to be used with Preact X. You can safely skip this section if you're not writing one.

### The `VNode` shape has changed

We renamed/moved the following properties:

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

As much as we tried, we always ran into edge-cases with third-party libraries written for react. This change to our `vnode` shape removed many difficult to spot bugs and makes our `compat` code a lot cleaner.

### Adjacent text nodes are not joined anymore

In Preact 8.x we had this feature where we would join adjacent text notes as an optimization. This doesn't hold true for X anymore because we're not diffing directly against the dom anymore. In fact we noticed that it hurt performance in X which is why we removed it. Take the following example:

```jsx
// Preact 8.x
console.log(<div>foo{"bar"}</div>);
// Logs a structure like this:
//   div
//     text

// Preact X
console.log(<div>foo{"bar"}</div>);
// Logs a structure like this:
//   div
//     text
//     text
```
