---
name: Passer à Preact (à partir de React)
permalink: '/guide/switching-to-preact
---

# Passer à Preact (à partir de React)

Il y a deux approches différentes pour passer de React à Preact :

1. Installer l'alias `preact-compat`
2. Passer vos imports à `preact` et supprimer le code non compatible

## Facile : l'alias `preact-compat`

Passer à Preact peut être aussi simple que d'installer `preact-compat` et de l'utiliser comme alias à la place de `react` et `react-dom`.
Cela vous permet de continuer à écrire du code pour React/ReactDOM sans aucun changement dans votre façon de travailler ou votre codebase.
`preact-compat` ajoute environ 2kb à la taille finale de votre bundle, mais possède l'avantage de supporter une vaste majorité des modules React existants que vous pourriez trouver sur npm. Le package `preact-compat` fournit tous les ajustements nécessaire au coeur de Preact pour le faire fonctionnement comme `react` et `react-dom`, dans un seul module.

Le processus d'installation comprend deux étapes.
Premièrement, vous devez installer preact et preact-compat (ce sont deux packages séparés) :

```sh
npm i -S preact preact-compat
```

Une fois ces dépendances installées, configurez votre système de build pour remplacer les imports de React afin qu'ils pointent vers Preact.


### Comment créer un alias preact-compat

Maintenant que vous avez vos dépendenes installées, vous allez devoir configurer votre système de build pour rediriger tous les imports/requires de `react` ou `react-dom` vers `preact-compat`.

#### Aliasing avec Webpack

Ajoutez simplement la configuration [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias) suivante à votre `webpack.config.js` :

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

#### Aliasing avec Browserify

