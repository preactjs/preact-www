---
title: Web Components
description: How to use web components with Preact
---

# Web Components

Web Components are a set of different technologies that allow you to create reusable, encapsulated custom HTML elements that are entirely framework-agnostic. Examples of Web Components include elements like `<material-card>` or `<tab-bar>`.

As a platform primitive, Preact [fully supports Web Components](https://custom-elements-everywhere.com/#preact), allowing seamless use of Custom Element lifecycles, properties, and events in your Preact apps.

Preact and Web Components are complementary technologies: Web Components provide a set of low-level primitives for extending the browser, and Preact provides a high-level component model that can sit atop those primitives.

---

<toc></toc>

---

## Rendering Web Components

In Preact, web components work just like other DOM Elements. They can be rendered using their registered tag name:

```jsx
customElements.define(
	'x-foo',
	class extends HTMLElement {
		// ...
	}
);

function Foo() {
	return <x-foo />;
}
```

### Properties and Attributes

JSX does not provide a way to differentiate between properties and attributes. Custom Elements generally rely on custom properties in order to support setting complex values that can't be expressed as attributes. This works well in Preact, because the renderer automatically determines whether to set values using a property or attribute by inspecting the affected DOM element. When a Custom Element defines a [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) for a given property, Preact detects its existence and will use the setter instead of an attribute.

```jsx
customElements.define(
	'context-menu',
	class extends HTMLElement {
		set position({ x, y }) {
			this.style.cssText = `left:${x}px; top:${y}px;`;
		}
	}
);

function Foo() {
	return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

> **Note:** Preact makes no assumptions over naming schemes and will not attempt to coerce names, in JSX or otherwise, to DOM properties. If a custom element has a property name `someProperty`, then it will need to be set using that exact same capitalization and spelling (`someProperty=...`). `someproperty=...` or `some-property=...` will not work.

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
