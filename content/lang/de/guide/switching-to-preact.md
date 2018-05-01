---
name: Von React zu Preact wechseln
permalink: '/guide/switching-to-preact
---

# (Von React) Zu Preact wechseln

Es gibt zwei verschiedene Herangehensweisen, wie man von React zu Preact wechseln kann:

1. Den `preact-compat`-Alias installieren
2. Die Importierungen nach `preact` abändern und inkompatiblen Code entfernen

## Einfach: `preact-compat`-Alias

Zu Preact wechseln ist eigentlich sehr einfach - man installiert `preact-compat` und setzt einen Alias für `preact-compat` anstatt `react` und `react-dom`.

Das ermöglicht es einem, mit dem Schreiben von React/ReactDOM-Code fortzufahren, ohne jegliche Änderungen am Workflow oder an der Codebasis vornehmen zu müssen.
`preact-compat` fügt zwar ungefähr 2kb zur Gesamtgröße des Projektes hinzu, hat allerdings den Vorteil, den Großteil von bereits existierenden React-Modulen, die man bei [npm](https://npmjs.com) finden sollte, zu unterstützen. Zusätzlich zu Preacts Kern liefert das `preact-compat`-Paket alle Änderungen, die benötigt werden, um genau wie `react` und `react-dom` zu funktionieren, in einem einzelnen Modul.

Der Installationsprozess ist in zwei Schritte unterteilt.
Zuerst muss man `preact` und `preact-compat`, zwei seperate Pakete, installieren:

```sh
npm i -S preact preact-compat
```

Sind diese Dependencies installiert, muss man den Build-Prozess so abändern, dass React-Imports stattdessen auf Preact referenzieren.


### `preact-compat`-Alias setzen

Nun, da die Dependencies installiert sind, muss man den Build-Prozess so konfigurieren, dass jegliche Importierungen von `react` oder `react-dom` zu `preact-compat` weitergeleitet werden.

#### Setzen des Alias mithilfe von Webpack

Man fügt einfach die folgende [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias)-Konfiguration zur `webpack.config.js`-Datei hinzu:

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Setzen des Alias mithilfe von Browserify

Falls Browserify verwendet wird, können Aliase definiert werden, indem man die [aliasify](https://npmjs.com/package/aliasify)-Transformation hinzufügt. Dieses Vorgehen funktioniert wie folgt:

Man installiert zuerst die Transformation: `npm i -D aliasify`

Und weist aliasify danach in der `package.json` an, React-Importierungen an `preact-compat` weiterzuleiten:

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Manuelles Setzen des Alias

Falls kein Build-System verwendet wird oder aber ein permanenter Wechsel zu `preact-compat` erwünscht ist, kann man natürlich auch alle Importierungen und Voraussetzungen in der Codebasis suchen und ersetzen, genauso wie es ein Alias tun würde:

> **find:**    `(['"])react(-dom)?\1`
>
> **replace:** `$1preact-compat$1`

In diesem Fall könnte es allerdings deutlich ansprechender sein, direkt zum vollen `preact`-Paket zu wechseln, anstatt auf `preact-compat` angewiesen zu sein.

Preacts Kern besitzt eine Vielzahl von Funktionen, sodass viele idiomatische React-Codebasen direkt mit minimalem Aufwand zu `preact` umgezogen werden können.

Dieser Ansatz wird im nächsten Abschnitt erläutert.

#### Setzen des Alias mithilfe von Node und module-alias

Beachtet man Small Screen Rendering-Funktionalitäten, kann man das [module-alias](https://npmjs.com/package/module-alias)-Paket zum Ersetzen von React mit Preact verwenden, sollte man keinen Bundler (wie z.B. Webpack) für den Build-Prozess des serverseitigen Codes verwenden.

```sh
npm i -S module-alias
```

`patchPreact.js`:
```js
var path = require('path')
var moduleAlias = require('module-alias')

moduleAlias.addAliases({
  'react': 'preact-compat/dist/preact-compat.min',
  'react-dom': 'preact-compat/dist/preact-compat.min',
  'create-react-class': path.resolve(__dirname, './create-preact-class')
})
```

`create-preact-class.js`:
```js
import { createClass } from 'preact-compat/dist/preact-compat.min'
export default createClass
```

Falls die neuartige `import`-Syntax auf dem eigenen Server mit Babel verwendet wird, wird das obrige Verhalten nicht funktionieren, da Babel alle Importierungen an das obere Ende eines Moduls platziert. In diesem Fall speichert man den obrigen Code in einer Datei namens `patchPreact.js` ab und importiert diese am Anfang seiner Datei (`import './patchPreact'`). Mehr über das Verwenden von `module-alias` kann man [hier](https://npmjs.com/package/module-alias) erfahren.

Es ist außerdem möglich, einen Alias direkt mithilfe von Node zu stetzen, ohne auf das `module-alias`-Paket angewiesen zu sein. Diese Methode basiert auf internen Properties von Nodes Modulsystem, daher sollte man sie mit Vorsicht genießen. Um manuell einen Alias zu setzen, sind folgende Schritte nötig:

```js
// patchPreact.js
var React = require('react')
var ReactDOM = require('react-dom')
var ReactDOMServer = require('react-dom/server')
var CreateReactClass = require('create-react-class')
var Preact = require('preact-compat/dist/preact-compat.min')
var Module = module.constructor
Module._cache[require.resolve('react')].exports = Preact
Module._cache[require.resolve('react-dom')].exports = Preact
Module._cache[require.resolve('create-react-class')].exports.default = Preact.createClass
```

### Erstellen und Testen

**Fertig!**

Wenn man nun den Build-Prozess ausführt, werden alle React-Importierungen stattdessen `preact-compat` importieren. Das Bundle wird so deutlich verkleinert.
Es ist immer eine gute Idee, die Testumgebung und die fertige App auszuführen, um zu prüfen, ob sie auch wirklich funktioniert.


---


## Optimal: Wechseln zu Preact

Die Nutzung von `preact-compat` in der eigenen Codebasis ist nicht vorausgesetzt, wenn man von React zu Preact migrieren will.
Preacts API ist fast identisch mit Reacts API. Ein Großteil der React-Codebasen kann mit winzigem bis nicht-existentem Aufwand migriert werden.

Generell involviert der Prozess des Wechselns zu Preact einige Schritte:

### 1. Preact installieren

Dieser Schritt ist vermutlich der Einfachste: man muss die Bibliothek lediglich installieren, um sie verwenden zu können!

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX Pragma: Zu `h()` transpilieren

> **Hintergrund:** Während die [JSX]-Spracherweiterung unabhängig von React ist,
> verwenden beliebte Transpilierer wie [Babel] and [Bublé] standartmäßig eine
> Konvertierung von JSX zu `React.createElement()`-Aufrufen.
> Dafür gibt es zwar historische Gründe, es ist allerdings wichtig zu verstehen,
> dass die Funktion, die JSX-Transpilierungen aufruft, eine bereits existierende
> Technologie namens [Hyperscript] ist.
> Preact huldigt dies und versucht, für ein besseres Verständnis für die Simplizität
> von JSX mithilfe der Nutzung von `h()` als sein [JSX Pragma] zu werben.
>
> **TL;DR:** `React.createElement()` wird zugunsten von preact's `h()` ausgetauscht.

In JSX ist das "Pragma" der Name einer Funktion, die das Erstellen eines solchen Elements abwickelt:

> `<div />` transpiliert zu `h('div')`
>
> `<Foo />` transpiliert zu `h(Foo)`
>
> `<a href="/">Hallo</a>` zu `h('a', { href:'/' }, 'Hallo')`

In jedem der obengenannten Beispiele ist `h` der Funktionsname, der als JSX-Pragma deklariert wird.


#### Mithilfe von Babel

Falls Babel verwender wird, kann man das JSX-Pragma in der `.babelrc`- oder `package.json`-Datei definiert werden. In welcher der beiden Datein man dies tut, ist lediglich von persönlicher Präferenz abhängig:

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Mithilfe von Kommentaren

Falls man mit einem Onlineeditor mit Babel-Integration (z.B. JSFiddle oder CodePen) arbeitet, kann man das JSX-Pragma definieren, indem man am Anfang seines Codes einen Kommentar einfügt:

`/** @jsx h */`


#### Mithilfe von Bublé

[Bublé] unterstützt JSX standardmäßig. Man muss lediglich die `jsx`-Option setzen:

`buble({ jsx: 'h' })`


### 3. Legacy Code aktualisieren

Preact strebt zwar eine vollständige API-Kompatibilität mit React an, allerdings werden kleine Teile des Interfaces absichtlich nicht integriert.
Der am ehesten erwähnbare ausgelassene Teil ist `createClass()`. Die Meinung zum Thema Klassen und OOP gehen weit auseinander, man sollte aber verstehen, dass JavaScript-Klassen intern in VDOM-Bibliotheken zum Repräsentieren von Komponententypen stehen. Dies wird wichtig, wenn man mit den Nuancen der Handhabung von Komponentenlebenszyklen arbeitet.

Falls die Codebasis schwerwiegend von `createClass()` abhängig ist, gibt es trotzdem eine großartige Option:
Laurence Dorman pflegt eine [alleinstehende `createClass()`-implementation](https://github.com/ld0rman/preact-classless-component), die nahtlos in Preact funktioniert und nur wenige hundert Bytes groß ist.
Alternativ kann man `createClass()`-Aufrufe auch automatisch mithilfe von Vu Trans [preact-codemod](https://github.com/vutran/preact-codemod) zu ES-Klassen konvertieren lassen.

Ein weiterer erwähnbarer Unterschied ist, dass Preact standartmäßig lediglich Funktionsreferenzierungen unterstützt.
Stringreferenzierungen sind in React veraltet und werden in naher Zukunft entfernt, da sie eine überraschende Menge an Komplexität für solch minimalen Nutzen hinzufügen.

Wenn man auch in Zukunft Stringreferenzierungen nutzen möchte, bietet [diese kleine Funktion](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d) eine zukunftssichere Version, die `this.refs.$$` weiterhin wie Stringreferenzierungen behandelt. Die Simplizität dieses kleinen Umwegs für Funktionsreferenzierungen zeigt außerdem, warum Funktionsreferenzierungen mittlerweile die präferierte Methode darstellen.


### 4. Root Render vereinfachen

Seit `react@0.13` wurde `render()` durch das `react-dom`-Modul bereitgestellt.
Preact nutzt kein separates Modul für das Rendern des DOMs, da Preact sowieso darauf konzentriert, ein guter DOM-Renderer zu sein.
Daher ist der letzte Schritt des Konvertierens der Codebasis zu Preact das Austauschen von `ReactDOM.render()` zu Preacts `render()`:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Man sollte ebenfalls anmerken, dass Preacts `render()`-Funktion nicht-destruktiv ist, daher funktioniert das Rendern nach `<body>` einwandfrei und ist sogar wünschenswert.

Dies ist möglich, da Preact nicht davon ausgeht, das komplette Root-Element zu steuern, dass man an Preact weitergibt. Das zweite `render()`-Argument ist `parent`, was bedeutet, dass es ein DOM-Element ist, in das _hinein_ gerendert wird.
Falls es erwünscht ist, direkt vom Root aus neu zu rendern (möglicherweise für Hot Module Replacement), akzeptiert `render()` ein Element zum Ersetzen als drittes Argument:


```js
// initial render:
render(<App />, document.body);

// update in-place:
render(<App />, document.body, document.body.lastElementChild);
```

In dem obrigen Beispiel ist man darauf angewiesen, dass das letzte Child der vorher gerenderte Root ist.
Dies funktioniert zwar in vielen Fällen (JSFiddles, CodePens, uvm.), es ist allerdings trotzdem besser, über mehr Kontrolle zu verfügen.
Deshalb gibt `render()` das Root-Element zurück: man gibt es als drittes Argument zum Neurendern weiter.

Das nachfolgende Beispiel zeigt, wie man als Antwort auf Webpacks Hot Module Replacement-Aktualisierungen neu rendert:

```js
// Root ist das Root DOM Element der App:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// Beispiel: Neurendern bei Webpack HMR-Aktualisierung:
if (module.hot) module.hot.accept('./app', init);
```

Das komplette Verfahren kann bei  [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18) eingesehen werden.


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
