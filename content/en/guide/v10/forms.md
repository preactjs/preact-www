---
name: Forms
description: 'How to build awesome forms in Preact that work anywhere.'
---

# Forms

Forms in Preact are largely the same as HTML forms.

Much like in HTML forms, forms in Preact both work by rendering input elements and listening for events triggered as the form is modified. The primary difference when rendering forms with Preact is that the value of each form input is generally controlled by Preact.

---

<div><toc></toc></div>

---

## Controlled Component and Uncontrolled Component

You'll often encounter the terms "Controlled Component" and "Uncontrolled Component" in documentation about working with forms in Preact. These terms refer to the way data flow is handled. The DOM has bidirectional data flow where each form control manages its own state and user input. For example, when typing into a text input element, the text is updated without requiring additional logic to store and display values.

In contrast, frameworks like Preact use unidirectional data flow. In this paradigm, instead of DOM elements like inputs managing their own internal state, most state is controlled by the Component that rendered that element.

A "Controlled" Component is a component where state must be manually managed by listening for events and passing new values as props. An "Uncontrolled" Component is a component that manages its own internal state, handling events and updating itself automatically.

```jsx
// Controlled: a Component manages the input's value.
function ControlledExample() {
    const someValue = 'hello';
    const handlInput = () => { /* */ };
    return <input value={someValue} onInput={handleInput} />;
}

// Uncontrolled: nothing sets the input value, so it is managed by the DOM
function UncontrolledExample() {
    const handlInput = () => { /* */ };
    return <input onInput={handleInput} />;
}
```

It is generally considered a good idea to use Controlled Components so that all state is managed the same way. However, when building standalone components or wrapping third-party UI libraries, it can still be useful to use a component as a simple "mount point" in the DOM for attaching non-Preact functionality. In these cases, an "Uncontrolled" Component is well-suited to the task.

> **Note:** Setting the `value` of an input to `undefined` or `null` also makes it "Uncontrolled".

## Creating A Simple Form

Let's create a simple form to submit todo items. For this we create a `<form>` Element, then add a handler to listen for the form's "submit" event. Similarly, we create a text input field and listen for the "input" event triggered in response to typing. Notice that we are storing the text input's value in our `TodoForm` component using `setState()` - this makes it a Controlled input. A Controlled component is suitable for this example, because we need to know the input's state in order to display its current value in another element.

```jsx
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Select Element

The `<select>` element uses `<option>` children to build up a list of values, typically shown as a dropdown. Once constructed, it can be controlled using `value` and `onChange` similar to other form controls:

```jsx
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.target.value });
  }

  onSubmit = e => {
    alert("Submitted " + this.state.value);
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Checkbox and Radio Button

In HTML, browser toggles and checks checkbox and radio button. In Controlled Component, you need to implement toggle and check. Therefore, checkbox and radio button (`<input type="checkbox|radio">`) can initially cause confusion When you build Form in Controlled Component.

Say we listen for a "change" event on a checkbox in Controlled Component, which is fired when the checkbox is checked or unchecked by the user. Form component set `checked` value in the Event object received from the checkbox to `state` in `change` event handler. This triggers rerendering component. `checked` value in `state` is reflected in the checkbox by this rerendering.

```jsx
class MyForm extends Component {
  toggle = event => {
      const checked = event.target.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={this.toggle}
        />
        foo
      </label>
    );
  }
}
```

When managing the state of checkboxes or radio buttons, it's important to understand the two different mechanisms for observing value changes. The `click` event is triggered on an input when its own value changes, such as when a radio button is clicked, or activated via the keyboard or its associated `<label>`. The `change` event is triggered on all inputs in a form group when the value of that _group_ is changed.

It's most common to use the `click` event for checkboxes and radio buttons, since it doesn't rely on named form groups which are a type of DOM state. When handling `click` events, the input element's boolean `checked` property indicates its current value.

In the example below, clicking on the checkbox or its label should toggle between Boolean `true` and `false` values. To achieve this as a controlled input, we can store the initial value in state and simply invert it in response to clicks. This will trigger a re-render, setting the checkbox's displayed value to the value from state.

```jsx
class MyForm extends Component {
  toggle = () => {
      const checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
        foo
      </label>
    );
  }
}
```
