---
name: API Reference
title: Introducing Signals
date: 2022-09-06
---

Signals are an easier way to manage your application's state compared to hooks. A signal is a container object with a special "value" property that holds some value. Reading a signal's value property from within a component or computed function automatically subscribes to updates, and writing to the value property triggers subscriptions.

Accessing the value of a signal within a component automatically re-renders that component when the value changes. In addition to being simpler and easier to write, this also ensures state updates stay fast regardless of how many components your app has. Signals will automatically optimize updates behind the scenes for you.

```jsx
import { signal, computed } from "@preact/signals";
 
// Option A: Instantiate signals outside of your components.
//           This is great if you want to be able to test
//           your application state independently.
const count = signal(0);
const double = computed(() => count.value * 2);
 
function Counter() {
  return (
    <button onClick={() => count.value++}>
      Value: {count}, value x 2 = {double}
    </button>
  );
}
```

```jsx
 import { useSignal, useComputed } from "@preact/signals";

// Option B: Instantiate them inside components. This is
//           very similar to what you’d do with `useState`
function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);
 
  return (
    <button onClick={() => count.value++}>
      Value: {count}, value x 2 = {double}
    </button>
  );
}
```

Since signals are shipped as an add-on, you can introduce them at your own pace. Try them out in a few components and gradually adopt them over time. They work great with hooks, so you can bring your existing knowledge with you. There are no breaking changes.

Oh and by the way, we are staying true to our roots of bringing you the smallest libraries possible. Signals are split into the core library and the Preact adapter with a combined size shy of 2kB.

If you want to jump right in, head over to our documentation to learn more in depth about signals.

## Which problems are solved by signals?

Over the past years we’ve been working on a wide spectrum of apps and teams, ranging from smaller ones up to big ones with hundreds of developers committing at the same time. During this time everyone of us noticed the same issues popping up again and again, regardless of the team or company we were at.

## The global state struggle

Application state usually starts out small and simple, with a few simple `useState` hooks. As the app grows and more components need access to the same piece of state, said state is usually lifted up to a common ancestor component. This pattern repeats multiple times until the majority of state ends up living close to the root of the component tree.
