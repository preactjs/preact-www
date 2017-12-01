---
name: Référence API
permalink: '/guide/api-reference'
---

# Référence API

## `Preact.Component`

`Component` est une classe de base dont vous allez généralement hériter afin de créer des composants Preact ayant leur propre état.

### `Component.render(props, state)`

Tous les composants doivent implémenter la fonction `render()`. Elle reçoit les propriétés et l'état du composant, et doit retourner un élément Preact ou `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

### Méthodes de cycle de vie

> _**Astuce:** Si vous avez déjà utilisé les Custom Elements HTML5, c'est similaire aux méthodes de cycle de vie `attachedCallback` `detachedCallback`._

Preact déclenche les méthodes de cycle de vie suivantes si elles sont définies dans un composant :

| Méthode de cycle de vie            | Quand est-elle déclenchée ?                              |
|------------------------------------|----------------------------------------------------------|
| `componentWillMount`               | avant que le composant soit monté dans le DOM            |
| `componentDidMount`                | après que le composant ait été monté dans le DOM         |
| `componentWillUnmount`             | avant de supprimer le composant du DOM                   |
| `componentWillReceiveProps`        | après que de nouvelles propriétés aient été acceptées    |
| `shouldComponentUpdate`            | avant `render()`. Retourner `false` pour éviter le rendu |
| `componentWillUpdate`              | avant `render()`                                         |
| `componentDidUpdate`               | après `render()`                                         |

Toutes les méthodes de cycle de vie et leurs paramètres sont présentes dans l'exemple de composant suivant :

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // props précédentes
		this.state // state précédent
	}
	componentWillMount() {}
	componentDidMount() {}
	componentDidUpdate() {}
	componentWillUnmount() {
		this.props // props courantes
		this.state // state courant
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Rend un composant Preact dans le noeud DOM `containerNode`. Retourne une référence vers le noeud DOM créé.

Si le noeud DOM optionnel `replaceNode` est fournit et que c'est un noeud fils de `containerNode`, Preact mettra à jour et remplacera cet élément en utilisant son algorithme de comparaison. Dans le cas contraire, Preact ajoutera l'élément créé à `containerNode`.

```js
import { render } from 'preact';

// Ces exemples montrent comment render() se comporte sur une page avec le code HTML suivant :
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// Ajoute MyComponent à container
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// Compare MyComponent avec <h1>My App</h1>
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Retourne un élément de DOM virtuel Preact avec les attributs fournits par `attributes`.

Tous les arguments restants sont réunis dans un tableau `children`, et sont d'un des types suivants :

- Valeurs scalaires (string, number, boolean, null, undefined, etc)
- Plus d'élément de DOM virtuel
- Des tableaux infiniment imbriqués de ce qui précède

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>
```
