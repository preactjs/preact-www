---
name: Komponententypen
permalink: '/guide/types-of-components'
---

# Komponententypen


Es gibt zwei Typen von Komponenten in Preact:

- Klassische Komponenten mit [Lifecycle-Methods] und State
- Zustandlose funktionale Komponenten mit Funktionen, die `props` akzeptieren und [JSX] zurückliefern.

Diese beiden Typen unterscheiden sich darin, wie Komponenten implementiert werden.


## Beispiel

Eine einfache `<Link>`-Komponente, die ein HTML-Element `<a>` bereitstellt:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Diese Komponenten kann wie folgt instanziiert/gerendert werden:

```xml
<Link href="http://example.com">Some Text</Link>
```


### Props & State destrukturieren

Da wir mit ES6 / ES2015 arbeiten, können wir die `<Link>`-Komponente weiter vereinfachen, indem wir Schlüssel aus `props` (dem ersten Argument für `render()`) mittels [Destrukturierung](https://github.com/lukehoban/es6features#destructuring) in lokale Variablen überführen:

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Wollten wir _alle_ `props`, die an die `<Link>`-Komponente übergeben wurden, im `<a>`-Element ausgeben, können wir den [Spread-Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) verwenden:

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Zustandslose funktionale Komponenten

Schließlich können wir auch betrachten, dass diese Komponente über keinen Zustand (State) verfügt - die Komponente wir mit denselben Eigenschaften immer dasselbe Ergebnis zurückliefern. In diesem Falle ist es am besten, sie als zustandslose funktionale Komponenten zu implementieren. Es handelt sich dabei um Funktionen, die `props` als Argument akzeptieren und JSX zurückliefern.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *Hinweis zu ES2015:* Oben wird eine Arrow-Funktion eingesetzt, und weil wir runde (parens) statt geschweifter  Klammern (brackets) für die Funktion verwenden, wird der Wert in den Klammern automatisch zurückgeliefert. Mehr dazu erfährst du [hier](https://github.com/lukehoban/es6features#arrows).
