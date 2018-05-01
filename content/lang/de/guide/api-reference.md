---
name: API-Referenzierung
permalink: '/guide/api-reference'
---

# API-Referenzierung

## `Preact.Component`

`Component` ist eine Basisklasse, die normalerweise als Subklasse zum Erstellen von kraftvollen Preact-Komponenten verwendet wird.

### `Component.render(props, state)`

Die `render()`-Funktion ist voraussetzend für alle Komponenten. Sie kann die props und states der Komponente inspizieren und sollte ein Preact-Element oder `null` zurückgeben.

```jsx
import { Component } from 'preact';

class MeineKomponente extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

### Lebenszyklusmethoden

> _**Tipp:** Wenn du eigene HTML5-Elemente verwendert hast: diese ähneln sich mit den `attachedCallback`- und `detachedCallback`-Lebenszyklusmethoden._

Preact ruft die nachfolgenden Lebenszyklusmethoden auf, falls sie für eine Komponente definiert sind:

| Lebenszyklusmethoden        | Wann sie aufgerufen wird                             				 |
|-----------------------------|--------------------------------------------------------------|
| `componentWillMount`        | bevor die Komponente an das DOM eingehanden wird					   |
| `componentDidMount`         | nachdem die Komponente an das DOM eingehanden wird 					 |
| `componentWillUnmount`      | vor dem Entfernen vom  DOM	                      					 |
| `componentWillReceiveProps` | bevor neue props angenommen werden                 					 |
| `shouldComponentUpdate`     | vor `render()`. `false` ausgeben, um Rendern zu überspringen |
| `componentWillUpdate`       | vor `render()`                                               |
| `componentDidUpdate`        | nach `render()`                                  						 |

Alle Lebenszyklusmethoden und ihre Parameter werden in der folgenden Beispielkomponente angezeigt:

```js
import { Component } from 'preact';

class MeineKomponente extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentWillMount() {}
	componentDidMount() {}
	componentDidUpdate() {}
	componentWillUnmount() {
		this.props // Current props
		this.state // Current state
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Rendere eine Preact-Komponente in den `containerNode` DOM-Knoten. Gibt eine Referenz zum gerenderten DOM-Knoten aus.

Wenn der optionale `replaceNode` DOM-Knoten gegeben ist und ein Child von `containerNode` ist, wird Preact dieses Element aktualisieren oder mit seinem Differenzierungsalgorithmus ersetzen. Andernfalls wird Preact das gerenderte Element zu `containerNode` hinzufügen.

```js
import { render } from 'preact';

// Diese Beispiele zeigen, wie sich render() in einer Seite mit folgendem Inhalt verhält:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MeineKomponente, container);
// MeineKomponente zu Container hinzufügen
//
// <div id="container">
//   <h1>My App</h1>
//   <MeineKomponente />
// </div>

const existingNode = container.querySelector('h1');

render(MeineKomponente, container, existingNode);
// MeineKomponente gegen <h1>Meine App</h1> differenzieren
//
// <div id="container">
//   <MeineKomponente />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Gibt ein Preact Virtual DOM-Element mit den gegebenen `Attributen` wieder.

Alle verbleibenden Argumente werden in einem `Children`-Array gesammelt. Dies können folgende Argumente sein:

- Skalarwerte (string, number, boolean, null, undefined, etc)
- Weitere Virtual DOM-Elemente
- Grenzenlos verschachtelte Arrays der oberen Fälle

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hallo!');
// <div id="foo">Hallo!</div>

h('div', { id: 'foo' }, 'Hallo', null, ['Preact!']);
// <div id="foo">Hallo Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hallo!')
);
// <div id="foo"><span>Hallo!</span></div>
```
