---
name: Наследование компонентов
permalink: '/guide/extending-component'
---

# Наследование компонентов

В некотоных проектах может быть удобно расширить функциональность класса Component.

Нет единого мнения по поводу того, стоит ли использовать наследование классов в JavaScript, но если вы хотите создать собственный "базовый класс", от которого будут наследоваться все ваши компоненты, Preact поддерживает такую схему.

Может, вы хотите автоматически подключаться к stores и reducers в Flux-like архитектуре. Может, вы хотите добавить property-based миксины, чтобы было более схоже с `React.createClass()` _(впрочем, [декоратор `@bind`](https://github.com/developit/decko#bind) в последнем случае всё же предпочтительнее)_.

В любом случае, просто используйте обычное наследование классов, чтобы расширить `Component`:

```js
class BoundComponent extends Component {
    // пример: получить bound methods
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

Использование:

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


Возможности безграничны. Например, вот расширенный класс `Component`, который поддерживает произвольные миксины:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Примечание:** Стоит заметить, что наследование может ... хрупкие отношения «родитель — ребёнок». Часто задачи, которые можно решить при помощи наследования, можно решить и в более функциональном стиле, чтобы избежать таких отношений.
