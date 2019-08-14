---
name: Debugger une application Preact
description: 'Comment debugger une application Preact quand quelque chose ne va pas.'
---

# Debugger une application Preact

Preact livre de nombreux outils pour permettre un déboggage plus simple. Ils sont empaquetés dans un seul `import` et peuvent êtres inclus en important `preact/debug`.

Ceux-ci incluent un pont vers l'excellente extension pour Chrome ou Firefox, [Outil développement React]. Si vous l'avez déjà d'installé vous pouvez **l'essayer sur ce site**. Vous n'avez qu'a ouvrir la console de développement et inspecter comment nous l'avons construit.

Nous afficherons un message de sommation ou une erreur lorsque nous rencontrerons un problème comme d'incorrecte nidification (en anglais nesting) des éléments `<table>`.


---

<toc></toc>

---

## Installation
L'[Outil de développement React] peut être installé dans la page d'extensions de votre navigateur


- [Pour Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Pour Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Une fois installé, nous avons besoin d'import `preact/debug` quelque part pour initialiser la connexion à l'extension. Soyez certain que cette import **est le premier** import de toute votre application.

> `preact-cli` inclue le paquet `preact/debug/` automatiquement. Vous pouvez sauter la prochaine étape en toute sécurité si vous l'utilisez.

Voila un exemple d'entrée principal de votre application.

```jsx
// Doit être le premier import
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Supprimer les outils de développement de la production

La plupart des "bundlers" vous permettent de supprimer du code lorsqu'ils détectent qu'une instruction `if` ne sera jamais rencontré. Vous pouvez utiliser ceci pour n'inclue `preact/debug` que pendant votre développement et sauvegarder quelques bytes précieux dans votre application final.

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

Soyez certain d'attribuer la variable d'environnement `NODE_ENV` à la valeur correct dans votre outil de "bundling".

Debugger des sommations et des erreurs

De temps en temps vous pourrez rencontrer une sommation (warning) ou une erreur (error) lorsque Preact détectera du code invalide. Elles doivent être corrigé pour permettre à l'application de fonctionner correctement.

### `undefined` parent passed to `render()`

Cela veut dire que le code essaie de faire un rendu de votre application dans le néant au lieu d'un élément DOM. C'est la différence entre :

```jsx
// What Preact received
render(<App />, undefined);

// vs what it expected
render(<App />, actualDomNode);
```
La raison principal pour laquelle cette erreur apparait est que votre élément DOM n'est pas présent lorsque la fonction `render()` est appelée. Soyez certain qu'il existe. 

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

La même erreur sera lancé lorsque ce sera l'inverse. Lorsque vous déclarez un export nommé (`named` export) et que vous essayez d'utiliser l'export `default`. Une façon rapide de vérifier cela (dans le cas où votre éditeur ne le fait pas déjà), est de simplement logger l'import.

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

Passer un literal-JSX ou un composant dans du JSX à nouveau est invalide et déclenchera cette erreur.

```jsx
const Foo = <div>foo</div>;
// Invalide: Foo contient déjà un élément-JSX
render(<Foo />, dom);
```
Pour corriger cela, nous pouvons juste passer la variable directement:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Improper nesting of table detected

HTML a une direction très claire sur la manière dont les tables devraient être structurés. Ne pas respecter ce format amènera à des erreurs de rendus qui peuvent être difficile à débogguer. Dans Preact, nous détectons et affichons ces erreurs. Pour en apprendre d'avantage sur comment ces tables devraient être structurés nous vous recommandons vivement la [documentation MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)

### Invalid `ref`-property

Lorsque la propriété `ref` contient quelque chose de non attendu, nous lancerons cette erreur. Ceci inclus les `refs` à base de chaine de caractère (`string-based refs`) qui peuvent avoir été déprécié il y a un moment.

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

De temps en temps vous pourriez accidentellement passer une valeur incorrect à un handler. Elles doivent toujours être une fonction (`function`) ou si vous souhaitez l'enlever, `null`. Tous les autres types sont invalides.


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

Avec Preact X nous il y a certains changement majeurs qui entrainent une rupture de compatibilité avec la précédente version de Preact dans la façon dont nous gérons la structure interne `vnode`.

| Preact 8.x | Preact 10.x |
|---|---|
| `vnode.nodeName` | `vnode.type` |
| `vnode.attributes` | `vnode.props` |
| `vnode.children` | `vnode.props.children`|

### Found children with the same key

Un aspect unique à propos des librairies basés sur un DOM virtuel est qu'elles ont une chance de détecter lorsqu'un noeud a été bougé. Cependant, pour savoir exactement quel noeud est lequel, nous avons besoin de les identifier. _Ceci n'est nécéssaire que lorsque nous créons des éléments dynamiquement._


```jsx
// Les deux enfants auront la même clé "A"
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

La façon correct de faire cela est de leur donner des clés uniques. Dans la plupart des cas, la donnée sur lequel vous itérez aura une forme d'`id`.


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
