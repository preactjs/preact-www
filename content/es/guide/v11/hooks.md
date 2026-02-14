---
title: Hooks
description: Los Hooks en Preact te permiten componer comportamientos juntos y reutilizar esa lógica en diferentes componentes
---

# Hooks

La API de Hooks es un concepto nuevo que te permite componer estado y efectos secundarios. Los Hooks te permiten reutilizar la lógica con estado entre componentes.

Si has trabajado con Preact por un tiempo, puedes estar familiarizado con patrones como "render props" y "componentes de orden superior" que intentan resolver estos desafíos. Estas soluciones han tendido a hacer que el código sea más difícil de seguir y más abstracto. La API de Hooks hace posible extraer claramente la lógica para estado y efectos secundarios, y también simplifica el testeo unitario de esa lógica independientemente de los componentes que se basan en ella.

Los Hooks pueden ser usados en cualquier componente, y evitan muchas trampas de la palabra clave `this` en la que se basan los componentes de clase. En lugar de acceder a propiedades desde la instancia del componente, los Hooks se basan en cierres. Esto los hace vinculados a valores y elimina una serie de problemas de datos obsoletos que pueden ocurrir al tratar con actualizaciones de estado asincrónicas.

Hay dos formas de importar hooks: desde `preact/hooks` o `preact/compat`.

---

<toc></toc>

---

## Introducción

La forma más fácil de entender los hooks es compararlos con Componentes equivalentes basados en clases.

