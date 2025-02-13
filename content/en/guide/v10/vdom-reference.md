---
name: VDOM Properties Reference
description: 'Learn more about how Preact uses special properties of your VDOM components'
---

# VDOM Properties Reference

This page describes how Preact applies rendered component properties to the DOM.

---

<div><toc></toc></div>

---

## ref

See the [References documentation](/guide/v10/refs#createref) for an introduction to this property.

The value can be a function, in which case it will be called with a reference to the element (or component) once it is mounted. If the function returns a cleanup function, then it will be called when unmounting, otherwise the function will be called again with `null`.

The value can also be a non-callable object, in which case Preact will assign the element (or null) to that object's `.current` property.

Note that this is a particularly special property in that this it is [not currently](https://github.com/preactjs/preact/pull/4658) passed through to custom components. See [forwardRef](/guide/v10/switching-to-preact#forwardref) for a workaround.

## style


## children

## dangerouslySetInnerHTML

## on*

### on*Capture

