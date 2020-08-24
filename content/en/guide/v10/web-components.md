---
name: Web Components
description: 'How to use webcomponents with Preact.'
---

# Web Components

Due to its lightweight nature Preact is a popular choice for writing web components. Many use it to build a component system that is then wrapped into various web components. This allows you to easily re-use them in other projects where a completely different framework is used.

 To learn more about how to build web components with Preact, please see [preact-custom-element](https://github.com/preactjs/preact-custom-element).
One thing to keep in mind is that Web Components don't replace Preact as they don't have the same goals.

---

<div><toc></toc></div>

---

## Rendering Web Components

From Preact's point of view, web components are just standard DOM-Elements. We can render them by using the registered tag name:

```jsx
function Foo() {
  return <x-foo />;
}
```

### Accessing Instance Methods

To be able to access the instance of your custom web component, we can leverage `refs`.

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

### Triggering custom events

Preact normalizes the casing of standard built-in DOM Events, which is how we can pass an `onChange` prop to `<div>`, when the event listener actually requires lowercase `"change"`. However, Custom Elements often fire custom events as part of their public API, and there's no way to know what custom events might be fired. In order to ensure Custom Elements are seamlessly supported in Preact, any unrecognized event handler props passed to a DOM Element will have their casing preserved.

```jsx
// native DOM event -> listens for a "click" event
<div onClick={() => console.log('click')} />

// Custom Element
// Add handler for "IonChange" event
<my-foo onIonChange={() => console.log('IonChange')} />
// Add handler for "ionChange" event (note the casing)
<my-foo onionChange={() => console.log('ionChange')} />
```

## Creating a Web Component

Any Preact component can be turned into a web component with [preact-custom-element](https://github.com/preactjs/preact-custom-element), a very thin wrapper that adheres to the Custom Elements v1 spec.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => (
  <p>Hello, {name}!</p>
);

register(Greeting, 'x-greeting', ['name']);
//          ^            ^           ^
//          |      HTML tag name     |
//   Component definition      Observed attributes
```

> Note: As per the [Custom Element Specification](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname), the tag name must contain a hyphen (`-`).

Use the new tag name in HTML, attribute keys and values will be passed in as props:

```html
<x-greeting name="Billy Jo"></x-greeting>
```

Output:

```html
<p>Hello, Billy Jo!</p>
```

### Observed Attributes

In contrast to Preact components, Web Components require explicitly stating the names of attributes you want to observe. Otherwise the component will not receive any attribute changes. These can be specified via the third parameter that's passed to the `register()` function:

```jsx
// Listen to changes to the `name` attribute
register(Greeting, 'x-greeting', ['name']);
```

If you omit the third parameter to `register()`, the list of attributes to observe can be specified using a static `observedAttributes` property on your Component. This also works for the Custom Element's name, which can be specified using a `tagName` static property:

If the third parameter is not left out we'll try to infer

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
  // Register as <x-greeting>:
  static tagName = 'x-greeting';

  // Track these attributes:
  static observedAttributes = ['name'];

  render({ name }) {
    return <p>Hello, {name}!</p>;
  }
}
register(Greeting);
```
