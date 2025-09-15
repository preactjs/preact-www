---
title: Signals
prev: /tutorial/09-error-handling
next: /tutorial/11-links
solvable: true
---

# Signals

In chapter four, we saw how Preact manages state with the help of
**hooks**. Hooks are powerful, but they always re-render the whole component whenever the state changes.

**Signals** is a other way to manage state in Preact. Unlike hooks, which re-render the whole component whenever the state changes, the signals update only the
parts of the UI that actually uses them. A signal remembers its value and automatically tracks where it is used, so when the value
changes, only the parts that depend on it will update.

### Creating a signal

You can create a signal using the `signal()` function, Every signal has a `.value` property.
signals read it with `signal.value` and update the value. Signals gets updated only there's a change in a value, else it remains same.

```js
import { signal } from '@preact/signals';

const count = signal(1);

count.value = 1; //no updates
count.value = 2; //count updates
```

Signals can work with **arrays**, as you know whenever the value changes, the signal tells the specific part of the UI that uses it to update.
But if you change value inside an array directly, the signal won’t know whether the value is changed or not.
Instead, signals only update when they get a **new array**, so you need to create a copy of array with the updated values, which updates the UI correctly.

```jsx
import { signal } from '@preact/signals';

const todos = signal(['Buy milk']);

todos.value.push('Clean room'); //doesn't update
todos.value = [...todos.value, 'Study for exam']; //updates the UI
```

### Derived values with computed signals

Sometimes you need a value that depends on other signals. For example, if you already have a first name and a last name,
now you want a full name which is derived from those first and last names. You can store it separately,
but then you have to update it every time when the first or last name changes.

This is where `computed()` helps. A computed signal is like a signal that is automatically calculated from other signals I.e, it depends on values of other signal.
You will not set the value directly. Instead, you give a small function to it, and it will always run that function automatically whenever the original signals change.

```jsx
import { signal, computed } from '@preact/signals';

const firstName = signal('John');
const lastName = signal('Doe');

//fullName will always stay in sync with firstName & lastName
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

console.log(fullName.value); //John Doe

//Update signal
firstName.value = 'Jane';

console.log(fullName.value); //Jane Doe (updated automatically)
```

## Side effects with effect()

Signals where used to store and update values, but sometimes you also need to run some extra code whenever a signal changes.
Doing something in response to a signal change is called a side effect. For example, Imagine you have a signal that stores a number.
Every time the number changes, you also want to show an alert message. That extra action is not just updating the value it’s something extra that happens because the
value changed. This extra action is what we call a side effect. with effects you can also update the page title, save data, or call an API.

That’s where `effect()` comes in. It runs a piece of code automatically whenever the signals inside it change.
You don’t have to call it yourself manually, it reacts to the signals it depends.

```jsx
import { signal, effect } from '@preact/signals';

const name = signal('Alice');

effect(() => {
	console.log(`Hello, ${name.value}!`);
});

name.value = 'Bob'; //"Hello, Bob!"
```

### Local state with Signals

Local state is a state that belongs to **Single Component** and doesn't shared with whole app.
When creating signals inside a component you should use the hook versions `useSignal(initialValue)` works like `signal()`,
but it is memoized to ensure that the same signal instance is reused across re-renders. Similarly, useComputed(fn) works like computed(),
but it also memoized. In simple terms, `useSignal` is used for state that changes and only belongs to one component,
`useComputed` is used for creating derived values from those signals while the value changes.

For example, let's consider a **Toggle component** with a button and a label,
where the button helps to switch the state of `const isOn = useSignal(false)` between `true` and `false`,
and `useComputed` is used to derive the state of label automatically based on value of `isOn`.

```jsx
import { useSignal, useComputed } from '@preact/signals';

function Toggle() {
	const isOn = useSignal(false); // local signal
	const label = useComputed(() => (isOn.value ? 'ON' : 'OFF'));

	return <button onClick={() => (isOn.value = !isOn.value)}>{label}</button>;
}
```

## Global state with Signals

Global state is state which be accessed by **Multiple components**, to make a signal globally accesable,
create it outside using `signal(initialValue)`, which makes the state reusable anywhere,
and `computed(fn)`, which lets you define derived values which will update automatically when the signal changes.
The simplest way to use global state is to directly import and use the signal across multiple components.

