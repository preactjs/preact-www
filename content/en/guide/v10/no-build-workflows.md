---
name: No-Build Workflows
description: 'Whilst build tools like Webpack, Rollup, and Vite are incredibly powerful and useful, Preact fully supports building applications without them.'
---

# No-Build Workflows

Whilst build tools like Webpack, Rollup, and Vite are incredibly powerful and useful, Preact fully supports building
applications without them.

No-build workflows are a way to develop web applications while forgoing build tooling, instead relying on the browser
to facilitate module loading and execution. This is a great way to get started wtih Preact and can continue to work
very well at all scales, but isn't entirely without difficulties.

---

<div><toc></toc></div>

---

## Import Maps

An [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) is a newer feature
that allows you to control how browsers resolve module specifiers, often to convert bare specifiers such as `preact`
to a CDN URL like `https://esm.sh/preact`. While many do prefer the aesthetics import maps can provide, there are also
objective advantages to the centralization of dependencies, such as easier versioning, reduced/removed duplication, and
better access to more powerful CDN features.

This isn't to say you need import maps, but for those choosing to forgo build tooling, they are a great option to at least
be aware of.

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
        return html`
          <h1>Hello, World!</h1>
        `;
      }

      render(html`<${App} />`, document.getElementById('app'));
    </script>
  </body>
</html>
```

We create a `<script>` tag with a `type="importmap"` attribute, and then define the modules we'd like to use
inside of it as JSON. Later, in a `<script type="module">` tag, we can import these modules using bare specifiers,
similiar to what you'd see in Node.

> **Note:** We use `?external=preact` in the example above as https://esm.sh will helpfully provide the
> module you're asking for as well as its dependencies -- for `htm/preact`, this means also providing a
> copy of `preact`. However, Preact and many other libraries need to be used as singletons (only a single
> active instance at a time) which creates a problem.
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
