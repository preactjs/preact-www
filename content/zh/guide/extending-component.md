---
name: Extending Component
permalink: '/guide/extending-component'
---

# Extending Component

It is possible that some projects would wish to extend Component with additional functionality.

There are varying opinions on the value of inheritance in JavaScript, but if you wish to build your own "base class" from which all of your components inherit, Preact has you covered.

Perhaps you want to do automatic connection to stores/reducers within a Flux-like architecture. Maybe you want to add property-based mixins to make it feel more like `React.createClass()` _(note: the [`@bind` decorator](https://github.com/developit/decko#bind) is preferable)_.

In any case, just use ES2015 class inheritance to extend Preact's `Component` class:

```js
class BoundComponent extends Component {
    // example: get bound methods
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

Example Usage:

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
