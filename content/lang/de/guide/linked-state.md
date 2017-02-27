---
name: Linked State
permalink: '/guide/linked-state'
---

# Linked State

Diese Dokumentation verwendet den in React gängigen Begriff Linked State für das Binding von State (dem Zustand einer Komponente). Preact geht einen Schritt weiter als React was die Optimierung von State-Veränderungen betrifft. Eine gängige Vorgehensweise mit ES2015-React-Code ist die Nutzung von Pfeilfunktionen (Arrow) innerhalb einer `render()`-Methode, um ihren Zustand in Abhängigkeit von Events zu aktualisieren. Das Erstellen von Funktionen innerhalb eines Scopes bei jedem Rendering ist ineffizient und verlangt der Garbage Collection mehr zu leistende Arbeit als nötig ab.

## Der schönere manuelle Weg

Eine Lösung besteht darin, gebundene Komponenten-Methoden mittels ES7-Klasseneigenschaften ([class instance fields](https://github.com/jeffmo/es-class-fields-and-static-properties)) zu deklarieren:

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

Obwohl damit bereits eine deutlich bessere Performance erreicht wird, erfordert dies immer noch viel unnötigen Code, um den Zustand des UI zu steuern.

> Eine andere Lösung wäre, die Komponentenmethoden _deklarativ_ mittels ES7-Dekoratoren zu binden, z.B. mittels [decko's](http://git.io/decko) `@bind`:


## Linked State ist die Lösung

Glücklicherweise stellt preact mit `linkState()` eine Lösung zur Verfügung, die als Methode der `Component`-Klasse bereitsteht.

Der Aufruf von `.linkState('text')` liefert eine Handler-Funktion zurück, der ein Event übergeben wird und die dann den verknüpften Wert nutzt, um die benannte Eigenschaft im Zustand der Komponente zu verwenden. Mehrfache Aufrufe von `linkState(name)` mit demselben `name` werden gecachet, so dass keine Performance-Nachteile entstehen.

Hier das obige Beispiel noch einmal mit **Linked State**:

```js
class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={this.linkState('text')} />;
	}
}
```

Dies ist viel klarer, leicht zu verstehen und effektiv und steuert verknüpfte Zustände von jeder Art von Eingabe. Ein optionales zweites Argument `'path'` kann genutzt werden, um einen mit Punkten verknüpften Pfad zum neuen Zustandswert zu liefern, der dann bei weiteren Bindings (z.B. den Werten von Drittanbieter-Komponenten) verwendet werden kann.


## Eigene Event-Pfade

Standardmäßig versucht `linkState()`, den passenden Wert aus einem Event selbst zu beziehen. Beispielsweise könnte ein `<input>`-Element die übergebene Zustandseigenschaft als `event.target.value` oder `event.target.checked` je nach Typ des der Eingabe setzen. Bei eigenen Event-Handlern werden an den von `linkState()` generierten Handler übergebene skalare Werte einfach auch als skalare Werte verwendet. In den meisten Fällen ist dies auch wünschenswert.

Es gibt jedoch auch andere Fälle – z.B. eigene Events oder gruppierte Radio-Buttons. Hier kann ein zweites Argument an `linkState()` übergeben werden, um den mit Punkten verknüpften Pfad zu übergeben, über den auf den Wert zugegriffen werden kann.

Zur besseren Verständlichkeit werfen wir einen Blick unter die Haube von `linkState()`. Im folgenden Beispiel wird ein manuell erstellter Event-Handler gezeigt, der einen Wert aus dem Event im Zustand persistiert. Es ist funktional gleichwertig zur Version mit `linkState()`, enthält jedoch nicht die Zwischenspeicher-Optimierung, die `linkState()` so wertvoll macht.

```js
// Der Handler, der von linkState zurückgeliefert wird:
handler = this.linkState('thing', 'foo.bar');

// ...ist dasselbe wie:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Beispiel: Gruppierte Radio-Buttons

Der folgende Code bringt nicht das gewünschte Ergebnis. Wenn der Benutzer auf "Nein" klickt, wird `noChecked` auf `true` gesetzt, aber `yesChecked` bleibt `true`, weil das `onChange`-Event nicht beim anderen Radiobutton ausgelöst wird:

```js
class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={this.linkState('Ja')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={this.linkState('Nein')}
        />
      </div>
    );
  }
}
```


Das zweite Argument von `linkState` hilft hier. Darin kann ein Pfad übergeben werden, der als verknüpfter Wert genutzt werden kann. Im Vergleich zum vorherigen Beispiel wird linkState explizit angewiesen, seinen neuen Zustandswert aus der Eigenschaft `value` von `event.target` zu beziehen:

```js
class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'Ja'}
          onChange={this.linkState('answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'nein'}
          onChange={this.linkState('answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Nun funktioniert das Beispiel wie erwartet.
