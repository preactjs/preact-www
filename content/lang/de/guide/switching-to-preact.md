---
name: Von React zu Preact wechseln
permalink: '/guide/switching-to-preact
---

# Von React zu Preact wechseln

Es gibt zwei Wege, um von React zu Preact zu wechseln:

1. Das `preact-compat`-Modul als Alias installieren
2. `preact` importieren und inkompatiblen Code entfernen

## Einfach: `preact-compat` als Alias

Preact kann ganz einfach installiert werden, indem du `preact-compat` als Alias für `react` und `react-dom` einsetzt.
Damit kannst du weiterhin React/ReactDOM-Code schreiben, ohne Veränderungen am Workflow oder der Codebase vorzunehmen.
`preact-compat` fügt ungefähr 2kb zur Größe deines Bundles hinzu, hat aber den Vorteil, die überwiegende Mehrheit der über npm verfügbaren React-Module zu unterstützen. Das `preact-compat`-Paket liefert alle notwendigen Anpassungen am Core von Preact, die es kompatibel zu `react` und `react-dom` in einem einzigen Modul machen.

Die Installation läuft in zwei Schritten ab.
Zunächst installierst du preact und preact-compat (als zwei separate Pakete):

```sh
npm i -S preact preact-compat
```

Sobald diese beiden Abhängigkeiten installiert sind, konfigurierst du dein Build-System so, dass React-Importe stattdessen auf Preact verweisen.


### Aliase für preact-compat erstellen

Alle import/require-Statements, die auf `react` oder `react-dom` verweisen, ersetzt du durch `preact-compat`.

#### Aliase über Webpack

Füge zu deiner `webpack.config.js` den folgenden [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias) hinzug:

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

#### Aliase über Browserify

