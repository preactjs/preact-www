---
title: Hooks
description: Los hooks en Preact te ayudan a componer distintos comportamientos y reutilizar esa lógica en otros componentes
---

# Hooks

La API de Hooks es un nuevo concepto que te permite componer tanto estados como efectos secundarios ('side effects'). Los Hook te ayudan a reusar lógica que concierne a los estados entre componentes.

Si has trabajado con Preact por un rato, puede que estés familiarizado con los patrones como los "render props" o los "higher order components" que tratan de dar una solución frente a estos retos. Estas soluciones tienden a complicar la lectura del código y abstraerlo. La API de Hooks hace posible extraer de manera precisa la lógica del estado y los efectos secundarios, a la vez que simplifica las pruebas unitarias de esa lógica independientemente de los componentes que dependen de ella.

Los Hooks pueden se usados en cualquier componente, y estos son ajenos a muchas de las falencias que presenta `this`, de la cual depende la API de clases. En vez de acceder a propiedades desde la instancia de un componente, los hooks dependen de 'closures'. Esto hace que estén limitados por valores y elimina una serie de problemas de datos obsoletos que pueden ocurrir cuando se trabaja con actualizaciones de estado asíncronas.

Hay dos maneras de importar hooks: desde `preact/hooks` o desde `preact/compat`.

---

<toc></toc>

---

## Introducción

La manera más sencilla de entender a los hooks es comparándolos con su equivalente en los componentes de clase.

