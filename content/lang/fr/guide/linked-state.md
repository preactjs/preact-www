---
name: Linked State
permalink: '/guide/linked-state'
---

# Etat lié

Un point sur lequel Preact va un peu plus loin que React est l'optimisation des changements du state. Un motif commun dans le code React écrit en ES2015 est d'utiliser les fonctions flèchées dans une méthode `render()` afin de mettre à jour le state en réponse à des événements. Créer des fonctions comprises dans une portée à chaque nouveau rendu n'est pas efficace et force le ramasse miettes à travailler plus que nécessaire.

## La méthode manuelle, plus agréable

Une solution est de déclarer des méthodes attachées au composant en utilisant les propriétés de classes d'ES7 ([champs d'instance de classe](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Bien que cela offre de meilleures performances à l'exécution, cela nécessite toujours beaucoup de code non nécessaire pour lier le state à l'interface utilisateur.

> Une autre solution est de lié les méthodes du composant de manière _déclarative_, en utilisant les décorateurs d'ES7, comme le `@bind` de [decko](http://git.io/decko)


## Etat lié à la rescousse

Heureusement, il y a une solution sous la forme du module de preact [`linkState`](https://github.com/developit/linkstate).

> Les versions précédentes de Preact embarquaient la fonction `linkState()`; toutefois, elle a depuis été déplacée dans un module séparé. Si vous souhaitez restaurer l'ancien comportement, regardez [cette page](https://github.com/developit/linkstate#usage) pour plus d'information à propos de l'utilisation du polyfill.

Appeler `linkState(this, 'text')` retourne une fonction qui, lorsqu'on lui passe un Event, utilise sa valeur associée pour mettre à jour la propriété nommée dans le state de votre composant. Plusieurs appels à `linkState(component, name)` avec le même `component` et le même `name` sont mis en cache, donc il n'y a pas de pénalité au niveau des performances.

Voici l'exemple précédent réécrit en utilisant **le state lié** :

```js
import linkState from 'linkstate';

class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```

C'est concis, facile à comprendre, et efficace. Cela gère la liaison du state de n'importe quel type d'input. Un troisième argument optionnel `'path'` peut être utilisé afin de fournir explicitement un chemin séparé par des points pour la nouvelle valeur de state, pour une liaison plus personnalisée (comme une liaison sur la valeur d'un composant externe).


## Custom Event Paths

Par défaut, `linkState()` essayera d'extrait la bonne valeur à partir d'un événement automatiquement. Par exemple, un élément `<input>` affectera la propriété de l'état à `event.target.value` ou `event.target.checked` en fonction de son type. Pour les gestionnaires d'événement personnalisés, passer des valeurs scalaires au gestionnaire généré par `linkState()` utilisera simplement la valeur scalaire. La plupart du temps, c'est le comportement attendu.

Il y a toutefois des cas où ce n'est pas ce qui est souhaité - les événements personnalisés et les boutons radios groupés sont deux exemples possibles. Dans ces cas-là, un troisième argument peut-être passé à `linkState()` pour spécifier le chemin séparé par des points dans l'objet événement où la valeur peut être trouvée.

Pour comprendre cette fonctionnalité, il peut être utile de jeter un oeil sous le capot de `linkState()`. Ce qui suit illustre un gestionnaire d'événement créé manuellement et qui persiste une valeur d'un objet Event dans le state. Fonctionnellement, c'est équivalent à la version utilisant `linkState()`, sans toutefois inclure l'optimisation de mémorisation qui rend `linkState()` précieux.

```js
// ce gestionnaire renvoyé par linkState :
handler = linkState(this, 'thing', 'foo.bar');

// ...est fonctionnellement équivalent à :
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Illustration: boutons radio groupés

Le code suivant ne fonctionne pas comme prévu. Si l'utilisateur clique sur "no", `noChecked` devient `true` mais `yesChecked` reste à `true`, puisque `onChange` n'est pas éclenché sur l'autre bouton radio :

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```


Le troisième argument de `linkState` est utile ici. Il vous laisse fournir un chemin à utiliser comme la valeur liée sur l'objet événement. En revisitant l'exemple précédent, demandons explicitement à `linkState` de prendre sa nouvelle valeur de state dans la propriété `value` de `event.target` :

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Maintenant l'exemple fonctionne comme on le souhaite !
