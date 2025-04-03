---
name: No-Build Workflows
description: 'Whilst build tools like Webpack, Rollup, and Vite are incredibly powerful and useful, Preact fully supports building applications without them.'
---

# No-Build Workflows

Whilst build tools like Webpack, Rollup, and Vite are incredibly powerful and useful, Preact fully supports building
applications without them.

No-build workflows are a way to develop web applications while forgoing build tooling, instead relying on the browser
to facilitate module loading and execution. This is a great way to get started with Preact and can continue to work
very well at all scales.

---

<div><toc></toc></div>

---

## Import Maps

An [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) is a newer browser feature
that allows you to control how browsers resolve module specifiers, often to convert bare specifiers such as `preact`
to a CDN URL like `https://esm.sh/preact`. While many do prefer the aesthetics import maps can provide, there are also
objective advantages to the centralization of dependencies such as easier versioning, reduced/removed duplication, and
better access to more powerful CDN features.

We do generally recommend using import maps for those choosing to forgo build tooling as they work around some issues
you may encounter using bare CDN URLs in your import specifiers (more on that below).

### Basic Usage

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) has a great deal of information on how to
utilize import maps, but a basic example looks like the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "preact": "https://esm.sh/preact@10.23.1",
          "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { render } from 'preact';
      import { html } from 'htm/preact';

      export function App() {
        return html`<h1>Hello, World!</h1>`;
      }

      render(html`<${App} />`, document.getElementById('app'));
    </script>
  </body>
</html>
```

We create a `<script>` tag with a `type="importmap"` attribute, and then define the modules we'd like to use
inside of it as JSON. Later, in a `<script type="module">` tag, we can import these modules using bare specifiers,
similar to what you'd see in Node.

> **Important:** We use `?external=preact` in the example above as https://esm.sh will helpfully provide the
> module you're asking for as well as its dependencies -- for `htm/preact`, this means also providing a
> copy of `preact`. However, Preact must be used only as a singleton with only a single copy included in your app.
>
> By using `?external=preact`, we tell `esm.sh` that it shouldn't provide a copy of `preact`, we can handle
> that ourselves. Therefore, the browser will use our importmap to resolve `preact`, using the same Preact
> instance as the rest of our code.

### Recipes and Common Patterns

While not an exhaustive list, here are some common patterns and recipes you may find useful when working with
import maps. If you have a pattern you'd like to see, [let us know](https://github.com/preactjs/preact-www/issues/new)!

For these examples we'll be using https://esm.sh as our CDN -- it's a brilliant, ESM-focused CDN that's a bit
more flexible and powerful than some others, but by no means are you limited to it. However you choose to serve
your modules, make sure you're familiar with the policy regarding dependencies: duplication of `preact` and some
other libraries will cause (often subtle and unexpected) issues. For `esm.sh`, we address this with the `?external`
query parameter, but other CDNs may work differently.

#### Preact with Hooks, Signals, and HTM

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
    }
  }
</script>
```

#### Aliasing React to Preact

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "react": "https://esm.sh/preact@10.23.1/compat",
      "react/": "https://esm.sh/preact@10.23.1/compat/",
      "react-dom": "https://esm.sh/preact@10.23.1/compat",
      "@mui/material": "https://esm.sh/@mui/material@5.16.7?external=react,react-dom"
    }
  }
</script>
```

## HTM

Whilst JSX is generally the most popular way to write Preact applications, it requires a build step to convert the non-standard syntax into something browsers and other runtimes can understand natively. Writing `h`/`createElement` calls by hand can be a bit tedious though with less than ideal ergonomics, so we instead recommend a JSX-like alternative called [HTM](https://github.com/developit/htm).

Instead of requiring a build step (though it can use one, see [`babel-plugin-htm`](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm)), HTM uses [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) syntax, a feature of JavaScript that's been around since 2015 and is supported in all modern browsers. This is an increasingly popular way to write Preact apps and is likely the most popular for those choosing to forgo a build step.

HTM supports all standard Preact features, including Components, Hooks, Signals, etc., the only difference being the syntax used to write the "JSX" return value.

```js
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

function Button({ action, children }) {
	return html`<button onClick=${action}>${children}</button>`;
}

function Counter() {
	const [count, setCount] = useState(0);

	return html`
		<div class="counter-container">
			<${Button} action=${() => setCount(count + 1)}>Increment<//>
			<input readonly value=${count} />
			<${Button} action=${() => setCount(count - 1)}>Decrement<//>
		</div>
	`;
}

render(html`<${Counter} />`, document.getElementById('app'));
```
