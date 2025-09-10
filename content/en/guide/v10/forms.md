---
title: Forms
description: Forms and form controls allow you to collect user input in your application and is a fundamental building block of most web applications
---

# Forms

Forms in Preact work in the same way as they do in HTML & JS: you render controls, attach event listeners, and submit information.

---

<toc></toc>

---

## Basic Form Controls

Often you'll want to collect user input in your application, and this is where `<input>`, `<textarea>`, and `<select>` elements come in. These elements are the common building blocks of forms in HTML and Preact.

### Input (text)

To get started, we'll create a simple text input field that will update a state value as the user types. We'll use the `onInput` event to listen for changes to the input field's value and update the state per-keystroke. This state value is then rendered in a `<p>` element, so we can see the results.

<tab-group tabstring="Classes, Hooks, Signals">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class BasicInput extends Component {
	state = { name: '' };

	onInput = e => this.setState({ name: e.currentTarget.value });

	render(_, { name }) {
		return (
			<div class="form-example">
				<label>
					Name: <input onInput={this.onInput} />
				</label>
				<p>Hello {name}</p>
			</div>
		);
	}
}
// --repl-after
render(<BasicInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function BasicInput() {
	const [name, setName] = useState('');

	return (
		<div class="form-example">
			<label>
				Name: <input onInput={e => setName(e.currentTarget.value)} />
			</label>
			<p>Hello {name}</p>
		</div>
	);
}
// --repl-after
render(<BasicInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { signal } from '@preact/signals';
// --repl-before
const name = signal('');

function BasicInput() {
	return (
		<div class="form-example">
			<label>
				Name: <input onInput={e => (name.value = e.currentTarget.value)} />
			</label>
			<p>Hello {name.value}</p>
		</div>
	);
}
// --repl-after
render(<BasicInput />, document.getElementById('app'));
```

</tab-group>

### Input (checkbox & radio)

<tab-group tabstring="Classes, Hooks, Signals">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class BasicRadioButton extends Component {
	state = {
		allowContact: false,
		contactMethod: ''
	};

	toggleContact = () =>
		this.setState({ allowContact: !this.state.allowContact });
	setRadioValue = e => this.setState({ contactMethod: e.currentTarget.value });

	render(_, { allowContact }) {
		return (
			<div class="form-example">
				<label>
					Allow contact: <input type="checkbox" onClick={this.toggleContact} />
				</label>
				<label>
					Phone:{' '}
					<input
						type="radio"
						name="contact"
						value="phone"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<label>
					Email:{' '}
					<input
						type="radio"
						name="contact"
						value="email"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<label>
					Mail:{' '}
					<input
						type="radio"
						name="contact"
						value="mail"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<p>
					You {allowContact ? 'have allowed' : 'have not allowed'} contact{' '}
					{allowContact && ` via ${this.state.contactMethod}`}
				</p>
			</div>
		);
	}
}
// --repl-after
render(<BasicRadioButton />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function BasicRadioButton() {
	const [allowContact, setAllowContact] = useState(false);
	const [contactMethod, setContactMethod] = useState('');

	const toggleContact = () => setAllowContact(!allowContact);
	const setRadioValue = e => setContactMethod(e.currentTarget.value);

	return (
		<div class="form-example">
			<label>
				Allow contact: <input type="checkbox" onClick={toggleContact} />
			</label>
			<label>
				Phone:{' '}
				<input
					type="radio"
					name="contact"
					value="phone"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<label>
				Email:{' '}
				<input
					type="radio"
					name="contact"
					value="email"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<label>
				Mail:{' '}
				<input
					type="radio"
					name="contact"
					value="mail"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<p>
				You {allowContact ? 'have allowed' : 'have not allowed'} contact{' '}
				{allowContact && ` via ${contactMethod}`}
			</p>
		</div>
	);
}
// --repl-after
render(<BasicRadioButton />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { signal } from '@preact/signals';
// --repl-before
const allowContact = signal(false);
const contactMethod = signal('');

function BasicRadioButton() {
	const toggleContact = () => (allowContact.value = !allowContact.value);
	const setRadioValue = e => (contactMethod.value = e.currentTarget.value);

	return (
		<div class="form-example">
			<label>
				Allow contact: <input type="checkbox" onClick={toggleContact} />
			</label>
			<label>
				Phone:{' '}
				<input
					type="radio"
					name="contact"
					value="phone"
					onClick={setRadioValue}
					disabled={!allowContact.value}
				/>
			</label>
			<label>
				Email:{' '}
				<input
					type="radio"
					name="contact"
					value="email"
					onClick={setRadioValue}
					disabled={!allowContact.value}
				/>
			</label>
			<label>
				Mail:{' '}
				<input
					type="radio"
					name="contact"
					value="mail"
					onClick={setRadioValue}
					disabled={!allowContact.value}
				/>
			</label>
			<p>
				You {allowContact.value ? 'have allowed' : 'have not allowed'} contact{' '}
				{allowContact.value && ` via ${contactMethod.value}`}
			</p>
		</div>
	);
}
// --repl-after
render(<BasicRadioButton />, document.getElementById('app'));
```

</tab-group>

### Select

<tab-group tabstring="Classes, Hooks, Signals">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MySelect extends Component {
	state = { value: '' };

	onChange = e => {
		this.setState({ value: e.currentTarget.value });
	};

	render(_, { value }) {
		return (
			<div class="form-example">
				<select onChange={this.onChange}>
					<option value="A">A</option>
					<option value="B">B</option>
					<option value="C">C</option>
				</select>
				<p>You selected: {value}</p>
			</div>
		);
	}
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function MySelect() {
	const [value, setValue] = useState('');

	return (
		<div class="form-example">
			<select onChange={e => setValue(e.currentTarget.value)}>
				<option value="A">A</option>
				<option value="B">B</option>
				<option value="C">C</option>
			</select>
			<p>You selected: {value}</p>
		</form>
	);
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { signal } from '@preact/signals';
// --repl-before
const value = signal('');

function MySelect() {
	return (
		<div class="form-example">
			<select onChange={e => (value.value = e.currentTarget.value)}>
				<option value="A">A</option>
				<option value="B">B</option>
				<option value="C">C</option>
			</select>
			<p>You selected: {value.value}</p>
		</form>
	);
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

</tab-group>

## Basic Forms

Whilst bare inputs are useful and you can get far with them, often we'll see our inputs grow into _forms_ that are capable of grouping multiple controls together. To help manage this, we turn to the `<form>` element.

To demonstrate, we'll create a new `<form>` element that contains two `<input>` fields: one for a user's first name and one for their last name. We'll use the `onSubmit` event to listen for the form submission and update the state with the user's full name.

<tab-group tabstring="Classes, Hooks, Signals">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class FullNameForm extends Component {
	state = { fullName: '' };

	onSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		this.setState({
			fullName: formData.get('firstName') + ' ' + formData.get('lastName')
		});
		e.currentTarget.reset(); // Clear the inputs to prepare for the next submission
	};

	render(_, { fullName }) {
		return (
			<div class="form-example">
				<form onSubmit={this.onSubmit}>
					<label>
						First Name: <input name="firstName" />
					</label>
					<label>
						Last Name: <input name="lastName" />
					</label>
					<button>Submit</button>
				</form>
				{fullName && <p>Hello {fullName}</p>}
			</div>
		);
	}
}
// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function FullNameForm() {
	const [fullName, setFullName] = useState('');

	const onSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setFullName(formData.get('firstName') + ' ' + formData.get('lastName'));
		e.currentTarget.reset(); // Clear the inputs to prepare for the next submission
	};

	return (
		<div class="form-example">
			<form onSubmit={onSubmit}>
				<label>
					First Name: <input name="firstName" />
				</label>
				<label>
					Last Name: <input name="lastName" />
				</label>
				<button>Submit</button>
			</form>
			{fullName && <p>Hello {fullName}</p>}
		</div>
	);
}

// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { signal } from '@preact/signals';
// --repl-before
const fullName = signal('');

function FullNameForm() {
	const onSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		fullName.value = formData.get('firstName') + ' ' + formData.get('lastName');
		e.currentTarget.reset(); // Clear the inputs to prepare for the next submission
	};

	return (
		<div class="form-example">
			<form onSubmit={onSubmit}>
				<label>
					First Name: <input name="firstName" />
				</label>
				<label>
					Last Name: <input name="lastName" />
				</label>
				<button>Submit</button>
			</form>
			{fullName.value && <p>Hello {fullName.value}</p>}
		</div>
	);
}

// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

</tab-group>

> **Note**: Whilst it's quite common to see React & Preact forms that link every input field to component state, it's often unnecessary and can get unwieldy. As a very loose rule of thumb, you should prefer using `onSubmit` and the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) API in most cases, using component state only when you need to. This reduces the complexity of your components and may skip unnecessary rerenders.

