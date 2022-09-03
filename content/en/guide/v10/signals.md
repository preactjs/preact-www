---
name: Signals
description: 'Signals allow you to compose state and to only re-render components that subscribe to their values.'
---

# Signals

Signals is a concept to manage your apps state via reactive primitives. The benefits of this approach are that state updates can be applied in the most performant way automatically and that they provide several developer ergonomics while avoiding a lot of problems that other state management solutions have at the same time.

This allows signals to serve a broader range of apps from small ones up to the biggest ones, without having to worry about performance or reaching for other state management solutions.

---

<div><toc></toc></div>

---

## Introduction

The main idea behind signals is that instead of passing the value itself around, you pass the getter to said value. That getter always stays the same, regardless of whether the value it holds changes. Due to the reference always being the same, Preact can bail out of rendering much earlier and continue from the component where the signal's value was accessed.


```jsx
import { signal } from "@preact/signals";

// Instantiate a signal that can be subscribed to
const count = signal(0);

function Counter() {
  // By accessing a signal inside a component Preact knows
  // that this component needs to re-render when the signal
  // value changes.
  const value = count.value;

  const increment = () => {
    // A signal is updated by assigning or mutating the
    // `.value` property.
    count.value++;
  }

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={increment}>click me</button>
    </div>
  );
}
```

Signals are accessed inside components as if they were native to Preact. Whenever you read a signal inside a component we'll automatically subscribe to that component. When you update the signal we'll know that this component needs to be updated and will do that for you.

## Installation

Signals can be installed by adding the `@preact/signals` package to your project. It contains both the Preact-specific adapter for signals, as well as the core signals library.

```sh
npm install @preact/signals
```

Once installed via your package manager of choice, you're ready to import them in your app.

## Creating your first signal

Let's use signals in a real world scenario. We're going to build a todo app, where you can add new todos, mark an item as completed or delete a todo from the list. We'll start with modeling the state. We're going to need a signal that holds a list of todos first, which we can represent with an `Array`;

```jsx
// no repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Write my first post", completed: true },
  { text: "Buy new groceries", completed: false },
  { text: "Walk the dog", completed: false },
]);
```

For adding a new todo we'll need another signal that we can later feed into an `<input>`-element. But we can use this signal already to create a function for adding a todo item to our list. To update signals, we assign a new value to the `.value` property.

```jsx
// no repl
// We'll use this for our input later
const newItem = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: newItem.value, completed: false }];
  newItem.value = ""; // Reset input value on add
}
```

> :bulb: Tip: A signal will only update if you assign a new value to it. If it's exactly the same that the signal already has, it won't update.
> 
> ```js
> // no repl
> const counter = signal(0);
> // Does nothing, because signal's value is already 0
> counter.value = 0;
> // Updates signal, because value is different
> counter.value = 1;
> ```

Let's check if our logic so far is correct. When we update the `newItem` signal and call `addTodo()`, we should see a new item being added to the `todos` signal. We can simulate this scenario by calling these functions directly.

```jsx
// no repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Write my first post", completed: true },
  { text: "Buy new groceries", completed: false },
  { text: "Walk the dog", completed: false },
]);

const newItem = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: newItem.value, completed: false }];
  newItem.value = ""; // Reset input value on add
}

// Check if our logic works
console.log("Before:", todos.value);

// Simulate adding a new todo
newItem.value = "This is a new todo";
addTodo();

// Check if it did indeed add a todo, and that the `newItem` signal is reset
console.log("After:", todos.value, newItem.value);
```

The remaining feature is being able to remove a todo from the list. To do that, we'll add a function which deletes a todo at the supplied index from the todos array.

```jsx
// no repl
function removeTodo(index) {
  todos.value.splice(index, 1)
  todos.value = [...todos.value];
}
```

## Deriving signals

To put the icing on the cake, we'll add one extra feature to our todo app. We'll add a bit of text to show the user how many todo items they have already crossed off. To do that we'll be importing the `computed(fn)` function from `@preact/signals`. The computed function allows us to subscribe to other signals and produce a new value based on theirs.

```jsx
// no repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Write my first post", completed: true },
  { text: "Buy new groceries", completed: false },
  { text: "Walk the dog", completed: false },
]);

// The `computed` function returns a new signal. Because we accessed
// the `todos` signal inside the callback, computed will automatically
// subscribe to it and update when the `todos` signal changes.
const completedCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length;
});

// Logs: 1, because one todo is marked as being completed
console.log(completedCount.value);
```

> :bulb: Tip: Deriving as much state as possible ensures that your state always has a single source of truth. It is a key principle of signals. This makes debugging a lot easier in case there is a flaw in application logic later on, as there are less places to worry about.

For our todolist app we don't need many computed signals, but in a more complex app they'll get a lot of mileage.

## Using signals in Preact

So far we've been busy modeling our application state and now it's time to wire it up to some nice UI that users can interact with. To make components react to signals we can access them as if they were native to Preact. In the same way like in the `computed` function's callback, we'll track any signals that are accessed inside the render function of a component and subscribe to them.

