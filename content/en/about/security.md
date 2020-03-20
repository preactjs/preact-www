---
name: Security
permalink: '/security'
description: "Read more about Preact's project goals"
---

# Security

askasd

---

<toc></toc>

---

## How Preact helps you be secure

asd

### Automatic HTML escaping

Whenever you pass an HTML string as a child, Preact will automatically escape it.

```jsx
const userContent = '<script>alert("hi");</script>';

// Later inside a component
<h1>{userContent}</h1>
```

The above will render as:

```html
<h1>&lt;script&gt;alert("hi");&lt;/script&gt;</h1>
```

### Props

Props and DOM attributes will either bei 


## Potential Dangers

As you learned e


### URL-injection

It is possible to inject javascript code into an unsanitized url that was (for example) passed by the backend by prefixing it with `javascript:`.

```html
<a href="javascript:alert('hi')">hi</a>
```

> The best way to prevent this issue is to always sanitize all URLs on the backend site before they are passed to the client. That way you can prevent this change for any consumer of your backend at the same time.

### HTML-injection

Like the name implies the prop `dangerouslySetInnerHTML` can lead to potential security issues and should be avoided. It uses `.innerHTML` under the hood and is suspectible to [Cross-Site-Scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

When the user can somehow control the string that is passed as `__html`, they can inject javascript

```jsx
// NEVER DO THIS!
const userContent = `<img src="x/" onerror="alert('h1');" />`;
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

> :warning: User provided HTML can never be 100% considered safe, unless it's in a sandboxed iframe.

### CSS-injection

If user inputs are directly passed into the `style` attribute of a DOM node, they can be tricked to click something they didn't intend to by placing the node as a transparent box over something like a login button. This is commonly called [Clickjacking](https://en.wikipedia.org/wiki/Clickjacking).
