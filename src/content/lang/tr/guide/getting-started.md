---
name: Getting Started
permalink: '/guide/getting-started'
---

# Getting Started

This guide walks through building a simple "ticking clock" component. More detailed information for each topic can be found in the dedicated pages under the Guide menu.


> :information_desk_person: You [don't _have_ to use ES2015 to use Preact](https://github.com/developit/preact-without-babel)... but you should. This guide assumes you have some sort of ES2015 build set up using babel and/or webpack/browserify/gulp/grunt/etc.  If you don't, start with [preact-boilerplate] or a [CodePen Template](http://codepen.io/developit/pen/pgaROe?editors=0010).


---


## Import what you need

The `preact` module provides both named and default exports, so you can either import everything under a namespace of your choosing, or just what you need as locals:

**Named:**

```js
import { h, render, Component } from 'preact';

// Tell Babel to transform JSX into h() calls:
/** @jsx h */
```

**Default:**

```js
import preact from 'preact';

// Tell Babel to transform JSX into preact.h() calls:
/** @jsx preact.h */
```

> Named imports work well for highly structured applications, whereas the default import is quick and never needs to be updated when using different parts of the library.

**Using via a CDN:**

```html
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.min.js"></script>
```

### Global pragma

Instead of declaring the `@jsx` pragma in your code, it's best to configure it globally in a `.babelrc`.

**Named:**
>**For Babel 5 and prior:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **For Babel 6 and 7:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Default:**
>**For Babel 5 and prior:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **For Babel 6 and 7:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## Rendering JSX

Out of the box, Preact provides an `h()` function that turns your JSX into Virtual DOM elements _([here's how](http://jasonformat.com/wtf-is-jsx))_. It also provides a `render()` function that creates a DOM tree from that Virtual DOM.

To render some JSX, just import those two functions and use them like so:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("hi!") }>Click Me</button>
	</div>
), document.body);
```

This should seem pretty straightforward if you've used [hyperscript] or one of its [many friends](https://github.com/developit/vhtml).

Rendering hyperscript with a virtual DOM is pointless, though. We want to render components and have them updated when data changes - that's where the power of virtual DOM diffing shines. :star2:


---


## Components

Preact exports a generic `Component` class, which can be extended to build encapsulated, self-updating pieces of a User Interface.  Components support all of the standard React [lifecycle methods](#the-component-lifecycle), like `shouldComponentUpdate()` and `componentWillReceiveProps()`.  Providing specific implementations of these methods is the preferred mechanism for controlling _when_ and _how_ components update.

Components also have a `render()` method, but unlike React this method is passed `(props, state)` as arguments. This provides an ergonomic means to destructure `props` and `state` into local variables to be referenced from JSX.

Let's take a look at a very simple `Clock` component, which shows the current time.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// render an instance of Clock into <body>:
render(<Clock />, document.body);
```


That's great. Running this produces the following HTML DOM structure:

```html
<span>10:28:57 PM</span>
```


---


## The Component Lifecycle

In order to have the clock's time update every second, we need to know when `<Clock>` gets mounted to the DOM. _If you've used HTML5 Custom Elements, this is similar to the `attachedCallback` and `detachedCallback` lifecycle methods._ Preact invokes the following lifecycle methods if they are defined for a Component:

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | before the component gets mounted to the DOM     |
| `componentDidMount`         | after the component gets mounted to the DOM      |
| `componentWillUnmount`      | prior to removal from the DOM                    |
| `componentWillReceiveProps` | before new props get accepted                    |
| `shouldComponentUpdate`     | before `render()`. Return `false` to skip render |
| `componentWillUpdate`       | before `render()`                                |
| `componentDidUpdate`        | after `render()`                                 |



So, we want to have a 1-second timer start once the Component gets added to the DOM, and stop if it is removed. We'll create the timer and store a reference to it in `componentDidMount`, and stop the timer in `componentWillUnmount`. On each timer tick, we'll update the component's `state` object with a new time value. Doing this will automatically re-render the component.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// set initial time:
		this.state.time = Date.now();
	}

	componentDidMount() {
		// update time every second
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// stop when not renderable
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// render an instance of Clock into <body>:
render(<Clock />, document.body);
```


---


Now we have [a ticking clock](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!


[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