Falls du Browserify einsetzt, können Aliase mit Hilfe des [aliasify](https://www.npmjs.com/package/aliasify)-Transform konfiguriert werden.

Installiere aliasify:  `npm i -D aliasify`

Weise aliasify dann in deiner `package.json` an, React-Importe auf preact-compat umzuleiten:

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

#### Aliase manuell erstellen

Falls du kein Build-System nutzt oder dauerhaft zu `preact-compat` wechseln willst, kannst du auch über Suchen & Ersetzen alle Import/Require-Statements in deiner Codebase austauschen:

> **Suchen:**    `(['"])react(-dom)?\1`
>
> **Ersetzen:** `$1preact-compat$1`

In diesem Falle könnte es sich aber eher anbieten, direkt zu `preact` zu wechseln, statt den Kompatibilitäts-Layer `preact-compat` einzusetzen.
Der Core von Preact core bietet nahezu alle Features von React, und viele React-Projekte können ohne größeren Aufwand direkt mit `preact` betrieben werden.
Die Vorgehensweise dazu wird weiter unten erläutert.


### Build & Test

**Fertig!**
Wenn du nun deinen Build durchlaufen lässt, werden alle React-Importe auf `preact-compat` verweisen und die Größe deines Projektes wird viel kleiner. Deine Test-Suite und ein Aufruf der App sollte nun zeigen, ob alles noch reibungslos funktionert.

---

## Optimal: Ganz zu Preact wechseln

Du muss nicht `preact-compat` nutzen, um von React zu Preact zu wechseln. Die API von Preact ist fast identisch zu React, und viele React-Projekte können ganz ohne oder nur mit wenigen Anpassungen migriert werden.

Grundsätzlich sind die Schritte einer Migration zu Preact die folgenden:

### 1. Preact installieren

Wie üblich mit NPM oder Yarn installieren:

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX Pragma: Zu `h()` transpilieren

> **Hintergrund:** Wärend die [JSX]-Spracherweiterung unabhängig von React ist, wandeln beliebte
> Transpiler wie [Babel] und [Bublé] JSX standardmäßig in `React.createElement()`-Aufrufe um.
> Hierfür gibt es historische Gründe, aber die Funktionsaufrufe, in die JSX transpiliert wird,
> sind genaugenommen eine schon vorher existierende Technologie namens [Hyperscript].
> Preact greift dies auf und bemüht sich darum, die Einfachheit von JSX zu vermitteln, indem es
> `h()` als sein [JSX Pragma] verwendet.
>
> **TL;DR:** Alle Aufrufe von `React.createElement()` müssen durch `h()` ersetzt werden.

In JSX steht "pragma" für eine Funktion, die ein Element erstellt:

> `<div />` wird zu `h('div')` transpiliert
>
> `<Foo />` wird zu `h(Foo)` transpiliert
>
> `<a href="/">Hallo</a>` wird zu `h('a', { href:'/' }, 'Hallo')`

In diesem Beispiel ist `h` die Funktion, die als JSX Pragma definiert wurde.


#### Mittels Babel

Falls du Babel bevorzugst, kann das JSX Pragma entweder in `.babelrc` oder in `package.json` konfiguriert werden:

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Mittels Kommentaren

Falls du einen Online-Editor, der Babel nutzt, verwendest (z.B. JSFiddle oder Codepen),
kannst du das JSX Pragma über einen Kommentar am Kopf des Codes definieren:

`/** @jsx h */`


#### Mittels Bublé

[Bublé] unterstützt standardmäßig JSX. Hier muss die `jsx`-Option konfiguriert werden:

`buble({ jsx: 'h' })`


### 3. Älteren Code aktualisieren

Obwohl Preact API-Kompatibilität mit React anstrebt, sind Teile des Interfaces bewusst nicht enthalten. Hierzu zählt vor allem `createClass()`. Die Meinungen zu Klassen und OOP in Javascript gehen auseinander, aber es sei darauf hingewiesen, dass Javascript-Klassen intern in VDOM-Libraries für Komponententypen verwendet werden, was die Behandlung von Komponenten-Lifecycles wichtig ist.

Falls deine Codebase viel von `createClass()` Gebrauch macht, gibt es jedoch eine nützliche Lösung:
Laurence Dormans [`createClass()`-Implementierung](https://github.com/ld0rman/preact-classless-component), die direkt mit Preact zusammenarbeitet und nur ein paar hundert Bytes groß ist. Alternativ kannst du auch deine `createClass()`-Aufrufe automatisch in ES-Klassen mittels [preact-codemod](https://github.com/vutran/preact-codemod) von Vu Tran umwandeln lassen.

Ein weiterer wichtiger Unterschied ist, dass Preact standardmäßig nur Funktionsreferenzen unterstützt. Zeichenkettenreferenzen werden in React als deprecated behandelt und werden demnächst entfernt, da sie erstaunlich viel Komplexität für wenig Nutzen erfordern.
Sofern du Zeichenkettenreferenzen weiter benutzen möchtest, bietet [diese winzige linkedRef-Funktion](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)
eine zukunftssichere Version, die auch `this.refs.$$` wie alte Zeichenkettenreferenzen behandelt.  Die einfache Struktur dieser Funktion zeigt auch, wieso Funktionsreferenzen den künftig zu bevorzugenden Weg darstellen.


### 4. Simplify Root Render

Seit React 0.13 wird `render()` vom `react-dom`-Modul bereitgestellt.
Preact nutzt kein separates Modul zum Rendern des DOM, weil genau das die eigentliche Zielstellung von Preact ist.
Im letzten Schritt muss daher in deinem Code `ReactDOM.render()` in die `render()`-Methode von Preact umgewandelt werden:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Es sei darauf hingewiesen, dass die `render()`-Funktion von Preact nicht-destruktiv ist, so dass das Rendern in das `<body>`-Element problemlos und sogar empfehlenswert ist.
Dies wird dadurch ermöglicht, dass Preact nicht davon ausgehet, dass es das gesamte Root-Element, das ihm übergeben wird, steuert. Das zweite Argument der `render()`-Funktion ist das `Elternelement` - d.h. das DOM-Element, _in das_ gerendert werden soll. Falls du vom Root-Element aus neu rendern willst (z.B. für Hot Module Replacement), kann an `render()` als drittes Argument auch ein Element übergeben werden, das ersetzt werden soll:

```js
// Erstes Rendering:
render(<App />, document.body);

// Aktualisierung:
render(<App />, document.body, document.body.lastElementChild);
```

Im obigen Beispiel wird das letzte Kindelement genutzt, nämlich das zuvor gerenderte Root-Element.
Obwohl dies in vielen Fällen funktioniert (jsfiddles, codepens, etc.), ist zu bevorzugen, die selbst bestimmen zu können. Darum liefert `render()` das Root-Element zurück: dieses kann dann als drittes Element übergeben werden, wenn am selben Ort neu gerendert werden soll.
Das folgende Beispiel zeigt, wie bei einem Update über Hot Module Replacement von Webpack neu gerendert werden kann:

```js
// root enthält das Root-DOM-Element:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// Beispiel: Re-rendering beim HMR-Update von Webpack:
if (module.hot) module.hot.accept('./app', init);
```

Diese Technik wird in [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18) angewendet


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
