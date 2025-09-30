---
title: preact-root-fragment
description: A standalone Preact 10+ implementation of the deprecated `replaceNode` parameter from Preact 10
---

# preact-root-fragment

preact-root-fragment is a standalone and more flexible Preact 10+ implementation of the deprecated `replaceNode` parameter from Preact 10.

It provides a way to render or hydrate a Preact tree using a subset of the children within the parent element passed to render():

```html
<body>
	<div id="root"> ⬅ we pass this to render() as the parent DOM element...

		<script src="/etc.js"></script>

		<div class="app"> ⬅ ... but we want to use this tree, not the script
			<!-- ... -->
		</div>
	</div>
</body>
```

---

<toc></toc>

---

## Why do I need this?

This is particularly useful for [partial hydration](https://jasonformat.com/islands-architecture/), which often requires rendering multiple distinct Preact trees into the same parent DOM element. Imagine the scenario below - which elements would we pass to `hydrate(jsx, parent)` such that each widget's `<section>` would get hydrated without clobbering the others?

```html
<div id="sidebar">
  <section id="widgetA"><h1>Widget A</h1></section>
  <section id="widgetB"><h1>Widget B</h1></section>
  <section id="widgetC"><h1>Widget C</h1></section>
</div>
```

Preact 10 provided a somewhat obscure third argument for `render` and `hydrate` called `replaceNode`, which could be used for the above case:

```jsx
render(<A />, sidebar, widgetA); // render into <div id="sidebar">, but only look at <section id="widgetA">
render(<B />, sidebar, widgetB); // same, but only look at widgetB
render(<C />, sidebar, widgetC); // same, but only look at widgetC
```

While the `replaceNode` argument proved useful for handling scenarios like the above, it was limited to a single DOM element and could not accommodate Preact trees with multiple root elements. It also didn't handle updates well when multiple trees were mounted into the same parent DOM element, which turns out to be a key usage scenario.

Going forward, we're providing this functionality as a standalone library called `preact-root-fragment`.

## How it works

`preact-root-fragment` provides a `createRootFragment` function:

```ts
createRootFragment(parent: ContainerNode, children: ContainerNode | ContainerNode[]);
```

Calling this function with a parent DOM element and one or more child elements returns a "Persistent Fragment". A persistent fragment is a fake DOM element, which pretends to contain the provided children while keeping them in their existing real parent element. It can be passed to `render()` or `hydrate()` instead of the `parent` argument.

Using the previous example, we can change the deprecated `replaceNode` usage out for `createRootFragment`:

```jsx
import { createRootFragment } from 'preact-root-fragment';

render(<A />, createRootFragment(sidebar, widgetA));
render(<B />, createRootFragment(sidebar, widgetB));
render(<C />, createRootFragment(sidebar, widgetC));
```

Since we're creating separate "Persistent Fragment" parents to pass to each `render()` call, Preact will treat each as an independent Virtual DOM tree.

## Multiple Root Elements

Unlike the `replaceNode` parameter from Preact 10, `createRootFragment` can accept an Array of children that will be used as the root elements when rendering. This is particularly useful when rendering a Virtual DOM tree that produces multiple root elements, such as a Fragment or an Array:

```jsx
import { createRootFragment } from 'preact-root-fragment';
import { render } from 'preact';

function App() {
  return (
    <>
      <h1>Example</h1>
      <p>Hello world!</p>
    </>
  );
}

// Use only the last two child elements within <body>:
const children = [].slice.call(document.body.children, -2);

render(<App />, createRootFragment(document.body, children));
```

## Preact Version Support

This library works with Preact 10 and 11.
