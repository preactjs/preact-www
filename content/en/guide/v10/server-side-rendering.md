---
name: Server-Side Rendering
description: 'Render your Preact application on the server to show content to users quicker.'
---

# Server-Side Rendering

Server-Side Rendering (often abbreviated as "SSR") allows you to render your application to an HTML string that can be sent to the client to improve load time. Outside of that there are other scenarios, like testing, where SSR proves really useful.

> Note: SSR is automatically enabled with `preact-cli` :tada:

---

<div><toc></toc></div>

---

## Installation

The server-side renderer for Preact lives in its [own repository](https://github.com/preactjs/preact-render-to-string/) and can be installed via your packager of choice:

```sh
npm install -S preact-render-to-string
```

After the command above finished, we can start using it right away. The API surface is rather small and can be best explained via a simple snippet:

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class="foo">content</div>;

console.log(render(App));
// <div class="foo">content</div>
```

## Shallow Rendering

For some purposes it's often preferable to not render the whole tree, but only one level. For that we have a shallow renderer which will print child components by name, instead of their return value.

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## Pretty Mode

If you need to get the rendered output in a more human friendly way, we've got you covered! By passing the `pretty` option, we'll preserve whitespace and indent the output as expected.

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(render(App, {}, { pretty: true }));
// Logs:
// <div class="foo">
//   <div>foo</div>
// </div>
```

## JSX Mode

The JSX rendering mode is especially useful if you're doing any kind of snapshot testing. It renders the output as if it was written in JSX.

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App));
// Logs: <div data-foo={true} />
```
