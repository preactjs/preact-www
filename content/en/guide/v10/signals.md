---
name: Signals
description: 'Signals: composable reactive state with automatic rendering'
---

# Signals

Signals are reactive primitives for managing application state.

What makes Signals unique is that state changes automatically update components and UI in the most efficient way possible. Automatic state binding and dependency tracking allows Signals to provide excellent ergonomics and productivity while eliminating the most common state management footguns.

Signals are effective in applications of any size, with ergonomics that speed up the development of small apps, and performance characteristics that ensure apps of any size are fast by default.

---

<div><toc></toc></div>

---

## Introduction

Much of the pain of state management in JavaScript is reacting to changes for a given value, because values are not directly observable. Solutions typically work around this by storing values in a variable and continuously checking to see if they have changed, which is cumbersome and not ideal for performance. Ideally, we want a way to express a value that tells us when it changes. That's what Signals do.

At its core, a signal is an object with a `.value` property that holds a value. This has an important characteristic: a signal's value can change, but the signal itself always stays the same:

```js
// --repl
import { signal } from "@preact/signals";

const count = signal(0);

// Read a signal’s value by accessing .value:
console.log(count.value);   // 0

// Update a signal’s value:
count.value += 1;

// The signal's value has changed:
console.log(count.value);  // 1
```

In Preact, when a signal is passed down through a tree as props or context, we're only passing around references to the signal. The signal can be updated without re-rendering any components, since components see the signal and not its value. This lets us skip all of the expensive rendering work and jump immediately to any components in the tree that actually access the signal's `.value` property.

Signals have a second important characteristic, which is that they track when their value is accessed and when it is updated. In Preact, accessing a signal's `.value` property from within a component automatically re-renders the component when that signal's value changes.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

// Create a signal that can be subscribed to:
const count = signal(0);

function Counter() {
  // Accessing .value in a component automatically re-renders when it changes:
  const value = count.value;

  const increment = () => {
    // A signal is updated by assigning to the `.value` property:
    count.value++;
  }

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>click me</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Finally, Signals are deeply integrated into Preact to provide the best possible performance and ergonomics. In the example above, we accessed `count.value` to retrieve the current value of the `count` signal, however this is unnecessary. Instead, we can let Preact do all of the work for us by using the `count` signal directly in JSX:

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

const count = signal(0);

function Counter() {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## Installation

Signals can be installed by adding the `@preact/signals` package to your project:

```sh
npm install @preact/signals
```

Once installed via your package manager of choice, you're ready to import it in your app.

## Usage Example

Let's use signals in a real world scenario. We're going to build a todo list app, where you can add and remove items in a todo list. We'll start by modeling the state. We're going to need a signal that holds a list of todos first, which we can represent with an `Array`:

```jsx
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries" },
  { text: "Walk the dog" },
]);
```

To let the user enter text for a new todo item, we'll need one more signal that we'll connect up to an `<input>` element shortly. For now, we can use this signal already to create a function that adds a todo item to our list. Remember, we can update a signal's value by assigning to its `.value` property:

```jsx
// We'll use this for our input later
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Clear input value on add
}
```

> :bulb: Tip: A signal will only update if you assign a new value to it. If the value you assign to a signal is equal to its current value, it won't update.
>
> ```js
> const count = signal(0);
>
> count.value = 0; // does nothing - value is already 0
>
> count.value = 1; // updates - value is different
> ```

Let's check if our logic is correct so far. When we update the `text` signal and call `addTodo()`, we should see a new item being added to the `todos` signal. We can simulate this scenario by calling these functions directly - no need for a user interface yet!

```jsx
// --repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries" },
  { text: "Walk the dog" },
]);

const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Reset input value on add
}

// Check if our logic works
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}]


// Simulate adding a new todo
text.value = "Tidy up";
addTodo();

// Check that it added the new item and cleared the `text` signal:
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}, {text: "Tidy up"}]

console.log(text.value);  // Logs: ""
```

The last feature we'd like to add is the ability to remove a todo item from the list. For this, we'll add a function that deletes a given todo item from the todos array:

```jsx
function removeTodo(todo) {
  todos.value = todos.value.filter(t => t !== todo);
}
```

## Building the UI

Now that we've modeled our application's state, it's time to wire in up to a nice UI that users can interact with.

```jsx
function TodoList() {
  const onInput = event => (text.value = event.target.value);

  return (
    <>
      <input value={text.value} onInput={onInput} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.value.map(todo => (
          <li>
            {todo.text}{' '}
            <button onClick={() => removeTodo(todo)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

And with that we have a fully working todo app! You can try out the full app [over here](/repl?example=todo-list-signals) :tada:

## Deriving state via computed signals

Let's add one more feature to our todo app: each todo item can be checked off as completed, and we'll show the user the number of items they've completed. To do that we'll import the [`computed(fn)`](#computedfn) function, which lets us create a new signal that is computed based on the values of other signals. The returned computed signal is read-only, and its value is automatically updated when any signals accessed from within the callback function change.

```jsx
// --repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries", completed: true },
  { text: "Walk the dog", completed: false },
]);

