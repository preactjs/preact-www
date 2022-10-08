---
name: Switching to Preact from React
permalink: '/guide/switching-to-preact'
description: 'Everything you need to know to switch from React to Preact.'
---

# Switching to Preact (from React)

`preact/compat` is our compatibility layer that allows you to leverage the many libraries of the React ecosystem and use them with Preact. This is the recommended way to try out Preact if you have an existing React app.

This lets you continue writing React/ReactDOM code without any changes to your workflow or codebase. `preact/compat` adds somewhere around 2kb to your bundle size, but has the advantage of supporting the vast majority of existing React modules you might find on npm. The `preact/compat` package provides all the necessary tweaks on top of Preact's core to make it work just like `react` and `react-dom`, in a single module.

---

<div><toc></toc></div>

---

## Setting up compat

To set up `preact/compat` you need to alias `react` and `react-dom` to `preact/compat`. The [Getting Started](/guide/v10/getting-started#aliasing-react-to-preact) page goes into detail on how aliasing is configured in various bundlers.

## PureComponent

The `PureComponent` class works similar to `Component`. The difference is that `PureComponent` will skip rendering when the new props are equal to the old ones. To do this we compare the old and new props via a shallow comparison where we check each props property for referential equality. This can speed up applications a lot by avoiding unnecessary re-renders. It works by adding a default `shouldComponentUpdate` lifecycle hook.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log("render")
    return <div />
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Logs: "render"

// Render a second time, doesn't log anything
render(<Foo value="3" />, dom);
```

> Note that the advantage of `PureComponent` only pays off when then render is expensive. For simple children trees it can be quicker to just do the `render` compared to the overhead of comparing props.

## memo

`memo` is equivalent to functional components as `PureComponent` is to classes. It uses the same comparison function under the hood, but allows you to specify your own specialized function optimized for your use case.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Hello {props.name}</div>
}

// Usage with default comparison function
const Memoed = memo(MyComponent);

// Usage with custom comparison function
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // Only re-render when `name' changes
  return prevProps.name === nextProps.name;
})
```

> The comparison function is different from `shouldComponentUpdate` in that it checks if the two props objects are **equal**, whereas `shouldComponentUpdate` checks if they are different.

## forwardRef

In some cases when writing a component you want to allow the user to get hold of a specific reference further down the tree. With `forwardRef` you can sort-of "forward" the `ref` property:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Hello world</div>;
})

// Usage: `ref` will hold the reference to the inner `div` instead of
// `MyComponent`
const ref = createRef();
render(<MyComponent ref={ref} />, dom)
```

This component is most useful for library authors.

## Portals

In rare circumstances you may want to continue rendering into a different DOM node. The target DOM node **must** be present before attempting to render into it.

```html
<html>
  <body>
    <!-- App is rendered here -->
    <div id="app"></div>
    <!-- Modals should be rendered here -->
    <div id="modals"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import MyModal from './MyModal';

function App() {
  const container = document.getElementById('modals');
  return (
    <div>
      I'm app
      {createPortal(<MyModal />, container)}
    </div>
  )
}
```

> Keep in mind that due to Preact reusing the browser's event system, events won't bubble up through a Portal container to the other tree.

## Suspense (experimental)

The main idea behind `Suspense` is to allow sections of your UI to display some sort of placeholder content while components further down the tree are still loading. A common use case for this is code-splitting where you'll need to load a component from the network before you can render it.

```jsx
import { Suspense, lazy } from 'preact/compat';

const SomeComponent = lazy(() => import('./SomeComponent'));

// Usage
<Suspense fallback={<div>loading...</div>}>
  <Foo>
    <SomeComponent />
  </Foo>
</Suspense>
```

In this example the UI will display the `loading...` text until `SomeComponent` is loaded and the Promise is resolved.

> This feature is experimental and may contain bugs. We have included it as an early preview to increase testing visibility. We don't recommend using it in production.