## Controlled & Uncontrolled Components

When talking about form controls you may encounter the terms "Controlled Component" and "Uncontrolled Component". These terms refer to whether or not the form control value is explicitly managed by the component. Generally, you should try to use _Uncontrolled_ Components whenever possible, the DOM is fully capable of handling `<input>`'s state:

```jsx
// Uncontrolled, because Preact doesn't set the value
<input onInput={myEventHandler} />
```

However, there are situations in which you might need to exert tighter control over the input value, in which case, _Controlled_ Components can be used.

```jsx
// Controlled, because Preact sets the value
<input value={myValue} onInput={myEventHandler} />
```

Preact has a known issue with controlled components: rerenders are required for Preact to exert control over input values. This means that if your event handler doesn't update state or trigger a rerender in some fashion, the input value will not be controlled, sometimes becoming out-of-sync with component state.

An example of one of these problematic situations is as such: say you have an input field that should be limited to 3 characters. You may have an event handler like the following:

```js
const onInput = e => {
	if (e.currentTarget.value.length <= 3) {
		setValue(e.currentTarget.value);
	}
};
```

The problem with this is in the cases where the input fails that condition: because we don't run `setValue`, the component doesn't rerender, and because the component doesn't rerender, the input value is not correctly controlled. However, even if we did add a `else { setValue(value) }` to that handler, Preact is smart enough to detect when the value hasn't changed and so it will not rerender the component. This leaves us with [`refs`](/guide/v10/refs) to bridge the gap between the DOM state and Preact's state.

