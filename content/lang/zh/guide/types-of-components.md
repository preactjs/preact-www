---
name: Types of Components
permalink: '/guide/types-of-components'
---


# 组件种类

Preact 中有两种组件：  
- 传统的组件：（带有生命周期方法和状态）  
- 无状态的函数式组件：本质上是接受 `props` 并返回 JSX 的函数

在两种类型的组件中，我们仍有很多方法来创建组件。

## 例子

让我们来看一个例子：一个简单的创建 `<a>` 标签的 `<Link>` 组件：


```js
class Link extends Component {
    render(props, state) {
        return <a href={props.href}>{ props.children }</a>;
    }
}
```

我们可以像下面展示的那样来渲染这个组件：

```xml
<Link href="http://example.com">Some Text</Link>
```

### 解构属性与状态

既然有了 ES6 / ES2015，我们能通过 [结构赋值](https://github.com/lukehoban/es6features#destructuring) 来进一步简化 `<Link>` 组件。

```js
class Link extends Component {
    render({ href, children }) {
        return <a {...{ href, children }} />;
    }
}
```

如果我们想把所有的 `props` 传递进 `<Link>`，我们可以用 [延展符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 来实现：


```js
class Link extends Component {
    render(props) {
        return <a {...props} />;
    }
}
```


### 无状态的函数式组件

最后，我们可以看到这个组件没有 state 
－某些情况下，我们希望传递相同的 props 来渲染组件，并得到相同的结果。无状态的函数式组件往往是最好的选择。无状态的函数式组件只是一种函数，接受 `props` 参数并返回 JSX。


```js
const Link = ({ children, ...props }) => (
    <a {...props}>{ children }</a>
);
```

> *ES2015 注意事项：*上面用到了箭头函数，因为我们在函数主体中用括号替代了花括号，括号中的值会被自动返回。你可以在 [这里](https://github.com/lukehoban/es6features#arrows) 查看更多介绍。
