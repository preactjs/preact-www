---
title: Signals
description: Composable reactive state with automatic rendering
---

# Signals

Signals are reactive primitives for managing application state.

What makes Signals unique is that state changes automatically update components and UI in the most efficient way possible. Automatic state binding and dependency tracking allows Signals to provide excellent ergonomics and productivity while eliminating the most common state management footguns.

Signals are effective in applications of any size, with ergonomics that speed up the development of small apps, and performance characteristics that ensure apps of any size are fast by default.

---

**Important**

This guide will go over using Signals in Preact, and while this is largely applicable to both the Core and React libraries, there will be some usage differences. The best references for their usage is in their respective docs: [`@preact/signals-core`](https://github.com/preactjs/signals), [`@preact/signals-react`](https://github.com/preactjs/signals/tree/main/packages/react)

---

<toc></toc>

---

## Introduction

Much of the pain of state management in JavaScript is reacting to changes for a given value, because values are not directly observable. Solutions typically work around this by storing values in a variable and continuously checking to see if they have changed, which is cumbersome and not ideal for performance. Ideally, we want a way to express a value that tells us when it changes. That's what Signals do.

At its core, a signal is an object with a `.value` property that holds a value. This has an important characteristic: a signal's value can change, but the signal itself always stays the same:

```js
// --repl
import { signal } from '@preact/signals';

const count = signal(0);

// Read a signal’s value by accessing .value:
console.log(count.value); // 0

// Update a signal’s value:
count.value += 1;

// The signal's value has changed:
console.log(count.value); // 1
```

In Preact, when a signal is passed down through a tree as props or context, we're only passing around references to the signal. The signal can be updated without re-rendering any components, since components see the signal and not its value. This lets us skip all of the expensive rendering work and jump immediately to any components in the tree that actually access the signal's `.value` property.

Signals have a second important characteristic, which is that they track when their value is accessed and when it is updated. In Preact, accessing a signal's `.value` property from within a component automatically re-renders the component when that signal's value changes.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { signal } from '@preact/signals';

// Create a signal that can be subscribed to:
const count = signal(0);

function Counter() {
	// Accessing .value in a component automatically re-renders when it changes:
	const value = count.value;

	const increment = () => {
		// A signal is updated by assigning to the `.value` property:
		count.value++;
	};

	return (
		<div>
			<p>Count: {value}</p>
			<button onClick={increment}>click me</button>
		</div>
	);
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

Finally, Signals are deeply integrated into Preact to provide the best possible performance and ergonomics. In the example above, we accessed `count.value` to retrieve the current value of the `count` signal, however this is unnecessary. Instead, we can let Preact do all of the work for us by using the `count` signal directly in JSX:

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { signal } from '@preact/signals';

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
render(<Counter />, document.getElementById('app'));
```

## Installation

Signals can be installed by adding the `@preact/signals` package to your project:

```bash
npm install @preact/signals
```

Once installed via your package manager of choice, you're ready to import it in your app.

## Usage Example

Let's use signals in a real world scenario. We're going to build a todo list app, where you can add and remove items in a todo list. We'll start by modeling the state. We're going to need a signal that holds a list of todos first, which we can represent with an `Array`:

```jsx
import { signal } from '@preact/signals';

const todos = signal([{ text: 'Buy groceries' }, { text: 'Walk the dog' }]);
```

To let the user enter text for a new todo item, we'll need one more signal that we'll connect up to an `<input>` element shortly. For now, we can use this signal already to create a function that adds a todo item to our list. Remember, we can update a signal's value by assigning to its `.value` property:

```jsx
// We'll use this for our input later
const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = ''; // Clear input value on add
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
import { signal } from '@preact/signals';

const todos = signal([{ text: 'Buy groceries' }, { text: 'Walk the dog' }]);

const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = ''; // Reset input value on add
}

// Check if our logic works
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}]

// Simulate adding a new todo
text.value = 'Tidy up';
addTodo();

// Check that it added the new item and cleared the `text` signal:
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}, {text: "Tidy up"}]