Usaremos un componente simple contador como nuestro ejemplo, que renderiza un número y un botón que lo aumenta en uno:

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Counter extends Component {
	state = {
		value: 0
	};

	increment = () => {
		this.setState(prev => ({ value: prev.value + 1 }));
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
render(<Counter />, document.getElementById('app'));
```

Ahora, aquí está un componente de función equivalente construido con hooks:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
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
render(<Counter />, document.getElementById('app'));
```

En este punto parecen bastante similares, sin embargo podemos simplificar aún más la versión de hooks.

Extrayamos la lógica del contador en un hook personalizado, haciéndolo fácilmente reutilizable en componentes:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
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

// Segundo contador, el cual renderiza otra salida.
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
	document.getElementById('app')
);
```

Ten en cuenta que tanto `CounterA` como `CounterB` son completamente independientes entre sí. Ambas usan el hook personalizado `useCounter()`, pero cada una tiene su propia instancia del estado asociado de ese hook.

> ¿Piensas que esto se ve un poco extraño? ¡No eres el único!
>
> Para muchos de nosotros tardó un tiempo acostumbrarse a este enfoque.

## El argumento de dependencia

Muchos hooks aceptan un argumento que se puede usar para limitar cuándo se debe actualizar un hook. Preact inspecciona cada valor en un array de dependencias y verifica si ha cambiado desde la última vez que se llamó a un hook. Cuando el argumento de dependencia no se especifica, el hook siempre se ejecuta.

En nuestra implementación de `useCounter()` anterior, pasamos un array de dependencias a `useCallback()`:

```jsx
function useCounter() {
	const [value, setValue] = useState(0);
	const increment = useCallback(() => {
		setValue(value + 1);
	}, [value]); // <-- array de dependencias
	return { value, increment };
}
```

Pasar `value` aquí causa que `useCallback` devuelva una nueva referencia de función cada vez que `value` cambia. Esto es necesario para evitar "cierres obsoletos", donde la llamada siempre hacería referencia a la variable `value` del primer render desde cuando fue creada, causando que `increment` siempre establezca un valor de `1`.

> Esto crea un nuevo callback `increment` cada vez que `value` cambia. Por razones de rendimiento, a menudo es mejor usar una [callback](#usestate) para actualizar valores de estado en lugar de retener el valor actual usando dependencias.

## Hooks con Estado

Aquí veremos cómo podemos introducir lógica con estado en componentes funcionales.

Antes de la introducción de hooks, se requerían componentes de clase en cualquier lugar donde se necesitara estado.

### useState

Este hook acepta un argumento, este será el estado inicial. Cuando se invoca, este hook devuelve un array de dos variables. La primera siendo el estado actual y la segunda siendo el setter para nuestro estado.

Nuestro setter se comporta similar al setter de nuestro estado clásico. Acepta un valor o una función con el currentState como argumento.

Cuando llamas al setter y el estado es diferente, desencadenará un rerender comenzando desde el componente donde se ha usado ese useState.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
	const [count, setCount] = useState(0);
	const increment = () => setCount(count + 1);
	// También puedes pasar un callback al setter.
	const decrement = () => setCount(currentCount => currentCount - 1);

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment}>Increment</button>
			<button onClick={decrement}>Decrement</button>
		</div>
	);
};
// --repl-after
render(<Counter />, document.getElementById('app'));
```

> Cuando nuestro estado inicial es caro, es mejor pasar una función en lugar de un valor.

### useReducer

El hook `useReducer` tiene un gran parecido con [redux](https://redux.js.org/). Comparado con [useState](#usestate) es más fácil de usar cuando tienes lógica de estado compleja donde el siguiente estado depende del anterior.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

const initialState = 0;
const reducer = (state, action) => {
	switch (action) {
		case 'increment':
			return state + 1;
		case 'decrement':
			return state - 1;
		case 'reset':
			return 0;
		default:
			throw new Error('Unexpected action');
	}
};

function Counter() {
	// Devuelve el estado actual y una función de envío para
  // activar una acción.
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
render(<Counter />, document.getElementById('app'));
```

## Memoización

En la programación de UI a menudo hay algo de estado o resultado que es caro de calcular. La Memoización puede cachear los resultados de ese cálculo permitiendo que sea reutilizado cuando se usa la misma entrada.

### useMemo

Con el hook `useMemo` podemos memoizar los resultados de ese cálculo y solo recalcularlo cuando una de las dependencias cambia.

```jsx
const memoized = useMemo(
	() => expensive(a, b),
	// Solo vuelve a ejecutar la función costosa cuando alguna de estas
  // dependencias cambie.
	[a, b]
);
```

> No ejecutes ningún código con efectos secundarios dentro de `useMemo`. Los efectos secundarios pertenecen a `useEffect`.

### useCallback

El hook `useCallback` se puede usar para asegurar que la función devuelta permanezca referencialmente igual mientras no haya cambiado ninguna dependencia. Esto se puede usar para optimizar las actualizaciones de componentes secundarios cuando se basan en la igualdad referencial para omitir actualizaciones (p. ej. `shouldComponentUpdate`).

```jsx
const onClick = useCallback(() => console.log(a, b), [a, b]);
```

> Hecho divertido: `useCallback(fn, deps)` es equivalente a `useMemo(() => fn, deps)`.

## Refs

Las **referencias** (refs para abreviar) son valores estables y locales que persisten entre rerenders pero no causan rerenders por sí mismos. Consulta [Refs](/guide/v10/refs) para más información y ejemplos.

### useRef

Para crear una referencia estable a un nodo del DOM o un valor que persista entre renders, podemos usar el hook `useRef`. Funciona de manera similar a [createRef](/guide/v10/refs#createref).

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
	// Inicializar useRef con un valor inicial de `null`
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
render(<Foo />, document.getElementById('app'));
```

> Ten cuidado de no confundir `useRef` con `createRef`.

### useImperativeHandle

Para mutar una ref que se pasa a un componente secundario podemos usar el hook `useImperativeHandle`. Toma tres argumentos: la ref a mutar, una función a ejecutar que devolverá el nuevo valor de ref, y un array de dependencias para determinar cuándo ejecutar de nuevo.

```jsx
// --repl
import { render } from 'preact';
import { useRef, useImperativeHandle, useState } from 'preact/hooks';
// --repl-before
function MyInput({ inputRef }) {
	const ref = useRef(null);
	useImperativeHandle(
		inputRef,
		() => {
			return {
				// Solo exponer `.focus()`, no dar acceso directo al nodo DOM.
				focus() {
					ref.current.focus();
				}
			};
		},
		[]
	);

	return (
		<label>
			Name: <input ref={ref} />
		</label>
	);
}

function App() {
	const inputRef = useRef(null);

	const handleClick = () => {
		inputRef.current.focus();
	};

	return (
		<div>
			<MyInput inputRef={inputRef} />
			<button onClick={handleClick}>Click To Edit</button>
		</div>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## useContext

Para acceder a contexto en un componente funcional podemos usar el hook `useContext`, sin componentes wrapper o de orden superior. El primer argumento debe ser el objeto de contexto que se crea a partir de una llamada a `createContext`.

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

// ...luego
function App() {
	return (
		<Theme.Provider value="light">
			<OtherComponent>
				<DisplayTheme />
			</OtherComponent>
		</Theme.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## Efectos Secundarios

Los Efectos Secundarios están en el corazón de muchas aplicaciones modernas. Ya sea que desees obtener algunos datos de una API o desencadenar un efecto en el documento, encontrarás que `useEffect` se adapta a casi todas tus necesidades. Es una de las principales ventajas de la API de hooks, que reformula tu mente en pensar en efectos en lugar del ciclo de vida de un componente.

### useEffect

Como el nombre lo implica, `useEffect` es la forma principal de desencadenar varios efectos secundarios. Incluso puedes devolver una función de limpieza desde tu efecto si es necesaria.

```jsx
useEffect(() => {
	// Dispara tu efecto
	return () => {
		// Opcional: cualquier código de limpieza.
	};
}, []);
```

Comenzaremos con un componente `Title` que debería reflejar el título al documento, para que podamos verlo en la barra de direcciones de nuestra pestaña en nuestro navegador.

```jsx
function PageTitle(props) {
	useEffect(() => {
		document.title = props.title;
	}, [props.title]);

	return <h1>{props.title}</h1>;
}
```

El primer argumento para `useEffect` es una devolusión de llamada sin argumentos que desencadena el efecto. En nuestro caso, solo queremos desencadenarlo cuando el título realmente ha cambiado. No habría punto en actualizarlo cuando se quede igual. Por eso estamos usando el segundo argumento para especificar nuestro [array de dependencia](#the-dependency-argument).

Pero a veces tenemos un caso de uso más complejo. Piensa en un componente que necesita suscribirse a algunos datos cuando se monta y necesita desuscribirse cuando se desmonta. Esto también se puede lograr con `useEffect`. Para ejecutar cualquier código de limpieza solo necesitamos devolver una función en nuestra devolucIón de llamada.

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// Componente que siempre mostrará el ancho actual de la ventana.
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
render(<WindowWidth />, document.getElementById('app'));
```

> La función de limpieza es opcional. Si no necesitas ejecutar ningún código de limpieza, no necesitas devolver nada en la devolución de llamada que se pasa a `useEffect`.

### useLayoutEffect

La firma es idéntica a [useEffect](#useeffect), pero se disparará tan pronto como el componente sea diferenciado y el navegador tenga una oportunidad de pintar.

### useErrorBoundary

Cada vez que un componente secundario lanza un error, puedes usar este hook para capturarlo y mostrar una UI de error personalizada al usuario.

```jsx
// error = El error que se detectó o `undefined` si no se produjo ningún error.
// resetError = Llame a esta función para marcar un error como resuelto. Depende
//   de su aplicación decidir qué significa eso y si es posible
//   recuperarse de los errores.
const [error, resetError] = useErrorBoundary();
```

Para fines de monitoreo a menudo es increíblemente útil notificar a un servicio de cualquier error. Para eso podemos aprovechar una devolución de llamada opcional y pasar eso como el primer argumento a `useErrorBoundary`.

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

Un ejemplo de uso completo puede verse así:

```jsx
const App = props => {
	const [error, resetError] = useErrorBoundary(error =>
		callMyApi(error.message)
	);

	// Mostrar un mensaje de error agradable.
	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={resetError}>Try again</button>
			</div>
		);
	} else {
		return <div>{props.children}</div>;
	}
};
```

> Si has estado usando la API de componentes basados en clases en el pasado, entonces este hook es esencialmente una alternativa al método de ciclo de vida [componentDidCatch](/guide/v10/whats-new/#componentdidcatch).
> Este hook fue introducido con Preact 10.2.0.

## Hooks de Utilidad

### useId

Este hook generará un identificador único para cada invocación y garantiza que estos serán consistentes al renderizar tanto [en el servidor](/guide/v10/server-side-rendering) como en el cliente. Un caso de uso común para ID consistentes son los formularios, donde los elementos `<label>` usan el atributo [`for`](https://developer.mozilla.org/es/docs/Web/HTML/Element/label#attr-for) para asociarlos con un elemento `<input>` específ ico. El hook `useId` no se limita solo a formularios y se puede usar siempre que necesites un ID único.

> Para hacer el hook consistente, necesitarás usar Preact tanto en el servidor
> como en el cliente.

Un ejemplo de uso completo puede verse así:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])

  // Mostrar un input con un ID único.
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> Este hook fue introducido con Preact 10.11.0 y necesita preact-render-to-string 5.2.4.
