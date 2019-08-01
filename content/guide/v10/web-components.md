---
name: Web Components
description: 'How to use webcomponents with Preact.'
---

# Web Components<!-- omit in toc -->

Due to its lightweight nature Preact is a popular choice for writing web components. Many use it to build a component system that is then wrapped into various web components. This allows you to easily re-use them in other projects where a completely different framework is used.

One thing to keep in mind is that Web Components don't replace Preact as they don't have the same goals.

---

- [Rendering Web Components](#rendering-web-components)
- [Accessing Instance Methods](#accessing-instance-methods)

---

## Rendering Web Components

From Preact's point of view, web components are just standard DOM-Elements. We can render them by using the registered tag name:

```jsx
function Foo() {
  return <x-foo />;
}
```

## Accessing Instance Methods

To be able to access the instance of your custom web component, we can leverage `refs`.

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
