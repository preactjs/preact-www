---
name: Switching to Preact from React
permalink: '/guide/switching-to-preact
---

# Switching to Preact (from React)

There are two different approaches to switch from React to Preact:

1. Install the `preact-compat` alias
2. Switch your imports to `preact` and remove incompatible code

## Easy: `preact-compat` Alias

Switching to Preact can be as easy as installing and aliasing `preact-compat` in for `react` and `react-dom`.
This lets you continue writing React/ReactDOM code without any changes to your workflow or codebase.
`preact-compat` adds somewhere around 2kb to your bundle size, but has the advantage of supporting
the vast majority of existing React modules you might find on npm.  The `preact-compat` package provides
all the necessary tweaks on top of Preact's core to make it work just like `react` and `react-dom`, in a single module.

The process for installation is two steps.
First, you must install preact and preact-compat (they are separate packages):

```sh
npm i -S preact preact-compat
```

With those dependencies installed, configure your build system to alias React imports so they point to Preact instead.


### How to Alias preact-compat

Now that you have your dependencies installed, you'll need to configure your build system
to redirect any imports/requires looking for `react` or `react-dom` with `preact-compat`.

#### Aliasing via Webpack

Simply add the following [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias)
configuration to your `webpack.config.js`:

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Aliasing via Browserify

If you're using Browserify, aliases can be defined by adding the [aliasify](https://www.npmjs.com/package/aliasify) transform.

First, install the transform:  `npm i -D aliasify`

Then, in your `package.json`, tell aliasify to redirect react imports to preact-compat:

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Aliasing Manually

If you're not using a build system or want to permanently switch to `preact-compat`,
you can also find & replace all the imports/requires in your codebase much like an alias does:

> **find:**    `(['"])react(-dom)?\1`
>
> **replace:** `$1preact-compat$1`

In this case though, you might find it more compelling to switch directly to `preact` itself, rather than relying on `preact-compat`.
Preact's core is quite fully featured, and many idiomatic React codebases can actually be switched straight to `preact` with little effort.
That approach is covered in the next section.

#### Aliasing in Node using module-alias

