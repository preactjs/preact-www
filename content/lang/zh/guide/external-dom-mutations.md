---
name: External DOM Mutations
permalink: '/guide/external-dom-mutations'
---

# 外部 DOM 修改

## 综述

有时候，需要用到一些第三方库，而这些第三方库需要能够自由的修改 DOM，并且在 DOM 内部持久化状态，或这些第三方库根本就没有组件化。有许多优秀的 UI 工具或可复用的元素都是处于这种无组件化的状态。在 Preact 中 (React 中也类似), 使用这些类型的库需要你告诉 Virtual DOM 的 rendering/diffing 算法：在给定的组件(或者该组件所呈现的 DOM) 中不要去撤销任何外部 DOM 的改变。

## 技巧

一般情况下，是在你的组件中定义一个 `shouldComponentUpdate()` 方法并让他返回值为 `fasle`，很简单，是吧：

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

或者可以简写为：

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

有了这个生命周期的钩子（指 shouldComponentUpdate），并告诉 Preact 当 VDOM tree 发生状态改变的时候, 不要去再次渲染该组件。这样你的组件就有了一个自身的根 DOM 元素的引用。你可以把这个组件当做一个静态组件，直到被移除。因此，任何的组件引用都可以简单通过 this.base 被调用，并且对应从 render() 函数返回的根 JSX 元素。

---

## 样例演练

这是一个"去掉" 组件重新渲染的例子。注意 render() 作为创建和挂载组件的一部份，为了生成组件初始的 DOM 结构，依然会被调用。
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

[![样例](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)

[** 在 Webpackbin 中查看样例 **](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## 真实场景中的样例

作为一种选择, 在后面的链接中查看这种技巧的使用 [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) -
他使用组件作为 DOM 的立足点，但是禁止组件更新, 而且让 [tags-input](https://github.com/developit/tags-input) 来接管这些事情.  一个更复杂的样例 [preact-richtextarea](https://github.com/developit/preact-richtextarea), preact-richtextarea 使用这个技巧来避免二次渲染一个可编辑的 `<iframe>` 标签。
