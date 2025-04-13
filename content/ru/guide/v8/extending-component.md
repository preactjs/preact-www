---
title: Расширение компонентов
---

# Расширение компонентов

Не исключено, что некоторые проекты захотят расширить базовый класс _Component_ дополнительными методами.

Существуют разные мнения о ценности наследования в JavaScript, но если вы хотите создать свой собственный «базовый класс», от которого наследуются все ваши компоненты, Preact позаботится об этом.

Возможно, вы хотите сделать автоматическое подключение к хранилищам/редукторам в рамках Flux-подобной архитектуры. Возможно, вы захотите добавить миксины, основанные на свойствах, чтобы сделать его более похожим на `React.createClass()` _(примечание: предпочтительнее использовать декоратор [`@bind`](https://github.com/developit/decko#bind))_.

В любом случае, просто используйте наследование классов ES2015 для расширения класса `Component` в Preact:

```js
class BoundComponent extends Component {
    // пример: получаем связанные методы
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

Пример использования:

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
    <Link href="http://example.com">Нажми меня</Link>,
    document.body
);
```


Возможности безграничны. Вот расширенный класс `Component`, поддерживающий простейшие миксины:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Сноска:** Стоит отметить, что наследование может привести к хрупким отношениям между родителями и потомками. Часто, когда сталкиваешься с задачей программирования, которую можно адекватно решить с помощью наследования, существует более функциональный способ достижения той же цели, позволяющий избежать создания таких отношений.