```jsx
// no repl
const counter = signal(0);

function Counter() {
  // This component will automatically subscribe to the `counter`
  // signal. Whenever that updates Preact will automatically re-render
  // teh `Counter` component.
  return <p>{counter.value}</p>
}
```

But back to our todo app! Let's apply this knowledge to code a simple UI for our todo app.

```jsx
// no repl
function TodoList() {
  const onInput = event => (newItem.value = event.target.value);

  return (
    <>
      <input type="text" value={newItem.value} onInput={onInput} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.value.map((todo, index) => {
          return (
            <li>
              <input
                type="checkbox"
                checked={todo.completed.value}
                onInput={() => (todo.completed.value = !todo.completed.value)}
              />
              {todo.completed.value ? <s>{todo.text}</s> : todo.text}{' '}
              <button onClick={() => removeTodo(index)}>❌</button>
            </li>
          );
        })}
      </ul>
      <p>Completed count: {completedCount.value}</p>
    </>
  );
}
```

And with that we have a fully working todo app! You can try out the full app [over here](/repl?example=todo-list-signals) :tada:

### Managing global app state

Up until now, we've created signals outside of the component tree. For a smaller app like a todolist this is perfectly fine, but for bigger and more complex ones this makes testing harder. The reason for that is that testing typically involves changing the values in your app state for a certain scenario to pass that into your components and assert on the html that is rendered. To do this you'd want to write your app so that you can pass the application state to it.

```jsx
// no repl
function createAppState() {
  const todos = signal([]);
  const completedCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completedCount }
}
```

> :bulb: Tip: Notice that we're consciously not including the `addTodo()` and `removeTodo(index)` function here. Separating data from functions that modify it, typically leads to a simpler architecture. If you want to read more on this topic, we recommend googling "Data-Driven Design".

With our todo app we could pass our state as a prop to it:

```jsx
// no repl
const state = createAppState();

//...later
<TodoList state={state} />
```

Again, this is totally fine for a smaller app. In bigger apps you typically run into the scenario where many components need access to the same piece of state. Usually this involves lifting the state up into a common shared ancestor component. To avoid passing it manually through each component via props, you'd want to put your state into [Context](/guide/v10/context) and provide that pretty close to the top of the component tree. Here is a quick example on how that may look like:

```jsx
// no repl
import { createContext } from "preact";
import { MyApp } from "./my-app";
import { createAppState } from "./my-app-state";

const AppState = createContext()

function App() {
  const state = createAppState();

  return (
    <AppState.Provider value={state}>
      <MyApp />
    </AppState.Provider>
  );
}

// ...later when you need access to your app state
import { useContext } from "preact/hooks";

function MyComponent() {
  const state = useContext(AppState);
}
```

If you want to learn more about how context works, head over to the [Context documentation](/guide/v10/context).

### Using hooks for one-off signals

Passing state through context is how most developers end up dealing with their application's state. But there are many scenarios where you need one-off state that is tied to a specific component. There is no reason for this state to live as part of your main business logic. Instead it should be constrained to the component that needs it. For that you can create signals and computed signals inline via the `useSignal` or `useComputed` hook.

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>Value: {count.value}, value x 2 = {double.value}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

Those two hooks are thin wrappers around `signal()` and `computed()` respectively.

## Advanced signals usage

The topics we've covered so far are all you need to get going. The following section is aimed at readers who want to benefit even more from an app whose state is solely managed by signals.

### Reacting to signals outside of components

When working with signals outside of the component tree, you may have noticed that computed signals don't fire unless you actively read its value. This is because signals by default are lazy. They will only compute once someone actively subscribes to it.

```js
// no repl
const count = signal(0);
const double = computed(() => count.value * 2);

// Despite us updating the `count` signal on which the `double` signal
// depends on, it will not be updated. This is because nobody listens
// to `double` yet.
count.value = 1;

// If we explicitely read `double`'s value, we'll refresh the signal.
// But only for this one time, because it was read from. Further updates
// to any of its dependencies will not update it.
// Logs: 2
console.log(double.value);
```