For SSR purposes, if you are not using a bundler like webpack to build your server side code, you can use the [module-alias](https://www.npmjs.com/package/module-alias) package to replace react with preact.

```sh
npm i -S module-alias
```

`patchPreact.js`:
```js
var path = require('path')
var moduleAlias = require('module-alias')

moduleAlias.addAliases({
  'react': 'preact-compat/dist/preact-compat.min',
  'react-dom': 'preact-compat/dist/preact-compat.min',
  'create-react-class': path.resolve(__dirname, './create-preact-class')
})
```

`create-preact-class.js`:
```js
import { createClass } from 'preact-compat/dist/preact-compat.min'
export default createClass
```

If you are using the new `import` syntax on your server with Babel, writing these lines above your other imports will not work since Babel moves all imports to the top of a module.  In that case, save the above code as `patchPreact.js`, then import it at the top of your file (`import './patchPreact'`). You can read more on `module-alias` usage [here](https://www.npmjs.com/package/module-alias).


It is also possible to alias directly in node without the `module-alias` package. This relies on internal properties of Node's module system, so proceed with caution.  To alias manually:

```js
// patchPreact.js
var React = require('react')
var ReactDOM = require('react-dom')
var ReactDOMServer = require('react-dom/server')
var CreateReactClass = require('create-react-class')
var Preact = require('preact-compat/dist/preact-compat.min')
var Module = module.constructor
Module._cache[require.resolve('react')].exports = Preact
Module._cache[require.resolve('react-dom')].exports = Preact
Module._cache[require.resolve('create-react-class')].exports.default = Preact.createClass
```

### Build & Test

**You're done!**
Now when you run your build, all your React imports will be instead importing `preact-compat` and your bundle will be much smaller.
It's always a good idea to run your test suite and of course load up your app to see how it's working.


---


## Optimal: Switch to Preact

You don't have to use `preact-compat` in your own codebase in order to migrate from React to Preact.
Preact's API is nearly identical to React's, and many React codebases can be migrated with little or no changes needed.

Generally, the process of switching to Preact involves a few steps:

### 1. Install Preact

This one is simple: you'll need to install the library in order to use it!

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX Pragma: transpile to `h()`

> **Background:** While the [JSX] language extension is independent from React, popular
> transpilers like [Babel] and [Bublé] default to converting JSX to `React.createElement()` calls.
> There are historical reasons for this, but it's worth understanding that the function calls JSX
> transpiles to are actually a pre-existing technology called [Hyperscript]. Preact pays homage
> to this and attempts to promote a better understanding of the simplicity of JSX by using `h()`
> as its [JSX Pragma].
>
> **TL;DR:** We need to switch `React.createElement()` out for preact's `h()`

In JSX, the "pragma" is the name of a function that handles creating each element:

> `<div />` transpiles to `h('div')`
>
> `<Foo />` transpiles to `h(Foo)`
>
> `<a href="/">Hello</a>` to `h('a', { href:'/' }, 'Hello')`

In each example above, `h` is the function name we declared as the JSX Pragma.


#### Via Babel

If you're using Babel, you can set the JSX Pragma in your `.babelrc` or `package.json` (whichever you prefer):

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Via Comments

If you're working in an online editor powered by Babel (such as JSFiddle or Codepen),
you can set the JSX Pragma by defining a comment near the top of your code:

`/** @jsx h */`


#### Via Bublé

[Bublé] ships with JSX support by default.  Just set the `jsx` option:

`buble({ jsx: 'h' })`


### 3. Update any Legacy Code

While Preact strives to be API-compatible with React, portions of the interface are intentionally not included.
The most noteworthy of these is `createClass()`. Opinions vary wildly on the subject of classes and OOP, but
it's worth understanding that JavaScript classes are internally in VDOM libraries to represent component types,
which is important when dealing with the nuances of managing component lifecycles.

If your codebase is heavily reliant on `createClass()`, you still have a great option:
Laurence Dorman maintains a [standalone `createClass()` implementation](https://github.com/ld0rman/preact-classless-component)
that works directly with preact and is only a few hundred bytes.
Alternatively, you can automatically convert your `createClass()` calls to ES Classes using [preact-codemod](https://github.com/vutran/preact-codemod) by Vu Tran.

Another difference worth noting is that Preact only supports Function Refs by default.
String refs are deprecated in React and will be removed shortly, since they introduce a surprising amount of complexity for little gain.
If you want to keep using String refs, [this tiny linkedRef function](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)
offers a future-proofed version that still populates `this.refs.$$` like String Refs did.  The simplicity of this tiny wrapper around
Function Refs also helps illustrate why Function Refs are now the preferred choice going forward.


### 4. Simplify Root Render

Since React 0.13, `render()` has been provided by the `react-dom` module.
Preact does not use a separate module for DOM rendering, since it is focused solely on being a great DOM renderer.
So, the last step in converting your codebase to Preact is switching `ReactDOM.render()` to preact's `render()`:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

It's also worth noting that Preact's `render()` is non-destructive, so rendering into `<body>` is perfectly fine (encouraged, even).
This is possible because Preact does not assume it controls the entire root element you pass it.  The second argument to `render()`
is actually `parent` - meaning it's a DOM element to render _into_.  If you would like to re-render from the root (perhaps for Hot
Module Replacement), `render()` accepts an element to replace as a third argument:

```js
// initial render:
render(<App />, document.body);

// update in-place:
render(<App />, document.body, document.body.lastElementChild);
```

In the above example, we're relying on the last child being our previously rendered root.
While this works in many cases (jsfiddles, codepens, etc), it's best to have more control.
This is why `render()` returns the root element: you pass it as the third argument to re-render in-place.
The following example shows how to re-render in response to Webpack's Hot Module Replacement updates:

```js
// root holds our app's root DOM Element:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// example: Re-render on Webpack HMR update:
if (module.hot) module.hot.accept('./app', init);
```

The full technique can be seen in [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
