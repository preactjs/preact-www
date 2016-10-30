---
name: Extending Component
permalink: '/guide/extending-component'
---

# Extending Component
扩展的组件

It is possible that some projects would wish to extend Component with additional functionality.

There are varying opinions on the value of inheritance in JavaScript, but if you wish to build your own "base class" from which all of your components inherit, Preact has you covered.

Perhaps you want to do automatic connection to stores/reducers within a Flux-like architecture. Maybe you want to add property-based mixins to make it feel more like `React.createClass()` _(note: the [`@bind` decorator](https://github.com/developit/decko#bind) is preferable)_.


我们平时在做项目的时候可以需要用到其他额外的组件，在JavaScript下面有很多不同的继承，但是如果你想封装或者建一些属于你自己的“基类”，而且可以让你的组件去继承，那么Preact能做到这一点。
或者甚至说想在你自己用flux作为架构的项目中，自动连接和添加一些混合基础属性如React.createClass()（注意：建议使用@bind decorator）。


In any case, just use ES2015 class inheritance to extend Preact's `Component` class:
在很多情况下，你只需要用ES6的类继承去扩展Preact的组件类


```js
class BoundComponent extends Component {
    // example: get bound methods绑定方法
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

Example Usage:实例

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


The possibilities are endless. Here's an extended `Component` class that supports rudimentary mixins:
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

> **Footnote:** It's worth noting that inheritance can lock you into brittle parent-child relationships. Often when faced with a programming task that can be solved adequately with inheritance, there is a more functional way to achieve the same goal that would avoid creating such a relationship.

脚注：
特别要注意的是，继承会把你锁定在父子关系里。 通常当面对可以利用继承来充分解决的编程任务时，会有一种更有效的方式来实现并且避免在这样的父子关系里面，都可以到达到你的需求。
