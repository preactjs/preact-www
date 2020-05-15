---
name: Forms
description: 'How to build awesome forms in Preact that work anywhere.'
---

# Forms

Forms in Preact and Forms in HTML work much the same. Both render a control, and attach an event listener to it.

The main difference between both is that in most cases the `value` of input control is controlled by whether DOM node or Component.

---

<div><toc></toc></div>

---

## Controlled Component and Uncontrolled Component

You'll often encounter "Controlled" Component and "Uncontrolled" Component in the document about form control. "Controlled" and "Uncontrolled" refer to the way data flow is handled. DOM has a bidirectional data flow, because every form control will manage the user input themselves. For examle, when a user types in text input element, its value is always reflected.

A framework like Preact in contrast generally has a unidirectional data flow. In Preact, generally, DOM (Example: text `input` element) doesn't manage the value itself there, Component (Example: a component which has child text `input` element) manages the value.

Controlled Component is that a component manages value of input control. Uncontrolled Component is that a component does not manages value of input control.

```jsx
// This is Controlled Component. Component manages the input's value.
<input value={someValue} onInput={myEventHandler} />;

// This is Uncontrolled Component. Component doesn't set the value. DOM manages input's value.
<input onInput={myEventHandler} />;
```

Generally, you should try to use "Controlled" Component at all times. However, when building standalone Component or wrapping third-party UI libraries, it can still be useful to simply use your component as a mount point for non-preact functionality. In these cases, "Uncontrolled" Component are nicely suited to the task.

> Note: If `value` attribute is set to `undefined` or `null`, it becomes "Uncontrolled" Component.

## Creating A Simple Form

Let's create a simple form to submit todo items. For this we create a `<form>`-Element and bind an event handler to onSubmit of the form. We do a similar thing for the text input field, but note that we are storing the value in TodoForm component by using `setState()`. You guessed it, we're using a Controlled Component here. In this example, Controlled Component is suitable, because we need to display the input's value in another element.

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

A `<select>`-Element is a little more involved, but works similar to all other form controls:

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
          onClick={this.toggle}
        />
      </label>
    );
  }
}
```

But, it is unnecessary to use `checked` value in Event object, since the component has `checked` value at before changing in `state`. So, instead of listening for a `change` event we should listen for a `click` event, which is fired any time the user clicks on the checkbox _or an associated `<label>`_. Checkboxes just toggle between Boolean `true` and `false`, so clicking the checkbox or the label, we'll just invert whatever value we have in state, triggering a re-render, setting the checkbox's displayed value to the one we want.

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
      </label>
    );
  }
}
```