> For more information on controlled components in Preact, see [Controlled Inputs](https://www.jovidecroock.com/blog/controlled-inputs) by Jovi De Croock.

Here's an example of how you might use a controlled component to limit the number of characters in an input field:

<tab-group tabstring="Classes, Hooks, Signals">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class LimitedInput extends Component {
	state = { value: '' };
	inputRef = createRef(null);

	onInput = e => {
		if (e.currentTarget.value.length <= 3) {
			this.setState({ value: e.currentTarget.value });
		} else {
			const start = this.inputRef.current.selectionStart;
			const end = this.inputRef.current.selectionEnd;
			const diffLength = Math.abs(
				e.currentTarget.value.length - this.state.value.length
			);
			this.inputRef.current.value = this.state.value;
			// Restore selection
			this.inputRef.current.setSelectionRange(
				start - diffLength,
				end - diffLength
			);
		}
	};

	render(_, { value }) {
		return (
			<div class="form-example">
				<label>
					This input is limited to 3 characters:{' '}
					<input ref={this.inputRef} value={value} onInput={this.onInput} />
				</label>
			</div>
		);
	}
}
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
// --repl-before
const LimitedInput = () => {
	const [value, setValue] = useState('');
	const inputRef = useRef();

	const onInput = e => {
		if (e.currentTarget.value.length <= 3) {
			setValue(e.currentTarget.value);
		} else {
			const start = inputRef.current.selectionStart;
			const end = inputRef.current.selectionEnd;
			const diffLength = Math.abs(e.currentTarget.value.length - value.length);
			inputRef.current.value = value;
			// Restore selection
			inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
		}
	};

	return (
		<div class="form-example">
			<label>
				This input is limited to 3 characters:{' '}
				<input ref={inputRef} value={value} onInput={onInput} />
			</label>
		</div>
	);
};
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';
// --repl-before
const LimitedInput = () => {
	const value = useSignal('');
	const inputRef = useRef();

	const onInput = e => {
		if (e.currentTarget.value.length <= 3) {
			value.value = e.currentTarget.value;
		} else {
			const start = inputRef.current.selectionStart;
			const end = inputRef.current.selectionEnd;
			const diffLength = Math.abs(
				e.currentTarget.value.length - value.value.length
			);
			inputRef.current.value = value.value;
			// Restore selection
			inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
		}
	};

	return (
		<div class="form-example">
			<label>
				This input is limited to 3 characters:{' '}
				<input ref={inputRef} value={value} onInput={onInput} />
			</label>
		</div>
	);
};
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

</tab-group>
