---
name: Debugging Preact Apps
description: 'How to debug Preact applications when something goes wrong.'
---

# Debugging Preact Apps

To make development and debugging easier Preact allows you to enable additional warning checks and a browser extension.

which help you to avoid common errors. On top of that there is a browser extension that allows you to inspect the component tree and profile your application. We highly recommend you enable both during development.

Preact ships with a lot of tools to make debugging easier. They're packaged in a single import and can be included by importing `preact/debug`.

These include a bridge to the [Preact Developer Tools](https://preactjs.github.io/preact-devtools/) Extension for Chrome and Firefox and numerous debugging errors/warnings that catch common errors when working with Preact, like incorrect nesting in `<table>` elements.

---

<toc></toc>

---

## Preact Developer Tools Exension

The Preact Developer Tools extension can be downlaoded and installed from the browser's extension store.

- [For Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [For Firefox](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)

Once installed we need to attach our applicaton to the extension by importing either `preact/devtools` or `preact/debug`. To be able to collect all necessary data from all components it must be imported as early as possible before Preact starts rendering.

> If you have them already installed you can **try it out on this site.** Just open the devtools and start inspecting how we built it.

> `preact-cli` does include the `preact/debug` package automatically. You can safely skip the next step if you're using it.

Here is an example of how your main entry file to your application may look like.

```jsx
// Must be the first import
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Strip devtools from production

Most bundlers allow you strip out code when they detect that a branch inside an `if`-statement will never be hit. We can use this to only include `preact/debug` during development and save those precious bytes in a production build.

```js
// We always want the devtools bridge enabled. It only weights a couple of bytes.
import "preact/devtools"

// Most bundlers like webpack, rollup, or parcel allow you to inject
// `process.env.NODE_ENV` to signal the environment the app is running in.
if (process.env.NODE_ENV==='development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

// First render is executed _after_ the devtoools are initialized.
render(<App />, document.getElementById('root'));
```

> Note: `preact/debug` imports `preact/devtools` automatically. If you don't care about enabling the devtools bridge during production you can omit the `preact/devtools` import.

If the extension is installed properly and the bridge is imported, you'll see a new tab labeled "Preact" next to the native devtool panels.

![The Preact devtools tab](/assets/devtools/devtools-tab.png)

> Pro-tip: You can arrange the order of the tabs by dragging them around.

The extension UI is divided into 3 sections:

### The Elements panel

The Elements panel allows you to inspect the component hierarchy of all running Preact instances. Currently versions 10.1.0 and newer are supported.

![The elements panel](/assets/devtools/devtools-elements.png)

### The Profiler

asd

> The profiler needs at least Preact version `10.3.0` and newer. Older versions are not supported.

### Settings

Via the settings panel we can set global options on how the extension should behave. We can, for example, toggle the color scheme between a dark and a light variant for optimal viewing experience.

![the settings UI](/assets/devtools/devtools-settings.png)

The dark variant looks like this:

![dark mode](/assets/devtools/devtools-dark.png)

## Debug Warnings and Errors

Sometimes you'll may get warnings or errors whenever Preact detects invalid code. These should all be fixed to ensure that your app works flawlessly. They can be enabled by importing `preact/debug`.

### `undefined` parent passed to `render()`

This means that the code is trying to render your app into nothing instead of a DOM node. It's the difference between:

```jsx
// What Preact received
render(<App />, undefined);

// vs what it expected
render(<App />, actualDomNode);
```

The main reason this error occurs is that the DOM node isn't present when the `render()` function is called. Make sure it exists.

### `undefined` component passed to `createElement()`

Preact will throw this error whenever you pass `undefined` instead of a component. The common cause for this one is mixing up `default` and `named` exports.

```jsx
// app.js
export default function App() {
  return <div>Hello World</div>;
}

// index.js: Wrong, because `app.js` doesn't have a named export
import { App } from './app';
render(<App />, dom);
```

The same error will be thrown when it's the other way around. When you declare a `named` export and are trying to use it as a `default` export. One quick way to check this (in case your editor won't do it already), is to just log out the import:

```js
// app.js
export function App() {
  return <div>Hello World</div>;
}

// index.js
import App from './app';

console.log(App);
// Logs: { default: [Function] } instead of the component
```

### Passed a JSX literal as JSX twice

Passing a JSX-Literal or Component into JSX again is invalid and will trigger this error.

```jsx
const Foo = <div>foo</div>;
// Invalid: Foo already contains a JSX-Element
render(<Foo />, dom);
```

To fix this, we can just pass the variable directly:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Improper nesting of table detected

HTML has a very clear directions on how tables should be structured. Deviating from that will lead to rendering errors that are very hard to debug. In Preact we'll detect this and print an error. To learn more about how tables should be structured we can highly recommend [the mdn documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)

### Invalid `ref`-property

When the `ref` property contains something unexpected we'll throw this error. This includes string-based `refs` that have been deprecated a while ago.

```jsx
// valid
<div ref={e => {/* ... */)}} />

// valid
const ref = createRef();
<div ref={ref} />

// Invalid
<div ref="ref" />
```

### Invalid event handler

Sometimes you'll may accidentally pass a wrong value to an event handler. They must always be a `function` or `null` if you want to remove it. All other types are invalid.

```jsx
// valid
<div onClick={() => console.log("click")} />

// invalid
<div onClick={console.log("click")} />
```

### Hook can only be invoked from render methods

This error occurs when you try to use a hook outside of a component. They are only supported inside a function component.

```jsx
// Invalid, must be used inside a component
const [value, setValue] = useState(0);

// valid
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</div>;
}
```

### Getting `vnode.[property]` is deprecated

With Preact X we did some breaking changes to our internal `vnode` shape.

| Preact 8.x | Preact 10.x |
|---|---|
| `vnode.nodeName` | `vnode.type` |
| `vnode.attributes` | `vnode.props` |
| `vnode.children` | `vnode.props.children`|

### Found children with the same key

One unique aspect about virtual-dom based libraries is that they have to detect when a children is moved around. However to know which child is which, we need to flag them somehow. _This is only necessary when you're creating children dynamically._

```jsx
// Both children will have the same key "A"
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

The correct way to do it is to give them unique keys. In most cases the data you're iterating over will have some form of `id`.

```jsx
const persons = [
  { name: 'John', age: 22 },
  { name: 'Sarah', age: 24}
];

// Somewhere later in your component
<div>
  {persons.map(({ name, age }) => {
    return <p key={name}>{name}, Age: {age}</p>;
  })}
</div>
```

[React Developer Tools]: https://github.com/facebook/react/tree/master/packages/react-devtools
