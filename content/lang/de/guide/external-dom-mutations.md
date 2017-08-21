---
name: Externe DOM-Mutationen
permalink: '/guide/external-dom-mutations'
---

# Externe DOM-Mutationen


## Übersicht

In manchen Fällen soll ein Projekt auch eine Library nutzen, die das DOM frei verändert, State darin persistiert oder auch gar keine Komponenten-Grenzen hat. Viele UI-Toolkits oder wiederverwendbare Elemente funktionieren auf diese Weise. In Preact (wie in React auch) muss dabei dem Virtual DOM-Renderingalgorithmus mitgeteilt werden, dass dieser nicht versuchen darf, etwaige externe DOM-Mutationen an einer Komponente (oder dem DOM-Element, die sie repräsentiert)_rückgängig zu machen_.


## Vorgehensweise

Dies kann erreicht werden, in eine Methode `shouldComponentUpdate()` in deiner Komponente definiert wird und diese `false` zurückliefern zu lassen:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... oder kurz:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Mit diesem Lifecycle-Hook und der Anweisung an Preact, die Komponente bei Veränderungen im VDOM-Baum nicht neu zu rendern, hat deine Komponente nun eine Referenz auf ein Root-DOM-Element, das als statisch behandelt wird, bis die Komponente entfernt wird. Wie bei jeder Komponente wird diese Referenz einfach `this.base` genannt und korrespondiert zum Root-JSX-Element, das von der `render()`-Methode zurückgeliefert wurde.

---

## Beispielhafter Ablauf

Das folgende Beispiel zeigt, wie das Neurendern einer Komponente "abgeschaltet" wird. Es sei darauf hingewiesen, dass `render()` nach wie vor aufgerufen wird, wenn die Komponente erstellt und gemountet wird, um seine anfängliche DOM-Struktur zu generieren.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // Nicht per Diff neu rendern:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // Hier kannst du auf die übergebenen Props zugreifen und diese nach Bedarf verändern
  }

  componentDidMount() {
    // Die Komponente wurde gemountet und kann nun das DOM verändern:
    let thing = document.createElement('beispielhaftes-Element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // Die Komponente wird im Anschluss aus dem DOM entfernt, notwendige Aufräumarbeiten ausführen.
  }

  render() {
    return <div class="beispiel" />;
  }
}
```


## Demonstration

[![Demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Betrachte diese Demo bei Webpackbin**](http://www.webpackbin.com/V1hyNQbpe)


## Fallbeispiele

Betrachte auch diese Technik hier im Einsatz: [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - das Beispiel verwendet eine Komponente, um sich im DOM zu verankern, deaktiviert aber Updates und überlässt die weiteren Schritte dann [tags-input](https://github.com/developit/tags-input) Ein komplexeres Beispiel zeigt [preact-richtextarea](https://github.com/developit/preact-richtextarea), das diese Methode nutzt, um ein Neurendern eines bearbeitbaren `<iframe>` zu verhindern.
