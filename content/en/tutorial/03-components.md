---
prev: /tutorial/02-events
next: /tutorial/04-state
title: Components
solvable: true
---

As we alluded to in part one of this tutorial, the key building block
in Virtual DOM applications is the Component. A Component is a self-contained
piece of an application that can be rendered as part of the Virtual DOM
tree just like an HTML element. You can think of a Component like a function
call: both are mechanisms that allow code reuse and indirection.

To illustrate, let's create a simple component called `MyButton` that
returns a Virtual DOM tree describing an HTML `<button>` element:

```jsx
function MyButton(props) {
  return <button class="my-button">{props.text}</button>
}
```

We can use this component in an application by referencing it in JSX:

```js
let vdom = <MyButton text="Click Me!" />

// remember createElement? here's what the line above compiles to:
let vdom = createElement(MyButton, { text: "Click Me!" })
```

Anywhere you use JSX to describe trees of HTML, you can also describe trees
of Components. The difference is that a component is described in JSX using
a name beginning with an uppercase character that corresponds to the
component's name (a JavaScript variable).

As Preact renders the Virtual DOM tree described by your JSX, each component
function it encounters will be invoked at that spot in the tree. As an example,
we can render our `MyButton` component into the body of a web page by passing
a JSX element describing that component to `render()`:

```jsx
import { render } from 'preact';

render(<MyButton text="Click me!" />, document.body)
```

### Nesting Components

Components can reference other components in Virtual DOM tree they return.
This creates a tree of components:

```jsx
function MediaPlayer() {
  return (
    <div>
      <MyButton text="Play" />
      <MyButton text="Stop" />
    </div>
  )
}

render(<MediaPlayer />, document.body)
```

We can use this technique to render different trees of components for
different scenarios. Let's make that `MediaPlayer` show a "Play" button
when no sound is playing, and a "Stop" button when sound is playing:

```jsx
function MediaPlayer(props) {
  return (
    <div>
      {props.playing ? (
        <MyButton text="Stop" />
      ) : (
        <MyButton text="Play" />
      )}
    </div>
  )
}

render(<MediaPlayer playing={false} />, document.body)
// renders <button>Play</button>

render(<MediaPlayer playing={true} />, document.body)
// renders <button>Stop</button>
```

> **Remember:** `{curly}` braces in JSX let us jump back into plain JavaScript.
> Here we're using a [ternary] expression to show different buttons based on
> the value of the `playing` prop.


### Component Children

Components can also be nested just like HTML elements. One of the reasons
Components are a powerful primitive is because they let us apply custom logic
to control how Virtual DOM elements nested within a component should be rendered.

The way this works is deceptively simple: any Virtual DOM elements nested
within a component in JSX are passed to that component as a special `children`
prop. A component can choose where to place its children by referencing them in
JSX using a `{children}` expression. Or, components can simply return the
`children` value, and Preact will render those Virtual DOM elements right where
that Component was placed in the Virtual DOM tree.

```jsx
<Foo>
  <a />
  <b />
</Foo>

function Foo(props) {
  return props.children  // [<a />, <b />]
}
```

Thinking back to the previous example, our `MyButton` component expected
a `text` prop that was inserted into a `<button>` element as its display
text. What if we wanted to display an image instead of text?

Let's rewrite `MyButton` to allow nesting using the `children` prop:

```jsx
function MyButton(props) {
  return <button class="my-button">{props.children}</button>
}

function App() {
  return (
    <MyButton>
      <img src="icon.png" />
      Click Me!
    </MyButton>
  )
}

render(<App />, document.body)
```

Now that we've seen a few examples of components rendering other
components, hopefully it's starting to become clear how nested
components let us assemble complex applications out of many smaller
individual pieces.

---

### Types of Components

<!--
So far, we've seen Components that are functions. Function components
take in `props` as their input, and return a Virtual DOM tree as
their output. What if we wanted to write a Component that rendered
different Virtual DOM trees based on an input other than `props`?

In addition to providing a way to map `props` to a Virtual DOM tree,
components can also update _themselves_. There are two ways to do this:
class components, and hooks. We'll cover hooks 
-->

So far, we've seen Components that are functions. Function components
take in `props` as their input, and return a Virtual DOM tree as
their output. Components can also be written as JavaScript classes,
which get instantiated by Preact and provide a `render()` method that
works much like a function component.

Class components are created by extending Preact's `Component` base class.
In the example below, notice how `render()` takes `props` as its input and
returns a Virtual DOM tree as its output - just like a function component!


```jsx
import { Component } from 'preact';

class MyButton extends Component {
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>Click Me!</MyButton>, document.body)
```

The reason we might use a class to define a component is to keep track of
the _lifecycle_ of our component. Each time Preact encounters a component
when rendering a Virtual DOM tree, it will create a new instance of our
class (`new MyButton()`).

However, if you recall from chapter one - Preact can be repeatedly given
new Virtual DOM trees. Each time we give Preact a new tree, it gets
compared against the previous tree to determine what changed between the
two, and those changes are applied to the page.

When a component is defined using a class, any _updates_ to that component
in the tree will reuse the same class instance. That means it's possible to
store data inside a class component that will be available the next time
its `render()` method is called.

Class components can also implement a number of [lifecycle methods], which
Preact will call in response to changes in the Virtual DOM tree:

```jsx
class MyButton extends Component {
  componentDidMount() {
    console.log('Hello from a new <MyButton> component!')
  }
  componentDidUpdate() {
    console.log('A <MyButton> component was updated!')
  }
  render(props) {
    return <button class="my-button">{props.children}</button>
  }
}

render(<MyButton>Click Me!</MyButton>, document.body)
// logs: "Hello from a new <MyButton> component!"

render(<MyButton>Click Me!</MyButton>, document.body)
// logs: "A <MyButton> component was updated!"
```

The lifecycle of class components makes them a useful tool for building
pieces of an application that respond to changes, rather than strictly
mapping `props` to trees. They also provide a way to store information
separately at each location where they're placed in the Virtual DOM tree.
In the next chapter, we'll see how components can update their section of
the tree whenever they want to change it.

---

## Try it!

To practise, let's combine what we've learned about components with our
event skills from the previous two chapters!

Create a `MyButton` component that accepts `style`, `children` and `onClick`
props, and returns an HTML `<button>` element with those props applied.

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>You're on your way to being a component pro!</p>
</solution>


```js:setup
useRealm(function (realm) {
  var options = require('preact').options;
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  var hasComponent = false;
  var check = false;

  win.console.log = function() {
    if (hasComponent && check) {
      store.setState({ solved: true });
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  var e = options.event;
  options.event = function(e) {
    if (e.type === 'click') {
      check = true;
      setTimeout(() => check = false);
    }
  };

  var r = options.__r;
  options.__r = function(vnode) {
    if (typeof vnode.type === 'function' && /MyButton/.test(vnode.type)) {
      hasComponent = true;
    }
  }

  return function () {
    options.event = e;
    options.__r = r;
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from "preact";

function MyButton(props) {
  // start here!
}

function App() {
  const clicked = () => {
    console.log('Hello!')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <button style={{ color: 'purple' }} onClick={clicked}>Click me</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    console.log('Hello!')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Click me</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v10/components#lifecycle-methods
