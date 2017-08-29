---
name: Linked State
permalink: '/guide/linked-state'
---

# 关联状态

在优化 state 改变的方面，Preact 比 React 走得跟超前一点。在 ES2015 React 代码中，通常的模式是在 `render()` 方法中使用箭头函数，以便于响应事件，更新状态。每次渲染都在局部创建一个函数闭包效率十分低下而且会迫使垃圾回收器做许多不必要的工作。

## 更好的手动处理方式

一个办法是使用 ES7 的类属性声明绑定了组件的方法。([类实例域](https://github.com/jeffmo/es-class-fields-and-static-properties))：


```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```


尽管这样做获得了更优异的运行性能，但是它还是需要编写许多不必要的代码来关联 state 和 UI。

> 另一个解决方案是使用 ES7 的装饰器，声明式地绑定组件方法。例如 [decko's](http://git.io/decko) `@bind`。

## 让关联状态（Linked State）来拯救你
幸运的是，在 Preact 的 Form 中，提供了 `linkState()` 作为解决方案。`linkState()` 是 `Component` 类的一个内置方法。

当发生一个事件时，调用 `.linkState('text')` 将会返回一个处理器函数，这个函数把它相关的值更新到你组件状态内指定的值。
多次调用 linkState(name)时，如果 name 参数相同，那么结果会被缓存起来。所以就必然不存在性能问题。
以下代码就是之前的样例通过 **Linked State** 重写:

```js
class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={this.linkState('text')} />;
	}
}
```
这段代码简洁明了，易于理解且高效。他能够处理来自任何输入形式的关联状态。
可选的第二参数 `'path'` 能够显示提供一个的点式路径（形如：foo.bar.baz）给新的状态，用于自定义绑定（如绑定到第三方组件的值）。
