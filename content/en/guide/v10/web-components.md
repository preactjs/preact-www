---
name: Web Components
description: 'How to use web components with Preact.'
---

# Web Components

Preact's tiny size and standards-first approach make it a great choice for building web components.

Web Components are a set of standards that make it possible to build new HTML element types - Custom Elements like `<material-card>` or `<tab-bar>`.
Preact [fully supports these standards](https://custom-elements-everywhere.com/#preact), allowing seamless use of Custom Element lifecycles, properties and events. 

Preact is designed to render both full applications and individual parts of a page, making it a natural fit for building Web Components. Many companies use it to build component or design systems that are then wrapped up into a set of Web Components, enabling re-use across multiple projects and within other frameworks.

Preact and Web Components are complementary technologies: Web Components provide a set of low-level primitives for extending the browser, and Preact provides a high-level component model that can sit atop those primitives.

---

<div><toc></toc></div>

---

## Rendering Web Components

In Preact, web components work just like other DOM Elements. They can be rendered using their registered tag name:

```jsx
customElements.define('x-foo', class extends HTMLElement {
  // ...
});

function Foo() {
  return <x-foo />;
}
```

### Properties and Attributes

JSX does not provide a way to differentiate between properties and attributes. Custom Elements generally rely on custom properties in order to support setting complex values that can't be expressed as attributes. This works well in Preact, because the renderer automatically determines whether to set values using a property or attribute by inspecting the affected DOM element. When a Custom Element defines a [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) for a given property, Preact detects its existence and will use the setter instead of an attribute.

```jsx
customElements.define('context-menu', class extends HTMLElement {
  set position({ x, y }) {
    this.style.cssText = `left:${x}px; top:${y}px;`;
  }
});

function Foo() {
  return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

When rendering static HTML using `preact-render-to-string` ("SSR"), complex property values like the object above are not automatically serialized. They are applied once the static HTML is hydrated on the client.

### Accessing Instance Methods

To be able to access the instance of your custom web component, we can leverage `refs`:

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

Preact normalizes the casing of standard built-in DOM Events, which are normally case-sensitive. This is the reason it's possible to pass an `onChange` prop to `<input>`, despite the actual event name being `"change"`. Custom Elements often fire custom events as part of their public API, however there is no way to know what custom events might be fired. In order to ensure Custom Elements are seamlessly supported in Preact, unrecognized event handler props passed to a DOM Element are registered using their casing exactly as specified.

```jsx
// Built-in DOM event: listens for a "click" event
<input onClick={() => console.log('click')} />

// Custom Element: listens for "TabChange" event (case-sensitive!)
<tab-bar onTabChange={() => console.log('tab change')} />

// Corrected: listens for "tabchange" event (lower-case)
<tab-bar ontabchange={() => console.log('tab change')} />
```

## Creating a Web Component

Any Preact component can be turned into a web component with [preact-custom-element](https://github.com/preactjs/preact-custom-element), a very thin wrapper that adheres to the Custom Elements v1 spec.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => (
  <p>Hello, {name}!</p>
);

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      HTML tag name     |       use shadow-dom
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

Web Components require explicitly listing the names of attributes you want to observe in order to respond when their values are changed. These can be specified via the third parameter that's passed to the `register()` function:

```jsx
// Listen to changes to the `name` attribute
register(Greeting, 'x-greeting', ['name']);
```

If you omit the third parameter to `register()`, the list of attributes to observe can be specified using a static `observedAttributes` property on your Component. This also works for the Custom Element's name, which can be specified using a `tagName` static property:

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

If no `observedAttributes` are specified, they will be inferred from the keys of `propTypes` if present on the Component:

```jsx
// Other option: use PropTypes:
function FullName({ first, last }) {
  return <span>{first} {last}</span>
}

FullName.propTypes = {
  first: Object,   // you can use PropTypes, or this
  last: Object     // trick to define un-typed props.
};

register(FullName, 'full-name');
```

### Passing slots as props

The `register()` function has a fourth parameter to pass options. Currently only the `shadow` options is supported, which attaches a shadow DOM tree to the specified element. When enabled, this allows the use of named `<slot>` elements to forward the Custom Element's children to specific places in the shadow tree.

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

Usage:

```html
<text-section>
  <span slot="heading">Nice heading</span>
  <span slot="content">Great content</span>
</text-section>
```
