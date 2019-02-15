---
name: Externe DOM-Mutationen
permalink: '/guide/external-dom-mutations'
---

# Externe DOM-Mutationen


## Übersicht

Manchmal ist es nötig, mit Drittanbieterbibliotheken zu arbeiten, die erwarten, frei im DOM mutieren zu können, in einem Stadium zu verharren oder überhaupt gar keine Komponentengrenzen zu haben. Es gibt viele großartige UI-Toolkits oder wiederverwendbare Elemente, die so funktionieren. In Preact, ähnlich wie in React, setzt das Arbeiten mit diesen Bibliotheken voraus, dass man dem Rendering oder der Differenzierungsalgorithmus des Virtual DOM befield, keine externen DOM-Mutationen, die innerhalb einer gegebenen Komponente (oder dem DOM-Element, dass es repräsentiert), _zückgängig_ zu machen.


## Technik

Dies funktioniert ganz einfach indem man eine `shouldComponentUpdate()`-Methode in einer Komponente definiert und diese auffordert, `false` zurückzugeben.

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

Mit diesem Lebenszyklus an Ort und Stelle und der Anweisung an Preact, die Komponente nicht zu rendern, wenn sich etwas im VDOM-Baum ändert, hat die Komponente nun eine Referenz in seinem DOM-Stammelement, das solange als statisch angesehen werden kann, bis die Komponente unmounted ist. Genau wie bei jeder Komponente wird diese Referenz einfach `this.base` genannt. Sie korrespondiert mit dem JSX-Stammelement, das von `render()` zurückgegeben wurde.
---

## Beispielsdurchlauf

Hier wird beispielhaft gezeigt, wie das Rerendern einer Komponente "ausgeschaltet" wird. Es muss beachtet wirden, dass `render()` immer noch im Zuge von Erstellung und Mounten der Komponente aufgerufen ist, damit seine ursprüngliche DOM-Struktur generiert werden kann.

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


## Demonstration

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Schau die Demo auf Webpackbin an**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Beispiele aus der realen Welt

Alternativ kann diese Technik bei [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) im Einsatz bewundert werden - es benutzt eine Komponente als Halt im DOM, umgeht aber Aktualisierungen und lässt [tags-input](https://github.com/developit/tags-input) von dort aus übernehmen. Ein komplexeres Beispiel wäre [preact-richtextarea](https://github.com/developit/preact-richtextarea). Es benutzt diese Technik, um das Rerendern eines editierbaren `<iframe>`-Element zu umgehen.
