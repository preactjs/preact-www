---
name: Modification Externe du DOM
permalink: '/guide/external-dom-mutations'
---

# Modification Externe du DOM


## Présentation

Parfois vous avez besoin de travailler avec des bibliothèques externes qui ont besoin de pouvoir modifier librement le DOM, persister le state dans celui-ci, ou ne sont pas contraintes à l'intérieur d'un composant. Il existe beaucoup de très bonnes boîtes à outils ou d'éléments réutilisables qui fonctionnent de cette façon. Dans Preact (tout comme React), travailler avec ce type de bibliothèques demande à ce que vous disiez à l'algorithme de rendu et de comparaison du DOM Virtuel qu'il ne doit pas essayer _d'annuler_ les modifications externes du DOM effectuées dans un composant donné (ou dans l'élément DOM qu'il représente).

## Technique

Cela peut être aussi simple que de définir une méthode `shouldComponentUpdate()` dans votre composant, et retourner `false` :

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... ou de manière raccourcie :

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Avec cette méthode de cycle de vie demandant à Preact de ne pas re-rendre le composant lorsque des modifications sont effectuée dans l'arbre de DOM virtuel en place, votre composant possède maintenant une référence vers son élément DOM racine qui peut être traitée comme statique jusqu'à ce que le composant soit démonté. Cette référence est simplement appelée `this.base`, et correspond à l'élément JSX racine qui a été retourné par `render()`.

---

## Exemple

Voici un exemple de désactivation du re-rendering pour un composant. Notez que `render()` est toujours invoqué lors de la création et du montage du composant, afin de générer sa structure DOM initiale.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // ne pas re-rendre après comparaison :
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // vous pouvez faire quelque chose avec les nouvelles props si vous le souhaitez ici
  }

  componentDidMount() {
    // un fois monté, vous pouvez modifier le DOM librement :
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // le composant est sur le point d'être supprimé du DOM, vous pouvez faire du nettoyage
  }

  render() {
    return <div class="example" />;
  }
}
```


## Démonstration

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Voir cette démo sur Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Exemples réels

Vous pouvez aussi voir cette technique en action dans [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - cela utilise un composant comme point d'appui dans le DOM, puis désactive les mises à jour et laisse [tags-input](https://github.com/developit/tags-input) prendre la main. Un exemple plus complexe pourrait être [preact-richtextarea](https://github.com/developit/preact-richtextarea), qui utilise cette technique pour éviter de re-rendre une `<iframe>` modifiable.
