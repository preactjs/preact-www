---
name: Kompontente erweitern
permalink: '/guide/extending-component'
---

# Komponente erweitern

Es besteht die Möglichkeit, dass manche Projekte eine Komponente mit zusätzlichen Funktionalitäten erweitern wollen.

Der Stellenwert von Vererbung in JavaScript ist umstritten, wenn man allerdings eine eigene "Basisklasse" erstellen will, von der alle anderen Komponenten erben, ist Preact genau richtig.

Möglicherweise ist das Erstellen von automatischen Verbindungen zu Stores/Reducers in einer Flux-ähnlichen Architektur gewünsht. Vielleicht mag man es auch, Eigentums-basierte Mixins hinzuzufügen, damit es sich mehr wie `React.createClass` anfühlt _(Anmerkung: der [@`bind` decorator](https://github.com/developit/decko#bind) ist bevorzugt)_.

In jedem Fall ist die Klassenvererbbarkeit aus ES2015 anwendbar, um Preacts `Component`-Klasse zu erweitern:

```js
class BoundComponent extends Component {
    // example: Gebundene Methoden erfassen
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

Anwendungsbeispiel:

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
    <Link href="http://example.com">Click mich</Link>,
    document.body
);
```


Die Möglichkeiten sind unendlich. Hier ist eine erweiterte `Component`-Klasse, die rudimentelle Mixins unterstützt:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Fußnote:** Man sollte anmerken, dass Vererbung einen in zerbrechliche parent-child-Beziehungen sperren können. Wenn man auf eine Programmieraufgabe, die adequat mit Vererbung gelöst werden kann, gibt es oftmals einen funktionaleren Weg um das gleiche Ziel zu erreichen, das das Erstellen einer solchen Beziehung unnötig macht.
