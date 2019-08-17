---
name: Référence API
description: ‘Apprenez en plus à propos de toutes les fonctions exporté Preact’
---

# Référence API

Cette page sert de rapide vue d’ensemble de toutes les fonctions exportées.


---

<toc></toc>

---

## Preact.Component

`Component` est une classe de base dont vous allez généralement hériter afin de créer des composants Preact ayant leur propre état.

### Component.render(props, state)

Tous les composants doivent implémenter la fonction `render()`. Elle reçoit les propriétés et l'état du composant, et doit retourner un élément Preact ou null.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Bonjour, {props.name}!</h1>;
	}
}
```

Pour en apprendre d’avantage à propos des `Components` et comment ils peuvent être utilisés, visitez la page [Components](guide/v10/components).

## render()

`render(component, containerNode, [replaceNode])`

Change un composant Preact en élément DOM `containerNode`. Retourne une référence à l'élément DOM rendu.

Si le paramètre optionnel `replaceNode` est fourni avec un élément DOM et que celui-ci est un enfant de `containerNode`, Preact fera une mise-à-jour et remplacera cet élément en utilisant son algorithme de différenciation.

```js
import { render } from 'preact';

const Foo = () => <div>foo</div>;

// DOM avant le rendu:
// <div id="container"></div>
render(<Foo />, document.getElementById('container'));
// Après rendu:
// <div id="container">
//  <div>foo</div>
// </div>

// DOM avant rendu:
// <div id="container">
//   <div>bar</div>
//   <div id="target"></div>
// </div>
render(
  Foo,
  document.getElementById('container'),
  document.getElementById('target')
);
// Après rendu:
// <div id="container">
//   <div>bar</div>
//   <div id="target">
//     <div>foo</div>
//   </div>
// </div>
```

## hydrate()
Lorsque vous utilisez un DOM pré-rendu, il n'y a pas besoin de faire en rendu encore une fois. Avec `hydrate`, la plupart de la phase de différenciation sera sauté à l'exception des écoute d'évènements. C'est principalement utilisé en conjonction avec le rendu coté serveur (en anglais SSR : [Server-Side Rendering](/guide/v10/server-side-rendering)).


```jsx
import { render } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container));
```

## h() / createElement()

`h(nodeName, attributes, [...children])`

Retourne un élément DOM virtuel Preact (en anglais : Preact Virtual DOM) avec les `attributes` donnés.

Les arguments suivant sont collectés dans une liste de `children` (enfants), et peuvent être :

- Une valeur scalaire (chaine de caractère, nombres, booléen, null, undefined, etc...)
- D'autres éléments DOM virtuel
- Une infinité de chaine imbriqués d'éléments spécifiés ci-dessus

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Bonjour!');
// <div id="foo">Bonjour!</div>

h('div', { id: 'foo' }, 'Bonjour', null, ['Preact!']);
// <div id="foo">Bonjour Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Bonjour!')
);
// <div id="foo"><span>Bonjour!</span></div>
```

## toChildArray

Cette fonction d'aide convertira toujours des enfants en liste. Si le paramètre est déjà une liste ceci ne fera rien. Cette fonction est nécessaire parce que le paramètre `children` ne garantit pas d'être une liste.

Si un élément ne contient qu'un seul enfant, celui-ci le recevra directement. Ce n'est seulement que lorsqu'il y a plusieurs enfants que vous pouvez être certain que `children` sera une liste.

Cependant, `toChildArray` retournant toujours une liste, cela vous facilitera la vie concernant leur prise en charge.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// children is not an array
render(<Foo>bar</Foo>, container);

// Children is an array
render((
  <Foo>
    <p>A</p>
    <p>B</p>
  </Foo>,
  container
);
```

## cloneElement

Cette fonction vous permet de faire un clonage superficiel d'un composant et d'en faire le rendu autre part.

## createContext

Voir dans la section [Documentation du contexte](/guide/v10/context#createcontext).

## createRef

Voir dans la section [Documentation des références](/guide/v10/refs#createref).

## Fragment

Un type spécial de composant qui ne fait aucun rendu dans le DOM. Il permet à un composant de retourner plusieurs enfants sans avoir besoin de les emballer dans une balise div.

```jsx
import { Fragment, render } from 'preact';

render((
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>
), container);
// Renders:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
