---
name: Linked State
permalink: '/guide/linked-state'
---

# 关联状态

在优化 state 改变的方面，Preact 比 React 走得跟超前一点。在 ES2015 React 代码中，通常的模式是在 `render()` 方法中使用箭头函数，以便于响应事件，更新状态。每次渲染都在局部创建一个函数闭包，这样效率十分低下而且会迫使垃圾回收器做许多不必要的工作。

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

幸运的是，这有一种使用Preact的 [`linkState`](https://github.com/developit/linkstate) 模块的解决方案。

> Preact之前的版本内置了 `linkState()` 方法; 但是，这个方法已经被移除出去成了单独的模块。 如果你想要使用以前的代码编写方式, 请查看 [这个页面](https://github.com/developit/linkstate#usage) 获取更多关于使用polyfill的信息。

当发生一个事件时，调用 `linkState(this, 'text')` 将会返回一个处理器函数，这个函数把它相关的值更新到你组件状态内指定的值。
多次使用相同的 `component` and `name` 参数调用 `linkState(component, name)` 时，结果会被缓存起来。所以就必然不存在性能问题。
以下代码就是之前的样例通过 **Linked State** 的重写:

```js
import linkState from 'linkstate';

class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```
这段代码简洁明了，易于理解且高效。他能够处理来自任何输入形式的关联状态。
可选的第三个参数 `'path'` 能够显式提供一个点式路径（形如：foo.bar.baz）给新的状态，用于自定义绑定（如绑定到第三方组件的值）。

## Custom Event Paths

默认情况下 `linkState()` 会试图从事件中推导出合适的值。 例如，一个 `<input>` 元素会将给定的state的属性的值设置为 `event.target.value` 或者 `event.target.checked` 这取决于 input 的 type 属性值。 对于自定义事件处理器，将纯粹的值传递给 `linkState()` 生成的事件处理函数，这个处理器将使用这个值。在大多数情况下，这种方法是可行的。

但是，有些情况下这是不可行的 —— 自定义事件和分组单选按钮就是这样的两个例子。在这些情况下，可以给 `linkState()` 传递第三个参数去指定可以找到值的事件点式路径（如event.type）。

为了理解这项特性，查看 `linkState()` 背后实现的秘密是非常有用的。以下展示了手动创建一个事件处理器，并且将事件对象的值传递给state。这在功能上等同于 使用 `linkState()` 的方式，但并不包括使 `linkState()` 有存在价值的缓存性能优化。

```js
// linkState返回的事件处理器:
handler = linkState(this, 'thing', 'foo.bar');

// ...在功能上等同于:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### 例子：分组单选按钮

下面的程序不会像预期般运行。如果用户点击了 "no", `noChecked` 变成了 `true` ，但是 `yesChecked` 仍然是 `true`, 因为另一个按钮的 `onChange` 事件并没有被触发:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```


`linkState` 的第三个参数在这里会派上用场。它允许你提供事件对象的点式路径值作为绑定值。 回顾之前的例子，可以显式指定linkState从 `event.target` 的 `value` 属性中获取新的状态值：

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

现在这个例子可以按照预期运行了！