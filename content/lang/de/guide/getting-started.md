---
name: "Los geht's"
permalink: "/guide/getting-started"
---

# Los geht's

Diese Anleitung zeigt, wie man eine einfache tickende Uhr als Komponente erstellt. Detailliertere Informationen zu jedem Thema können auf den dedizierten Seiten unter dem Anleitungsmenü gefunden werden.

> :information_desk_person: Man [_muss_ nicht ES2015 für Preact benutzen](<https://github.com/developit/preact-without-babel>)... man sollte es aber. Diese Anleitung geht davon aus, dass man eine ES2015-Umgebung mit Babel und/oder Webpack/Browserify/Gulp/Grunt/etc. benutzt. Wenn das nicht der Fall ist, verwende [preact-boilerplate] oder eine [CodePen-Vorlage](http://codepen.io/developit/pen/pgaROe?editors=0010).

--------------------------------------------------------------------------------

## Importiere, was man braucht

Das `preact`-Modul bietet die Option für bestimmte und allgemeine Exporte, man kann also alles unter einem persönlichen Namensraum importieren, oder aber das komplette Paket ansprechen.

**Bestimmt:**

```javascript
import { h, render, Component } from 'preact';

// Weise Babel an, JSX in h()-Aufrufe zu transformieren:
/** @jsx h */
```

**Allgemein:**

```javascript
import preact from 'preact';

// Weise Babel an, JSX in preact.h()-Aufrufe zu transformieren:
/** @jsx preact.h */
```

> Bestimmte Importierungen funktionieren wundervoll mit hochstrukturierten Applikationen, der allgemeine Import ist hingegen schnell und muss niemals aktualisiert werden, sollte man verschiedene Teile der Bibliothek verwenden.


### Globales Pragma

Anstatt das `@jsx`-Pragma im eigenen Code zu deklarieren sollte man es lieber global in einer `.babelrc`-Datei komnfigurieren.

**Bestimmt:**

> **Mit Babel 5 oder niedriger:**

> ```json
> { "jsxPragma": "h" }
> ```

> **Ab Babel 6:**

> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Allgemein:**

> **Für Babel 5 und niedriger:**

> ```json
> { "jsxPragma": "preact.h" }
> ```

> **Ab Babel 6:**

> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

--------------------------------------------------------------------------------

## JSX Rendern

Preact bietet von Grund auf eine `h()`-Funktion, die JSX-Code in VDOM-Elemente _([so funktioniert's](https://jasonformat.com/wtf-is-jsx))_ umwandeln. Es bietet außerdem die `render()`-Funktion an, mit der man einenn DOM-Baum des Virtuellen DOMs erstellt.

Um JSX zu rendern, importiert man diese zwei Funktionen und setzt sie wie folgt ein:

```javascript
import { h, render } from 'preact';

render((
    <div id="foo">
        <span>Hallo Welt!</span>
        <button onClick={ e => alert("hi!") }>Klick mich!</button>
    </div>
), document.body);
```

Dies sollte eigentlich bekannt sein, wenn man bereits mit [hyperscript] oder einem seiner [vielen Freunde](https://github.com/developit/vhtml) gearbeitet hat.

Hyperscript in einem Virtuellen DOM zu Rendern macht allerdings gar keinen Sinn. Da man Komponenten rendern möchte und diese sich aktualisieren sollen, wenn sich Daten ändern, glänzt in diesem Falle die Differenzierung des Virtuellen DOM ganz besonders. :star2:
--------------------------------------------------------------------------------

## Komponente

Preact exportiert eine generische `Komponente`-Klasse, welche zum Erstellen von verkapselten, sich selbst aktualisierenden Teilen einer Benutzeroberfläche erweitert werden kann. Komponenten unterstützt die standartmäßigen React-[Lebenszyklusmethoden] wie z.B. `shouldComponentUpdate()`und `componentWillReceiveProps()`. Das Bereitstellen von spezifischen Implementationen dieser Methoden ist die bevorzugte Vorgehensweise, wenn man kontrollieren will, _wann_ und _wie_ Komponenten sich aktualisieren.

Komponenten haben außerdem eine `render()`-Methode, allerdings erhält diese, anders als in React, `(props, state)` als Argumente. Dies ermöglicht eine ergonomische Vorgehensweise, mit der man `props` und `state` in lokale Variablen destrukturieren kann, die dann von JSX referenziert werden können.

Nachfolgend ist eine simple `Uhr`-Komponente, die die aktuelle Zeit anzeigt.

```javascript
import { h, render, Component } from 'preact';

class Uhr extends Component {
    render() {
        let time = new Date().toLocaleTimeString();
        return <span>{ time }</span>;
    }
}

// Eine Uhr-Instanz in <body> rendern:
render(<Uhr />, document.body);
```

So weit, so gut. Das Ausführen dieser Anweisung generiert die folgende HTML-DOM-Struktur;:

```html
<span>10:28:57 PM</span>
```

--------------------------------------------------------------------------------

## Der Komponentenlebenszyklus

Damit sich die Uhr jede Sekunde aktualisieren kann, muss man wissen, wann `<Uhr>` an das DOM gemounted wird. _Falls man bereits HTML5 Custom Elements benutzt hat, wird einem dies vertraut vorkommen. Es ähnelt sich mit den `attachedCallback`- und `detachedCallback`-Lebenszyklusmethoden._ Falls sie für eine Komponente definiert sind, ruft Preact die folgenden Lebenszyklusmethoden auf:

| Lebenszyklusmethoden        | Wann sie aufgerufen wird                             				 |
|-----------------------------|--------------------------------------------------------------|
| `componentWillMount`        | bevor die Komponente an das DOM eingehanden wird					   |
| `componentDidMount`         | nachdem die Komponente an das DOM eingehanden wird 					 |
| `componentWillUnmount`      | vor dem Entfernen vom  DOM	                      					 |
| `componentWillReceiveProps` | bevor neue props angenommen werden                 					 |
| `shouldComponentUpdate`     | vor `render()`. `false` ausgeben, um Rendern zu überspringen |
| `componentWillUpdate`       | vor `render()`                                               |
| `componentDidUpdate`        | nach `render()`                                  						 |

Gewünscht ist also ein 1-Sekunden-Timer, der startet, sobald die Komponente zum DOM hinzugefügt wird und stoppt, sobald diese vom DOM entfernt wird. Dieser erstellte Timer wird in `componentDidMount` referenziert und mithilfe von `componentWillUnmount` gestoppt. Bei jedem Durchlauf des Timers wird das `state`-Objekt der Komponente mit einem neuen Zeitwert aktualisiert. Dies führt automatisch dazu, dass die Komponente neu gerendert wird.

```javascript
import { h, render, Component } from 'preact';

class Uhr extends Component {
    constructor() {
        super();
        // Initiale Zeit einstellen:
        this.state.time = Date.now();
    }

    componentDidMount() {
        // Zeit jede Sekunde aktualisieren
        this.timer = setInterval(() => {
            this.setState({ time: Date.now() });
        }, 1000);
    }

    componentWillUnmount() {
        // Stoppen, falls nicht renderbar
        clearInterval(this.timer);
    }

    render(props, state) {
        let time = new Date(state.time).toLocaleTimeString();
        return <span>{ time }</span>;
    }
}

// Eine Instanz von Uhr in <body> rendern:
render(<Uhr />, document.body);
```

--------------------------------------------------------------------------------

Das war's! Man hat jetzt eine [tickende Uhr](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/).

[hyperscript]: https://github.com/dominictarr/hyperscript
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