console.log(text.value); // Logs: ""
```

The last feature we'd like to add is the ability to remove a todo item from the list. For this, we'll add a function that deletes a given todo item from the todos array:

```jsx
function removeTodo(todo) {
	todos.value = todos.value.filter(t => t !== todo);
}
```

## Building the UI

Now that we've modeled our application's state, it's time to wire it up to a nice UI that users can interact with.

```jsx
function TodoList() {
	const onInput = event => (text.value = event.currentTarget.value);

	return (
		<>
			<input value={text.value} onInput={onInput} />
			<button onClick={addTodo}>Add</button>
			<ul>
				{todos.value.map(todo => (
					<li>
						{todo.text} <button onClick={() => removeTodo(todo)}>❌</button>
					</li>
				))}
			</ul>
		</>
	);
}
```

And with that we have a fully working todo app! You can try out the full app [over here](/repl?example=todo-signals) :tada:

## Deriving state via computed signals

Let's add one more feature to our todo app: each todo item can be checked off as completed, and we'll show the user the number of items they've completed. To do that we'll import the [`computed(fn)`](#computedfn) function, which lets us create a new signal that is computed based on the values of other signals. The returned computed signal is read-only, and its value is automatically updated when any signals accessed from within the callback function change.

```jsx
// --repl
import { signal, computed } from '@preact/signals';

const todos = signal([
	{ text: 'Buy groceries', completed: true },
	{ text: 'Walk the dog', completed: false }
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
		return todos.value.filter(todo => todo.completed).length;
	});

	return { todos, completed };
}
```

> :bulb: Tip: Notice that we're consciously not including the `addTodo()` and `removeTodo(todo)` functions here. Separating data from functions that modify it often helps simplify application architecture. For more details, check out [data-oriented design](https://www.dataorienteddesign.com/dodbook/).

We can now pass our todo application state as a prop when rendering:

```jsx
const state = createAppState();

// ...later:
<TodoList state={state} />;
```

This works in our todo list app because the state is global, however larger apps typically end up with multiple components that require access to the same pieces of state. This usually involves "lifting state up" to a common shared ancestor component. To avoid passing state manually through each component via props, the state can be placed into [Context](/guide/v10/context) so any component in the tree can access it. Here is a quick example of how that typically looks:

```jsx
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { createAppState } from './my-app-state';

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
import { useSignal, useComputed } from '@preact/signals';

function Counter() {
	const count = useSignal(0);
	const double = useComputed(() => count.value * 2);

	return (
		<div>
			<p>
				{count} x 2 = {double}
			</p>
			<button onClick={() => count.value++}>click me</button>
		</div>
	);
}
```

Those two hooks are thin wrappers around [`signal()`](#signalinitialvalue) and [`computed()`](#computedfn) that construct a signal the first time a component runs, and simply use that same signal on subsequent renders.

> :bulb: Behind the scenes, this is the implementation:
>
> ```js
> function useSignal(value) {
> 	return useMemo(() => signal(value), []);
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
import { signal, computed, effect } from '@preact/signals';

const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => `${name.value} ${surname.value}`);

// Logs name every time it changes:
effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Updating `name` updates `fullName`, which triggers the effect again:
name.value = 'John';
// Logs: "John Doe"
```

Optionally, you can return a cleanup function from the callback provided to [`effect()`](#effectfn) that will be run before the next update takes place. This allows you to "clean up" the side effect and potentially reset any state for the subsequent trigger of the callback.

```js
effect(() => {
	Chat.connect(username.value);

	return () => Chat.disconnect(username.value);
});
```

You can destroy an effect and unsubscribe from all signals it accessed by calling the returned function.

```js
import { signal, effect } from '@preact/signals';

const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => name.value + ' ' + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Destroy effect and subscriptions:
dispose();

// Updating `name` does not run the effect because it has been disposed.
// It also doesn't re-compute `fullName` now that nothing is observing it.
name.value = 'John';
```

> :bulb: Tip: Don't forget to clean up effects if you're using them extensively. Otherwise your app will consume more memory than needed.

## Reading signals without subscribing to them

On the rare occasion that you need to write to a signal inside [`effect(fn)`](#effectfn), but don't want the effect to re-run when that signal changes,
you can use `.peek()` to get the signal's current value without subscribing.

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

As an alternative to `.peek()`, we have the `untracked` function which receives a function as an argument and returns the outcome of the function. In `untracked` you can
reference any signal with `.value` without creating a subscription. This can come in handy when you have a reusable function that accesses `.value` or you need to access
more than 1 signal.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
	// Update `count` without subscribing to `count` or `delta`:
	count.value = untracked(() => {
		return count.value + delta.value;
	});
});
```

