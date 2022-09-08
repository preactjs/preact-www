---
prev: /tutorial
next: /tutorial/02-events
title: Virtual DOM
solvable: true
---

You might have heard people refer to "Virtual DOM", and wondered:
what makes it "virtual"? How is a "virtual" DOM different from
the real DOM we use when programming for the browser?

A Virtual DOM is a simple description of a tree structure using objects:

```js
let vdom = {
  type: 'p',         // a <p> element
  props: {
    class: 'big',    // with class="big"
    children: [
      'Hello World!' // and the text "Hello World!"
    ]
  }
}
```

Libraries like Preact provide a way to construct these descriptions, which can
then be compared against the browser's DOM tree. As each part of the tree is
compared, and the browser's DOM tree is updated to match the structure described
by the Virtual DOM tree.

This is a useful tool, because it lets us compose user interfaces _declaratively_
rather than _imperatively_. Instead of describing _how_ to update the DOM in
response to things like keyboard or mouse input, we only need to describe _what_
the DOM should look like after that input is received. It means we can repeatedly
give Preact descriptions of tree structures, and it will update the browser's DOM
tree to match each new description – regardless of its current structure. 

In this chapter, we'll learn how to create Virtual DOM trees, and how to tell
Preact to update the DOM to match those trees.

### Creating Virtual DOM trees

There are a few ways to create Virtual DOM trees:

- `createElement()`: a function provided by Preact
- [JSX]: HTML-like syntax that can be compiled to JavaScript
- [HTM]: HTML-like syntax you can write directly in JavaScript

It's useful to start things off with the simplest approach, which would be to call Preact's `createElement()` function directly:

```jsx
import { createElement, render } from 'preact';

let vdom = createElement(
  'p',              // a <p> element
  { class: 'big' }, // with class="big"
  'Hello World!'    // and the text "Hello World!"
);

render(vdom, document.body);
```

The code above creates a Virtual DOM "description" of a paragraph element.
The first argument to createElement is the HTML element name.
The second argument is the element's "props" - an object containing attributes
(or properties) to set on the element.
Any additional arguments are children for the element, which can be strings (like
`'Hello World!'`) or Virtual DOM elements from additional `createElement()` calls.

The last line tells Preact to build a real DOM tree that matches our Virtual DOM
"description", and to insert that DOM tree into the `<body>` of a web page.

### Now with more JSX!

We can rewrite the previous example using [JSX] without changing its functionality.
JSX lets us describe our paragraph element using HTML-like syntax, which can help
keep things readable as we describe more complex trees. The drawback of JSX is that
our code is no longer written in JavaScript, and must be compiled by a tool like [Babel]. Compilers do the work of converting the JSX example below into the exact
`createElement()` code we saw in the previous example.

```jsx
import { createElement, render } from 'preact';

let vdom = <p class="big">Hello World!</p>;

render(vdom, document.body);
```

It looks a lot more like HTML now!

There's one final thing to keep in mind about JSX: code inside of a JSX element
(within the angle brackets) is special syntax and not JavaScript. To use JavaScript
syntax like numbers or variables, you first need to "jump" back out from JSX using
an `{expression}` - similar to fields in a template. The example below shows two
expressions: one to set `class` to a randomized string, and another to calculate
a number.

```jsx
let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = <p class={maybeBig}>Hello {40 + 2}!</p>;
                 // ^---JS---^       ^--JS--^
```

If we were to `render(vdom, document.body)`, the text "Hello 42!" would be shown.

### Once more with HTM

[HTM] is an alternative to JSX that uses standard JavaScript tagged templates,
removing the need for a compiler. If you haven't encountered tagged templates,
they're a special type of String literal that can contain `${expression}` fields:

```js
let str = `Quantity: ${40 + 2} units`;  // "Quantity: 42 units"
```

HTM uses `${expression}` instead of the `{expression}` syntax from JSX, which
can make it clearer what parts of your code are HTM/JSX elements, and what
parts are plain JavaScript:

```js
import { html } from 'htm/preact';

let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = html`<p class=${maybeBig}>Hello ${40 + 2}!</p>`;
                        // ^--JS--^          ^-JS-^
```

All of these examples produce the same result: a Virtual DOM tree that can
be given to Preact to create or update an existing DOM tree.

---

### Detour: Components

We'll get into a lot more detail about Components later in this tutorial, but
for now it's important to know that HTML elements like `<p>` are just one of
_two_ types of Virtual DOM elements. The other type is a Component, which is
a Virtual DOM element where the type is a function instead of a string like `p`.

Components are the building blocks of Virtual DOM applications. For now, we'll
create a very simple component by moving our JSX into a function, which will be
rendered for us so we don't need to write that last `render()` line anymore:

```jsx
import { createElement } from 'preact';

export default function App() {
	return (
		<p class="big">Hello World!</p>
	)
}
```

## Try it!

On the right side of this page, you'll see the code from our previous example
at the top. Below that is a box with the result of running that code. You can
edit the code and see how your changes affect (or break!) the result as you go.

To test what you've learned in this chapter, try giving the text some more pizazz!
Make the word `World` stand out by wrapping it in HTML tags: `<em>` and `</em>`.

Then, make all of the text <span style="color:purple">purple</span> by adding a
`style` prop. The `style` prop is special, and allows an object value with
one or more CSS properties to set on the element. To pass an object as a prop value, you'll need to use an `{expression}`, like `style={{ property: 'value' }}`.

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>We've made things appear on the screen. Next we'll make them interactive.</p>
</solution>


```js:setup
useResult(function(result) {
  var hasEm = result.output.innerHTML.match(/<em>World\!?<\/em>/gi);
  var p = result.output.querySelector('p');
  var hasColor = p && p.style && p.style.color === 'purple';
  if (hasEm && hasColor) {
    store.setState({ solved: true });
  }
}, []);
```


```jsx:repl-initial
import { render } from 'preact';

function App() {
  return (
    <p class="big">Hello World!</p>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';

function App() {
  return (
    <p class="big" style={{ color: 'purple' }}>
      Hello <em>World</em>!
    </p>
  )
}

render(<App />, document.getElementById("app"));
```

[JSX]: https://en.wikipedia.org/wiki/JSX_(JavaScript)
[HTM]: https://github.com/developit/htm
[Babel]: https://babeljs.io
