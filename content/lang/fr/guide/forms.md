---
name: Formulaires
permalink: '/guide/forms'
---

# Formulaires

Dans Preact, les formulaires fonctionnent globalement de la même façon que dans React, à l'exception près qu'il n'y a pas de support pour les props/attributs "statiques" (valeur initiale).

**[Documentations des formulaires React](https://facebook.github.io/react/docs/forms.html)**


## Composants Controllés et Non Controllés

La documentation de React sur les [Composants "Controllés"](https://facebook.github.io/react/docs/forms.html#controlled-components) et [Composants "Non-controllés"](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) est très utiles pour comprendre comment appréhender les formulaires HTML, qui utilise un flux de données bidirectionnel, et comment les utiliser dans le contexte d'un rendu de DOM Virtuel basé sur des composants, qui utilise généralement un flux de données unidirectionnel.

Généralement, vous devriez essayer de toujours utiliser les composants _Controllés_. Toutefois, lorsqu'on construit des composants isolés ou qu'on enrobe des bibliothèques externes, il peut être utile de simplement utiliser votre composant comme un point de montage pour des fonctionnalités qui ne sont pas liées à preact. Dans ces cas là, les composants "Non controllés" correspondent à ce que vous souhaitez faire.


## Checkboxes & boutons Radios

Les checkboxes et les boutons radio (`<input type="checkbox|radio">`) peuvent être source de confusion lorsque vous construisez des formulaires contrôlés. C'est parce que dans un environnement non contrôlé, nous autoriserions typiquement le navigateur à "basculer" ou "cocher" une checkbox ou un bouton radio pour nous, en écoutant un événement "change" et en réagissant en fonction de la nouvelle valeur. Mais cette technique ne se transpose pas bien dans un monde où l'interface utilisateur est toujours mise à jour automatiquement en réponse à un changement du state ou des props.

> **Exemple :** Disons que nous écoutons un événement "change" sur une checkbox, qui est déclenché lorsque la checkbox est cochée ou décochée par l'utilisateur. Dans notre gestionnaire d'événement "change", nous affectons la nouvelle valeur reçue par la checkbox dans le `state`. Cela déclenchera un nouveau rendu de notre composant, qui va réassigner la valeur de la checkbox selon la valeur du state. Ce n'est pas nécessaire, parce que nous venons de demander au DOM une valeur, puis lui avons demandé de se mettre à jour avec n'importe quelle valeur.

Donc, au lieu d'écouter un événement `change`, nous devrions écouter un événement `click`, qui est déclenché à chaque fois que l'utilisateur clique sur la checkbox _ou un `<label>` associé_. Les checkboxes ne font que basculer entre les booléens `true` et `false`, donc en cliquant sur la checkbox ou le label nous allons inverser la valeur que nous avons dans le state, et déclencher un nouveau rendu qui affectera la valeur affichée de la checkbox à celle que nous souhaitons.

### Exemple de checkbox

```js
class MyForm extends Component {
    toggle = e => {
        let checked = !this.state.checked;
        this.setState({ checked });
    };
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={this.toggle} />
            </label>
        );
    }
}
```
