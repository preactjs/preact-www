---
name: Differences to React
permalink: '/guide/differences-to-react'
description: 'What are the differences between Preact and React. This document describes them in detail'
---

# Differences to React

Preact itself is not intended to be a reimplementation of React. There are differences. Many of these differences are trivial, or can be completely removed by using [preact/compat], which is a thin layer over Preact that attempts to achieve 100% compatibility with React.

The reason Preact does not attempt to include every single feature of React is in order to remain **small** and **focused** - otherwise it would make more sense to simply submit optimizations to the React project, which is already a very complex and well-architected codebase.

---

<div><toc></toc></div>

---

## Main differences

The main difference when comparing Preact and React apps is that we don't ship our own Synthetic Event system. Preact uses the browser's native `addEventlistener` for event handling internally. See [GlobalEventHandlers] for a full list of DOM event handlers.

For us it doesn't make sense as the browser's event system supports all features we need. A full custom event implementation would mean more maintenance overhead and a larger API surface area for us.

We've come across the following differences between React's synthetic event system and native browser events:

- Browser events don't bubble through `<Portal>`-Components
- The clear "x" button in IE11 for `<input type="search">` elements does not fire an `input` event.
- Use `onInput` instead `onChange` for `<input>`-elements (**only if `preact/compat` is not used**)

The other main difference is that we follow a bit more closely the DOM specification. One example of that is that you can use `class` instead of `className`.

## Version Compatibility

For both Preact and [preact/compat], version compatibility is measured against the _current_ and _previous_ major releases of React. When new features are announced by the React team, they may be added to Preact's core if it makes sense given the [Project Goals]. This is a fairly democratic process, constantly evolving through discussion and decisions made in the open, using issues and pull requests.

> Thus, the website and documentation reflect React `0.16.x` and `15.x` when discussing compatibility or making comparisons.

## Features unique to Preact

Preact actually adds a few convenient features inspired by work in the (P)React community:

### Arguments in `Component.render()`

For convenience we pass `this.props` and `this.state` of a class component to the `render()`. Take a look at this component which uses one prop and one state property.

```jsx
// Works in both Preact and React
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

In Preact this is can be also written like this:

```jsx
// Only works in Preact
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

Both snippets render the exact same thing. It's just a matter of stylistic preference.

### Raw HTML attribute/property names

With Preact we follow more closely the DOM specification supported by all major browsers. One prominent difference is that you can use the
standard `class` attribute instead of `className`.

```jsx
// This:
<div class="foo" />

// ...is the same as:
<div className="foo" />
```

Most Preact developers prefer to use `class` because it's shorter to write, but both are supported.

### Use `onInput` instead of `onChange`

For historical reasons React basically aliased `onChange` to `onInput`. The latter is the one that's native to the DOM and supported everywhere. The `input` event is what you're looking for in nearly all cases where you want to be notified when the form control is updated.

```jsx
// React
<input onChange={e => console.log(e.target.value)} />

// Preact
<input onInput={e => console.log(e.target.value)} />
```

If you're using [preact/compat] we'll set up this alias for `onChange` to `onInput` globally similar to React. This is one of the tricks we use to ensure maximum compatibility with the React ecosystem.

### JSX-Constructor

This idea was originally called [hyperscript] and has value well beyond the React ecosystem, so Preact promotes the original standard. ([Read: why `h()`?](http://jasonformat.com/wtf-is-jsx)). If you're looking at the transpiled output, it's a bit easier to read than `React.createElement`.

```js
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// vs
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

In most Preact apps you'll encounter `h()`, but we support both in core, so it doesn't really matter which one you'll use.

### No contextTypes needed

The legacy `Context`-API requires Components to implement `contextTypes` or `childContextTypes` in React. With Preact we don't have that limitation and all Components receive the all `context` entries drawn from `getChildContext()`.

## Features exclusive to `preact/compat`

`preact/compat` is our **compat**ibility layer that translates React code to Preact. For existing React users this makes it very easy to try out Preact by just setting up a few aliases in their bundler configuration and leaving the rest of their code as is.

### Children-API

The `Children`-API is a specialized way to iterate over a component's `children`. For Preact this API is not needed and we recommend to use the native array methods instead.

```jsx
// React
function App(props) {
  return <div>{Children.count(props.children)}</div>
}

// Preact: Convert children to an array and use standard array methods.
function App(props) {
  return <div>{toChildArray(props.children).length}</div>
}
```

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
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
