---
title: Browser Support
description: Preact supports all modern browsers (Chrome, Firefox, Safari, Edge) out of the box
---

# Browser Support

Preact 11.x bundles are transpiled for the following browsers:

- Chrome >= 40
- Safari >= 9
- Firefox >= 36
- Edge >= 12

Preact does not include polyfills and relies on `Object.assign`, `String.prototype.startsWith`, and `queueMicrotask`. Not all versions listed above provide these APIs, so you may need to polyfill them depending on your browser support requirements. Without polyfills, these APIs are available in Chrome 71+, Safari 12.1+, Firefox 69+, and Edge 79+.

If you need to support older browsers, stick to Preact 10.x, which supports back to IE11.
