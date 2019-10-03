---
name: Hooks
description: 'Hooks in Preact allow you to compose behaviours together and re-use that logic in different components.'
---

# Hooks

Hooks is a new concept that allows you to compose state and side effects. They allow you to reuse stateful logic between components.

If you've worked with Preact for a while you may be familiar with patterns like `render-props` and `higher-order-components` that try to solve the same. But they've always made code harder to follow whereas with hooks you can neatly extract that logic and make it easy to unit test it independently.

Due to their functional nature they can be used in functional components and avoid many pitfalls of the `this` keyword that's present in classes. Instead they rely on closures which makes them value-bound and eliminates a whole bag of bugs when it comes to async state updates.

There are two ways to import these, you can import them from
`preact/hooks` or `preact/compat`.

---

<toc></toc>

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

All the component does is render a div and a button to increment the counter. Let's rewrite it to be based on hooks:

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

## The dependency argument

Many hooks feature an argument that can be used to limit when a hook should be updated. Preact will walk over the dependency array and check for referential equality. In the previous Counter example we've used it on `useCallback`:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(
    () => setValue(value + 1),
    // This is the dependency array
    [value]
  );
  return { value, increment };
}
```

In this example we always want to update the function reference to the callback whenever `value` changes. This is necessary because otherwise the callback would still reference the `value` variable of the time the callback was created in.

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

The `useReducer` hook has a close resemblance to [redux](https://redux.js.org/). Compared to [useState](#usestateinitialstate) it's easier to use when you have complex state logic where the next state depends on the previous one.

```jsx
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Unexpected action');
  }
};

function Counter() {
  // Returns the current state and a dispatch function to
  // trigger an action
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>reset</button>
    </div>
  );
}
```

## Memoization

In UI programming there is often some state or result that's expensive to calculate. Memoization can cache the results of that calculation allowing it to be reused when the same input is used.

### useMemo

With the `useMemo` hook we can memoize the results of that computation and only recalculate it when one of the dependencies changes.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // Only re-run the expensive function when any of these
  // dependencies change
  [a, b]
);
```

> Don't run any effectful code inside `useMemo`. Side-effects belong in `useEffect`.

### useCallback

The `useCallback` hook can be used to ensure that the returned function will remain referentially equal for as long as no dependencies have changed. This can be used to optimize updates of child components when they rely on referential equality to skip updates (e.g. `shouldComponentUpdate`).

```jsx
const onClick = useCallback(
  () => console.log(a, b);
  [a, b],
);
```

> Fun fact: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

## useRef

To get a reference to a DOM node inside a functional components there is the `useRef` hook. It works similar to [createRef](/guide/v10/refs#createrefs).

```jsx
function Foo() {
  // Initialize useRef with an initial value of `null`
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Focus input</button>
    </>
  );
}
```

> Be careful not to confuse `useRef` with `createRef`.

## useContext

To access context in a functional component we can use the `useContext` hook, without any higher-order or wrapper components. The first argument must be the context object that's created from a `createContext` call.

```jsx
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Active theme: {theme}</p>;
}

// ...later
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
```

## Side-Effects

Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, you'll find that the `useEffect` fits nearly all your needs. It's one of the main advantages of the hooks API, that it reshapes your mind into thinking in effects instead of a component's lifecycle.

### useEffect

As the name implies, `useEffect` is the main way to trigger various side-effects. You can even return a cleanup function from your effect one if needed.

```jsx
useEffect(() => {
  // Trigger your effect
  return () => {
    // Optional: Any cleanup code
  };
}, []);
```

We'll start with a `Title` component which should reflect the title to the document, so that we can see it in the address bar of our tab in our browser.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

The first argument to `useEffect` is an argument-less callback that triggers the effect. In our case we only want to trigger it, when the title really has changed. There'd be no point in updating it when it stayed the same. That's why we're using the second argument to specify our [dependency-array](#the-dependency-argument).

But sometimes we have a more complex use case. Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. This can be accomplished with `useEffect` too. To run any cleanup code we just need to return a function in our callback.

```jsx
// Component that will always display the current window width
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div>Window width: {width}</div>;
}
```

> The cleanup function is optional. If you don't need to run any cleanup code, you don't need to return anything in the callback that's passed to `useEffect`.

### useLayoutEffect

The signature is identical to [useEffect](#useeffect), but it will fire as soon as the component is diffed and the browser has a chance to paint.
