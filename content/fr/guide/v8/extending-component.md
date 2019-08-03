---
name: Étendre le composant de base
permalink: '/guide/extending-component'
---

# Étendre le composant de base

Il est possible que certains projets souhaitent étendre `Component` avec des fonctionnalités additionelles.

Il existe différents avis sur l'héritage en JavaScript, mais si vous souhaitez créer votre propre classe de base dont tous vos composants hériteront, Preact a tout prévu.

Peut-être que vous voulez vous connecter automatiquement à des stores ou des reducers dans le cas d'une architecture de type Flux. Peut-être que vous souhaitez ajouter des mixins basés sur les propriétés pour que cela ressemble plus à `React.createClass()` _(note : le [décorateur `@bind`](https://github.com/developit/decko#bind) est préférable)_.

Dans tous les cas, utilisez simplement l'héritage de ES2015 pour étendre la classe `Component` de Preact :

```js
class BoundComponent extends Component {
    // exemple : récupérer les méthodes liées
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
Exemple d'utilisation :

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

Les possibilités sont infinies. Voici une classe qui étend `Component` et supporte des mixins rudimentaires :

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Note :** il est important de noter que l'héritage peut vous bloquer dans une relation parent-enfant fragile. Souvent, lorsque vous êtes face à une tâche que peut être résolué par l'héritage, il y a une façon plus fonctionnelles de faire la même chose, qui vous permettra de créer une telle relation.