Si vous utilisez Browserify, les alias peuvent être définis en ajoutant le module de transformation [aliasify](https://www.npmjs.com/package/aliasify).

Premièrement, installez le module de transformation : `npm i -D aliasify`

Ensuite, dans votre `package.json`, dites à aliasify de rediriger les imports de react vers preact-compat :

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

#### Faire l'aliasing manuellement

Si vous n'utilisez pas de système de build ou voulez passer complètement à `preact-compat`, vous pouvez rechercher et remplacer tous les imports/requires dans votre codebase tout comme le ferait un alias :

> **recherche :**    `(['"])react(-dom)?\1`
>
> **remplacer par :** `$1preact-compat$1`

Toutefois, dans ce cas, vous risquez de trouver cela plus convaincant de passer directement à `preact`, plutôt que de vous appuyer sur `preact-compat`. Le coeur de Preact regroupe quasiment toutes les fonctionnalités, et beaucoup de codebases React peuvent en fait être passée à `preact` avec peu d'efforts.
Cette approche est couverte dans la prochaine section.

#### Aliasing avec Node en utilisant module-alias

Pour des raison de rendu côté serveur, si vous n'utilisez pas un bundler comme webpack pour construire votre code côté serveur, vous pouvez utilise le package [module-alias](https://www.npmjs.com/package/module-alias) pour remplacer react par preact.

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

Si vous utilisez la nouvelle syntaxe `import` sur votre serveur avec Babel, écrire ces lignes au-dessus de vos autres imports ne va pas fonctionner puisque Babel déplace tous les imports en haut d'un module. Dans ce cas, sauvegardez le code ci-dessus dans un fichier `patchPreact.js`, puis importez le en haut de votre fichier (`import './patchPreact'`). Vous pouvez en savoir plus sur le fonctionnement de `module-alias` [ici](https://www.npmjs.com/package/module-alias).

Il est aussi possible de rediriger directement dans node sans le package `module-alias`. Cela s'appuie sur des propriétés internes du système de module de Node, donc faites attentions. Pour rediriger manuellement :

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

### Build & Test

**Vous avez terminé !**
Maintenant lorsque vous lancez votre build, tous vos impots React vont importer `preact-compat` à la place et votre bundle va être bien plus petit.
C'est toujours une bonne idée de lancer vos tests et bien évidemment lancez votre application pour voir comment elle fonctionne.


---


## Optimal : passer à Preact

Vous n'avez pas forcément à utiliser `preact-compat` dans votre codebase pour passer de React à Preact.
L'API de Preact est presque identique à celle de React, et beaucoup de codebases React peuvent être migrée avec très peu ou aucun changement.

Généralement, le processus pour passer à Preact met en jeu quelques étapes :

### 1. Installer Preact

Celle-ci est simple : vous allez devoir installer la bibliothèque avant de pouvoir l'utiliser !

```sh
npm install --save preact  # ou : npm i -S preact
```

### 2. Pragma JSX : transpiler vers `h()`

> **Contexte :** Bien que l'extension de langage [JSX] est indépendante de React, des transpileurs populaires comme [Babel] et [Bublé] convertissent par défaut le JSX vers des appels à `React.createElement()`. Il y a des raisons historiques à cela, mais il vaut la peine de comprendre que les appels de fonctions vers lesquels JSX est transpilé sont en fait une technologie déjà existente appelée [Hyperscript]. Preact rend hommage à cela et essaye de promouvoir une meilleure compréhension de la simplicité de JSX en utilisant `h()` comme son [Pragma JSX].
>
> **TL;DR:** Nous devons passer de `React.createElement()` au `h()` de Preact

Dans JSX, le "pragma" est le nom de la fonction qui s'occupe de créer chaque élément :

> `<div />` transpile vers `h('div')`
>
> `<Foo />` transpile vers `h(Foo)`
>
> `<a href="/">Hello</a>` vers `h('a', { href:'/' }, 'Hello')`

Dans chaque exemple ci-dessus, `h` est le nom de la fonction que nous avons déclaré comme étant le Pragma JSX.


#### Avec Babel

Si vous utilisez Babel, vous pouvez définir le Pragma JSX dans votre `.babelrc` ou votre `package.json` (comme vous préférez) :

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Avec des commentaires

Si vous travaillez avec un éditeur en ligne qui utilise Babel (comme JSFiddle ou Codepen), vous pouvez définir le Pragma JSX en ajoutant un commentaire au début de votre code :

`/** @jsx h */`


#### Avec Bublé

[Bublé] est livré avec le support de JSX par défaut. Définissez juste l'option `jsx` :

`buble({ jsx: 'h' })`


### 3. Mettre à jour n'importe quel code ancien

Bien que Preact fasse tout son possible pour fournir une API compatible avec celle de React, des portions de l'interface ne sont intentionnellement pas fournies.
La plus remarquable est `createClass()`. Les opinions varient grandement sur le sujet de classes et POO, mais il vaut le coup de comprendre que les classes JavaScript sont utilisées par les bibliothèque de DOM Virtuel pour représenter les types de composants, ce qui est important lorsqu'il est question des nuances dans la gestion du cycle de vie d'un composant.

Si votre codebase utilise énormément `createClass()`, il vous reste tout de même une très bonne option :
Laurence Dorman maintient un [implémentation indépendant de `createClass()`](https://github.com/ld0rman/preact-classless-component) qui fonctionne directement avec preact et ne fait que quelques octets.
Alternativement, vous pouvez automatiquement convertir vos appels à `createClass()` vers des classes ES6 en utilisant [preact-codemod](https://github.com/vutran/preact-codemod) de Vu Tran.

Une autre différence qu'il convient de noter est que Preact ne support que les références fonctionnelles par défaut.
Les références par chaîne de caractères sont dépréciées dans React et vont être supprimées sous peu, car elles introduisent trop de complexité pour peu de gains.
Si vous voulez continuer d'utiliser les références par chaîne de caractère, [cette petite fonction linkedRef](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d) vous offre une solution durable qui alimente `this.refs.$$` comme les références par chaine de caractères le faisaient. La simplicité de ce petit enrobage autour des références fonctionnelles aide aussi à illustrer pourquoi celles-ci sont maintenant le meilleur choix pour le futur.


### 4. Simplify Root Render

Depuis React 0.13, `render()` a été fournit par le module `react-dom`.
Preact n'utilise pas un module séparé pour le rendu DOM, puisqu'il concentre ses efforts pour être un bon créateur de DOM.
Donc, la dernière étape pour convertir votre codebase vers Preact est de convertir `ReactDOM.render()` vers la fonction `render()` de Preact :

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Il convient aussi de noter que le `render()` de Preact est non-destructif, donc rendre dans `<body>` fonctionne parfaitement (et est même encouragé).
C'est aussi possible parce que Preact ne prétend pas contrôler entièrement l'élément racine que vous lui passez. Le second argument de `render()` est en fait `parent` - ce qui signifie que c'est un élément du DOM dans lequel il est possible de rendre. Si vous voulez re-rendre à partir de la racine (peut-être pour du Hot Module Replacement), `render()` accepte un élément à remplacer comme troisième argument :

```js
// initial render:
render(<App />, document.body);

// update in-place:
render(<App />, document.body, document.body.lastElementChild);
```

Dans l'exemple ci-dessus, nous utilisons le dernier enfant comme étant notre précédente racine pour le rendu. Bien que cela fonctionne dans la plupart des cas (jsfiddles, codepens, etc), il vaut mieux avoir plus de contrôle. C'est pourquoi `render()` retourne l'élément racine : vous le passez comme troisième argument pour re-rendre en place. L'exemple suivant montre comment re-rendre en réponse aux mises à jour du Hot Module Replacement de Webpack :

```js
// root contient l'élément racine de notre application
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// exemple : nouveau rendu à chaque mise à jour du HMR webpack
if (module.hot) module.hot.accept('./app', init);
```

La technique complète peut être vue dans [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
