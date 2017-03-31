---
name: Extending Component
permalink: '/guide/extending-component'
---

# 扩展组件

一些项目可能希望继承 Component 去获得额外的能力，在 JavaScript 下面有很多不同的继承，但是如果你想封装或者建一些属于你自己的『基类』，而且可以让你的组件去继承，那么 Preact 能做到这一点。

或者，你想在类 flux 架构中实现对 stores/reducers 的自动连接。又或才你希望添加基于属性的 mixins, 使用它更像 `React.createClass()` (注：更推荐使用 [`@bind` 装饰器](https://github.com/developit/decko#bind))。




在任何情况下，你只需要用 ES6 的类继承去扩展 Preact 的组件类


```js
class BoundComponent extends Component {
    // example: get bound methods 绑定方法
    binds() {
        let list = this.bind || [],
            binds = this._binds;
        if (!binds) {
            binds = this._binds = {};
            for (let i=list.length; i--; ) {
                binds[list[i]] = this[list[i]].bind(this);
            }
        }
        return binds;
    }
}
```

使用案例：

```js
class Link extends BoundComponent {
    bind = ['click'];
    click() {
        open(this.props.href);
    }
    render({ children }) {
        let { click } = this.binds();
        return <span onClick={ click }>{ children }</span>;
    }
}

render(
    <Link href="http://example.com">Click Me</Link>,
    document.body
);
```



有很多的可能性在里面，下面是一个支持混合的扩展类

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---



脚注：
特别要注意的是，继承会把你锁定在父子关系里。通常当面对可以利用继承来充分解决的编程任务时，会有一种更有效的方式来实现你的需求，并且避免这样的父子关系。