---
name: Getting Started
permalink: '/guide/getting-started'
---

# 如何开始

这个指引会示范去搭建一个简单的『时钟』组件。每个主题下更详情的信息，可以在『指引』菜单下面对应的页面找到。


> :information_desk_person: 你 [使用 Preact 的时候，不必使用 ES2015](https://github.com/developit/preact-without-babel)... 但你最好使用。这个指引假定你已经使用过一些 ES2015 构建，基于 babel 和 / 或 webpack/browserify/gulp/grunt / 等等。如果你还没有，请从 [preact-boilerplate] 或一个 [CodePen Template](http://codepen.io/developit/pen/pgaROe?editors=0010)开始。


---


## Import 引用你所需要的

`preact` 模块提供命名导出以及默认导出，因此，你既可以在一个你选定的全名空间下 import 所有的模块，或者只 import 你所需要的模块，如下所示：

**命名引入：**

```js
import { h, render, Component } from 'preact';

// 告诉 Babel 将 JSX 转化成 h() 的函数调用:
/** @jsx h */
```

**默认引入：**

```js
import preact from 'preact';

// 告诉 Babel 将 JSX 转化成 preact.h() 的函数调用:
/** @jsx preact.h */
```

> 定义好的引用，对于高度结构化的应用比较好；而默认引用，对于想使用库的各个模块来说，则更方便，而且不需要经常去改变。

### 全局 pragma

与其直接在你的代码里去声明 `@jsx` pragma，不如在 `.babelrc` 中进去全局定义。

**命名引入：**
>**Babel 5 或更早的版本：**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Babel 6：**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**默认引入：**
>**Babel 5 或更早的版本：**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Babel 6：**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## 渲染 JSX

创造性地，Preact 提供 一个 `h()` 函数去将你的 JSX 转化成 虚拟 DOM elements _([这篇文章阐述了原理](http://jasonformat.com/wtf-is-jsx))_。它也提供了一个 `render()` 函数，通过虚拟 DOM 去造创 DOM 树。

去渲染一些 JSX，请引用这两个函数，并像如下一样使用：

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("hi!") }>Click Me</button>
	</div>
), document.body);
```

如果你有使用 [hyperscript] 或者 它的一些[类似的库](https://github.com/developit/vhtml)，这个看起来会非常直观。

尽管用虚拟 DOM 去渲染 hyperscript 并没意义。我们想去渲染组件及使他们在数据变化的时候进行更新，那正是虚拟 DOM 比较的闪光点。:star2:


---


## 组件

Preact 输出一个通用的 `Component` 类，它能使被继承，用于搭建被封装好的，自我可更新的用户界面片段。组件支持所有的 React [生命周期方法]， 像 `shouldComponentUpdate()` 和 `componentWillReceiveProps()`。提供特定的对这些方法的实现，是控制组件 _什么时候_ 和 _如何_ 更新的推荐办法。

组件也有 `render()` 方法，但跟 React 不同的是，这个方法将 `(props, state)` 传入，作为参数。这个提供了更人性化的办法，去解构 `props` 和 `state` 参数成为 JSX 指定的局部变量。

让我们来看这个非常简单的 `Clock` 组件，它显示了当前的时间。

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// 将一个时钟渲染到 <body > 标签:
render(<Clock />, document.body);
```

太棒了，运行上面代码，会生成下面的 HTML DOM 结构：

```html
<span>10:28:57 PM</span>
```


---


## 组件生命周期

为了让时钟的每秒都更新，我们需要知道 `<Clock>` 什么时候渲染到 DOM 里面。如果你使用过 HTML5 自定义元素，这个就跟 `attachedCallback` 和 `detachedCallback` 生命周期类似。 Preact 会调起下面的生命周期方法，如果它们在一个组件中被定义：

| 生命周期方法                  | 什么时候被调用                                    |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | 在一个组件被渲染到 DOM 之前                         |
| `componentDidMount`         | 在一个组件被渲染到 DOM 之后      					 |
| `componentWillUnmount`      | 在一个组件在 DOM 中被清除之前                       |
| `componentWillReceiveProps` | 在新的 props 被接受之前                              |
| `shouldComponentUpdate`     | 在 `render()` 之前. 若返回 `false`，则跳过 render   |
| `componentWillUpdate`       | 在 `render()` 之前                                |
| `componentDidUpdate`        | 在 `render()` 之后                                |

所以，我们需要一个秒级的计时器，在组件添加到 DOM 的时候，就马上开始，同时在它被清除的时候停止。我们会在 `componentDidMount` 中创造一个计时器，并存储一个引用。同时会在 `componentWillUnmount` 中停止这个计时器。在每次计时器计时的时候，我们会用新的值去更新组件的 `state` 对象。做这个数据更新的时候，框架会自动重新渲染组件。

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// 设置初始的时间
		this.state.time = Date.now();
	}

	componentDidMount() {
		// 每秒都更新一下时间
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// 当不再渲染，停止计时器
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// 将一个时钟对象渲染在 < body > 标签:
render(<Clock />, document.body);
```


---


现在，我们有了一个[时钟应用](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)！



[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