This poses the question how we can subscribe to signals outside of the component tree. Maybe we want to log something to the console whenever a signal changes or maybe we want to persist our state in [`LocalStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API), so that the user can reload the app with its state preserved.

For these use cases `effect(fn)` is the perfect fit. It works very similar to computed signals, in that it tracks every signal that you read from in the callback function. The major difference between computed signals and `effect(fn)`, is that the `effect(fn)` function doesn't return a new signal. The point isn't to derive state like with computed signals, but rather to trigger effects based on other signals.

```js
import { signal, computed, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

// Logs: "Jane Doe"
effect(() => console.log(name.value));

// Updating one of its dependencies will automatically trigger
// the effect above, and will print "John Doe" to the console.
name.value = "John";
```

You can destroy an effect and unsubscribe from all signals it was subscribed to, by calling the returned function.

```js
import { signal, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

// Logs: "Jane Doe"
const dispose = effect(() => console.log(fullName.value));

// Destroy effect and subscriptions
dispose();

// Update does nothing, because no one is subscribed anymore.
// Even the computed `fullName` signal won't change, because it knows
// that no one listens to it.
surname.value = "Doe 2";
```

> :bulb: Tip: Don't forget to cleanup effects if you're using them extensively. Otherwise your app will consume more memory than needed.


### Reading signals without writing to them

On the rare occasion that you need to write to a signal inside `effect(fn)`, but don't want the effect to depend on said signal, you can read a signal's value without subscribing to it with `.peek()`.

```js
// no repl
const foo = signal("foo");
const called = signal(0);

effect(() => {
  // Subscribe to `foo`
  foo.value;
  // Update `called` signal, whenever this effect is called,
  // without making this effect depend on `called`.
  called.value = called.peek() + 1;
});

// When we update `foo` the effect will be called
foo.value = "foobar";

// But when we update `called`, the effect won't be called
// because it didn't subscribe to it.
called.value = 10;
```

> :bulb: Tip: The scenarios in which you don't want to subscribe to a signal are rare. In most cases you want your effect to subscribe to all signals. Only use `.peek()`, when you really need to.

### Combining multiple updates into one

Remember the `addTodo()` function we used earlier in our todo app? Here is a refresher on what it looked like:

```js
// no repl
const todos = signal([]);
const newItem = signal("");

function addTodo() {
  // 1st write
  todos.value = [...todos.value, { text: newItem.value, completed: false }];
  // 2nd write
  newItem.value = "";
}
```

In that function we're triggering two updates: One for `todos` and the other for `newItem`. Sometimes this is undesired and we want to combine both updates into one to get a little bit more of performance. Here is where the `batch(fn)` function comes into play. With it we can combine multiple signal writes into one single update that is triggered when the callback completes.

To combine both updates we wrap the signal writes with `batch(fn)`.

```js
// no repl
function addTodo() {
  // Combine both updates into one
  batch(() => {
    todos.value = [
      ...todos.value,
      { text: newItem.value, completed: false }
    ];
    newItem.value = "";
  })
}
```

When you access a signal that you wrote to earlier inside the callback, or access a computed signal that was invalidated by another signal, we'll only update the necessary dependencies to get the current value for the signal you read from. All other invalidated signals will still only update at the end of the callback function.

```js
import { signal, computed, effect batch } from "@preact/signals-core";

const counter = signal(0);
const double = computed(() => counter.value * 2);
const tripple = computed(() => counter.value * 3);

effect(() => console.log(double.value, tripple.value));

batch(() => {
  counter.value = 1;
  // Logs: 2, despite being inside batch, but `tripple`
  // will only update once the callback is complete
  console.log(counter.double);
});
// Now we reached the end of the batch and call the effect
```

Furthermore, batches can be nested and updates will be flushed when the outermost batch call completes.

```js
import { signal, computed, effect batch } from "@preact/signals-core";

const counter = signal(0);
effect(() => console.log(counter.value));

batch(() => {
  batch(() => {
    // Signal is invalidated, but update is not flushed because
    // we're still inside another batch
    counter.value = 1;
  });

  // Still not updated...
});
// Now the callback completed and we'll trigger the effect.
```

### Rendering optimizations

With signals we can bypass virtual-dom rendering by attaching directly to the DOM. If you pass a signal into JSX, it will be bound to the DOM's `Text` node that will be rendered in its place and it will update that whenever the signal changes.

```jsx
// no repl
const count = signal(0);

function Counter() {
  // Unoptimized: Will trigger the surrounding
  // component to re-render
  return <p>Value: {count.value}</p>;
}

function Counter() {
  // Optimized: Will update the text node directly without
  // needing to re-render the `Counter` component
  return <p>Value: {count}</p>;
}
```

To opt into this optimization, pass the signal into JSX instead of accessing its `.value` property.


## API

This section is an overview of the signals API. It's aimed to be a quick reference for folks who already know how to use signals and need a quick reminder on what's available.

### signal(initialValue)

Used to create a new signal. The first argument is the initial value of the signal.

```js
const counter = signal(0);
```

To create signals on the fly inside your component use `useSignal(initialValue)`.

To read from a signal without subscribing to it, use `signal.peek()`.

### computed(fn)

This function allows you to combine multiple signals and produce a new signal. You can think of it as deriving data from existing signals. You cannot write to signals inside the callback as the expectation is that computed signals are pure and thereby read-only.

```js
const name = signal("Jane");
const surname = signal("Doe");

const name = computed(() => name.value + " " + surname.value);
```

To create computed signals on the fly inside your component use `useComputed(fn)`.

### effect(fn)

To react to signals and trigger code based on them changing, use `effect(fn)`.

```js
const name = signal("Jane");
const surname = signal("Doe");

const name = computed(() => name.value + " " + surname.value);

// Always log to console when `name`changes
effect(() => console.log(name.value));
```

### batch(fn)

Combine multiple writes to signals into one single update pass. This is usually used for performance reasons. Batches can be nested and writes will be flushed once the outermost batch callback completes. When you read a previously invalidated signal inside the batch callback, the signal will refresh its value.

```js
// no repl
const name = signal("Jane");
const surname = signal("Doe");

// Combine both writes into one update
batch(() => {
  name.value = "Foo";
  surname.value = "Bar";
})
```
