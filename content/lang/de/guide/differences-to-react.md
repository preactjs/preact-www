---
name: Unterschiede gegenüber React
permalink: '/guide/differences-to-react'
---

# Unterschiede gegenüber React

Preact versteht sich nicht als eine Neuimplementierung von React. Es gibt einige Unterschiede.  Einige von ihnen sind trivial oder lassen sich durch [preact-compat] ausgleichen, eine Preact-Variante, der auf hundertprozentige Kompatibilität mit React abzielt.

Der Grund, warum Preact nicht jedes einzelne Feature von React abbilden will, ist der Anspruch, **klein** und **fokussiert** zu bleiben - denn sonst wäre es sinnvoler, Optimierungen direkt für das React-Projekt einzureichen, das jedoch an sich schon sehr komplex ist und über eine sehr saubere Architektur verfügt.


## Versions-Kompatibilität

Sowohl bei Preact als auch [preact-compat] vergleichen wir die Versions-Kompatibilität mit dem jeweils _aktuellen_ und dem _vorherigen_ Major-Release von React. Sobald neue Features vom React-Team angekündigt werden, nehmen wir sie in Preact auf, sofern diese unsere [Projekt-Ziele] erfüllen. Dies wird recht demokratisch entschieden: die Diskussionen dazu führen wir offen, auch anhand von Issues und Pull Requests.

> Daher beziehen sich die Website und die Dokumentation auf React `0.14.x` und `15.x`, wenn wir Kompatibilität besprechen oder Vergleiche anstellen.


## Was ist enthalten?

- [ES6-Klassen]
    - _Klassen helfen, zustandsbehaftete (stateful) Komponenten sauber zu beschreiben_
- [High-Order Components]  
    - _Komponenten, deren `render()`-Funktion andere Komponenten zurückliefert, d.h. Wrapper_
- [Stateless Pure Functional Components]  
    - _Functionen, die `props` als Argumente akzeptieren und JSX/VDOM zurückliefern_
- [Context]: Unterstützung für `context` wurde in Preact [3.0] hinzugefügt.
    - _Context is ein experimentelles Feature von React, das von einigen Libraries aufgegriffen wurde._
- [Refs]: Unterstützung für Funktionsreferenzen wurde in Preact [4.0] hinzugefügt. Zeichenketten-Referenzen sind in `preact-compat` enthalten.
    - _Referenzen ermöglichen, auf gerenderte Elemente und Kind-Komponenten zu verweisen._
- [Virtual DOM Diffing]
    - _Das ist essenziell - Preact liefert einen einfachen und effektiven Abgleich, der **[extrem](http://developit.github.io/js-repaint-perfs/) [schnell](https://localvoid.github.io/uibench/)** ist._
- `h()`, eine verallgemeinerte Fassung von `React.createElement`
    - _Diese Idee nennt sich ursprünglich [hyperscript] und ist auch außerhalb einer React-Umgebung von Bedeutung, daher nutzt Preact den ursprünglichen Standard. ([Read: why `h()`?](http://jasonformat.com/wtf-is-jsx))_
    - _Es ist damit auch etwas besser lesbar: `h('a', { href:'/' }, h('span', null, 'Home'))`_


## Was ist zusätzlich enthalten?

Preact fügt einige Komfortfunktionen hinzu, die von der Arbeit der React-Community inspiriert wurde:

- `this.props` und `this.state` werden an `render()` als Argumente übergeben 
    - _Sie können auch manuell referenziert werden, ist allerdings sauberer, insbesondere beim [Destrukturieren]_
- [Linked State] wird automatisch aktualisiert, wenn sich Eingaben ändern
- Stapelbehandlung von DOM-Updates, die mittels `setTimeout(1)` _(oder auch requestAnimationFrame)_ gesteuert werden können
- Für CSS-Klassen kann einfach `class` verwendet werden, `className` wird zwar auch unterstützt, jedoch wird `class` bevorzugt.
- Wird `class` einem Objekt hinzugefügt, wird dabei eine Zeichenkette namens `className` erstellt, deren Schlüssel Wahr-Werte haben.
- Recycling/Pooling von Komponenten und Elementen.


## Was fehlt?

- [PropType] Validierung: Nicht jeder nutzt PropTypes, so dass sie im Core von Preact nicht enthalten sind.
    - _**Vollständige Unterstützung für PropTypes** bietet [preact-compat], oder du kannst sie manuell nutzen._
- [Children]: Sind nicht notwendig in Preact, weil `props.children` _immer ein Array ist_.
    - _`React.Children` wird in [preact-compat] vollständig unterstützt._
- Synthetic Events: Preact richtet sich nicht an veraltete Browser, so dass dieser zusätzliche Overhead nicht notwendig ist.
    - _Preact nutzt das native `addEventListener` der Browser zur Ereignisbehandlung. [GlobalEventHandlers] enthält eine vollständige Liste der DOM-Event Handlers._
    - _Eine vollständige Implementierung der Ereignisbehandlung würde viel Aufwand und Performance-Fragen und eine umfangreichere API mit sich bringen._


## Was ist anders?

Preact und React unterscheiden sich in einigen Bereichen:

- `render()` akzeptiert ein drittes Argument: einen DOM-Node, der _ersetzt werden soll_. Wird dieser nicht übergeben, wird der zurückgelieferte Wert angehängt. Dies könnte sich in der Zukunft leicht vereändern, indem möglicherweise eine automatische Erkennung, ob das Ersetzen des Inhaltes eines DOM-Nodes angebracht wäre, implementiert wird.
- Komponenten implementieren nicht `contextTypes` oderr `childContextTypes`. Kindelemente erhalten alle `context`-Einträge, die über `getChildContext()` bezogen werden.

[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contexts]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[ES6-Klassen]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[High-Order Components]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Stateless Pure Functional Components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[Destrukturieren]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state