// create a signal computed from other signals
const completed = computed(() => {
  // When `todos` changes, this re-runs automatically:
  return todos.value.filter(todo => todo.completed).length;
});

// Logs: 1, because one todo is marked as being completed
console.log(completed.value);
```

Our simple todo list app doesn't need many computed signals, but more complex apps tend to rely on computed() to avoid duplicating state in multiple places.

> :bulb: Tip: Deriving as much state as possible ensures that your state always has a single source of truth. It is a key principle of signals. This makes debugging a lot easier in case there is a flaw in application logic later on, as there are less places to worry about.

## Managing global app state

Up until now, we've only created signals outside the component tree. This is fine for a small app like a todo list, but for larger and more complex apps this can make testing difficult. Tests typically involve changing values in your app state to reproduce a certain scenario, then passing that state to components and asserting on the rendered HTML. To do this, we can extract our todo list state into a function:

```jsx
function createAppState() {
  const todos = signal([]);

  const completed = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completed }
}
```

> :bulb: Tip: Notice that we're consciously not including the `addTodo()` and `removeTodo(todo)` functions here. Separating data from functions that modify it often helps simplify application architecture. For more details, check out [data-oriented design](https://en.wikipedia.org/wiki/Data-oriented_design).

We can now pass our todo application state as a prop when rendering:

```jsx
const state = createAppState();

// ...later:
<TodoList state={state} />
```

This works in our todo list app because the state is global, however larger apps typically end up with multiple components that require access to the same pieces of state. This usually involves "lifting state up" to a common shared ancestor component. To avoid passing state manually through each component via props, the state can be placed into [Context](/guide/v10/context) so any component in the tree can access it. Here is a quick example of how that typically looks:

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { createAppState } from "./my-app-state";

const AppState = createContext();

render(
  <AppState.Provider value={createAppState()}>
    <App />
  </AppState.Provider>
);

// ...later when you need access to your app state
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

If you want to learn more about how context works, head over to the [Context documentation](/guide/v10/context).

## Local state with signals

The majority of application state ends up being passed around using props and context. However, there are many scenarios where components have their own internal state that is specific to that component. Since there is no reason for this state to live as part of the app's global business logic, it should be confined to the component that needs it. In these scenarios, we can create signals as well as computed signals directly within components using the `useSignal()` and `useComputed()` hooks:

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>{count} x 2 = {double}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

Those two hooks are thin wrappers around [`signal()`](#signalinitialvalue) and [`computed()`](#computedfn) that construct a signal the first time a component runs, and simply that same signal on subsequent renders.

> :bulb: Behind the scenes, this is the implementation:
>
> ```js
> function useSignal(value) {
>  return useMemo(() => signal(value), []);
> }
> ```

## Advanced signals usage

The topics we've covered so far are all you need to get going. The following section is aimed at readers who want to benefit even more by modeling their application state entirely using signals.

### Reacting to signals outside of components

When working with signals outside of the component tree, you may have noticed that computed signals don't re-compute unless you actively read their value. This is because signals are lazy by default: they only compute new values when their value has been accessed.

```js
const count = signal(0);
const double = computed(() => count.value * 2);

// Despite updating the `count` signal on which the `double` signal depends,
// `double` does not yet update because nothing has used its value.
count.value = 1;

// Reading the value of `double` triggers it to be re-computed:
console.log(double.value); // Logs: 2
```

This poses a question: how can we subscribe to signals outside of the component tree? Perhaps we want to log something to the console whenever a signal's value changes, or persist state to [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

To run arbitrary code in response to signal changes, we can use [`effect(fn)`](#effectfn). Similar to computed signals, effects track which signals are accessed and re-run their callback when those signals change. Unlike computed signals, [`effect()`](#effectfn) does not return a signal - it's the end of a sequence of changes.

```js
import { signal, computed, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => `${name.value} ${surname.value}`);

