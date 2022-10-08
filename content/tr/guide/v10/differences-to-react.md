---
name: Differences to React
permalink: '/guide/differences-to-react'
description: 'What are the differences between Preact and React. This document describes them in detail'
---

# Differences to React

Preact is not intended to be a reimplementation of React. There are differences. Many of these differences are trivial, or can be completely removed by using [preact/compat], which is a thin layer over Preact that attempts to achieve 100% compatibility with React.

The reason Preact does not attempt to include every single feature of React is in order to remain **small** and **focused** - otherwise it would make more sense to simply submit optimizations to the React project, which is already a very complex and well-architected codebase.

---

<div><toc></toc></div>

---

## Main differences

The main difference between Preact and React is that Preact does not implement a synthetic event system for size and performance reasons. Preact uses the browser's standard `addEventListener` to register event handlers, which means event naming and behavior works the same in Preact as it does in plain JavaScript / DOM. See [MDN's Event Reference] for a full list of DOM event handlers.

Standard browser events work very similarly to how events work in React, with a few small differences. In Preact:

- events don't bubble up through `<Portal>` components
- standard `onInput` should be used instead of React's `onChange` for form inputs (**only if `preact/compat` is not used**)
- standard `onDblClick` should be used instead of React's `onDoubleClick` (**only if `preact/compat` is not used**)
- `onSearch` should generally be used for `<input type="search">`, since the clear "x" button does not fire `onInput` in IE11

Another notable difference is that Preact follows the DOM specification more closely. Custom elements are supported like any other element, and custom events are supported with case-sensitive names (as they are in the DOM).

## Version Compatibility

For both preact and [preact/compat], version compatibility is measured against the _current_ and _previous_ major releases of React. When new features are announced by the React team, they may be added to Preact's core if it makes sense given the [Project Goals]. This is a fairly democratic process, constantly evolving through discussion and decisions made in the open, using issues and pull requests.

> Thus, the website and documentation reflect React `16.x` and `15.x` when discussing compatibility or making comparisons.

## Debug messages and errors

