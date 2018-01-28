---
name: Unterschiede zu React
permalink: '/guide/differences-to-react'
---

# Unterschiede zu React

Preact selbst soll keine Neuimplementation von React sein. Es gibt durchaus Unterschiede. Viele dieser Unterschiede sind trivial oder können mit der Nutzung von [preact-compat] komplett entfernt werden. Preact-compat ist eine dünne Schicht, die über Preact liegt und versucht, die 100%ige Kompatibilität mit React herzustellen.

Preact ist nicht darauf ausgelegt, jede einzelne Funktion von React zu übernehmen, um **klein** und **fokussiert** zu bleiben - andernfalls würde es mehr Sinn ergeben, simple Optimierungen für das React-Projekt, welches bereits über eine sehr komplexe und gut architektierte Codebasis verfügt, einzureichen.


## Versionenkompatibilität

Für Preact und [preact-compat] gilt: Versionenkompatibilit wird gegen die _aktuellen_ und _vorherigen_ Hauptveröffentlichungen von React gemessen. Wenn neue Funktionen vom React-Team angekündigt werden, werden sie, sollten sie mit den [Projektziele]n im Hinterkopf nutzvoll sein, zu Preacts Kern hinzugefügt. Dies ist ein recht demokratischer Prozess, der von sich konstant entwickelnden Diskussionen und Entscheidungen der Masse gezeichnet ist. Er lebt von Issues und Pull Requests.

> Daher ist von React `0.14.x` und `15.x` gemeint, wenn auf der Website oder in der Dokumentation von Kompatibilität oder Vergleichen die Rede ist.


## Was ist inbegriffen?

- [ES6 Class Components]
    - _Klassen ermöglichen einen expressiven Weg, zustandsorientierte Komponenten zu definieren_
- [High-Order Components]  
    - _Komponenten, die andere Komponenten von `render()` ausgeben, effektiv sind dies Wrapper_
- [Stateless Pure Functional Components]  
    - _Funktionen, die `props` als Argumente empfangen und JSX/VDOM ausgeben_
- [Contexts]: Support for `context` was added in Preact [3.0].
    - _Kontext ist eine experimentelle React-Funktion, wurde aber von anderen Bibliotheken adoptiert._
- [Refs]: Support for function refs was added in Preact in [4.0]. String refs are supported in `preact-compat`.
    - _Refs bieten einen weg, gerenderte Elemente und Child-Komponenten zu rendern._
- Virtual DOM Diffing
    - _Quasi unabdingbar - Preacts Differenzierung ist simpel, aber effektiv und **[extrem](http://developit.github.io/js-repaint-perfs/) [schnell](https://localvoid.github.io/uibench/)**._
- `h()`, eine mehr generalisierte Version von `React.createElement`
- _Diese Idee hieß ursprünglich [hyperscript] und war weit über das React-Ökosystem hinaus wertvoll, daher bewirbt Preact den originalen Standart. ([Lies: warum `h()`?](http://jasonformat.com/wtf-is-jsx))_
- _Außerdem ist lesbarer: `h('a', { href:'/' }, h('span', null, 'Home'))`_


## Was ist hinzugefügt?

Preact fügt durchaus vereinzelt nützliche Funktionen hinzu, die von dem Schaffen der React-Gemeinde inspiriert sind.

- `this.props` und `this.state` werden an `render()` weitergegeben  
    - _Man kann sie immer noch manuell referenzieren. Dieses Vorgehen ist einfach sauberer, insbesondere bei der [Destrukturierung]_
- Gestapelte Aktualisierungen des DOM, die mit `setTimeout(1)` zurückgegeben und verglichen werden, _(können außerdem requestAnimationFrame verwenden)_
- Man kann einfach `class` für CSS-Klassen verwenden. `className` wird zwar immer noch unterstützt, `class` wird aber präferiert.
- Komponenten- und Elementenwiederverwendung- und pooling.


## Was fehlt?

- [PropType] Validierung: Nicht jeder benutzt PropTypes, daher gehören sie nicht Preacts Kern an.
    - _**PropTypes sind vollständig durch** [preact-compat] **unterstützt**, können aber auch manuell verwendet werden._
- [Children]: Nicht notwendig in Preact, da `props.children` _immer ein Array_ ist.
    - _`React.Children` ist vollständig in [preact-compat] unterstützt._
- Synthetisch Ereignisse: Preacts Ziel in der Browserunterstützung setzt diesen zusätzlichen Mehraufwand nicht vorraus.
    - _Preact nutzt das native `addEventListener` des Browsers für Ereignishandhabung. Unter [GlobalEventHandlers] ist eine vollständige Liste an DOM Ereignishandhabungen zu finden._
    - _Eine vollständige Ereignisimplementierung würde mehr Wartung, Leistungseinbußen und eine größere API bedeuten._


## Was ist anders?

Preact und React haben einige feinere Unteschiede:


- `render()` akzeptiert ein drittes Argument, welches der Grundknoten zu _replace_ ist, andernfalls fügt es es hinzu. Dies könnte sich in einer zukünftigen Version ein wenig ändern, vermutlich durch automatische Erkennung der Angemessenheit eines Ersatzrenders mithilfe einer Inspizierung des Grundknoten.
- Komponenten implementieren `contextTypes` oder `childContextTypes` nicht. Children empfangen alle `context`-Einträge von `getChildContext()`.

[Projektziele]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contexts]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[ES6 Class Components]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[High-Order Components]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Stateless Pure Functional Components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[Destrukturierung]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state
