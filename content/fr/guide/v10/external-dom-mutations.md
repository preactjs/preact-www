---
name: Mutations DOM externes
permalink: '/guide/external-dom-mutations'
description: "Comment intégrer Peact avec jQuery et d'autres extraits JavaScript qui mutent le DOM directement"
---

# Mutation DOM externe

Parfois on a besoin de travailler avec une librairie qui a besoin de manipuler librement le DOM, sauvegarder des états en celui-ci, ou qui n'a aucune limite de composant. Il y a beaucoup de très bon outils réutilisables qui fonctionnent de cette manière.

En Preact (et de manière similaire, en React), travailler avec ce type de libraire demande à ce que vous disiez à l'algorithme de changement du DOM virtuel qu'il ne devrait pas essayer de _défaire_ les changements DOM externes fait à l'intérieur d'un composant (`Component`) ou l'élément DOM qu'il représente.

---

<toc></toc>

---

## Technique

Ceci peut être aussi simple que définir une méthode `shouldComponentUpdate()` sur votre composant, et lui faire retourner `false`:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... ou pour le raccourcie:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Avec ce hook sur le cycle de vie, et en disant à Preact de ne pas refaire un rendu sur le composant quand des changements se font dans l'arbre VDOM (DOM virtuel), votre composant a maintenant une référence à son élément DOM racine qui peut être considéré comme static jusqu'à ce que le composant est retiré du DOM (unmounted). Comme tous les composants cette référence s'appelle tout simplement `this.base`, et correspond à la racine de l'élément JSX qui a été retourné par `render()`.

---

## Exemple pas à pas

Ceci est est un exemple de comment on peut "éteindre" la re-génération du rendu d'un composant. Notez que `render()` est toujours invoqué dans la procédure où l'on crée et charge le composant afin de générer sa structure DOM initiale.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // Ne re-fait pas le rendu via l'algorithme de différenciation (`diff`)
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // Vous pouvez faire quelque chose avec les paramètres entrant ici
  }

  componentDidMount() {
    // maintenant qu'il est chargé, vous pouvez modifier le DOM librement
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // le composant est sur le point d'être supprimé du DOM, faites un nettoyage.
  }

  render() {
    return <div class="example" />;
  }
}
```


## Démonstration

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Voir cette démo sur Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Exemples dans la vie réel

Alternativement, vous pouvez voir cette technique en action sur [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - ceci utilise un composant comme une attache au DOM, mais désactive ensuite les mises-à-jours et permet [tags-input](https://github.com/developit/tags-input) re reprendre la main. Un exemple plus complexe peut être [preact-richtextarea](https://github.com/developit/preact-richtextarea), qui utilise cette technique afin d'éviter de re-générer un rendu sur une `<iframe>`
