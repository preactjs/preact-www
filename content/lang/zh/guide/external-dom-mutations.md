---
name: External DOM Mutations
permalink: '/guide/external-dom-mutations'
---

# 外部DOM修改

## 综述

有时候，需要用到一些第三方库,而这些第三方库需要能够自由的修改DOM，并且再DOM内部持久化状态,或这写第三方库根本就没有组件化。有许多优秀的UI工具或可复用的元素都是处于这种无组件化的状态。在Preact中(React中也类似),使用这些类型的库需要你告诉 Virtual DOM的rendering/diffing算法: 在给定的组件(或者该组件所呈现的DOM)中不要去撤销任何外部DOM的改变。

## 技巧

一般情况下，是在你的组件中定义一个`shouldComponentUpdate()`方法并让他返回值为`fasle`,很简单,是吧:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... 或者可以简写为:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

With this lifecycle hook in place and telling Preact not to re-render the Component when changes occur up the VDOM tree, your Component now has a reference to its root DOM element that can be treated as static until the Component is unmounted. As with any component that reference is simply called `this.base`, and corresponds to the root JSX Element that was returned from `render()`.
把这个生命周期的钩子(指的`shouldComponentUpdate`)到位并告诉Preact当VDOM tree发生状态改变的时候,不要去再次渲染该组件。这样你的组件就有了一个自身的根DOM元素的索引。你可以把这个组件当做一个静态组件，直到被移除。
---

## Example Walk-Through

Here is an example of "turning off" re-rendering for a Component.  Note that `render()` is still invoked as part of creating and mounting the Component, in order to generate its initial DOM structure.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // do not re-render via diff:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // you can do something with incoming props here if you need
  }

  componentDidMount() {
    // now mounted, can freely modify the DOM:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // component is about to be removed from the DOM, perform any cleanup.
  }

  render() {
    return <div class="example" />;
  }
}
```


## Demonstration

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**View this demo on Webpackbin**](http://www.webpackbin.com/V1hyNQbpe)


## Real-World Examples

Alternatively, see this technique in action in [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - it uses a component as a foothold in the DOM, but then disables updates and lets [tags-input](https://github.com/developit/tags-input) take over from there.  A more complex example would be [preact-richtextarea](https://github.com/developit/preact-richtextarea), which uses this technique to avoid re-rendering an editable `<iframe>`.
