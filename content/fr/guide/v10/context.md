---
name: Contexte
description: 'Le contexte vous permet de passer des paramètres (`props`) à travers des composants intermédiaires. Ce document décrit comment l'ancienne et la nouvelle API fonctionne.'
---

# Contexte

Le contexte vous permet de passer une valeur à travers les `props` à un enfant plus bas dans l'arbre sans avoir à passer à travers tous les composants qui se trouvent entre. Il permet par exemple de pouvoir gérer des thèmes personalisés. En quelques mots, le contexte permet de faire des mise à jour dans Preact dans un style publieur / abonné. (terme originel : pub-sub)

Il y a deux différents moyens d'utiliser `context`: Via la nouvelle API `createContext` et l'ancienne API héritée. La différence entre les deux est que l'ancienne ne peut pas mettre à jour un enfant lorsqu'un élément parent interrompt le rendu en utilisant `shouldComponentUpdate`. C'est pourquoi il est très recommandé d'utiliser `createContext`.

---

<toc></toc>

---

## createContext

En premier, nous avons besoin de créer un objet de contexte que nous puissions passer en paramètre. Ceci est fait via la fonction `createContext(initialValue)`, qui retourne un composant `Provider` (Publieur) qui est utilisé pour définir la valeur du contexte et un `Consumer` (Abonné) qui est responsable de récupérer la valeur du contexte.


```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => {
        return <button {...props} class={'btn ' + theme}>Bouton à thème</button>;
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    <Theme.Provider />
  );
}
```

> Une façon plus simple d'utiliser un contexte est d'utiliser le "hook" [useContext](/guide/v10/hooks#context).

## L'API contexte héritée (dite "Legacy")

Nous incluons l'API héritée principalement à des fins de rétrocompatibilité. Elle a été remplacée par l'API `createContext`. L'API héritée est connue pour avoir des problèmes comme le blocage de mise-à-jours s'il y a des composants intermédiaires qui retournent `false` à `shouldComponentUpdate`. Si vous souhaitez l'utiliser malgré tout, vous pouvez continuer à lire.

Pour passer une variable personnalisée à travers le contexte, un composant a besoin d'avoir la méthode `getChildContext`. Vous pouvez y retourner les nouvelles valeurs que vous voulez stocker dans le contexte. Le contexte peut être accédé à travers le second argument dans le cas d'une fonction, ou `this.context` dans le cas d'un composant de classe.

```jsx
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Themed Button
    </button>;
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light'
    }
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
```
