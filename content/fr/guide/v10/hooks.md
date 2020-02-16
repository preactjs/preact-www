---
name: Accroches
description: 'Les accroches en Preact vous permettent de composer des comportements ensemble et réutiliser les logiques dans différents composants.'
---

# Accroches

Les accroches (en anglais 'Hooks') est un nouveau concept qui vous permet de composer des états et des effets de bords. Cela vous permet de réutiliser des logiques d'états entre différents composants.

Si vous avez déjà travaillé avec Preact pendant un moment vous pourriez être familier avec des schéma du style `render-props` et `high-order-components` qui vous permettent de faire la même chose. Mais ces solutions ont toujours rendu le code difficile tandis qu'avec les crochets vous pouvez facilement extraire cette logique et la rendre testable unitairement et indépendamment.

De part leur nature fonctionnel, elle peuvent être utilisé dans les composants fonctionnels ('functional components') et évider de nombreux pièges du mot clé `this` que présentent ces classes. Au lieu de cela, les crochets se basent sur les "closures" qui les rendent lié à la valeur et éliminent tout un tas d'erreurs lorsqu'il en vient à la mise-à-jours des états d'une manière asynchrone.

Il y a deux manière d'importer celles-ci, vous pouvez les importer depuis
`preact/hooks` ou `preact/compat`.

---

<toc></toc>

---

## Introduction

C'est plus facile de vous montrer le code et de comparer cela à un composant de classe pour vous donner une idée de leur avantage. Par exemple ce simple exemple de compteur (en anglais Counter):

```jsx
class Counter extends Component {
  state = { value: 0 };

  increment = () => this.setState(prev => ({ value: prev.value +1 }));

  render(_, { value }) {
    return (
      <div>
        Counter: {value}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

Tout ce que le composant fait est un rendu de la `div` et un `button` pour incrémenter le compteur. Ré-écrivons ceci pour le baser sur des accroches:

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```
Jusqu'ici tout est assez similaire. Alors allons une étape plus loins. Nous pouvons maintenant extraire la logique de compteur dans une accroche personnalisée et la rendre réutilisable entre les composants.


```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);
  return { value, increment };
}

// First counter
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      Counter A: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Second counter which renders a different output.
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Counter B: {value}</h1>
      <p>I'm a nice counter</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

Notez comment chacun de `CounterA` et `CounterB` sont complètement indépendants l'un de l'autres.

> Si vous pensez que cela peut être un petit peu étrange, vous n'êtes pas le seul. Cela a prit un moment pour tout le monde à repenser et refaire leurs habitudes.

## L'argument de dépendance

De nombreuses accroches possèdent un argument qui peut être utiliser pour limiter le processus de mise-à-jour de celui-ci. Preact passera sur la liste de dépendance et vérifiera l'égalité des références. Dans le précédent exemple `Counter` nous l'avons utilisé sur `useCallback`:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(
    () => setValue(value + 1),
    // This is the dependency array
    [value]
  );
  return { value, increment };
}
```

Dans cette exemple nous voulons toujours mètre à jours la référence à la fonction rappelé quand `value` change. Ceci est nécéssaire parce que le rappel référencerait toujours la variable `value` de cet objet depuis lorsque l'objet a été crée.


## Les accroches avec état

Ici nous verrons comment nous introduisons des logique d'états dans ces composants fonctionnels.

Avant les accroches nous devions faire une classe composant à chaque fois que nous voulions un état. Ceci a changé.

### useState

Cet accroche accepte un argument, celui-ci sera l'état initial. Lorsque nous invoquerons cette accroche elle retournera une liste de deux variables. La première étant l'état initial et le second étant le "setter" pour notre état.

Notre applicateur (en anglais "setter") se comporte de manière similaire à `setState` d'un composant de classe classique. Il accepte une valeur ou une fonction avec le `currentState` comme argument.

Lorsque vous appelez l'applicateur et que l'état est différent, cela déclenchera un rendu en commençant par le composant qui a utilisé useState.

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // You can also pass a callback to the setter
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

> Lorsque notre état initiale est couteux c'est mieux de passer une fonction à la place d'une valeur.

### useReducer

L'accroche `useReducer` a une ressemblance proche à [redux](https://redux.js.org/). Comparé à [useState](#usestateinitialstate) il est plus simple à utiliser lorsque vous avez une logique d'état complexe où le prochain état dépend du précédent.


