---
name: Web Components
description: 'How to use webcomponents with Preact.'
---

# Web Components

Due to its lightweight nature Preact is a popular choice for writing web components. Many use it to build a component system that is then wrapped into various web components. This allows you to easily re-use them in other projects where a completely different framework is used.

One thing to keep in mind is that Web Components don't replace Preact as they don't have the same goals.

---

<div><toc></toc></div>

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

## Triggering custom events

Preact normalizes the casing of standard built-in DOM Events, which is how we can pass an `onChange` prop to `<div>`, when the event listener actually requires lowercase `"change"`. However, Custom Elements often fire custom events as part of their public API, and there's no way to know what custom events might be fired. In order to ensure Custom Elements are seamlessly supported in Preact, any unrecognized event handler props passed to a DOM Element will have their casing preserved.

```jsx
// native DOM event -> listens for a "click" event
<div onClick={() => console.log('click')} />

// Custom Element
// Add handler for "IonChange" event
<my-foo onIonChange={() => console.log('IonChange')} />
// Add handler for "ionChange" event (note the casing)
<my-foo onionChange={() => console.log('ionChange')} />
```
