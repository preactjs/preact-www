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

Iff values for *both* are provided on your VDOM node, note that `class` will the be set as an attribute (under normal circumstances) and `className` will be set as a property — but whichever one ends up being iterated last during the DOM diffing tends to clobber the other regardless.


## children


The value of the property itself is under the control of Preact, e.g. in the following example despite passing some other value for the prop, `MyComponent` would not receive a `children` entry in its props because there are no actual child vnodes:

```jsx

<MyComponent children={[1,2,3]} />
```

## dangerouslySetInnerHTML

For regular DOM nodes, this provides a way to take over the rendered contents. Like [React's version](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html), it expects an object with an `__html` property whose value is to be set as the [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) of the element.

For functional/class-based components this is treated just as any other arbitrary property. The value would be available to the component's implementation but does not directly influence/override its rendered output. (TBD: but does [diff-skipping](https://preactjs.com/guide/v10/upgrade-guide/#dangerouslysetinnerhtml-will-skip-diffing-of-children) still apply?)

## on*

For property names beginning with "on…" Preact registers an event handler. See the [Events tutorial](/tutorial/02-events/) for additional explanation.

Note that while Preact core does do a bit of fix up here and there (see [Other special properties](#other-special-properties) below…) it generally follows the underlying browser DOM event naming/behavior more plainly and directly when you are not using `preact/compat`.


### on*Capture

If your event property name ends with "…Capture" then Preact will register your event handler during the capture (rather than bubbling) phase.


## Other special properties

Preact core includes many other special property fixups including for:

* certain form/display elements
* certain event names and HTML attributes
* various idiosyncracies of the [SVG DOM](https://www.w3.org/TR/SVG11/svgdom.html)
* … etc.

The list above is not intended to be comprehensive.

There are many nuances both for specific bugfixes/workarounds/compatibility concessions, and other nuances that simply fall out of the how the internals have gotten implemented. (For example of one such edge case, currently if you assign your own property value to a raw DOM node object in an uncontrolled way e.g. `spanRef.current["data-myvar"] = null` it may then interfere w/Preact's fallback attribute setting of `<span ref={spanRef} data-myvar="controlled-value" />`.)

Your best guide for advanced details would be to refer to the [`diff/props.js` source code](https://github.com/preactjs/preact/blob/main/src/diff/props.js), as well as the overarching diffing algorithm itself ([e.g.](https://github.com/preactjs/preact/blob/face9247724db0a74b764316c4486f384b89cfed/src/diff/index.js#L554-L576)) corresponding to the specific version of Preact you are using.
