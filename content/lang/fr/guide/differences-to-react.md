---
name: Différences avec React
permalink: '/guide/differences-to-react'
---

# Différences avec React

En soit, Preact n'a pas pour but d'être une réimplémentation de React. Il y a des différences. La plupart de ces différences sont triviales, ou peuvent être complètement supprimées en utilisant [preact-compat], qui est une surcouche de Preact légère ayant pour but de fournir une compatibilité complète avec React.

La raison pour laquelle Preact n'essaye pas d'inclure chaque fonctionnalité de React est de rester **léger** et **focalisé** - sinon cela aurait plus de sens de tout simplement proposer des optimisations au projet React, qui est déjà une base de code très complexe et bien architecturée.

## Compatibilité de version

Pour Preact et [preact-compat], la compatibilité de version est mesurée par rapport aux version majeures _actuelle_ et _précédente_ de React. Quand de nouvelles fonctionnalités sont annoncées par l'équipe de React, elles peuvent être ajoutées au coeur de Preact si cela fait sens par rapport aux [buts du projet]. C'est un processus relativement démocratique, en constante évolution à travers des discussions et des décisions transparentes, en utilisant les issues et les pull requests.

> Ainsi, le site web et la documentation reflètent React `0.14.x` et `15.x`, lorsque l'on parle de compatibilité ou qu'on fait des comparaisons.

## Qu'est-ce qui est inclut ?

- [ES6 Class Components]
    - _les classes apportent une façon expressive de définir des composants à état_
- [Composants d'ordre supérieur]  
    - _des composants qui retournent d'autres composants par leur méthode `render()`, des wrappers, en réalité_
- [Stateless Pure Functional Components]  
    - _des fonctions qui reçoivent un argument `props` et retournent du JSX/DOM virtuel_
- [Contextes]: Le support de `context` a été ajouté dans Preact [3.0].
    - _Le context est une fonctionnalité expérimentale de React, mais il a été adopté par certaines bibliothèques._
- [Références]: Le support des références fonctionnelles a été ajouté dans Preact [4.0]. Les références en chaîne de caractères sont supportée dans `preact-compat`.
    - _Les références fournissent une façon de se référer à un élément qui a été rendu et aux composants fils._
- Comparaison de DOM Virtuel
    - _C'est donné - La comparaison de Preact est simple mais efficace, et **[extrêmement](http://developit.github.io/js-repaint-perfs/) [rapide](https://localvoid.github.io/uibench/)**._
- `h()`, une version plus généralisée de `React.createElement`
    - _Cette idée étant originellement appelée [hyperscript] et a une portée au-delà de l'écosystème de React, donc Preact favorise le standard original. ([Lire: pourquoi `h()` ?](http://jasonformat.com/wtf-is-jsx)_
    - _C'est aussi un peu plus lisible : `h('a', { href:'/' }, h('span', null, 'Home'))`_


## Qu'est-ce qui a été ajouté ?

En fait, Preact ajoute quelques fonctionnalités pratiques inspirées par le travail de la communauté React :

- `this.props` et `this.state` sont passées à `render()` pour vous
    - _Vous pouvez toujours les référencer manuellement. C'est juste plus propre, particulièrement quand vous [destructurez]_
- Mise à jour des éléments du document (DOM) par lot en utilisant la fonction `setTimeout(1)` _(sur des navigateurs plus récents la fonction `requestAnimationFrame` est utilisée)_. Pour éviter une trop grande variance dans leur mise à jour, un mécanisme de `debounce` est utilisé.
- Vous pouvez utiliser `class` pour les classes CSS. `className` est toujours supportée, mais `class` est préféré.
- Recyclage et groupement de composants et d'éléments.


## Qu'est-ce qu'il manque ?

- La validation des [PropType] : Tout le monde n'utilise pas les PropTypes, donc ils ne font pas partie du coeur de Preact.
    - _**Les PropTypes sont totalement supportés** dans [preact-compat], ou vous pouvez les utiliser manuellement._
- [Children]: Pas nécéssaire dans Preact, parce que `props.children est _toujours un Array_.
    - _`React.Children` est totalement supporté dans [preact-compat]._
- Événements synthétiques : Les navigateurs supportés par Preact n'ont pas besoin de cet ajout.
    - _Preact utilise la méthode `addEventListener` nativement supportée par les navigateurs pour la gestion des événements. Voir [GlobalEventHandlers] pour une liste complète des gestionnaires d'événement DOM._
    - _Une complémentation complète des événements signifirait plus de problèmes de maintenance et de performances, ainsi qu'une API plus étendue._


## Qu'est-ce qui est différent ?

Preact et React présentent quelques subtiles différences :

- `render()` accepte un troisième argument, qui est le noeud racine à _remplacer_, sinon ça ajoute le noeud. Cela pourrait un peu changer dans une future version, peut-être en détectant automatiquement qu'un remplacement est approprié, en inspectant le noeud racine.
- Les composants n'implémentent pas `contextTypes` ou `childContextTypes`. Les enfants reçoicent toutes les entrées du `context` définies dans `getChildContext()`.

[buts du projet]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contextes]: https://facebook.github.io/react/docs/context.html
[Références]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[ES6 Class Components]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[Composants d'ordre supérieur]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Stateless Pure Functional Components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructurez]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state
