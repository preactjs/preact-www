---
name: Contexte
description: 'Le contexte vous permet de passer des paramètres (`props`) à travers des composants intermédiaires. Ce document décris comment la nouvelle et ancienne API fonctionnent.'
---

# Contexte

Le contexte vous permet de passer une valeur à travers les `props` à un enfant en bas de l'arbre sans avoir à passer à travers tous les composants qui se trouvent entre. Un cas d'utilisation très populaire par exemple est le thème. En quelques mots, le contexte permet de faire des mise à jours dans Preact dans un style publicateur / abonné. (terme originel : pub-sub)

Il y a deux différents moyens d'utilise `context`: Via la nouvelle API `createContext` et l'ancienne API hérité. La différence entre les deux est que l'ancienne ne peut pas mettre à jour un enfant lorsqu'un élément parent interrompt le rendu en utilisant `shouldComponentUpdate`. C'est pourquoi il est très recommandé d'utiliser `createContext`.

---

<toc></toc>

---

## createContext

En premier, nous avons besoin de créer un objet context que nous pouvons passer en paramètre. Ceci est fait via la fonction `createContext(initialValue)`, qui retourne un composant `Provider` qui est utilisé pour définir la valeur du contexte et un `Consumer` qui est responsable de récupérer la valeur du contexte.


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

> Une façon plus simple d'utiliser contexte est d'utiliser le "hook" [useContext](/guide/v10/hooks#context).

## L'API contexte hérité (dite "Legacy")

Nous incluons l'API hérité principalement pour des raison de compatibilités à rebours. Elle a été remplacé par l'API `createContext`. L'API hérité est connu pour avoir des problèmes comme le blocage de mise-à-jours s'il y a des composants intermédiaires qui retournent `false` à `shouldComponentUpdate`. Si vous souhaitez l'utiliser malgré tout, vous pouvez continuer à lire.

Pour passer une variable personnalisé à travers le contexte, un composant a besoin d'avoir la méthode `getChildContext`. Vous pouvez y retourner les nouvelles valeurs que vous voulez stocker dans le contexte. Le contexte peut être accéder à travers comme second argument dans le cas d'une fonction, et `this.context` dans le cas d'un composant de class.

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
