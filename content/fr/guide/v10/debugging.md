---
name: Débogage d'une application Preact
description: 'Comment déboguer une application Preact quand quelque chose ne va pas.'
---

# Déboguer une application Preact

Preact livre de nombreux outils pour permettre un débogage plus simple. Ils sont empaquetés dans un seul `import` et peuvent êtres inclus en important `preact/debug`.

Ceux-ci incluent un pont vers l'excellente extension pour Chrome ou Firefox, [Outil développement React]. Si vous l'avez déjà installée vous pouvez **l'essayer sur ce site**. Vous n'avez qu'à ouvrir la console de développement et inspecter comment nous l'avons construit.

Nous afficherons un message d'avertissement ou une erreur lorsque nous rencontrerons un problème comme un embriquement incorrect (en anglais nesting) des éléments `<table>`.


---

<toc></toc>

---

## Installation
L'[Outil de développement React] peut être installé dans la page d'extensions de votre navigateur


- [Pour Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Pour Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Une fois installé, nous avons besoin d'importer `preact/debug` quelque part pour initialiser la connexion à l'extension. Faites un sorte que cette import **est le premier** de toute votre application.

> `preact-cli` inclue le paquet `preact/debug/` automatiquement. Vous pouvez sauter la prochaine étape en toute sécurité si vous l'utilisez.

Voici un exemple d'entrée principale d'application.

```jsx
// Doit être le premier import
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Supprimer les outils de développement en production

La plupart des "bundlers" vous permettent de supprimer du code lorsqu'ils détectent qu'une instruction `if` ne sera jamais rencontrée, vous pouvez utiliser ceci pour n'inclure `preact/debug` que pendant votre développement et sauvegarder quelques précieux octets dans votre application finale.

```js
// Doit être le premier import
if (process.env.NODE_ENV==='development') {
  // Ici nous devons utiliser require puisque les instructions
  // "import" ne sont autorisé qu'en haut d'un fichier.
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

Soyez certain d'attribuer la variable d'environnement `NODE_ENV` à la valeur correcte dans votre outil de "bundling".

Déboguer les avertissements et des erreurs

De temps en temps vous pourrez rencontrer un avertissement (warning) ou une erreur (error) lorsque Preact détectera du code invalide. Elles doivent être corrigé pour permettre à l'application de fonctionner correctement.

### `undefined` parent passed to `render()`

Cela veut dire que le code essaie de faire un rendu de votre application dans le vide, au lieu d'un élément DOM. C'est la différence entre :

```jsx
// Ce qu'à reçu Preact
render(<App />, undefined);

// vs. ce à quoi il s'attendait
render(<App />, actualDomNode);
```
La raison principale pour laquelle cette erreur apparaît est que votre élément DOM n'est pas présent lorsque la fonction `render()` est appelée. Soyez certain qu'il existe. 

### `undefined` component passed to `createElement()`

Preact lancera une erreur lorsque vous passerez `undefined` au lieu d'un composant. Une cause commune a cette erreur est une confusion avec les exports de type `default` et `named`.

```jsx
// app.js
export default function App() {
  return <div>Bonjour monde !</div>;
}

// index.js: Faux, car `app.js` n'a pas d'export nommé
import { App } from './app';
render(<App />, dom);
```

La même erreur sera lancée lorsque çe sera l'inverse, par exemple lorsque vous déclarez un export nommé (`named` export) et que vous essayez d'utiliser l'export `default`. Une façon rapide de vérifier cela (dans le cas où votre éditeur ne le fait pas déjà), est de simplement faire usage de `console.log` afin d'en connaître la valeur.

```js
// app.js
export function App() {
  return <div>Bonjour monde !</div>;
}

// index.js
import App from './app';

console.log(App);
// Logs: { default: [Function] } Au lieu d'un composant
```

### Passed a JSX literal as JSX twice

Passer une constante JSX ou un composant dans du JSX à nouveau est invalide et déclenchera cette erreur.

```jsx
const Foo = <div>foo</div>;
// Invalide: Foo contient déjà une constante JSX
render(<Foo />, dom);
```
Pour corriger cela, nous pouvons juste passer la variable directement:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Improper nesting of table detected

HTML a une direction très claire sur la manière dont les tables devraient être structurées. Ne pas respecter ce format amènera à des erreurs de rendu qui peuvent être difficile à déboguer. Dans Preact, nous détectons et affichons ces erreurs. Pour en apprendre d'avantage sur la structure correcte des tables, nous vous recommandons vivement la [documentation MDN](https://developer.mozilla.org/fr/docs/Apprendre/HTML/Tableaux/Basics)

### Invalid `ref`-property

Lorsque la propriété `ref` contient quelque chose de non attendu, nous lancerons cette erreur. Ceci inclut les `refs` à base de chaîne de caractères (`string-based refs`) qui ont été déprécié par le passé.

```jsx
// valide
<div ref={e => {/* ... */)}} />

// valide
const ref = createRef();
<div ref={ref} />

// Invalide
<div ref="ref" />
```

### Invalid event handler

De temps en temps vous pourriez accidentellement passer une valeur incorrecte à un handler. Elles doivent toujours être une fonction, ou, si vous souhaitez l'enlever, `null`. Tous les autres types sont invalides.


```jsx
// valid
<div onClick={() => console.log("click")} />

// invalid
<div onClick={console.log("click")} />
```

### Hook can only be invoked from render methods

Cette erreur survient lorsque vous essayez d'utiliser un `hook` en dehors d'un composant. Ceux-ci ne sont supportés qu'à l'intérieur d'un composant.

```jsx
// Invalide, doit être utilisé à l'intérieur d'un composant
const [value, setValue] = useState(0);

// valide
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</div>;
}
```

### Getting `vnode.[property]` is deprecated

Avec Preact X, certains changement majeurs entraînent une rupture de compatibilité avec la précédente version de Preact dans la façon dont nous gérons la structure interne `vnode`.

| Preact 8.x | Preact 10.x |
|---|---|
| `vnode.nodeName` | `vnode.type` |
| `vnode.attributes` | `vnode.props` |
| `vnode.children` | `vnode.props.children`|

### Found children with the same key

Un aspect unique des librairies basés sur un DOM virtuel est qu'elles ont une chance de détecter lorsqu'un nœud a été bougé. Cependant, pour savoir exactement quel nœud est lequel, nous avons besoin de les identifier. _Ceci n'est nécessaire que lorsque nous créons des éléments dynamiquement._


```jsx
// Les deux enfants auront la même clé "A"
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

La bonne façon de gérer cela est de leur donner des clés uniques. Dans la plupart des cas, la donnée sur laquelle vous itérez aura une forme d'`id`.


```jsx
const persons = [
  { name: 'John', age: 22 },
  { name: 'Sarah', age: 24}
];

// Quelque part dans votre composant
<div>
  {persons.map(({ name, age }) => {
    return <p key={name}>{name}, Age: {age}</p>;
  })}
</div>
```

[Outil de développement React]: https://github.com/facebook/react-devtools
