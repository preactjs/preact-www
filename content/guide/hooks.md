---
name: Hooks
permalink: '/guide/hooks'
---

# Hooks

Hooks are a way to incorporate state/side effects/...
in our functional components.

There are two ways to import these, you can import them from
`preact/hooks` or `preact/compat`.

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

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const Counter = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount((currentCount) => currentCount - 1)}>Decrement</button>
        </div>
    )
}
```

> When our initial state is expensive it's better to pass a function instead of a value.
