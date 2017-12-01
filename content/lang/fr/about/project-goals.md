---
name: Les objectifs de Preact
permalink: '/about/project-goals'
---

# Les objectifs de Preact

## Objectifs

Preact vise à remplir certains objectifs clés :

- **Performance:** Afficher rapidement et efficacement
- **Taille:** Petit, léger _(environ 3.5kb)_
- **Efficacité:** Utilisation efficace de la mémoire _(recyclage, éviter le ramasse-miettes)_
- **Compréhensibilité:** Comprendre le code ne devrait pas prendre plus de quelques heures
- **Compatibilité:** Preact a pour but d'être _largement compatible_ avec l'API de React. [preact-compat] tente d'ajouter le maximum de compatibilité possible avec React.

## Non-objectifs

Certaines fonctionnalités de React sont volontairement absentes de Preact, soit parce qu'elles ne sont pas réalisables en prenant en compte les objectifs principaux de Preact listés ci-dessus ou parce qu'elles n'entrent pas dans le cadre des fonctionnalités essentielles de Preact.

- Les éléments listés dans [Que manque-t-il ?](/guide/differences-to-react#whats-missing):
    - les PropTypes, qui peuvent facilement être utilisées comme une bibliothèque tierce
    - les Children, puisque Preact place toujours les children dans un tableau
    - les événements synthétiques, puisque Preact n'essaye pas de réparer les problèmes dans les anciens navigateurs comme IE8

[preact-compat]: https://github.com/developit/preact-compat/
