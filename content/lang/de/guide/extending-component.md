---
name: Die Component-Klasse erweitern
permalink: '/guide/extending-component'
---

# Die Component-Klasse erweiter

Es ist denkbar, dass für ein Projekt Component um zusätzliche Funktionen erweitert werden soll.

Es gibt verschiedene Meinungen zum Nutzen von Vererbung in JavaScript, aber falls du deine eigene "Base Class" entwickeln möchtest, von der all deine Komponenten abgeleitet werden, unterstützt dicg Preact dabei.

Vielleicht willst du in einer an Flux angelehnten Architektur automatische Verbindungen zu Stores oder Reducers erstellen. Vielleicht willst du eigenschaftenbasierte Mixins entwickeln, die sich mehr wie `React.createClass()` anfühlen _(Hinweis: der [`@bind` Decorator](https://github.com/developit/decko#bind) ist zu bevorzugen)_.

Nutze in jedem Falle die Klassenvererbung von ES2015, um die `Component`-Klasse von Preact zu erweitern:

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

Beispiel:

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


Die Möglichkeiten sind unbegrenzt. Die folgende erweiterte `Component`-Klasse unterstützt rudimentäre Mixins:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Nachtrag:** Vererbung kann empfindliche Beziehungen zwischen Objekten herbeiführen. Wenn eine Programmieraufgabe mit Hilfe von Vererbung lösbar ist, gibt es oft auch einen funktionaleren Weg, dasselbe Ziel ohne eine solche Beziehung zu erreichen.
