---
name: Différences avec React
permalink: '/guide/differences-to-react'
description: 'Différences détaillées entre Preact et React'
---

# Différences à React

Preact en soit même n'est pas fait pour être une ré-implémentation de React. Il y a des différences, beaucoup d'entre elles sont triviales, peut être complètement supprimés en utilisant [preact/compat], qui est une fine couche au dessus de Preact afin de lui permettre d'avoir 100% de compatibilité avec React.

La raison pour laquelle Preact n'essaie pas d'inclure toutes les fonctionnalités de React est qu'elle est faite pour rester **petite** et **concentré** - autrement, cela aurait eu plus de sense de soumettre des optimisations au projet React, qui a déjà une architecture complexe et solide.

---

<toc></toc>

---

## Principales différences

La principal différence en comparant une application Preact et React est que nous ne livrons pas un système de gestion d'événement synthétique. Preact utilise la gestion d'événement native `addEventlistener` pour gêrer les évènements internes. Voir [Evénements Globaux] pour une liste complète des événements DOM.

Une gestion synthétique n'a pas de sense car le navigateur supporte toutes les fonctionnalités dont nous avons besoin. Une implémentation d'une gestion d'événement personnalisé augmenterait nos frais de développement et une surface d'API plus large.

L'autre principal différence est que nous suivons d'un peu plus prêt les spécifications DOM. Un exemple est que nous permettons d'utiliser `class` au lieu de `className`.


## Compatibilité de Versions

Pour Preact et [preact/compat], la compatibilité de version est mesuré avec la version majeure _actuel_ et _précédente_ de React. Quand de nouvelles fonctionnalités sont annoncés par l'équipe de React, elles pourraient être ajouté à Preact si cela a du sens avec les [objectifs du projet]. Ceci est un processus démocratique, constamment évoluant à travers les discussions et les décisions faite ouvertement, utilisant des tickets (issues) et des propositions de modification (pull-requests).

> Ainsi, le site et la documentation utilisent React `0.16.x` et `15.` lorsque l'on parle de compatibilité et de comparaisons.


## Fonctionnalités unique à Preact

Preact a décidé d'ajouter quelques fonctionnalités pratique inspirés par le travail de la communauté (P)React.

### Arguments dans `Component.render()`

Nous passons `this.props` et `this.state` d'une classe composant à `render()`. vous pouvez voir que ce composant utilise un seul paramètre (`prop`) et une seul propriété d'état (`state property`).

```jsx
// Fonctionne à la fois avec Preact et React
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```
En Preact, ceci peut aussi être écrit comme ceci:

```jsx
// Fonctionne seulement en Preact
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```
Les deux extraits vont faire exactement le même rendu. Ce n'est qu'une question de préférence stylistique.

### attributs HTML brut / noms des propriétés
Avec Preact nous suivons d'un peu plus prêt les spécifications DOM. Une principale différence est que nous permettons d'utiliser `class` au lieu de `className`.

```jsx
// This:
<div class="foo" />

// ...est le même que:
<div className="foo" />
```
La plupart des développeurs Preact préfèrent d'utiliser une `class` parce que c'est plus court à écrire mais les deux sont supportés.

### Utiliser `onInput` au lieu de `onChange`

Pour des raisons historique, React a simplement lié (aliased) `onChange` à `onInput`. La dernière est celle utilisé par le DOM et est supporté partout. L'événement `input` est celui principalement celui qui est utilisé dans tous les cas où vous souhaitez être notifié lorsque l'élément de contrôle de formulaire (`input`, `textarea`, `checkbox`, etc...) est mis-à-jour.


```jsx
// React
<input onChange={e => console.log(e.target.value)} />

// Preact
<input onInput={e => console.log(e.target.value)} />
```
Si vous utilisez [preact/compat] nous mettrons en place cet alias 'onChange' à `onInput` globalement de manière similaire à React. Ceci est une des astuces que nous utilisons pour nous assurer d'une compatibilité avec l'écosystème de React.

### JSX-Constructor
Cette idée était originellement appellé [hyperscript] et a de la valeur bien au dela de l'écosystème React, alors Preact promu le standard originel. ([Lire : pourquoi `h()`?]((http://jasonformat.com/wtf-is-jsx)). Si vous regardez la sortie transpilé, ce sera plus simple à lire que `React.createElement`.

```js
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// vs
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```
Dans la plupart des applications Preact vous rencontrerez `h()`, mais nous supportons les deux, alors peut importe celui que vous utiliserez.

### Pas besoin de contextTypes

L'API hérité `Context` a besoin que les `Component` implémente `contextTypes` ou `childContextTypes` dans react. Avec Preact nous n'avons pas cette limitation et tous les composants reçoivent toutes les entrées `context` récupérés dans `getChildContext()`.

## Fonctionnalités exclusives à `preact/compat`

`preact/compat` est notre couche de **compat**ibilité qui traduit du code React en Preact. Pour des utilisateurs de React existant il est très simple d'utiliser Preact en mêttant en place quelques alias dans leur fichier de configuration et laisser le reste du code tel qu'il est.

### Children-API

L'API `children` est spécialisé dans une façon d'itérer les `children` d'un composant. Pour Preact cette API n'est pas nécéssaire et nous recommandons d'utiliser une chaine native à la place.

```jsx
// React
function App(props) {
  return <div>{Children.count(props.children)}</div>
}

// Preact: Convert children to an array and use standard array methods.
function App(props) {
  return <div>{toChildArray(props.children).length}</div>
}
```

### Composants spécialisés

[preact/compat] livre une version spécialisé des composants qui ne sont pas fait pour toutes les applications. Ceci inclus:

- `PureComponent`: Ne se met à jour que si un `props` ou un `state` a changé
- `memo`: Similaire à `PureComponent` mais permet de passer une fonction de comparaison.
- `forwardRef`: Livre une référence (`ref`) à un enfant spécifique d'un composant.
- `Portals`: Continue le rendu dans un container DOM différent.
- `Suspense`: **experimental** Permet de définir un affichage temporaire pendant que le rendu n'est pas fini.
- `lazy`: **experimental** "Lazy load" du code asynchrone et marque l'arbre comme étant prêt ou pas en fonction.

[objectifs du projet]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: #features-exclusive-to-preactcompat
[Evénements Globaux]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers