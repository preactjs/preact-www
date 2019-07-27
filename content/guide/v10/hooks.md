---
name: Hooks
---

# Hooks <!-- omit in toc -->

Hooks is a new concept that allows you to compose state and side effects. They allow you to reuse stateful logic between components.

If you've worked with Preact for a while you may be familiar with patterns like `render-props` and `high-order-components` that try to solve the same. But they've always made code harder to follow whereas with hooks you can neatly extract that logic and make it easy to unit test it independently.

Due to their functional nature they can be used in functional components and avoid many pitfalls of the `this` keyword that's present in classes. Instead they rely on closures which makes them value-bound and eliminates a whole bag of bugs when it comes to async state updates.

There are two ways to import these, you can import them from
`preact/hooks` or `preact/compat`.

---

- [Introduction](#introduction)
- [Stateful hooks](#stateful-hooks)
  - [useState](#usestate)
  - [useReducer](#usereducer)
- [Memoization](#memoization)
- [Refs](#refs)
- [Context](#context)
- [Side-Effects](#side-effects)
- [Recipes](#recipes)

---

## Introduction

It's easier to show you what they look like and compare that to class components to get a grasp of the advantages of them. Take a simple counter app for example:

```jsx
class Counter extends Component {
  state = { value: 0 };

  increment = () => this.setState(prev => ({ value: prev.value +1 }));

  render(_, { value }) {
    return (
      <div>
        Counter: {value}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

All the component does is render a div and a button to increment the counter. Let's rewrite it to be beased on hooks:

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

At this point they seem pretty similar. So let's take it one step further. Now we can extract the counter logic into a custom hook to make it reusable across components.

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);
  return { value, increment };
}

// First counter
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      Counter A: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Second counter which renders a different output.
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Counter B: {value}</h1>
      <p>I'm a nice counter</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

Note how both `CounterA` and `CounterB` are completely independent of each other.

> If you're thinking that they may look a bit weird, than you're not alone. It took everybody a while to rethink our learned habits.

## Stateful hooks

Here we'll see how we can introduce stateful logic into these
functional components.
Before hooks we had to make a class component every time we needed
state. Now times have changed.

### useState

This hook accepts an argument, this will be the initial state. When
invoking this hook returns an array of two variables. The first being
the current state and the second one being the setter for our state.

Our setter behaves similar to the setter of our classic state.
It accepts a value or a function with the currentState as argument.

When you call the setter and the state is different, it will trigger
a rerender starting from the component where that useState has been used.

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // You can also pass a callback to the setter
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

> When our initial state is expensive it's better to pass a function instead of a value.

### useReducer

## Memoization

## Refs

## Context

## Side-Effects

## Recipes
