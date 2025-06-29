---
title: Differences to React
---

# Differences to React

Preact itself is not intended to be a reimplementation of React. There are differences. Many of these differences are trivial, or can be completely removed by using [preact-compat], which is a thin layer over Preact that attempts to achieve 100% compatibility with React.

The reason Preact does not attempt to include every single feature of React is in order to remain **small** and **focused** - otherwise it would make more sense to simply submit optimizations to the React project, which is already a very complex and well-architected codebase.

---

<toc></toc>

---

## Version Compatibility

For both Preact and [preact-compat], version compatibility is measured against the _current_ and _previous_ major releases of React. When new features are announced by the React team, they may be added to Preact's core if it makes sense given the [Project Goals]. This is a fairly democratic process, constantly evolving through discussion and decisions made in the open, using issues and pull requests.

> Thus, the website and documentation reflect React `0.14.x` and `15.x` when discussing compatibility or making comparisons.

## What's Included?

- [ES6 Class Components]
  - _classes provide an expressive way to define stateful components_
- [Higher-Order Components]
  - _components that return other components from `render()`, effectively wrappers_
- [Stateless Pure Functional Components]
  - _functions that receive `props` as arguments and return JSX/VDOM_
- [Contexts]: Support for the legacy `context API` was added in Preact [3.0].
  - _Support for the [new api](https://reactjs.org/docs/context.html) is discussed [as PR #963](https://github.com/preactjs/preact/pull/963)._
- [Refs]: Support for function refs was added in Preact in [4.0]. String refs are supported in `preact-compat`.
  - _Refs provide a way to refer to rendered elements and child components._
- Virtual DOM Diffing
  - _This is a given - Preact's diff is simple but effective, and **[extremely](http://developit.github.io/js-repaint-perfs/) [fast](https://localvoid.github.io/uibench/)**._
- `h()`, a more generalized version of `React.createElement`
  - _This idea was originally called [hyperscript] and has value well beyond the React ecosystem, so Preact promotes the original standard. ([Read: why `h()`?](http://jasonformat.com/wtf-is-jsx))_
  - _It's also a little more readable: `h('a', { href:'/' }, h('span', null, 'Home'))`_

## What's Added?

Preact actually adds a few convenient features inspired by work in the React community:

- `this.props` and `this.state` are passed to `render()` for you
  - _You can still reference them manually. This is just cleaner, particularly when [destructuring]_
- Batching of DOM updates, debounced/collated using `setTimeout(1)` _(can also use requestAnimationFrame)_
- You can just use `class` for CSS classes. `className` is still supported, but `class` is preferred.
- Component and element recycling/pooling.

## What's Missing?

- [PropType] Validation: Not everyone uses PropTypes, so they aren't part of Preact's core.
  - _**PropTypes are fully supported** in [preact-compat], or you can use them manually._
- [Children]: Not necessary in Preact, because `props.children` is _always an Array_.
  - _`React.Children` is fully supported in [preact-compat]._
- Synthetic Events: Preact's browser support target does not require this extra overhead.
  - _Preact uses the browser's native `addEventListener` for event handling. See [GlobalEventHandlers] for a full list of DOM event handlers._
  - _A full events implementation would mean more maintenance and performance concerns, and a larger API._

## What's Different?

Preact and React have some more subtle differences:

- `render()` accepts a third argument, which is the root node to _replace_, otherwise it appends. This may change slightly in a future version, perhaps auto-detecting that a replacement render is appropriate by inspecting the root node.
- Components do not implement `contextTypes` or `childContextTypes`. Children receive all `context` entries drawn from `getChildContext()`.

[project goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/preactjs/preact/milestones/3.0
[4.0]: https://github.com/preactjs/preact/milestones/4.0
[preact-compat]: https://github.com/preactjs/preact-compat
[proptype]: https://github.com/developit/proptypes
[contexts]: https://reactjs.org/docs/legacy-context.html
[refs]: https://facebook.github.io/react/docs/more-about-refs.html
[children]: https://facebook.github.io/react/docs/top-level-api.html#reactchildren
[globaleventhandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[es6 class components]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[higher-order components]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[stateless pure functional components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[linked state]: /guide/v8/linked-state