Vamos a usar un componente que representa un contador simple como ejemplo. Este renderiza un número y un botón el cual incrementa el número en uno.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Counter extends Component {
  state = {
    value: 0
  };

  increment = () => {
    this.setState(prev => ({ value: prev.value +1 }));
  };

  render(props, state) {
    return (
      <div>
        <p>Counter: {state.value}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Ahora, aquí hay un componente funcional equivalente construido con hooks:

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <div>
      <p>Counter: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

En este punto se ven muy similares, pero podemos simplificar aun más la versión con hooks.

Vamos a extraer la lógica del contador en un hook personalizado, haciéndolo fácilmente reutilizable a través de los componentes:

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return { value, increment };
}

// Primer contador
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      <p>Counter A: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Segundo contador que renderiza un resultado diferente
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
// --repl-after
render(
  <div>
    <CounterA />
    <CounterB />
  </div>,
  document.getElementById("app")
);
```

Ten en cuenta que tanto `CounterA` como `CounterB` son completamente independientes entre sí. Ambos utilizan el hook personalizado `useCounter()`, pero cada uno tiene su propia instancia del estado asociado a ese hook.

> ¿Esto te parece un poco extraño? No eres el único.
>
> A muchos nos costó acostumbrarnos a este enfoque.

## El argumento de las dependencias

Muchos hooks aceptan un argumento que puede ser usado para limitar cuando un hook debe ser actualizado. Preact inspecciona cada valor en un array de dependencias y comprueba si ha cambiado desde la última vez que se llamó a un hook. Cuando no se especifica el argumento de dependencia, el hook se ejecuta siempre.

En nuestra implementación `useCounter()` anterior, pasamos un array de dependencias a `useCallback()`:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);  // <-- the dependency array
  return { value, increment };
}
```

Pasar `value` aquí hace que `useCallback` devuelva una nueva referencia a la función cada vez que `value` cambia.
Esto es necesario para evitar "stale closures", donde el callback siempre hace referencia a la variable `value` de la primera renderización desde que fue creada, causando que `increment` siempre establezca un valor de `1`.

> Esto crea una nueva llamada de retorno de `increment` cada vez que `value` cambia.
> Por razones de rendimiento, a menudo es mejor usar un [callback](#usestate) para actualizar los valores de estado en lugar de retener el valor actual usando dependencias.

## Hooks de estado

Aquí veremos cómo podemos introducir lógica con estado en componentes funcionales.

Antes de la introducción de los hooks, los componentes de clase eran necesarios en cualquier lugar donde se necesitara estado.

### useState

Este hook acepta un argumento, este será el estado inicial. Cuando se invoca
este hook devuelve un array de dos variables. La primera es
el estado actual y la segunda el setter de nuestro estado.

Nuestro setter se comporta de forma similar al setter de nuestro estado clásico.
Acepta un valor o una función con el currentState como argumento.

Cuando se llama al setter y el estado es diferente, se activará
un re-render comenzando desde el componente donde ese useState ha sido usado.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // También puedes pasar un callback como el setter
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

> Cuando nuestro estado inicial es demasiado demandante es mejor pasar una función en vez de un valor.

### useReducer

El hook `useReducer` tiene un gran parecido con [redux](https://redux.js.org/). Comparado con [useState](#usestate), es más fácil de usar cuando tienes una lógica de estado compleja donde el siguiente estado depende del anterior.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

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
  // Devuelve el estado actual y una función de dispatch para
  // desencadenar una acción
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
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## Memoization

En la programación de UI a menudo hay algún estado o resultado que es costoso de calcular. La 'memoization' puede almacenar en caché los resultados de ese cálculo permitiendo que sea reutilizado cuando se usa la misma entrada.

### useMemo

Con el hook `useMemo` podemos memorizar los resultados de ese cálculo y sólo recalcularlo cuando cambie una de las dependencias.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
// Sólo volver a ejecutar esta función costosa cuando cualquiera de estas
  // dependencias cambie
  [a, b]
);
```

> No ejecutes ningún código con efectos dentro de `useMemo`. Los efectos secundarios pertenecen a `useEffect`.

### useCallback

El hook `useCallback` puede utilizarse para asegurar que la función devuelta permanecerá igual mientras no cambien las dependencias. Esto se puede utilizar para optimizar las actualizaciones de componentes hijos cuando se basan en la igualdad referencial para omitir actualizaciones (por ejemplo, `shouldComponentUpdate`).

```jsx
const onClick = useCallback(
  () => console.log(a, b),
  [a, b]
);
```

> Dato: `useCallback(fn, deps)` es el equivalente de `useMemo(() => fn, deps)`.

## useRef

Para obtener una referencia a un nodo DOM dentro de un componente funcional existe el hook `useRef`. Funciona de forma similar a [createRef](/guide/v10/refs#createref).

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
  // Inicializa 'useRef' con un valor de null
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Focus input</button>
    </>
  );
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> Ten cuidado de confundir `useRef` con `createRef`.

## useContext

Para acceder al context en un componente funcional podemos utilizar el hook `useContext`, sin ningún componente de orden superior o wrapper. El primer argumento debe ser el objeto context creado a partir de una llamada a `createContext`.

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Active theme: {theme}</p>;
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
// --repl-after
render(<App />, document.getElementById("app"));
```

## Efectos secundarios

Los efectos secundarios (side-effects) son el corazón de muchas aplicaciones modernas. Tanto si quieres obtener datos de una API como activar un efecto en el documento, verás que `useEffect` se adapta a casi todas tus necesidades. Una de las principales ventajas de la API de hooks es que te permite pensar en efectos en lugar de en el ciclo de vida de un componente.

### useEffect

Como su nombre indica, `useEffect` es la principal forma de desencadenar varios efectos secundarios. Puedes incluso devolver una función de limpieza de tu efecto si es necesario.

```jsx
useEffect(() => {
  // Trigger your effect
  return () => {
    // Optional: Cualquier código cleanup
  };
}, []);
```

Empezaremos con un componente `Title` que debe reflejar el título al documento, para que podamos verlo en la barra de direcciones de nuestra pestaña en nuestro navegador.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

El primer argumento de `useEffect` es un callback sin argumentos que activa el efecto. En nuestro caso, sólo queremos activarlo cuando el título haya cambiado realmente. No tendría sentido actualizarlo cuando sigue igual. Por eso usamos el segundo argumento para especificar nuestro [dependency-array](#el-argumento-dependencia).

Pero a veces tenemos un caso de uso más complejo. Piensa en un componente que necesita suscribirse a algunos datos cuando se monta y necesita darse de baja cuando se desmonta. Esto también se puede conseguir con `useEffect`. Para ejecutar cualquier código de limpieza sólo necesitamos devolver una función en nuestro callback.

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// Componente que siempre mostrará el ancho actual de la ventana
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Window width: {width}</p>;
}
// --repl-after
render(<WindowWidth />, document.getElementById("app"));
```

> La función cleanup es opcional. Si no necesitas ejecutar ningún código cleanup, no necesitas devolver nada en el callback que se pasa a `useEffect`.

### useLayoutEffect

La forma es idéntica a [useEffect](#useeffect), pero se disparará tan pronto como el componente se difunda y el navegador tenga la oportunidad de renderizar.

### useErrorBoundary

Siempre que un componente hijo lance un error, puede utilizar este hook para capturarlo y mostrar una interfaz de usuario de error personalizada al usuario.

```jsx
// error = El error que fue capturado o `undefined` si nada dio error.
// resetError = Llama a esta función para marcar un error como resuelto. Depende
// depende de tu aplicación decidir qué significa eso y si es posible
// recuperarse de los errores.
const [error, resetError] = useErrorBoundary();
```

Para propósitos de monitorización, a menudo es increíblemente útil notificar a un servicio de cualquier error. Para ello podemos utilizar un callback opcional y pasarla como primer argumento a `useErrorBoundary`.

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

Un ejemplo que muestre su uso completo puede ser este:

```jsx
const App = props => {
  const [error, resetError] = useErrorBoundary(
    error => callMyApi(error.message)
  );
  
  // Display a nice error message
  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  } else {
    return <div>{props.children}</div>
  }
};
```

> Si ha estado utilizando la API de componentes basada en clases en el pasado, entonces este hook es esencialmente una alternativa al método del ciclo de vida [componentDidCatch](/guide/v10/whats-new/#componentdidcatch).
> Este hook se introdujo con Preact 10.2.0.

## Hooks de utilidad

### useId

Este hook generará un identificador único para cada invocación y garantiza que estos serán consistentes al renderizar tanto [en el servidor](/guide/v10/server-side-rendering) como en el cliente. Un caso de uso común para IDs consistentes son los formularios, donde los elementos `<label>` utilizan el atributo [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for) para asociarlos con un elemento `<input>` específico. Sin embargo, el hook `useId` no está vinculado únicamente a los formularios y puede utilizarse siempre que se necesite un ID único.

> Para que el hook sea coherente, deberá utilizar Preact tanto en el servidor
> como en el cliente.

Un ejemplo de uso completo puede tener este aspecto:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])
  
  // Display a nice error message
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> Este hook se introdujo con Preact 10.11.0 y necesita preact-render-to-string 5.2.4.