Our flexible architecture allows addons to enhance the Preact experience in any way they want. One of those addons is `preact/debug` which adds [helpful warnings and errors](https://preactjs.com/guide/v10/debugging) and attaches the [Preact Developer Tools](https://preactjs.github.io/preact-devtools/) browser extension, if installed. Those guide you when developing Preact applications and make it a lot easier to inspect what's going on. You can enable them by adding the relevant import statement:

```js
import "preact/debug"; // <-- Add this line at the top of your main entry file
```

This is different from React which requires a bundler being present that strips out debugging messages at build time by checking for `NODE_ENV != "production"`.

## Features unique to Preact

Preact actually adds a few convenient features inspired by work in the (P)React community:

### Native support for ES Modules

Preact was built with ES Modules in mind from the beginning, and was one of the first frameworks to support them. You can load Preact via the `import` keyword directly in browsers without having it to pass through a bundler first.

### Arguments in `Component.render()`

For convenience, we pass `this.props` and `this.state` to the `render()` method on class components. Take a look at this component which uses one prop and one state property.

```jsx
// Works in both Preact and React
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

In Preact this can be also written like this:

```jsx
// Only works in Preact
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

Both snippets render the exact same thing, render arguments are provided for convenience.

### Raw HTML attribute/property names

Preact aims to closely match the DOM specification supported by all major browsers. When applying `props` to an element, Preact _detects_ whether each prop should be set as a property or HTML attribute. This makes it possible to set complex properties on Custom Elements, but it also means you can use attribute names like `class` in JSX:

```jsx
// This:
<div class="foo" />

// ...is the same as:
<div className="foo" />
```

Most Preact developers prefer to use `class` because it's shorter to write, but both are supported.

### SVG inside JSX

SVG is pretty interesting when it comes to the names of its properties and attributes. Some properties (and their attributes) on SVG objects are camelCased (e.g. [clipPathUnits on a clipPath element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Attributes)), some attributes are kebab-case (e.g. [clip-path on many SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)), and other attributes (usually ones inherited from the DOM, e.g. `oninput`) are all lowercase.

Preact applies SVG attributes as-written. This means you can copy and paste unmodified SVG snippets right into your code and have them work out of the box. This allows greater interoperability with tools designers tend to use to generate icons or SVG illustrations.

```jsx
// React
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" strokeWidth="2" strokeLinejoin="round" cx="24" cy="24" r="20" />
</svg>
// Preact (note stroke-width and stroke-linejoin)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" stroke-width="2" stroke-linejoin="round" cx="24" cy="24" r="20" />
</svg>
```

If you're coming from React, you may be used to specifying all attributes in camelCase. You can continue to use always-camelCase SVG attribute names by adding [preact/compat] to your project, which mirrors the React API and normalizes these attributes.

### Use `onInput` instead of `onChange`

Largely for historical reasons, the semantics of React's `onChange` event are actually the same as the `onInput` event provided by browsers, which is supported everywhere. The `input` event is the best-suited event for the majority of cases where you want to react when a form control is modified. In Preact core, `onChange` is the standard [DOM change event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) that gets fired when an element's value is _committed_ by the user.

```jsx
// React
<input onChange={e => console.log(e.target.value)} />

// Preact
<input onInput={e => console.log(e.target.value)} />
```

If you're using [preact/compat], most `onChange` events are internally converted to `onInput` to emulate React's behavior. This is one of the tricks we use to ensure maximum compatibility with the React ecosystem.

### JSX Constructor

JSX is a syntax extension for JavaScript that is converted to nested function calls. The idea of using these nested calls to build up tree structures long predates JSX, and was previously popularized in JavaScript by the [hyperscript] project. This approach has value well beyond the scope of the React ecosystem, so Preact promotes the original generalized community-standard. For a more in-depth discussion of JSX and its relationship to Hyperscript, [read this article on how JSX works](https://jasonformat.com/wtf-is-jsx).

**Source:** (JSX)

```jsx
<a href="/">
  <span>Home</span>
</a>
```

**Output:**

```js
// Preact:
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// React:
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

Ultimately, if you're looking at the generated output code for a Preact application, it's clear that a shorter un-namespaced "JSX pragma" is both easier to read _and_ more suitable for optimizations like minification. In most Preact apps you'll encounter `h()`, though it doesn't really matter which name you use since a `createElement` alias export is also provided.

### No contextTypes needed

The legacy `Context` API requires Components to declare specific properties using React's `contextTypes` or `childContextTypes` in order to receive those values. Preact does not have this requirement: all Components receive all `context` properties produced by `getChildContext()` by default.

## Features exclusive to `preact/compat`

`preact/compat` is our **compat**ibility layer that translates React code to Preact. For existing React users this can be an easy way to try out Preact without changing any of your code, by [setting up a few aliases](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact) in your bundler configuration.

### Children API

The `Children` API is a specialized set of methods for working with the value of `props.children`. For Preact this is generally unnecessary, and we recommend using the built-in array methods instead. In Preact, `props.children` is either a Virtual DOM node, an empty value like `null`, or an Array of Virtual DOM nodes. The first two cases are the simplest and most common, since it's possible to use or return `children` as-is:

```jsx
// React:
function App(props) {
  return <Modal content={Children.only(props.children)} />
}

// Preact: use props.children directly:
function App(props) {
  return <Modal content={props.children} />
}
```

For specialized cases where you need to iterate over the children passed to a component, Preact provides a `toChildArray()` method that accepts any `props.children` value and returns a flattened and normalized Array of Virtual DOM nodes.

```jsx
// React
function App(props) {
  const cols = Children.count(props.children);
  return <div data-columns={cols}>{props.children}</div>
}

// Preact
function App(props) {
  const cols = toChildArray(props.children).length;
  return <div data-columns={cols}>{props.children}</div>
}
```

A React-compatible `Children` API is available from `preact/compat` to make integration with existing component libraries seamless.

### Specialised Components

[preact/compat] ships with specialised components that are not necessary for every app. These include

- [PureComponent](/guide/v10/switching-to-preact#purecomponent): Only updates if `props` or `state` have changed
- [memo](/guide/v10/switching-to-preact#memo): Similar in spirit to `PureComponent` but allows to use a custom comparison function
- [forwardRef](/guide/v10/switching-to-preact#forwardRef): Supply a `ref` to a specified child component.
- [Portals](/guide/v10/switching-to-preact#portals): Continues rendering the current tree into a different DOM container
- [Suspense](/guide/v10/switching-to-preact#suspense): **experimental** Allows to display fallback content in case the tree is not ready
- [lazy](/guide/v10/switching-to-preact#suspense): **experimental** Lazy load async code and mark a tree as ready/not ready accordingly.

[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/switching-to-preact
[MDN's Event Reference]: https://developer.mozilla.org/en-US/docs/Web/Events
