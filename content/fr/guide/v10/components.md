---
name: Composant `Components`
descriptions: 'Les composants sont le coeur des application Preact. Apprenez comment vous en servir et composez des UI'

---

# Composant

Les composants (`Component`) représentent le bloc de construction de base de Preact. Il sont fondamentaux pour construire facilement des UI complexes. Ils sont aussi responsables d'attacher l'état (`state`) à notre rendu de sortie.

Il y a deux types de composants dans Preact, et nous allons les voir dans ce guide.

---

<toc></toc>

---

## Composant fonctionnel

Les composants fonctionnels sont des simples fonctions qui reçoivent en paramètre `props` comme premier argument. Le nom de la fonction **doit** commencer avec une majuscule pour qu'elles soient reconnues avec JSX.

```jsx
function MyComponent(props) {
  return <div>Mon nom est {props.name}.</div>;
}

// Usage
const App = <MyComponent name="John Doe" />;

// Renders: <div>Mon nom est John Doe.</div>
render(App, document.body);
```

> NB : dans des versions antérieures elles étaient connues comme des composants sans état mais ceci n'est plus vrai depuis les [`Hooks`](/guide/v10/hooks)

## Composant de classe

Les composants class ont un état et des méthodes de cycle de vie. Ces dernières sont des méthodes spéciales qui seront appelés lorsque le composant est attaché au DOM ou lorsqu'il est détruit, par exemple.

Ici, nous avons une simple classe composant appelé `<Clock>` qui affiche le temps actuel:

```js
class Clock extends Component {
  state = { time: Date.now() }

  // Cycle de vie: Appellé lorsque notre composant est crée
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Cycle de vie: Appelé lorsque notre composant est détruit
  componentWillUnmount() {
    // s'arrête lorsqu'il n'est plus affichable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
```

### Méthodes de cycle de vie

Afin de permettre à l'horloge de se mettre à jour toutes les secondes, nous avons besoin de savoir quand `<Clock>` est monté au DOM. _Si vous avez utilisé des éléments personnalisés HTML5, ceci est similaire aux méthodes de cycle de vie `attachedCallback` et `detachedCallback`._ Preact invoque ces méthodes en suivant le cycle suivant s'ils sont défini dans le composant:

| Méthode de cycle de vie     | Quand est ce qu'elle est appelé                 |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | (obsolète) avant que le composant soit monté dans le DOM|
| `componentDidMount`         | après que le composant soit monté dans le DOM    |
| `componentWillUnmount`      | avant la suppression de l'élément du DOM         |
| `componentWillReceiveProps` | (obsolète) avant que de nouveaux paramètres soient ajoutés |
| `getDerivedStateFromProps`  | juste avant `shouldComponentUpdate`. À utiliser avec précaution. |
| `shouldComponentUpdate`     | avant `render()`. Retourner `false` pour sauter le rendu |
| `componentWillUpdate`       | (obsolète) appelé avant `render()`                                |
| `getSnapshotBeforeUpdate`   | appelé avant `render()` |
| `componentDidUpdate`        | appelé après `render()`                                 |

> Voir [ce diagramme](https://twitter.com/dan_abramov/status/981712092611989509) pour avoir un visuel de leurs relations.

#### componentDidCatch

Une de ces méthodes est particulière : `componentDidCatch`. Elle est spéciale car elle permet de gérer les erreurs qui apparaissent pendant le rendu. Ceci inclus les erreurs qui apparaissent dans les fonctions attachés aux cycle de vie, mais exclut toute erreur gérée de manière asynchrone (Comme après un appel `fetch()`).

Quand une erreur est lancée, nous pouvons utiliser cette méthode pour réagir à cette dernière, et afficher un joli message d'erreur ou tout autre contenu de retrait.


```jsx
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Quelque chose s'est mal passé</p>;
    }
    return props.children;
  }
}
```

## Fragments

Un `Fragment` permet de retourner plusieurs éléments à la fois. Ils résolvent une limitation du JSX qui demande que chaque bloc ne doit avoir qu'un seul élément racine (`root`). Vous les rencontrerez souvent en combinaison avec les listes, les tables ou le CSS Flexbox où chaque élément intermédiaire aurait autrement un style différent.

```jsx
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Renders:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Notez que les transpilateurs modernes vous permettent d'utiliser une syntaxe plus courte pour `Fragments`. Ce raccourci est bien plus commun et sera celui que vous rencontrerez le plus souvent.

```jsx
// This:
const Foo = <Fragment>foo</Fragment>;
// ...is the same as this:
const Bar = <>foo</>;
```
