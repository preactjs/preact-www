---
name: Import Maps
description: 'Import maps are a new feature in JavaScript that are especially useful for no-build workflows.'
---

# Import Maps

Import maps are a new feature in JavaScript that are especially useful for no-build workflows.

An [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) is a newer feature
that allows you to control how browsers resolve module specifiers, usually to convert bare specifiers such as `preact`
to a CDN URL like `https://esm.sh/preact`. While many do prefer the aesthetics import maps can provide, there are also
real advantages to using them, such as better control over dependencies and solving the issues that come with HTTP imports.

This isn't to say you need import maps, but for those choosing to forgo build tooling, they are a great option that can help
solve some issues such as dependency duplication, versioning, and allow use of more intelligent CDNs, without giving up control.

## Basic Usage

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) has a great deal of information on how to
utilize import maps, but a basic example looks like the following:

```html
<DOCTYPE html>
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
> module you're asking for as well as its dependencies -- for `htm/preact`, this means also providing `preact`.
> However, Preact, and many other libraries, need to be used as singletons (only a single active
> instance at a time) so this creates a problem.
>
> By using `?external=preact`, we tell `esm.sh` that it shouldn't provide a copy of `preact`, we can handle
> that ourselves. Therefore, when the browser goes to execute `htm/preact`, it will use our importmap to find
> `preact` and use the same instance as the rest of our code.

## Recipes and Common Patterns

While not an exhaustive list, here are some common patterns and recipes you may find useful when working with
import maps. If you have a pattern you'd like to see, let us know! //TODO: Add GH issues link

For these examples we'll be using https://esm.sh as our CDN -- it's a brilliant option is a bit more flexible
than some others, but by no means are you limited to it.

### Preact with Hooks, Signals, and HTM

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact"
    }
  }
</script>
```

### Aliasing React to Preact

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "@mui/material": "https://esm.sh/@mui/material?alias=react:preact/compat,react-dom:preact/compat&external=preact"
    }
  }
</script>
```

...or, alternatively...

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "react": "https://esm.sh/preact@10.23.1/compat",
      "react/": "https://esm.sh/preact@10.23.1/compat/",
      "react-dom": "https://esm.sh/preact@10.23.1/compat",
      "@mui/material": "https://esm.sh/@mui/material?external=react,react-dom"
    }
  }
</script>
```

Both are equivalent, using slightly different methods. If you're using the many React libraries, the second
method may be preferable, as it avoids the need to alias in every CDN URL, but ultimately, it's personal taste.
