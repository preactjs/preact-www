---
name: Schnelleinstieg
permalink: '/guide/getting-started'
---

# Schnelleinstieg

Diese Anleitung erläutert Schritt für Schritt die Entwicklung einer Komponente für die Darstellung der Uhrzeit. Detaillierte Informationen zu jedem Thema findest du im Menü unter "Guide".


> :information_desk_person: Du [_musst nicht_ zwingend ES2015 nutzen, um  Preact einzusetzen](https://github.com/developit/preact-without-babel)... aber du solltest es. Diese Anleitung geht dvon aus, dass du bereits eine ES2015-Umgebung mit Babel und/oder Webpack/Browserify/Gulp/Grunt/etc. aufgesetzt hast. Falls nicht, starte mit [preact-boilerplate] oder einem [CodePen Template](http://codepen.io/developit/pen/pgaROe?editors=0010).


---


## Importiere, was du brauchst

Das `preact`-Modul stellt benannte und Standard-Exports bereit, so dass du entweder alles im Namespace oder nur das, was du benötigst als lokale Objekte importieren kannst:

**Benannt:**

```js
import { h, render, Component } from 'preact';

// Babel anweisen, JSX in h()-Aufrufe zu transformieren:
/** @jsx h */
```

**Standard:**

```js
import preact from 'preact';

// Babel anweisen, JSX in preact.h()-Aufrufe zu transformieren:
/** @jsx preact.h */
```

> Benannte Importe eignen sich für höher strukturierte Anwendungen, wohingegen der Standard-Import einfach ist und nicht angepasst werden muss, wenn du irgendwann andere Teile der Library nutzen möchtest.

### Globales Pragma

Statt die `@jsx`-Anweisung in deinem Code zu deklarieren, empfiehlt es sich, dies global in der `.babelrc`-Datei zu tun.

**Benannt:**
>**Für Babel 5 und früher:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Für Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Standard:**
>**Für Babel 5 und früher:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Für Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## JSX rendern

Preact stellt eine `h()`-Funktion bereit, die JSX in Virtual DOM-Elemente umwandelt _([So funktioniert's](http://jasonformat.com/wtf-is-jsx))_. Zusätzlich verfügt Preact über eine `render()`-Funktion, die einen DOM-Baum aus diesem Virtual DOM erzeugt.

Um JSX zu rendern, import diese beiden Funktionen und verwende sie wie folgt:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hallo Welt!</span>
		<button onClick={ e => alert("hi!") }>Klick mich</button>
	</div>
), document.body);
```

Diese Vorgehensweise sollte vertraut wirken, wenn du bereits mit [hyperscript] oder einem [ähnlichen Ansatz](https://github.com/developit/vhtml) gearbeitet hast.

hyperscript mit einem Virtual DOM zu rendern, ist jedoch wenig sinnvoll. Wir wollen Komponenten ausgeben und diese aktualisieren, wenn sich Daten ändern, und genau hierfür ist das Virtual DOM prädestiniert. :star2:


---


## Komponenten

Preact exportiert eine generische `Component`-Klasse, die erweitert werden kann, um gekapselte, selbst-aktualisierende Teile eines User Interfaces zu entwickeln. Komponenten unterstützen alle [Lifecycle-Methoden] von React wie `shouldComponentUpdate()` und `componentWillReceiveProps()`.  Speifische Implementierungen dieser Methoden ist der bevorzugte Weg zur Steuerung _wann_ and _wo_ Komponenten aktualisiert werden sollen.

Komponenten verfügen ebenfalls über eine `render()`-Methode. Anders als bei React wird dieser Methode jedoch zusätzlich `(props, state)` als Argumente übergeben. Damit kann auf `props` und `state` als lokale Variablen zugegriffen und in JSX referenziert werden.

Eine beispielhafte, sehr einfache `Uhrzeit`-Komponente soll diese Prinzipien zeigen:

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// Uhrzeit-Komponente im <body> ausgeben:
render(<Clock />, document.body);
```


Und damit wird folgende HTML DOM-Struktur erzeugt:

```html
<span>10:28:57 PM</span>
```


---


## Der Lebenszyklus der Komponenten

Damit die Uhrzeit in der Komponente jede Sekunde aktualisiert wird, müssen wir zunächst wissen, wann `<Clock>` im DOM erstmalig erstellt oder "gemountet" wird. _Falls du bereits mit HTML5-Custom Elements vertraut bist, ist dies vergleichbar mit den Lifecycle-Methoden `attachedCallback` und `detachedCallback`._ Preact ruft die folgenden Lebenszyklus-Methoden auf, sofern diese für eine Komponente definiert sind:

| Lifecycle-Methode        | Wann sie aufgerufen wird                         |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | bevor die Komponente im DOM gemountet wird       |
| `componentDidMount`         | nachdem die Komponente im DOM gemountet wurde    |
| `componentWillUnmount`      | bevor sie aus dem DOM entfernt wird              |
| `componentDidUnmount`       | nachdem sie aus dem DOM entfernt wird            |
| `componentWillReceiveProps` | bevor neue Eigenschaften (Props) übergeben werden|
| `shouldComponentUpdate`     | vor `render()`. `false` übergeben, um nicht zu rendern |
| `componentWillUpdate`       | vor `render()`                                   |
| `componentDidUpdate`        | nach `render()`                                  |


Die Uhrzeit-Komponente muss jede Sekunde aktualisiert werden, nachdem sie dem DOM hinzugefügt wurde, und die Aktualisierung angehalten werden, sobald die Komponente entfernt wird.
Der Timer und eine Referenz auf ihn wird in `componentDidMount` erstellt. In `componentWillUnmount` wird der Timer gestoppt. Bei jeder Aktualisierung des Timers soll auch das `state`-Objekt der Komponente mit einem neuen Wert aktualisiert werden. Dadurch wird die Komponente automatisch neu gerendert.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// Startzeit setzen:
		this.state.time = Date.now();
	}

	componentDidMount() {
		// Uhrzeit jede Sekunde aktualisieren
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// Aktualisierung der Zeit stoppen, wenn die Komponente nicht mehr ausgegeben wird
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// Uhrzeit-Komponente im <body> ausgeben:
render(<Clock />, document.body);
```


---


Und damit haben wir [eine dynamisch aktualisierte Uhrzeit](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!



[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
