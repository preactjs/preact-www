---
name: Commencer
permalink: '/guide/getting-started'
---

# Commencer

Dans ce guide, nous allons créer un simple composant d'horloge. Vous pouvez trouver plus d'information sur chaque sujet dans les pages dédiées dans le menu Guide.

> :information_desk_person: Vous [n'êtes pas obligé d'utiliser ES2015 pour utiliser Preact](https://github.com/developit/preact-without-babel)... mais vous devriez. Ce guide part du principe que vous avez déjà un système de build ES2015 utilisant babel et/ou webpack/browserify/gulp/grunt/etc. Si ce n'est pas le cas, commencez avec [preact-boiletplate] ou un [template CodePen](http://codepen.io/developit/pen/pgaROe?editors=0010).


---


## Importer ce dont vous avez besoin

Le module `preact` fournit à la fois des exports nommés et par défaut, donc vous pouvez tout importer sous le namespace de votre choix, ou juste ce dont vous avez besoin localement.

**Nommé :**

```js
import { h, render, Component } from 'preact';

// Dis à Babel de transformer le JSX en appels à h() :
/** @jsx h */
```

**Par défaut :**

```js
import preact from 'preact';

// Dis à Babel de transformer le JSX en appels à preact.h() :
/** @jsx preact.h */
```

> Les imports nommés fonctionnent bien pour des applications très structurés, alors que l'import par défaut est rapide et n'a jamais besoin d'être mis à jour lorsque vous utilisez différentes parties de la bibliothèque.

### Pragma global

Au lieu de déclarer le pragma `@jsx` dans votre code, il vaut mieux le configurer globalement dans un `.babelrc`.

**Nommé :**
>**Pour Babel 5 et inférieur :**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Pour Babel 6 et 7 :**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Par défaut :**
>**Pour Babel 5 et inférieur :**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Pour Babel 6 et 7 :**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## Rendre du JSX

Preact fournit une fonction `h()` qui transforme votre JSX en éléments de DOM Virtuel _([voici comment](http://jasonformat.com/wtf-is-jsx))_. Il fournit aussi une fonction `render()` qui crée un arbre DOM à partir de ce DOM Virtuel.

Pour rendre du JSX, importez juste ces deux fonctions et utilisez comme ceci :

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("hi!") }>Click Me</button>
	</div>
), document.body);
```

Cela devrait vous paraître simple si vous avez déjà utilisé [hyperscript] ou l'un de ses [nombreux amis](https://github.com/developit/vhtml).

Rendre hyperscript avec un DOM virtuel est inutile, cependant. Nous voulons rendre des composants et les mettre à jour lorsque les données changent - c'est là que le pouvoir du DOM virtuel rayonne. :star2:


---


## Composants

Preact exporte une classe `Component` générique, qui peut être étendue pour créer des boûts d'interface utilisateur encapsulés et indépendants. Les composants supportent toutes les [méthodes de cycle de vie][#the-component-lifecycle] standard de React, comme `shouldComponentUpdate()` et `componentWillReceiveProps()`. Ecrire votre implémentation spécifique de ces méthodes et la meilleure façon de contrôler _quand_ et _comment_ les composants sont mis à jour.

Les composants ont aussi une méthode `render()`, mais à la différence de React, cette méthode reçoit `(props, state)` comme arguments. Cela donne un moyen ergonomique de destructurer `props` et `state` en variables locales qui pourront être référencés dans le JSX.

Jettons un oeil à un composant `Clock` très simple, qui affiche l'heure courante.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// rend une instance de Clock dans <body> :
render(<Clock />, document.body);
```

C'est super. Executer cela produit la structure DOM HTML suivante :

```html
<span>10:28:57 PM</span>
```


---


## Le cycle de vie d'un composant

Pour pouvoir mettre à jour l'heure de l'horloge à chaque seconde, nous devons savoir lorsque `<Clock>` a été monté dans le DOM. _Si vous avez utilisé les HTML5 Custom Elements, c'est similaire aux méthodes de cycle de vie `attachedCallback` et `detachedCallback`._ Preact exécute les méthodes de cycle de vie suivantes si elles sont définies dans un Composant :

| Méthode de cycle de vie            | Quand est-elle appelée ?                                 |
|------------------------------------|----------------------------------------------------------|
| `componentWillMount`               | avant que le composant soit monté dans le DOM            |
| `componentDidMount`                | après que le composant soit monté dans le DOM            |
| `componentWillUnmount`             | avant la suppression du DOM                              |
| `componentWillReceiveProps`        | avant que de nouvelles props soient acceptées            |
| `shouldComponentUpdate`            | avant `render()`. Retournez `false` pour éviter le rendu |
| `componentWillUpdate`              | avant `render()`                                         |
| `componentDidUpdate`               | après `render()`                                         |



Donc, nous voulons démarrer un minuteur qui se déclenche toutes les secondes une fois que le composant a été ajouté au DOM, et l'arrêter si il est supprimé. Nous allons créer le minuteur et stocker une référence vers celui-ci dans `componentDidMount`, et l'arrêter dans `componentWillUnmount`. A chaque déclenchement du minuteur, nous allons mettre à jour l'objet `state` du composant avec une nouvelle valeur de l'heure. Cela aura pour effet de déclencher un nouveau rendu du composant.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// affectation de l'heure initiale :
		this.state.time = Date.now();
	}

	componentDidMount() {
		// mise à jour à chaque seconde :
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// arrêt lors de la suppression
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// rendu d'une instance de Clock dans <body>
render(<Clock />, document.body);
```


---

Maintenant nous avons une [horloge fonctionnelle](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/) !


[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
