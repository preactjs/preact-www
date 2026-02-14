---
title: Referencias
description: Las Refs son una forma de crear valores estables que son locales a una instancia de componente y persisten entre renders
translation_by:
  - Ezequiel Mastropietro
---

# Referencias

Las referencias, o refs para abreviar, son valores estables y locales que persisten entre renders de componentes pero no disparan rerenders como lo harían el estado o las props cuando cambian.

Más a menudo verás que las refs se usan para facilitar la manipulación imperativa del DOM pero pueden ser usadas para almacenar cualquier valor local arbitrario que necesites que se mantenga estable. Puedes usarlas para rastrear un valor de estado anterior, mantener una referencia a un ID de intervalo o timeout, o simplemente un valor de contador. Importante, las refs no deben ser usadas para la lógica de renderizado, en su lugar, consumidas en métodos de ciclo de vida y manejadores de eventos únicamente.

---

<toc></toc>

---

## Creando una Referencia

Hay dos formas de crear refs en Preact, dependiendo de tu estilo de componente preferido: `createRef` (componentes de clase) y `useRef` (componentes de función/hooks). Ambas APIs funcionan fundamentalmente de la misma forma: crean un objeto plano estable con una propiedad `current`, opcionalmente inicializada a un valor.

<tab-group tabstring="Classes, Hooks">

```jsx
import { createRef } from 'preact';

class MyComponent extends Component {
	countRef = createRef();
	inputRef = createRef(null);

	// ...
}
```

```jsx
import { useRef } from 'preact/hooks';

function MyComponent() {
	const countRef = useRef();
	const inputRef = useRef(null);

	// ...
}
```

</tab-group>

## Usando Referencias para Acceder a Nodos DOM

El caso de uso más común para refs es acceder al nodo DOM subyacente de un componente. Esto es útil para manipulación imperativa del DOM, como medir elementos, llamar a métodos nativos en varios elementos (como `.focus()` o `.play()`), e integrar con librerías de terceros escritas en JavaScript vanilla. En los siguientes ejemplos, al renderizar, Preact asignará el nodo DOM a la propiedad `current` del objeto ref, haciéndolo disponible para usar después de que el componente se haya montado.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class MyInput extends Component {
	ref = createRef(null);

	componentDidMount() {
		console.log(this.ref.current);
		// Enseña en consola: [HTMLInputElement]
	}

	render() {
		return <input ref={this.ref} />;
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
// --repl-before
function MyInput() {
	const ref = useRef(null);

	useEffect(() => {
		console.log(ref.current);
		// Enseña en consola: [HTMLInputElement]
	}, []);

	return <input ref={ref} />;
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

### Referencias de Callback

Otra forma de usar referencias es pasando una función al prop `ref`, donde el nodo DOM será pasado como un argumento.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MyInput extends Component {
	render() {
		return (
			<input
				ref={dom => {
					console.log('Mounted:', dom);

					// A partir de Preact 10.23.0, opcionalmente puedes devolver una función de limpieza
					return () => {
						console.log('Unmounted:', dom);
					};
				}}
			/>
		);
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
// --repl-before
function MyInput() {
	return (
		<input
			ref={dom => {
				console.log('Mounted:', dom);

				// A partir de Preact 10.23.0, opcionalmente puedes devolver una función de limpieza
				return () => {
					console.log('Unmounted:', dom);
				};
			}}
		/>
	);
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

> Si la función callback ref proporcionada es inestable (como una que está definida en línea, como se mostró arriba), y _no_ devuelve una función de limpieza, **será llamada dos veces** en todos los rerenders: una vez con `null` y luego una vez con la referencia actual. Este es un problema común y las APIs `createRef`/`useRef` lo hacen un poco más fácil obligando al usuario a verificar si `ref.current` está definido.
>
> Una función estable, por comparación, podría ser un método en la instancia del componente de clase, una función definida fuera del componente, o una función creada con `useCallback`, por ejemplo.

## Usando References para Almacenar Valores Locales

Las refs no se limitan a almacenar nodos DOM, sin embargo; pueden ser usadas para almacenar cualquier tipo de valor que puedas necesitar.

En el siguiente ejemplo, almacenamos el ID de un intervalo en una ref para poder iniciarlo y detenerlo de forma independiente.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class SimpleClock extends Component {
	state = {
		time: Date.now()
	};
	intervalId = createRef(null);

	startClock = () => {
		this.setState({ time: Date.now() });
		this.intervalId.current = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	};

	stopClock = () => {
		clearInterval(this.intervalId.current);
	};

	render(_, { time }) {
		const formattedTime = new Date(time).toLocaleTimeString();

		return (
			<div>
				<button onClick={this.startClock}>Start Clock</button>
				<time dateTime={formattedTime}>{formattedTime}</time>
				<button onClick={this.stopClock}>Stop Clock</button>
			</div>
		);
	}
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
// --repl-before
function SimpleClock() {
	const [time, setTime] = useState(Date.now());
	const intervalId = useRef(null);

	const startClock = () => {
		setTime(Date.now());
		intervalId.current = setInterval(() => {
			setTime(Date.now());
		}, 1000);
	};

	const stopClock = () => {
		clearInterval(intervalId.current);
	};

	const formattedTime = new Date(time).toLocaleTimeString();

	return (
		<div>
			<button onClick={startClock}>Start Clock</button>
			<time dateTime={formattedTime}>{formattedTime}</time>
			<button onClick={stopClock}>Stop Clock</button>
		</div>
	);
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

</tab-group>
