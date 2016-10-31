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

把这个生命周期的钩子(指的`shouldComponentUpdate`)到位并告诉Preact当VDOM tree发生状态改变的时候,不要去再次渲染该组件。这样你的组件就有了一个自身的根DOM元素的索引。你可以把这个组件当做一个静态组件，直到被移除。As with any component that reference is simply called `this.base`, and corresponds to the root JSX Element that was returned from `render()`.
---

## 样例演练

以下就是去掉了二次渲染的组件。值得注意的是`render()`方法仍然在组件创建和挂载的过程中被调用用于生成初始的DOM结构。

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


## 示范

[![样例](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**在Webpackbin中查看样例**](http://www.webpackbin.com/V1hyNQbpe)


## 真实场景中的样例

作为一种选择, 在后面的链接中查看这种技巧的使用 [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) -
他使用组件作为DOM的立足点，但是禁止组件更新,而且让[tags-input](https://github.com/developit/tags-input) 来接管这些事情.  一个更复杂的样例[preact-richtextarea](https://github.com/developit/preact-richtextarea), preact-richtextarea使用这个技巧来避免二次渲染一个可编辑的`<iframe>`标签。