// Logs name every time it changes:
effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Updating `name` updates `fullName`, which triggers the effect again:
name.value = "John";
// Logs: "John Doe"
```

You can destroy an effect and unsubscribe from all signals it accessed by calling the returned function.

```js
import { signal, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Destroy effect and subscriptions:
dispose();

// Updating `name` does not run the effect because it has been disposed.
// It also doesn't re-compute `fullName` now that nothing is observing it.
name.value = "John";
```

> :bulb: Tip: Don't forget to clean up effects if you're using them extensively. Otherwise your app will consume more memory than needed.


## Reading signals without subscribing to them

On the rare occasion that you need to write to a signal inside [`effect(fn)`](#effectfn), but don't want the effect to re-run when that signal changes, you can use `.peek()` to get the signal's current value without subscribing.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Update `count` without subscribing to `count`:
  count.value = count.peek() + delta.value;
});

// Setting `delta` reruns the effect:
delta.value = 1;

// This won't rerun the effect because it didn't access `.value`:
count.value = 10;
```

> :bulb: Tip: The scenarios in which you don't want to subscribe to a signal are rare. In most cases you want your effect to subscribe to all signals. Only use `.peek()` when you really need to.


## Combining multiple updates into one

Remember the `addTodo()` function we used earlier in our todo app? Here is a refresher on what it looked like:

```js
const todos = signal([]);
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = "";
}
```

Notice that the function triggers two separate updates: one when setting `todos.value` and the other when setting the value of `text`. This can sometimes be undesirable and warrant combining both updates into one, for performance or other reasons. The [`batch(fn)`](#batchfn) function can be used to combine multiple value updates into one "commit" at the end of the callback:

```js
function addTodo() {
  batch(() => {
    todos.value = [...todos.value, { text: text.value }];
    text.value = "";
  });
}
```

Accessing a signal that has been modified within a batch will reflect its updated value. Accessing a computed signal that has been invalidated by another signal within a batch will re-compute only the necessary dependencies to return an up-to-date value for that computed signal. Any other invalidated signals remain unaffected and are only updated at the end of the batch callback.

```js
// --repl
import { signal, computed, effect, batch } from "@preact/signals-core";

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
  // set `count`, invalidating `double` and `triple`:
  count.value = 1;

  // Despite being batched, `double` reflects the new computed value.
  // However, `triple` will only update once the callback completes.
  console.log(double.value); // Logs: 2
});
```


> :bulb: Tip: Batches can also be nested, in which case batched updates are flushed only after the outermost batch callback has completed.


### Rendering optimizations

With signals we can bypass Virtual DOM rendering and bind signal changes directly to DOM mutations. If you pass a signal into JSX in a text position, it will render as text and automatically update in-place without Virtual DOM diffing:

```jsx
const count = signal(0);

function Unoptimized() {
  // Re-renders the component when `count` changes:
  return <p>{count.value}</p>;
}

function Optimized() {
  // Text automatically updates without re-rendering the component:
  return <p>{count}</p>;
}
```

To enable this optimization, pass the signal into JSX instead of accessing its `.value` property.

A similar rendering optimization is also supported when passing signals as props on DOM elements.

## API

This section is an overview of the signals API. It's aimed to be a quick reference for folks who already know how to use signals and need a reminder of what's available.

### signal(initialValue)

Creates a new signal with the given argument as its initial value:

```js
const count = signal(0);
```

When creating signals within a component, use the hook variant: `useSignal(initialValue)`.

The returned signal has a `.value` property that can be get or set to read and write its value. To read from a signal without subscribing to it, use `signal.peek()`.

### computed(fn)

Creates a new signal that is computed based on the values of other signals. The returned computed signal is read-only, and its value is automatically updated when any signals accessed from within the callback function change.

```js
const name = signal("Jane");
const surname = signal("Doe");

const fullName = computed(() => `${name.value} ${surname.value}`);
```

When creating computed signals within a component, use the hook variant: `useComputed(fn)`.

### effect(fn)

To run arbitrary code in response to signal changes, we can use `effect(fn)`. Similar to computed signals, effects track which signals are accessed and re-run their callback when those signals change. Unlike computed signals, `effect()` does not return a signal - it's the end of a sequence of changes.

```js
const name = signal("Jane");

// Log to console when `name` changes:
effect(() => console.log('Hello', name.value));
// Logs: "Hello Jane"

name.value = "John";
// Logs: "Hello John"
```

### batch(fn)

The `batch(fn)` function can be used to combine multiple value updates into one "commit" at the end of the provided callback. Batches can be nested and changes are only flushed once the outermost batch callback completes. Accessing a signal that has been modified within a batch will reflect its updated value.

```js
const name = signal("Jane");
const surname = signal("Doe");

// Combine both writes into one update
batch(() => {
  name.value = "John";
  surname.value = "Smith";
});
```
