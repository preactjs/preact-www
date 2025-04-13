---
title: Externe DOM-Mutationen
---

# Externe DOM-Mutationen

---

<toc></toc>

---

## Übersicht

Manchmal ist es nötig, mit Drittanbieterbibliotheken zu arbeiten, die erwarten, frei im DOM mutieren zu können, in einem Stadium zu verharren oder überhaupt gar keine Komponentengrenzen zu haben. Es gibt viele großartige UI-Toolkits und wiederverwendbare Elemente, die so funktionieren. In Preact, ähnlich wie auch React, setzt das Arbeiten mit diesen Bibliotheken voraus, dass man dem Rendering oder der Differenzierungsalgorithmus des Virtual DOM befiehlt, keine externen DOM-Mutationen innerhalb einer bestimmten Komponente (oder seinem  DOM-Element) _rückgängig_ zu machen.


## Technik

Dies funktioniert ganz einfach indem man eine `shouldComponentUpdate()`-Methode in einer Komponente definiert und diese `false` zurückgeben lässt.

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... oder in Kurzform:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Mit diesem Eingriff in den Lebenszyklus und der Anweisung an Preact, die Komponente nicht zu rendern, wenn sich etwas im VDOM-Baum ändert, hat die Komponente nun eine Referenz in seinem DOM-Stammelement, das solange als statisch angesehen werden kann, bis die Komponente unmounted ist. Genau wie bei jeder Komponente wird diese Referenz einfach `this.base` genannt. Sie korrespondiert mit dem JSX-Stammelement, das von `render()` zurückgegeben wurde.

## Beispieldurchlauf

Hier wird beispielhaft gezeigt, wie das Rerendern einer Komponente "ausgeschaltet" wird. Es muss beachtet werden, dass `render()` immer noch im Zuge von Erstellung und Mounten der Komponente aufgerufen wird, damit seine ursprüngliche DOM-Struktur generiert werden kann.

```js
class Beispiel extends Component {
  shouldComponentUpdate() {
    // Nicht via diff rerendern:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // Irgendetwas mit eingehenden props kann hier erledigt werden, falls benötigt
  }

  componentDidMount() {
    // jetzt gemounted, kann das DOM frei modifizieren:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // Komponente ist kurz davor, vom DOM entfernt zu werden. Aufräumarbeiten sind hier möglich.
  }

  render() {
    return <div class="beispiel" />;
  }
}
```


## Beispiele aus der realen Welt

Alternativ kann diese Technik bei [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) im Einsatz bewundert werden - es benutzt eine Komponente als Halt im DOM, umgeht aber Aktualisierungen und lässt [tags-input](https://github.com/developit/tags-input) von dort aus übernehmen. Ein komplexeres Beispiel wäre [preact-richtextarea](https://github.com/developit/preact-richtextarea). Es benutzt diese Technik, um das Rerendern eines bearbeitbaren `<iframe>`-Elementes zu umgehen.
