---
name: Premiers pas
description: "Premiers pas avec Preact. Nous apprendrons comment mettre en place des outils (si nécessaire) et commencerons à écrire une application."
---

# Premiers pas

Ce simple guide vous aide à commencer a développer des applications Preact. Il y a 3 moyens populaires de le faire.

Si vous commencez juste nous vous recommandons de commencer avec [preact-cli](#best-practices-powered-with-preact-cli).

---

<toc></toc>

---

## Sans aucun outil de construction

Preact a toujours été livré avec une solution prête à être utilisé dans le navigateur. Ce qui ne nécessite aucun outil de construction (build tools).

```js
import { h, Component, render } from 'https://unpkg.com/preact';

// Créez votre application
const app = h('div', null, 'Hello World!');

// Injectez votre application dans l'élément avec l'id `app`.
// Faites en sorte que l'élément soit présent dans le dom ;)
render(app, document.getElementById('app'));
```

La seul différence est que vous ne pouvez pas utiliser JSX parce que JSX a besoin d'être transpilé. Nous avons une alternative dans la prochaine section.

### Alternatives à JSX

Écrire une application avec un `h` brut ou un appel `createElement` est bien moins amusant que d'écrire du JSX. JSX à l'avantage de ressembler à du HTML, qui rend la compréhension plus simple pour beaucoup de développeurs. Cela en revanche nécessite une étape pré-construite, alors nous vous recommandons vivement une alternative appelé [htm].

En un mot, [htm] peut être décrit comme: Une syntaxe JSX en plein Javascript sans avoir besoin de transpiler. Au lieu d'utiliser une syntaxe personnalisé, cela repose sur les littéraux de gabarits (tagged template strings) natif à javascript qui ont été ajouté à Javascript il y a un moment.


```js
import { h, Component, render } from 'https://unpkg.com/preact';
import { html, Component, render } from 'https://unpkg.com/htm';

// Initialize htm with Preact
const html = htm.bind(h);

const app = html`<div>Hello World!</div>`
render(app, document.getElementById('app'));
```

C'est une façon très populaire d'écrire des applications Preact et nous vous recommandons vivement de lire le [README][htm] de html si vous êtes intéressé par cette méthode.

## Meilleur pratique, avec `preact-cli`

Le projet `preact-cli` a crée la meilleur solution pour livrer des applications Preact à l’empaquetage optimisé pour les meilleurs configurations web. Il est construit avec des outils standard comme `webpack`, `babel` et `postcss`. Du par ca simplicité c'est le choix le plus populaire pour utiliser Preact parmis nos utilisateurs.

Comme le nom l'implique, `preact-cli` est une **c**commande en **l**igne de commande qui peut être utilisé sur le terminal de votre machine. Installez le globalement en lancant:
```bash
npm install -g preact-cli
```

Après, vous aurez une nouvelle commande dans votre terminal appelé `preact`. Avec celle-ci vous pouvez créer une nouvelle application en utilisant la commande suivante:

```bash
preact create default my-project
```

La commande suivante récupère un modèle depuis `preactjs-template/default`, affiche quelques informations et génère un projet à `./mon-projet`.

> Astuce : Chaque dépot Github qui a un dossier `'template'` peut être utilisé comme un template en utilisant `preact create <nom-utilisateur>/<dépot> <nom-du-projet>`

### Premiers pas pour le développement

Nous somme prêt à commencer notre application. Pour lancer le serveur de développement, tapez la commande suivante dans le dossier d'un projet fraichement généré (`mon-projet`)

```bash
# Go into the generated project folder
cd my-project/

# Start the devserver
npm run dev
```

Lorsque le serveur sera lancé vous pourrez accéder à votre application à l'URL qui sera affiché dans la console. Maintenant vous être prêt à développer !

### Faire un empaquetage de production

Il y a un moments où vous voulez enfin deployer votre application. La commande `preact` livre un outil pratique `build` afin de générer un empaquetage compressé.

```bash
npm run build
```

Après la complétion, vous pouvez utiliser le dossier `build/` nouvellement crée qui peut être déployer directement sur le serveur.

> Pour une liste complète des commandes disponibles vérifiez la liste dans le [fichier README](https://github.com/preactjs/preact-cli#cli-options) de preact-cli.

## L'intégrer dans une application existante

Si vous avez déjà un processus de travail existant, c'est très possible que vous aillez déjà des outils d'empaquetage. Le choix le plus populaire est [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) ou [parcel](https://parceljs.org/). Preact fonctionne directement avec chacun d'eux. Aucun changement n'est nécéssaire !

### Mêttre en place JSX

Pour transpiler JSX, vous avez besoin d'un plugin babel qui converti votre code en Javascript valide. Celui que nous utilisons tous est [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Une fois installé vous avez besoin de spécifier une fonction JSX qui devrait être utilisé:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> [babeljs](https://babeljs.io/) est l'une des meilleurs documentation. Nous vous recommandons vivement de la vérifier pour vos questions concernant babel ou comment le configurer.

### Aliasing React à Preact

At some point you'll probably want to make use of the vast react ecosystem. Libraries and Components originally written for React work seamlessly with our compatibility layer. To make use of it we need to point all `react` and `react-dom` imports to Preact. This step is called aliasing.

#### Aliasing dans webpack

Pour alias un paquet dans webpack vous devez ajouter la section `resolve.alias` dans votre configuration.
Suivant la configuration que vous utilisez ceci pourrait déjà être présente mais ayant les alias pour Preact manquant.

```js
const config = {
  //...snip
  resolve: {
    alias: {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat', // Doit être en dessous de test-utils
    },
}
```

#### Aliasing dans parcel

Parcel utilise le fichier standard `package.json` pour lire les configurations sous une clé `alias`.


```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Aliasing dans jest

Similaire aux empaqueteurs (bundlers), [jest](https://jestjs.io/) permet de réécrire le chemin d'un module. Cette syntaxe est un peut différente que, disons dans webpack, parceque celle-ci est basé sur des regex. Ajoutez ceci dans votre configuration jest:

```js
{
  "moduleNameMapper": {
    "react": "preact/compat"
    "react-dom/test-utils": "preact/test-utils"
    "react-dom": "preact/compat"
  }
}
```

[htm]: https://github.com/developit/htm