## Combining multiple updates into one

Remember the `addTodo()` function we used earlier in our todo app? Here is a refresher on what it looked like:

```js
const todos = signal([]);
const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = '';
}
```

Notice that the function triggers two separate updates: one when setting `todos.value` and the other when setting the value of `text`. This can sometimes be undesirable and warrant combining both updates into one, for performance or other reasons. The [`batch(fn)`](#batchfn) function can be used to combine multiple value updates into one "commit" at the end of the callback:

```js
function addTodo() {
	batch(() => {
		todos.value = [...todos.value, { text: text.value }];
		text.value = '';
	});
}
```

Accessing a signal that has been modified within a batch will reflect its updated value. Accessing a computed signal that has been invalidated by another signal within a batch will re-compute only the necessary dependencies to return an up-to-date value for that computed signal. Any other invalidated signals remain unaffected and are only updated at the end of the batch callback.

```js
// --repl
import { signal, computed, effect, batch } from '@preact/signals';

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

## Models

Models provide a structured way to build reactive state containers that encapsulate signals, computed values, effects, and actions. They offer a clean pattern for organizing complex state logic while ensuring automatic cleanup and batched updates.

As applications grow in complexity, managing state with individual signals can become unwieldy. Models solve this by bundling related signals, computed values, and actions together into cohesive units. This makes your code more maintainable, testable, and easier to reason about.

### Why Use Models?

Models offer several key benefits:

- **Encapsulation**: Group related state and logic together, making it clear what belongs where
- **Automatic cleanup**: Effects created in models are automatically disposed when the model is disposed, preventing memory leaks
- **Automatic batching**: All methods are automatically wrapped as actions, ensuring optimal performance
- **Composability**: Models can be nested and composed, with parent models automatically managing child model lifecycles
- **Reusability**: Models can accept initialization parameters, making them reusable across different contexts
- **Testability**: Models can be instantiated and tested in isolation without requiring component rendering

Here's a simple example showing how models organize state:

```js
import { signal, computed, createModel } from '@preact/signals';

const CounterModel = createModel((initialCount = 0) => {
	const count = signal(initialCount);
	const doubled = computed(() => count.value * 2);

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

const counter = new CounterModel(5);
counter.increment();
console.log(counter.count.value); // 6
```

For more details on how to use models in your components and the full API reference, see the [Model APIs](#createmodelfactory) in the API section below.

## API

This section is an overview of the signals API. It's aimed to be a quick reference for folks who already know how to use signals and need a reminder of what's available.

### signal(initialValue)

Creates a new signal with the given argument as its initial value:

```js
const count = signal(0);
```

The returned signal has a `.value` property that can be get or set to read and write its value. To read from a signal without subscribing to it, use `signal.peek()`.

#### useSignal(initialValue)

When creating signals within a component, use the hook variant: `useSignal(initialValue)`. It functions similarly to `signal()` but is memoized to ensure that the same signal instance is used across renders of the component.

```jsx
function MyComponent() {
	const count = useSignal(0);
}
```

### computed(fn)

Creates a new signal that is computed based on the values of other signals. The returned computed signal is read-only, and its value is automatically updated when any signals accessed from within the callback function change.

```js
const name = signal('Jane');
const surname = signal('Doe');

const fullName = computed(() => `${name.value} ${surname.value}`);
```

#### useComputed(fn)

When creating computed signals within a component, use the hook variant: `useComputed(fn)`.

```jsx
function MyComponent() {
	const name = useSignal('Jane');
	const surname = useSignal('Doe');

	const fullName = useComputed(() => `${name.value} ${surname.value}`);
}
```

### effect(fn)

To run arbitrary code in response to signal changes, we can use `effect(fn)`. Similar to computed signals, effects track which signals are accessed and re-run their callback when those signals change. If the callback returns a function, this function will be run before the next value update. Unlike computed signals, `effect()` does not return a signal - it's the end of a sequence of changes.

```js
const name = signal('Jane');

// Log to console when `name` changes:
effect(() => console.log('Hello', name.value));
// Logs: "Hello Jane"

name.value = 'John';
// Logs: "Hello John"
```

#### useSignalEffect(fn)

When responding to signal changes within a component, use the hook variant: `useSignalEffect(fn)`.

```jsx
function MyComponent() {
	const name = useSignal('Jane');

	// Log to console when `name` changes:
	useSignalEffect(() => console.log('Hello', name.value));
}
```

### batch(fn)

The `batch(fn)` function can be used to combine multiple value updates into one "commit" at the end of the provided callback. Batches can be nested and changes are only flushed once the outermost batch callback completes. Accessing a signal that has been modified within a batch will reflect its updated value.

```js
const name = signal('Jane');
const surname = signal('Doe');

// Combine both writes into one update
batch(() => {
	name.value = 'John';
	surname.value = 'Smith';
});
```

### untracked(fn)

The `untracked(fn)` function can be used to access the value of several signals without subscribing to them.

```js
const name = signal('Jane');
const surname = signal('Doe');

effect(() => {
	untracked(() => {
		console.log(`${name.value} ${surname.value}`);
	});
});
```

### createModel(factory)

The `createModel(factory)` function creates a model constructor from a factory function. The factory function can accept arguments for initialization and should return an object containing signals, computed values, and action methods.

```js
import { signal, computed, effect, createModel } from '@preact/signals';

const CounterModel = createModel((initialCount = 0) => {
	const count = signal(initialCount);
	const doubled = computed(() => count.value * 2);

	effect(() => {
		console.log('Count changed:', count.value);
	});

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

// Create a new model instance using `new`
const counter = new CounterModel(5);
counter.increment(); // Updates are automatically batched
console.log(counter.count.value); // 6
console.log(counter.doubled.value); // 12

// Clean up all effects when done
counter[Symbol.dispose]();
```

#### Key Features

- **Factory arguments**: Factory functions can accept arguments for initialization, making models reusable with different configurations.
- **Automatic batching**: All methods returned from the factory are automatically wrapped as actions, meaning state updates within them are batched and untracked.
- **Automatic effect cleanup**: Effects created during model construction are captured and automatically disposed when the model is disposed via `Symbol.dispose`.
- **Composable models**: Models compose naturally - effects from nested models are captured by the parent and disposed together when the parent is disposed.

#### Model Composition

Models can be nested within other models. When a parent model is disposed, all effects from nested models are automatically cleaned up:

```js
const TodoItemModel = createModel((text) => {
	const completed = signal(false);

	return {
		text,
		completed,
		toggle() {
			completed.value = !completed.value;
		}
	};
});

const TodoListModel = createModel(() => {
	const items = signal([]);

	return {
		items,
		addTodo(text) {
			const todo = new TodoItemModel(text);
			items.value = [...items.value, todo];
		},
		removeTodo(todo) {
			items.value = items.value.filter(t => t !== todo);
			todo[Symbol.dispose]();
		}
	};
});

const todoList = new TodoListModel();
todoList.addTodo('Buy groceries');
todoList.addTodo('Walk the dog');

// Disposing the parent also cleans up all nested model effects
todoList[Symbol.dispose]();
```

### action(fn)

The `action(fn)` function wraps a function to run in a batched and untracked context. This is useful when you need to create standalone actions outside of a model:

```js
import { signal, action } from '@preact/signals';

const count = signal(0);

const incrementBy = action((amount) => {
	count.value += amount;
});

incrementBy(5); // Batched update
```

### useModel(modelOrFactory)

The `useModel` hook is available in both `@preact/signals` and `@preact/signals-react` packages. It handles creating a model instance on first render, maintaining the same instance across re-renders, and automatically disposing the model when the component unmounts.

```jsx
import { signal, createModel } from '@preact/signals';
import { useModel } from '@preact/signals';

const CounterModel = createModel(() => ({
	count: signal(0),
	increment() {
		this.count.value++;
	}
}));

function Counter() {
	const model = useModel(CounterModel);

	return (
		<button onClick={() => model.increment()}>
			Count: {model.count}
		</button>
	);
}
```

For models that require constructor arguments, wrap the instantiation in a factory function:

```jsx
const CounterModel = createModel((initialCount) => ({
	count: signal(initialCount),
	increment() {
		this.count.value++;
	}
}));

function Counter({ initialValue }) {
	// Use a factory function to pass arguments
	const model = useModel(() => new CounterModel(initialValue));

	return (
		<button onClick={() => model.increment()}>
			Count: {model.count}
		</button>
	);
}
```

### Recommended Patterns

#### Explicit ReadonlySignal Pattern

For better encapsulation, declare your model interface explicitly and use `ReadonlySignal` for signals that should only be modified through actions:

```ts
import { signal, computed, createModel, ReadonlySignal } from '@preact/signals';

interface Counter {
	count: ReadonlySignal<number>;
	doubled: ReadonlySignal<number>;
	increment(): void;
	decrement(): void;
}

const CounterModel = createModel<Counter>(() => {
	const count = signal(0);
	const doubled = computed(() => count.value * 2);

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

const counter = new CounterModel();
counter.increment(); // OK
counter.count.value = 10; // TypeScript error: Cannot assign to 'value'
```

#### Custom Dispose Logic

If your model needs custom cleanup logic that isn't related to signals (such as closing WebSocket connections), use an effect with no dependencies that returns a cleanup function:

```js
const WebSocketModel = createModel((url) => {
	const messages = signal([]);
	const ws = new WebSocket(url);

	ws.onmessage = (e) => {
		messages.value = [...messages.value, e.data];
	};

	// This effect runs once; its cleanup runs on dispose
	effect(() => {
		return () => {
			ws.close();
		};
	});

	return {
		messages,
		send(message) {
			ws.send(message);
		}
	};
});

const chat = new WebSocketModel('wss://example.com/chat');
chat.send('Hello!');

// Closes the WebSocket connection on dispose
chat[Symbol.dispose]();
```

This pattern mirrors `useEffect(() => { return cleanup }, [])` in React and ensures that cleanup happens automatically when models are composed together - parent models don't need to know about the dispose functions of nested models.

## Utility Components and Hooks

As of v2.1.0, the `@preact/signals/utils` package provides additional utility components and hooks to make working with signals even easier.

### Show Component

The `<Show>` component provides a declarative way to conditionally render content based on a signal's value.

```jsx
import { signal } from '@preact/signals';
import { Show } from '@preact/signals/utils';

const isVisible = signal(false);

function App() {
	return (
		<Show when={isVisible} fallback={<p>Nothing to see here</p>}>
			<p>Now you see me!</p>
		</Show>
	);
}

// You can also use a function to access the value
function App() {
	return <Show when={isVisible}>{value => <p>The value is {value}</p>}</Show>;
}
```

### For Component

The `<For>` component helps you render lists from signal arrays with automatic caching of rendered items.

```jsx
import { signal } from '@preact/signals';
import { For } from '@preact/signals/utils';

const items = signal(['A', 'B', 'C']);

function App() {
	return (
		<For each={items} fallback={<p>No items</p>}>
			{(item, index) => <div key={index}>Item: {item}</div>}
		</For>
	);
}
```

### Additional Hooks

#### useLiveSignal(signal)

The `useLiveSignal(signal)` hook allows you to create a local signal that stays synchronized with an external signal.

```jsx
import { signal } from '@preact/signals';
import { useLiveSignal } from '@preact/signals/utils';

const external = signal(0);

function Component() {
	const local = useLiveSignal(external);
	// local will automatically update when external changes
}
```

#### useSignalRef(initialValue)

The `useSignalRef(initialValue)` hook creates a signal that behaves like a React ref with a `.current` property.

```jsx
import { useSignalEffect } from '@preact/signals';
import { useSignalRef } from '@preact/signals/utils';

function Component() {
	const ref = useSignalRef(null);

	useSignalEffect(() => {
		if (ref.current) {
			console.log('Ref has been set to:', ref.current);
		}
	});

	return (
		<div ref={ref}>
			The ref has been attached to a {ref.current?.tagName} element.
		</div>
	);
}
```

## Debugging

If you're using Preact Signals in your application, there are specialized debugging tools available:

- **[Signals Debug](https://github.com/preactjs/signals/blob/main/packages/debug)** - A development tool that provides detailed console output about signal updates, effect executions, and computed value recalculations.
- **[Signals DevTools](https://github.com/preactjs/signals/blob/main/packages/devtools-ui)** - Visual DevTools UI for debugging and visualizing Preact Signals in real-time. You can embed it directly in your page for demos, or integrate it into custom tooling.

> **Note:** These are framework-agnostic tools from the Signals library. While they work great with Preact, they're not Preact-specific.
