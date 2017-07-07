---
name: Forms
permalink: '/guide/forms'
---

# Forms


Forms in Preact work much the same as they do in React, except there is no support for the "static" (initial value) props/attributes.

**[React Forms Docs](https://facebook.github.io/react/docs/forms.html)**


## Controlled & Uncontrolled Components

React's documentation on ["Controlled" Components](https://facebook.github.io/react/docs/forms.html#controlled-components) and ["Uncontrolled" Components](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) is immensely useful in understanding how to take HTML forms, which have bidirectional data flow, and make use of them from the context of a Component-based Virtual DOM renderer, which generally has unidirectional data flow.

Generally, you should try to use _Controlled_ Components at all times.  However, when building standalone Components or wrapping third-party UI libraries, it can still be useful to simply use your component as a mount point for non-preact functionality.  In these cases, "Uncontrolled" Components are nicely suited to the task.


## Checkboxes & Radio Buttons

Checkboxes and radio buttons (`<input type="checkbox|radio">`) can initially cause confusion when building controlled forms. This is because in an uncontrolled environment, we would typically allow the browser to "toggle" or "check" a checkbox or radio button for us, listening for a change event and reacting to the new value.  However, this technique does not transition well into a world view where the UI is always updated automatically in response to state and prop changes.

> **Walk-Through:** Say we listen for a "change" event on a checkbox, which is fired when the checkbox is checked or unchecked by the user.  In our change event handler, we set a value in `state` to the new value received from the checkbox.  Doing so will trigger a re-render of our component, which will re-assign the value of the checkbox to the value from state.  This is unnecessary, because we just asked the DOM for a value but then told it to render again with whatever value we wanted.

So, instead of listening for a `change` event we should listen for a `click` event, which is fired any time the user clicks on the checkbox _or an associated `<label>`_.  Checkboxes just toggle between Boolean `true` and `false`, so clicking the checkbox or the label, we'll just invert whatever value we have in state, triggering a re-render, setting the checkbox's displayed value to the one we want.

### Checkbox Example

```js
class MyForm extends Component {
    toggle = e => {
        let checked = !this.state.checked;
        this.setState({ checked });
    };
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={this.toggle} />
            </label>
        );
    }
}
```
