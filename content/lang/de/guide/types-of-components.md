---
name: Komponententypen
permalink: '/guide/types-of-components'
---

# Komponententypen


Es gibt zwei Arten von Komponenten in Preact:

- Klassische Komponenten mit [Lebenszyklusmethoden] und State
- State-lose, funktionale Komponenten, welche Funktionen sind, die `props` akzeptieren und [JSX] ausgeben.

Innerhalb dieser zwei Typen gibt es außerdem viele verscheidene Wege, Komponenten zu implementieren.


## Beispiel

 Hier ein Beispiel: Eine einfache `<Link>`-Komponente, die ein ein HTML-`<a>`-Element erstellt:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Die Komponente kann wie folgt instanziert/gerendert werden:

```xml
<Link href="http://example.com">Irgendein Text</Link>
```


### Props & State destrukturieren

Da dies in ES6/ES2015 lebt, kann man die `<Link>`-Komponente weiter vereinfachen, indem man Schlüssel von `props` (das erste `render()`-Argument) lokalen Variablen mithilfe von [destructuring](https://github.com/lukehoban/es6features#destructuring) zuweist:

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Falls man _alle_ `props` der `<Link>`-Komponente in ein `<a>`-Element kopieren möchte, kann man den [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) verwenden:

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### State-lose funktionale Komponenten

Zu guter Letzt kann man sehen, dass diese Komponente keinen State hat. Man kann die Komponente mit den selben props rendern und bekommt jedes Mal das gleiche Resulat. Wenn dies der Fall ist, ist die Nutzung von State-losen funktionalen Komponenten empfohlen. Diese sind lediglich Funktionen, die `props` als Argumente annehmen und JSX ausgeben.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *ES2015-Anmerkung:* Das Obengenannte ist eine Arrow-Funktion. Da Parens, oder auch ()-Klammern, statt Braces, oder auch {}-Klammern, für den Funktionskörper verwendet wurden, wird der Wert innerhalb der Parens automatisch zurückgegeben. [Hier](https://github.com/likehoban/es6features#arrow) kann man mehr darüber erfahren.
