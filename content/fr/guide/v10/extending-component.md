---
name: Extending Component
permalink: '/guide/extending-component'
---

# Étendre un Composant

Il est possible que certain projets souhaitent étendre les fonctionnalités de base d'un Composant.

Il y a de différentes opinions sur la valeur ajouté de l'héritage en Javascript, mais si vous souhaitez créer vos propres "base class" desquels tous vous composants héritent, Preact vous permet de le faire.

Peut être que vous voulez une connection automatique avec des stores/reducers dans une architecture "Flux". Peut être que vous souhaitez ajouter des mixins basés sur des propriétés pour avoir quelque chose qui ressemble plus à `React.createClass()` _(note: le [décorateur `@bind`](https://github.com/developit/decko#bind) est préférable_)

Dans tous les cas, juste utiliser un héritage de class ES2015 pour étendre une class Composant Preact :

```js
class BoundComponent extends Component {
    // example: récupère les méthodes liés
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

Les possibilités sont infinis. Il y a un class `Component` étendu qui supporte les mixins rudimentaires:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Note de bas de page:** Il est intéressant de noter que l'héritage peut vous verrouiller dans des relations fragiles "enfant-parent". Souvent lorsque nous faisons face à un problème qui peut être résolu avec un paradigme objet peut aussi l'être avec une façon plus fonctionnel sans avoir à créer ce genre de relation.
