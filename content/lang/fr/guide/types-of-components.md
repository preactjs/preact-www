---
name: Types de composants
permalink: '/guide/types-of-components'
---

# Types de composants

Il y a deux types de composants dans Preact :

- Les composants classiques, avec des [méthodes de cycle de vie] et un état.
- Les composants fonctionnels sans état, qui sont des fonctions qui prennent en paramètre des `props` et retournent du [JSX].

Entre ces deux types, il y a aussi plusieurs façons d'implémenter les composants.


## Exemple

Prenons un exemple : un simple composant `<Link>` qui crée un élément HTML `<a>` : 

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Nous pouvons instancier/rendre ce composant comme ceci :

```xml
<Link href="http://example.com">Some Text</Link>
```


### Destructurer les Props et le State

Puisque qu'il est écrit en ES6 / ES2015, nous pouvons simplifier notre composant `<Link>` en faisant correspondre les clefs de `props` (le premier argument de `render()`) à des variables locales en utilisant les [destructuration](https://github.com/lukehoban/es6features#destructuring) :

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Si nous voulions copier _toutes_ les `props` passées à notre composant `<Link>`, nous aurions pu utiliser [l'opérateur spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) :

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Composants fonctionnels sans état

Enfin, nous pouvons voir que ce composant n'a aucun état - nous pouvons le rendre avec les mêmes props et récupérer le même résultat à chaque fois. Quand c'est le cas, il est généralement mieux d'utiliser un composant fonctionnel sans état. Ce sont juste des fonctions qui prennent des `props` en argument, et retournent du JSX.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *Note à propos de ES2015 :* la fonction ci-dessus est une fonction fléchée, et parce que nous avons utilisé des parenthèses à la place des accolades pour le corps de la fonction, la valeur à l'intérieur des parenthèses est retournée automatiquement. Vous pouvez en apprendre plus à ce propos [ici](https://github.com/lukehoban/es6features#arrows).
