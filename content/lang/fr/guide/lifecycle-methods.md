---
name: Méthodes du cycle de vie
permalink: '/guide/lifecycle-methods'
---

# Méthodes du cycle de vie

> _**Note:** Si vous avez déjà utilisé les HTML5 Custom Elements, c'est similaire aux méthodes `attachedCallback` et `detachedCallback`._

Preact invoque les méthodes suivantes durant le cycle de vie d'un composant:

| Nom de la méthode           | A quel moment                                                    |
|-----------------------------|------------------------------------------------------------------|
| `componentWillMount`        | Avant que le composant soit monté dans le DOM                    |
| `componentDidMount`         | Après que le composant a été monté dans le DOM                   |
| `componentWillUnmount`      | Avant que le composant soit démonté du DOM                       |
| `componentDidUnmount`       | Après que le composant a été démonté du DOM                      |
| `componentWillReceiveProps` | Avant que les nouvelles propriétés du composant soient acceptées |
| `shouldComponentUpdate`     | Avant `render()`. Retournez `false` pour arrêter le render       |
| `componentWillUpdate`       | Avant `render()`                                                 |
| `componentDidUpdate`        | Après `render()`                                                 |
