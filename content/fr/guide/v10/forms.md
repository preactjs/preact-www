---
name: Formulaires
description: 'Comment créer un formulaire avec Preact qui fonctionnera partout'
---

# Formulaires

Les formulaires dans Preact fonctionnent presque de la même manière qu'en HTML. Vous faites le rendu d'un controleur d'entrée et vous attachez une écoute d'événement (`event listener`) à celui-ci.

La principal différence est que dans la plupart des cas, la `value` n'est pas controlé par le noeud DOM, mais par Preact.

---

<toc></toc>

---

## Composants controllés et non controllés

(`Controlled & Uncontrolled Components`) Lorsque l'on parle de control d'un formulaire nous rencontrerons souvent les termes "Composant controllé" (`Controlled Component`) et "Composant non controllé" (`Uncontrolled Component`). Ces descriptions font référence à la manière dont le flux de donnée est géré. Le DOM a un flux bidirectionel parce que chaque control qu'il effectura gérera l'entrée de l'utilisateur lui même. Une simple entrée de texte mettera toujours à jour sa valeur lorsque l'utilisateur aura écrit dedans.

En contraste, un framework comme Preact a généralement un flux unidirectionnel. Le composant ne gère pas la valeur en soit même, mais quelque chose plus haut dans l'arbre des composants.

```jsx
// Non controlé, parceque Preact n'attribue pas la valeur
<input onInput={myEventHandler} />;

// Controlé, parceque Preact attribue la valeur
<input value={someValue} onInput={myEventHandler} />;
```

Généralement, vous devriez tout le temps essayer d'utiliser des composants _controllés_. Cependant, lorsque vous contruisez des composants autonome ou lorsque vous enrombez une librairie externe, cela peut toujours être util de simplement utiliser votre composant comme point d'entré pour une fonctionnalité non Preact. Dans ces cas, les composants non controllés sont bien adapté pour cette tache.

> note : définir la valeur comme `undefined` ou `null` renderont le composant non controllé

## Créer un simple formulaire

Créons un simple formulaire pour soumettre une entrée dans une liste de notes. Pour cela, nous créons un élément `<form>` et nous l'attachons à une gestion d'événement qui sera appelé lorsque le formulaire sera soumis. Nous faisons quelque chose de similaire qu'avec l'entrée de texte, mais nous sauvergardons les valeur dans la class elle même par nous même. Vous l'avez deviné, nous utilisons ici une entrée _controllé_. Dans cet exemple c'est très util car nous voulons afficher la valeur dans un autre élément.

```jsx
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}<p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Select Input

Un Element `<select>` est un peu plus impliqué, mais fonctionne d'une manière similaire à la validation de formulaire:

```jsx
class MySelect extends Component {
  state = { value: '' };

  onInput = e => {
    this.setState({ value: e.target.value });
  }

  onSubmit = e => {
    alert("Submitted something");
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onInput={this.onInput}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Cases à cocher & cases d'options

Les cases à cocher ou d'option (`<input type="checkbox|radio">`) peuvent initiallement être cause de confusion lorsque l'on crée des formulaires controlés. C'est parce que dans un environement non controllé, nous permetterions au navigateur de cocher une case pour nous, éouter sur des changements d'événements et réagir à la nouvelle valeur. Cependant, cette technique ne fait pas une bonne transition dans un monde ou ce composant change en fonction des changement d'état (`state`) et de paramètres (`props`).

> **Procédure:** Disons que nous souhaiterions écouter les changement d'une case à cocher qui serait activé par l'utilisateur. Dans notre gestion d'événement `input`, nous définissons un état (`state`) à la nouvelle valeur recu par la checkbox. Ceci déclanchera un rendu de notre composant, qui ré-assignera la valeur de la case à cocher à la valeur stocké dans l'état. C'est inutile car nous avons justement demandé au DOM une valeur et ensuite nous lui demandons de refaire un rendu avec la valeur reçu.

Alors, à la place d'écouter un événement `input` nous devrions plutôt écouter un événement `click`, qui sera lancé chaque fois que l'utilisateur cliquera sur la case à coché ou _un label associé_. Une case à cocher ne bascule qu'entre un Booleen `true` et `false`, alors nous nous ne ferons qu'inverser la valeur que nous avons dans l'état et nous déclanchant un rendu, et affichant la case à cocher que nous voulons.

### Exemple de case à cocher

```js
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
      </label>
    );
  }
}
```