For example, `const theme = signal("light")` could be toggled in one component and read in another.
But this can become harder to manage in larger apps, there's a common way where the global state will wrap in a **Context**.
With context, you can create a function like `createAppState()` that stores your signals and computed values.
Then, you give this state to your whole app by wrapping it in `Context.Provider`.
By This way, any component inside the app can easily access the shared state without passing it through props.
Any component can then access this shared state using `useContext`.

In short, using signal and computed directly as global state works well for simple apps,
but using context is helpful when many components in different parts of your app need to use the same global state.

```jsx
import { signal, computed } from '@preact/signals';

export const counter = signal(0);
export const doubled = computed(() => counter.value * 2);

function Increment() {
	return <button onClick={() => counter.value++}>Increment</button>;
}

function Display() {
	return <p>Counter doubled: {doubled}</p>;
}
```

Here, `counter` and `doubled` are global signals that both components (Increment and Display) can use directly.

```jsx
import { signal, computed } from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

// Create a state object
function createAppState() {
	const counter = signal(0);
	const doubled = computed(() => counter.value * 2);
	return { counter, doubled };
}

// Create a context
const AppState = createContext();

// Component 1: Increment button
function Increment() {
	const state = useContext(AppState); // access shared state
	return <button onClick={() => state.counter.value++}>Increment</button>;
}

// Component 2: Display result
function Display() {
	const state = useContext(AppState); // access shared state
	return <p>Counter doubled: {state.doubled}</p>;
}

// Main App
export function App() {
	return (
		<AppState.Provider value={createAppState()}>
			<Increment />
			<Display />
		</AppState.Provider>
	);
}
```

Here, `counter` and `doubled` is created once inside `createAppState()` and passed to all components through `Context`,
so you don’t need to import global signals directly.

## Try it!

Let’s create a counter which gets incremented while the button is clicked using `signal`, which is similar to the state example from fourth chapter.

<solution> 
	<h4>🎉 Congratulations!</h4> 
	<p>You learned how to use signals!</p> 
</solution>

```js:setup
useResult(function() {
	var options = require('preact').options;

	var oe = options.event;
	options.event = function(e) {
		if (oe) oe.apply(this, arguments);

		if (e.currentTarget.localName !== 'button') return;
		var root = e.currentTarget.parentNode.parentNode;
		var text = root.innerText.match(/Count:\s*([\w.-]*)/i);
		if (!text) return;
		if (!text[1].match(/^-?\d+$/)) {
			return console.warn(
				"Tip: it looks like you're not rendering {count} anywhere."
			);
		}
		setTimeout(function() {
			var text2 = root.innerText.match(/Count:\s*([\w.-]*)/i);
			if (!text2) {
				return console.warn('Tip: did you remember to render {count}?');
			}
			if (text2[1] == text[1]) {
				return console.warn(
					'Tip: remember to update the signal value using `.value`.'
				);
			}
			if (!text2[1].match(/^-?\d+$/)) {
				return console.warn(
					'Tip: it looks like `count` is being set to something other than a number.'
				);
			}

			if (Number(text2[1]) === Number(text[1]) + 1) {
				solutionCtx.setSolved(true);
			}
		}, 10);
	};

	return function() {
		options.event = oe;
	};
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { signal } from '@preact/signals';

function MyButton(props) {
	return (
		<button style={props.style} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

function App() {
	const count = signal(0);

	const clicked = () => {
		// increment the signal value here
	};

	return (
		<div>
			<p class="count">Count:</p>
			<MyButton style={{ color: 'purple' }} onClick={clicked}>
				Click me
			</MyButton>
		</div>
	);
}

render(<App />, document.getElementById('app'));
```

```jsx:repl-final
import { render } from 'preact';
import { signal } from '@preact/signals';

function MyButton(props) {
	return (
		<button style={props.style} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

function App() {
	const count = signal(0);

	const clicked = () => {
		count.value++;
	};

	return (
		<div>
			<p class="count">Count: {count}</p>
			<MyButton style={{ color: 'purple' }} onClick={clicked}>
				Click me
			</MyButton>
		</div>
	);
}

render(<App />, document.getElementById('app'));
```