```jsx
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Unexpected action');
  }
};

function Counter() {
  // Returns the current state and a dispatch function to
  // trigger an action
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>reset</button>
    </div>
  );
}
```

## Memoization

Dans la programmation d'UI il y a souvent quelques états ou résultats qui sont couteux à calculer. Memoization permet de sauvegarder le résultat de cette calculation permettant de la réutiliser lorsque la même entrée est utilisé.

### useMemo

Avec les accroches `useMemo`, nous pouvons memoize les résultats de cette calculation et seulement re-calculer lorsque les dépendances changes.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // Only re-run the expensive function when any of these
  // dependencies change
  [a, b]
);
```

> N'utilisez pas de code à effet de bord à l'intérieur de `useMemo`. Les effets de bords doivent être dans `useEffect`.

### useCallback

L'accroche `useCallback` peut être utilisé pour s'assurer que la référence de la fonction retourné restera egal aussi longtemps que les dépendances ne changent pas. Ceci peut être utilisé pour optimiser la mise-à-jour des composants enfant lorsqu'ils se basent sur l'égalité de la référence pour sauter un rendu (e.g: `shouldComponentUpdate`).

```jsx
const onClick = useCallback(
  () => console.log(a, b);
  [a, b],
);
```

> Fait ammusant: `useCallback(fn, deps)` est équivalent à `useMemo(() => fn, deps)`.

## useRef

Pour obtenir la référence à un élément DOM à l'intérieur d'un composant fonctionnel il y à l'accroche `useRef`. Qui fonctionne d'une manière similaire à [createRef](/guide/v10/refs#createrefs).

```jsx
function Foo() {
  // Initialise useRef avec la valeur initiale de `null`
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Focus input</button>
    </>
  );
}
```

> Faites attention à ne pas utiliser `useRef` avec `createRef`.

## useContext

Pour accéder à un contexte à l'intérieur d'un composant fonctionnel nous pouvons utiliser l'accroche `useContext`, sans aucun emballage de plus haut niveau. Le premier argument doit être un objet context qui est crée depuis un appel à `createContext`.

```jsx
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Theme actif: {theme}</p>;
}

// ...later
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
```

## Effets de bord

Les effets de bord sont au coeur de beaucoup d'applications modernes. Que vous vouliez récupérer de la donnée depuis une API, ou déclencher un effet sur un document, vous verrez que `useEffect` est adapté à pratiquement tous vos besoins. C'est l'un des principaux avantages à l'API des accroches, c'est qu'elle base la manière de penser sur les effets plutôt que le cycle de vie des composants.

### useEffect

Comme le nom l'implique, `useEffect` est le principal moyen de déclencher divers effets de bords. Vous pouvez retourner une fonction de nettoyage comme l'un de vos effets si vous en avez besoin.

```jsx
useEffect(() => {
  // Trigger your effect
  return () => {
    // Optional: Any cleanup code
  };
}, []);
```

Nous allons commencer avec un composant `Title` qui devrait refléter le titre de vos documents, afin que nous puissions voir dans la barre d'adresse dans l'onglet de notre navigateur.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [prop.title]);

  return <h1>{props.title}</h1>;
}
```

Le premier argument à `useEffect` est une fonction de rappel (en anglais 'callback') qui ne prend aucun argument et qui déclenche l'effet. Dans notre cas nous ne voulons le déclencher que lorsque le titre a vraiment changé. Il n'y a aucune raison de le mettre à jour si le titre est le même. C'est pour cela que l'on utilise un second argument pour spécifier notre [liste de dépendance](#the-dependency-argument).

Mais parfois, nous avons des cas d'utilisation plus complexe. Pensez à un composant qui a besoin de s'inscrire à certaines données lorsqu'il est crée ou détruit. Ceci peut aussi être accomplie avec `useEffect`. Pour lancer un code de nettoyage nous n'avons qu'à lancer une fonction dans notre fonction de rappel.

```jsx
// Component that will always display the current window width
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div>Window width: {width}</div>;
}
```

> La fonction de nettoyage est optionnel. Si vous n'avez pas besoin de lancer de code de nettoyage, vous n'êtes pas obliger de retourner quoi que ce soit dans ce qui est passé à `useEffect`.

### useLayoutEffect

La signature est identique à [useEffect](#useeffect), mais ne se lancera que lorsque le composant sera différencié et que le navigateur a une chance d’imprimer ce contenu.