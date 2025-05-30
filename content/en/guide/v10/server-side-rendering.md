---
title: Server-Side Rendering
description: 'Render your Preact application on the server to show content to users quicker.'
---

# Server-Side Rendering

Server-Side Rendering (often abbreviated as "SSR") allows you to render your application to an HTML string that can be sent to the client to improve load time. Outside of that there are other scenarios, like testing, where SSR proves really useful.

---

<toc></toc>

---

## Installation

The server-side renderer for Preact lives in its [own repository](https://github.com/preactjs/preact-render-to-string/) and can be installed via your packager of choice:

```bash
npm install -S preact-render-to-string
```

After the command above finished, we can start using it right away.

## HTML Strings

Both of the following options return a single HTML string that represents the full rendered output of your Preact application.

### renderToString

The most basic and straightforward rendering method, `renderToString` transforms a Preact tree into a string of HTML synchronously.

```jsx
import { renderToString } from 'preact-render-to-string';

const name = 'Preact User!'
const App = <div class="foo">Hello {name}</div>;

const html = renderToString(App);
console.log(html);
// <div class="foo">Hello Preact User!</div>
```

### renderToStringAsync

Awaits the resolution of promises before returning the complete HTML string. This is particularly useful when utilizing suspense for lazy-loaded components or data fetching.

```jsx
// app.js
import { Suspense, lazy } from 'preact/compat';

const HomePage = lazy(() => import('./pages/home.js'));

function App() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <HomePage />
    </Suspense>
  );
};
```

```jsx
import { renderToStringAsync } from 'preact-render-to-string';
import { App } from './app.js';

const html = await renderToStringAsync(<App />);
console.log(html);
// <h1>Home page</h1>
```

## HTML Streams

Streaming is a method of rendering that allows you to send parts of your Preact application to the client as they are ready rather than waiting for the entire render to complete.

### renderToPipeableStream

`renderToPipeableStream` is a streaming method that utilizes [Node.js Streams](https://nodejs.org/api/stream.html) to render your application. If you are not using Node, you should look to [renderToReadableStream](#rendertoreadablestream) instead.

```jsx
import { renderToPipeableStream } from 'preact-render-to-string/stream-node';

// Request handler syntax and form will vary across frameworks
function handler(req, res) {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    onError(error) {
      res.statusCode = 500;
      res.send(
          `<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`
      );
    },
  });

  // Abandon and switch to client rendering if enough time passes.
	setTimeout(abort, 2000);
}
```

### renderToReadableStream

`renderToReadableStream` is another streaming method and similar to `renderToPipeableStream`, but designed for use in environments that support standardized [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) instead.

```jsx
import { renderToReadableStream } from 'preact-render-to-string/stream';

// Request handler syntax and form will vary across frameworks
function handler(req, res) {
  const stream = renderToReadableStream(<App />);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
```

## Customize Renderer Output

We offer a number of options through the `/jsx` module to customize the output of the renderer for a handful of popular use cases.

### JSX Mode

The JSX rendering mode is especially useful if you're doing any kind of snapshot testing. It renders the output as if it was written in JSX.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const App = <div data-foo={true} />;

const html = renderToString(App, {}, { jsx: true });
console.log(html);
// <div data-foo={true} />
```

### Pretty Mode

If you need to get the rendered output in a more human friendly way, we've got you covered! By passing the `pretty` option, we'll preserve whitespace and indent the output as expected.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

const html = renderToString(App, {}, { pretty: true });
console.log(html);
// <div class="foo">
//   <div>foo</div>
// </div>
```

### Shallow Mode

For some purposes it's often preferable to not render the whole tree, but only one level. For that we have a shallow renderer which will print child components by name, instead of their return value.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

const html = renderToString(App, {}, { shallow: true });
console.log(html);
// <div class="foo"><Foo /></div>
```

### XML Mode

For elements without children, XML mode will instead render them as self-closing tags.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div></div>;
const App = <div class="foo"><Foo /></div>;

let html = renderToString(App, {}, { xml: true });
console.log(html);
// <div class="foo"><div /></div>

html = renderToString(App, {}, { xml: false });
console.log(html);
// <div class="foo"><div></div></div>
```
