---
title: preact-custom-element
description: Wrap your Preact component up as a custom element
---

# preact-custom-element

Preact's tiny size and standards-first approach make it a great choice for building web components.

Preact is designed to render both full applications and individual parts of a page, making it a natural fit for building Web Components. Many companies use this approach to build component or design systems that are then wrapped up into a set of Web Components, enabling re-use across multiple projects and within other frameworks whilst continuing to offer the familiar Preact APIs.

---

<toc></toc>

---

## Creating a Web Component

Any Preact component can be turned into a web component with [preact-custom-element](https://github.com/preactjs/preact-custom-element), a very thin wrapper that adheres to the Custom Elements v1 spec.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => <p>Hello, {name}!</p>;

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
	return (
		<span>
			{first} {last}
		</span>
	);
}

FullName.propTypes = {
	first: Object, // you can use PropTypes, or this
	last: Object // trick to define un-typed props.
};

register(FullName, 'full-name');
```

### Passing slots as props

The `register()` function has a fourth parameter to pass options; currently, only the `shadow` option is supported, which attaches a shadow DOM tree to the specified element. When enabled, this allows the use of named `<slot>` elements to forward the Custom Element's children to specific places in the shadow tree.

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
