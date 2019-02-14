---
name: Verlinkter State
permalink: '/guide/linked-state'
---

# Verlinkter State

Ein Bereich, den Preact ausführlicher als React behandelt ist das Optimieren der Änderungen von States. Ein gängiges Schema in ES2015-React-Code ist das Benutzen von Arrow-Funktionen innerhalb einer `render()`-Methode, um States im Falle eines Ereignisses zu aktualisieren. Funktionen, die nur innerhalb einer einzelnen Render-Instanz leben ist ineffizient und zwingt den Garbage Collector dazu, deutlich mehr Arbeit als nötig wäre zu verrichten.


## Der schönere, manuelle Weg

Eine Lösung beinhaltet das Definieren von gebundenen Komponentenmethoden mithilfe von ES7-Klassen-Properties ([class instance fields](https://github.com(jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Während dies zu deutlich besseren Laufzeitleistungen führt, beinhaltet dieser Ansatz immer noch eine Menge unnötigen Code, der gebraucht wird, um State und UI zu verbinden.

> Ein anderer Ansatuz wäre es, Komponentenmethoden mithilfe von ES7-Decorators  _deklarativ_ anzubinden. Ein Beispiel hierfür wäre [decko's](http://git.io/decko) `@bind`:


## Verlinkter State eilt zur Rettung

Glücklicherweise gibt es eine Lösung in Form von Preacts [`linkState`](https://github.com/developit/linkstate)-Modul.

> Frühere Versionen von Preact hatten die `linkState()`-Funktion bereits von Grund auf eingebaut, sie wurde mittlerweile aber in ein seperates Modul verschoben. Wenn man zum alten Verhalten zurückwechseln möchte, findet man auf [dieser Seite](https://github.com/developit/linkstate#usage) Informationen zur Anwendung dieses Polyfills.

Das Aufrufen von `linkState(this, 'text')` gibt eine Handler-Funktion aus, die, falls an diese ein Ereignis weitergegeben wird, seinen zugewiesen Wert zum Aktualisieren der bestimmten Property des States der Komponente benutzt. Mehrere Aufrufe an `linkState(component, name)` mit der selben `component` und `name` werde gecached, sodass man nicht mit Leistungseinbuße rechnen muss.

Nachfolgend ist das genannte Beispiel mithilfe von **Verlinkten State**:

```js
import linkState from 'linkstate';

class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```

Dieses Vorgehen ist präzise, einfach zu verstehen und effektiv. Es verarbeitet verlinkte States jedes Eingabetypus. Ein optionales, drittes Argument `'path'` kann verwendet werden, um einen Punkt-notierten Keypath dem neuen State-Wert für zusätzliche, eigene Bindings (z.B. Anbinden an den Wert einer Dritttanbieterkomponente) explizit bereitzustellen.


## Eigene Ereignispfade

Standartmäßig wird `linkState()`versuchen, den passenden Wert eines Ereignisses automatisch er ermitteln. Ein `<input>`-Element wird beispielsweise, je nach Eingabetyp, die gegebene State-Property zu `event.target.value` bzw. `event.target.checked` setzen. Die meisten eigenen Ereignis-Handler funktionieren so, dass das Weitergeben von Skalarwerte zum von `linkState()` generierten Handler einfach diesen gegebenen Skalarwert verwendet. Dieses Verhalten ist in den meisten Fällen erwünscht.

Es gibt auch Fälle, in den dieses Verhalten nicht wünschenswert ist. Eigene Ereignisse und gruppierte Radio Buttons sind zwei Beispiele. In diesen Fällen kann ein drittes Argument an `linkState()` weitergegeben werden, um Punkt-notierte Keypaths innerhalb des Ereignisses, in dem der Wert gefunden werden kann, zu spezifizieren.

Um diese Funktion verstehen zu können, ist es nützlich, einen Blick unter die Haube von `linkState()` zu werfen. Der nachfolgende Teil illustriert einen manuell erstellten Ereignis-Handler, der einen Wert vom Inneren eines Ereignisobjektes in State schreibt. Dieses Verhalten ist funktional equivalent zur `linkState()`-Version, beinhaltet allerdings nicht die Memoisationsoptimierung, die `linkState()` so wertvoll macht.

```js
// Dieser von linkState zurückgegebene Handler:
handler = linkState(this, 'thing', 'foo.bar');

// ...ist funktional equivalent zu:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Illustration: Gruppierte Radio Buttons

Der nachfolgende Code funktioniert nicht wie zuerst erwartet. Wenn der Nutzer "no" anklickt, wird `noChecked` zwar zu `true`, `yesChecked` bleibt aber auch `true`, da `onChange` nicht bei den anderen Radio Buttons ausgelöst wird:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```



`linkState`s drittes Argument hilft hier weiter. Man kann einen hiermit einen Pfad im Ererignisobjekt als verlinkten Wert verwenden. Wenn man nun auf das vorherige Beispiel eingeht, kann man linkState explizit befehlen, seinen State-Wert von der `value`-Property aus `event.target` zu beziehen:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Nun funktioniert das Beispiel wie erwartet!
