---
name: VDOM Properties Reference
description: 'Learn more about how Preact uses special properties of your VDOM components'
---

# VDOM Properties Reference

This page describes how Preact applies rendered component properties to the DOM.

---

<div><toc></toc></div>

---

## key

The value of this property provides an identity for the VDOM node when diffing against a previous render.
See the [Keys tutorial](/tutorial/08-keys/) for background.

Note that this is a particularly special property in that it is intercepted by Preact and *not* passed along to any custom component.


## ref

See the [References documentation](/guide/v10/refs#createref) for an introduction to this property.

The value can be a function, in which case it will be called with a reference to the element (or component) once it is mounted. If the function returns a cleanup function, then it will be called when unmounting, otherwise the function will be called again with `null`.

The value can also be a non-callable object, in which case Preact will assign the element (or null) to that object's `.current` property.

Note that this is, like `key`, also a particularly special property in that this it is [not currently](https://github.com/preactjs/preact/pull/4658) passed through to custom components. See [forwardRef](/guide/v10/switching-to-preact#forwardref) for a workaround.


## style

This value can be a string containing inline CSS as it would appear in plain HTML. Note, however, that any string will be applied via `dom.style.cssText = value` which parses the CSS and will result in an empty attribute in case of any syntax error rather than the content being applied verbatim.

This value can also be an object, in which case each of its individual entries are applied as [individual CSS properties](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty) on the element (at default [priority](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity#the_!important_exception)). Each key of your object may use the either the dashed style (e.g. `{"text-decoration-color": "blue"}`) or, for [CSS properties the browser is aware of](https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-camel-cased-attribute), a camelCased style may be used as well (e.g. `{textDecorationColor: "blue"}`).

### Numeric values

Numeric values of style objects entries will have a "px" suffix **automatically appended** unless the CSS property name is either a custom one (e.g. `--my-var`) or is [known to be "non-dimensional"](https://github.com/preactjs/preact/blob/face9247724db0a74b764316c4486f384b89cfed/src/constants.js#L20-L21). This is for compatibility with React, but will likely be [removed from Preact core](https://github.com/preactjs/preact/issues/2621) in a future version.


## class / className

Preact core supports both `class` and `className` for setting the respective attribute/property. See [Preact's philosophy around raw attribute/property usage](/guide/v10/differences-to-react#raw-html-attributeproperty-names) for more discussion.

Note that if values for *both* are provided on your VDOM node, note that `class` will normally be set as an attribute and `className` will be set as a property — but whichever one ends up being iterated last during the DOM diffing tends to clobber the other regardless.


## children

## dangerouslySetInnerHTML

## on*

### on*Capture

