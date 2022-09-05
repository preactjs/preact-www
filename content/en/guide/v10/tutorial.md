---
name: Quick Tutorial
description: 'Write your first Preact application'
---

# Tutorial

This guide walks through building a simple "ticking clock" component. If you're new to Virtual DOM, try the [full Preact tutorial](/tutorial).

> :information_desk_person: This guide assumes that you completed the [Getting Started](/guide/v10/getting-started) document and have successfully set up your tooling. If not, start with [preact-cli](/guide/v10/getting-started#best-practices-powered-with-preact-cli).

---

<div><toc></toc></div>

---

## Hello World

Out of the box, the two functions you'll always see in any Preact codebase are `h()` and `render()`. The `h()` function is used to turn JSX into a structure Preact understands. But it can also be used directly without any JSX involved:

```jsx
// With JSX
const App = <h1>Hello World!</h1>;

// ...the same without JSX
const App = h('h1', null, 'Hello World');
```

This alone doesn't do anything and we need a way to inject our Hello-World app into the DOM. For this we use the `render()` function.

```jsx
// --repl
import { render } from 'preact';

const App = <h1>Hello World!</h1>;

// Inject our app into the DOM
render(App, document.getElementById('app'));
```

Congratulations, you've build your first Preact app!

## Interactive Hello World

Rendering text is a start, but we want to make our app a little more interactive. We want to update it when data changes. :star2:

Our end goal is that we have an app where the user can enter a name and display it, when the form is submitted. For this we need to have something where we can store what we submitted. This is where [Components](/guide/v10/components) come into play.

So let's turn our existing App into a [Components](/guide/v10/components):

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}

render(<App />, document.getElementById("app"));
```

You'll notice that we added a new `Component` import at the top and that we turned `App` into a class. This alone isn't useful but it's the precursor for what we're going to do next. To make things a little more exciting we'll add a form with a text input and a submit button.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

Now we're talking! It's starting to look like a real app! We still need to make it interactive though. Remember that we'll want to change `"Hello world!"` to `"Hello, [userinput]!"`, so we need a way to know the current input value.

We'll store it in a special property called `state` of our Component. It's special, because when it's updated via the `setState` method, Preact will not just update the state, but also schedule a render request for this component. Once the request is handled, our component will be re-rendered with the updated state.

Lastly we need to attach the new state to our input by setting `value` and attaching an event handler to the `input` event.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Initialise our state. For now we only store the input value
  state = { value: '' }

  onInput = ev => {
    // This will schedule a state update. Once updated the component
    // will automatically re-render itself.
    this.setState({ value: ev.target.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

At this point the app shouldn't have changed much from a users point of view, but we'll bring all the pieces together in our next step.

We'll add a handler to the `submit` event of our `<form>` in similar fashion like we just did for the input. The difference is that it writes into a different property of our `state` called `name`. Then we swap out our heading and insert our `state.name` value there.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Add `name` to the initial state
  state = { value: '', name: 'world' }

  onInput = ev => {
    this.setState({ value: ev.target.value });
  }

  // Add a submit handler that updates the `name` with the latest input value
  onSubmit = ev => {
    // Prevent default browser behavior (aka don't submit the form here)
    ev.preventDefault();

    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

Boom! We're done! We can now enter a custom name, click "Update" and our new name appears in our heading.

## A Clock Component

We wrote our first component, so let's get a little more practice. This time we build a clock.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

Ok, that was easy enough! Problem is, that the time doesn't change. It's frozen at the moment we rendered our clock component.

So, we want to have a 1-second timer start once the Component gets added to the DOM, and stop if it is removed. We'll create the timer and store a reference to it in `componentDidMount`, and stop the timer in `componentWillUnmount`. On each timer tick, we'll update the component's `state` object with a new time value. Doing this will automatically re-render the component.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

And we did it again! Now we have [a ticking clock](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!
