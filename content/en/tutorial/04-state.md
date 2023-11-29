---
prev: /tutorial/03-components
next: /tutorial/05-refs
title: State
solvable: true
---

Now that we know how to create HTML elements and components, and how to
pass props and event handlers to both using JSX, it's time to learn how
to update the Virtual DOM tree.

As we alluded to in the previous chapter, both function and class components
can have **state** - data stored by a component that is used to change
its Virtual DOM tree. When a component updates its state, Preact re-renders
that component using the updated state value. For function components, this
means Preact will re-invoke the function, whereas for class components it
will only re-invoke the class' `render()` method. Let's look at an example
of each.

### State in class components

Class components have a `state` property, which is an object that holds
data the component can use when its `render()` method is called. A component
can call `this.setState()` to update its `state` property and request that
it be re-rendered by Preact.

```jsx
class MyButton extends Component {
  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: true })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.clicked ? 'Clicked' : 'No clicks yet'}
      </button>
    )
  }
}
```

Clicking the button calls `this.setState()`, which causes Preact to
call the class' `render()` method again. Now that `this.state.clicked`
is `true`, the `render()` method returns a Virtual DOM tree containing
the text "Clicked" instead of "No clicks yet", causing Preact to update
the button's text in the DOM.


### State in function components using hooks

Function components can have state too! While they don't have a
`this.state` property like class components, a tiny add-on module
is included with Preact that provides functions for storing
and working with state inside function components, called "hooks".

Hooks are special functions that can be called from within a function
component. They're special because they **remember information across
renders**, a bit like properties and methods on a class. For example,
the `useState` hook returns an Array containing a value and a "setter"
function that can be called to update that value. When a component is
invoked (re-rendered) multiple times, any `useState()` calls it makes
will return the exact same Array each time.

> ℹ️ **_How do hooks actually work?_**
>
> Behind the scenes, hook functions like `setState` work by storing
> data in a sequence of "slots" associated with each component
> in the Virtual DOM tree. Calling a hook function uses up one slot,
> and increments an internal "slot number" counter so the next call
> uses the next slot. Preact resets this counter before invoking each
> component, so each hook call gets associated with the same slot when
> a component is rendered multiple times.
>
> ```js
> function User() {
>   const [name, setName] = useState("Bob")    // slot 0
>   const [age, setAge] = useState(42)         // slot 1
>   const [online, setOnline] = useState(true) // slot 2
> }
> ```
>
> This is called call site ordering, and it's the reason why hooks must
> always be called in the same order within a component, and cannot be
> called conditionally or within loops.

Let's see an example of the `useState` hook in action:

```jsx
import { useState } from 'preact/hooks'

const MyButton = () => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
  }

  return (
    <button onClick={handleClick}>
      {clicked ? 'Clicked' : 'No clicks yet'}
    </button>
  )
}
```

Clicking the button calls `setClicked(true)`, which updates the state field
created by our `useState()` call, which in turn causes Preact to re-render
this component. When the component is rendered (invoked) a second time,
the value of the `clicked` state field will be `true`, and the returned
Virtual DOM will have the text "Clicked" instead of "No clicks yet".
This will cause Preact to update the button's text in the DOM.


---

## Try it!

Let's try creating a counter, starting from the code we wrote in the previous
chapter. We'll need to store a `count` number in state, and increment its value
by `1` when a button is clicked.

Since we used a function component in the previous chapter, it may be easiest to
use hooks, though you can pick whichever method of storing state you prefer.


<solution>
  <h4>🎉 Congratulations!</h4>
  <p>You learned how to use state!</p>
</solution>


```js:setup
useResult(function () {
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (oe) oe.apply(this, arguments);

    if (e.target.localName !== 'button') return;
    var root = e.target.parentNode.parentNode;
    var text = root.innerText.match(/Count:\s*([\w.-]*)/i);
    if (!text) return;
    if (!text[1].match(/^-?\d+$/)) {
      return console.warn('Tip: it looks like you\'re not rendering {count} anywhere.');
    }
    setTimeout(function() {
      var text2 = root.innerText.match(/Count:\s*([\w.-]*)/i);
      if (!text2) {
        return console.warn('Tip: did you remember to render {count}?');
      }
      if (text2[1] == text[1]) {
        return console.warn('Tip: remember to call the "setter" function to change the value of `count`.');
      }
      if (!text2[1].match(/^-?\d+$/)) {
        return console.warn('Tip: it looks like `count` is being set to something other than a number.');
      }

      if (Number(text2[1]) === Number(text[1]) + 1) {
        store.setState({ solved: true });
      }
    }, 10);
  }

  return function () {
    options.event = oe;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    // increment count by 1 here
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

```jsx:repl-final
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const [count, setCount] = useState(0)

  const clicked = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p class="count">Count: {count}</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Click me</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v10/components#lifecycle-methods
