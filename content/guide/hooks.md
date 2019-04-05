---
name: Hooks
permalink: '/guide/hooks'
---

# Hooks

## Introduction

Hooks are an opportunity to cross the gap between class
and functional components.

With this new feature we can introduce several new things
in Functional components:

- State
- In render memoization
- Side-effects
- Mutable refs
- Context

Each of these will be explained in more depth in the following chapters.

All of these hooks are available from Preact X and will be
importable from `preact/hooks`.

## State

Do you remember occasions where you had written your neat
little functional component but all of a sudden you needed
some state and had to convert it to a class just for that
one state boolean?

Well you'll enjoy reading the next part.

### useState

useState as all other hooks can only be invoked in the render
method.
When invoking it you can pass an argument, this will be your
initial value.
After the invocation it will return an array with two arguments
The first being the state and the second a setter for the state.

The setter works just like the old setState, you can pass a value,
or use it as a function.
When using it as a function the argument will be your old state and you
return it a new state.

Here's a simple counter implemented with useState.

```jsx
import { useState } from 'preact/hooks;

const Counter = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>Current count: {count}</p>
            <button onClick={() => setCount(c => c + 1)} />
        </div>
    );
}

export default Counter;
```

If you are dealing with an expensive initial value you should
pass it as a function to prevent your initial value from being
reevaluated every render.

Let's look at a small example,

Let's say we have an array of people where we need to filter out
all people under the age of twenty.
This will be our initial value.

If we write: `useState(people.filter((person) => person.age < 20))`
then it will be evaluated on every render (it won't change the value
it will just be evaluated).
While when we do this: `useState(() => people.filter((person) => person.age < 20))`
when passing it like this it won't be reevaluted but only applied once.

### useReducer

## Memoization

### useMemo

### useCallbacks

## Side-effects

## Mutable refs


## Context

## Pitfalls

## Differences to React
