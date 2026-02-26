---
title: Señales
description: Estado reactivo composable con renderizado automático
translation_by:
  - Ezequiel Mastropietro
---

# Señales

Las Señales son primitivos reactivos para administrar el estado de la aplicación.

Lo que hace que las Señales sean únicas es que los cambios de estado actualizan automáticamente los componentes y la UI de la manera más eficiente posible. El enlace de estado automático y el seguimiento de dependencias permite que las Señales proporcionen una excelente ergnomía y productividad mientras eliminan los problemas de administración de estado más comunes.

Las Señales son efectivas en aplicaciones de cualquier tamaño, con ergnomía que acelera el desarrollo de aplicaciones pequeñas, y características de rendimiento que aseguran que las aplicaciones de cualquier tamaño sean rápidas por defecto.

---

**Importante**

Esta guía cubrirá el uso de Signals en Preact, y aunque esto es en gran medida aplicable a ambas librerías Core y React, habrá algunas diferencias de uso. Las mejores referencias para su uso se encuentran en sus respectivos documentos: [`@preact/signals-core`](https://github.com/preactjs/signals), [`@preact/signals-react`](https://github.com/preactjs/signals/tree/main/packages/react)

---

<toc></toc>

---

## Introducción

Gran parte del dolor de la administración de estado en JavaScript es reaccionar a cambios para un valor dado, porque los valores no son directamente observables. Las soluciones generalmente resuelven esto almacenando valores en una variable y verificando continuamente si han cambiado, lo que es engorroso y no es ideal para el rendimiento. Idealmente, queremos una forma de expresar un valor que nos diga cuándo cambia. Eso es lo que hacen las Señales.

En esencia, una señal es un objeto con una propiedad `.value` que contiene un valor. Esto tiene una característica importante: el valor de una señal puede cambiar, pero la señal en sí siempre permanece igual:

```js
// --repl
import { signal } from '@preact/signals';

const count = signal(0);

// Lea el valor de una señal accediendo a .value:
console.log(count.value); // 0

// Actualizar el valor de una señal:
count.value += 1;

// El valor de la señal ha cambiado:
console.log(count.value); // 1
```

En Preact, cuando una señal se transmite a través de un árbol como accesorios o contexto, solo estamos transmitiendo referencias a la señal. La señal se puede actualizar sin volver a renderizar ningún componente, ya que los componentes ven la señal y no su valor. Esto nos permite omitir todo el costoso trabajo de renderización y saltar inmediatamente a cualquier componente del árbol que realmente acceda a la propiedad `.value` de la señal.

Las Señales tienen una segunda característica importante, que es que rastrean cuándo se accede a su valor y cuándo se actualiza. En Preact, acceder a la propiedad `.value` de una Señal desde dentro de un componente automáticamente rerenderiza el componente cuando ese valor de la Señal cambia.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { signal } from '@preact/signals';

// Crea una señal que se puede suscribirse:
const count = signal(0);

function Counter() {
	// Acceder a .value en un componente automáticamente rerenderiza cuando cambia:
	const value = count.value;

	const increment = () => {
		// Una señal se actualiza asignando a la propiedad `.value`:
		count.value++;
	};

	return (
		<div>
			<p>Count: {value}</p>
			<button onClick={increment}>click me</button>
		</div>
	);
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

Finalmente, las Señales están profundamente integradas en Preact para proporcionar el mejor rendimiento y ergonomía posible. En el ejemplo anterior, accedimos a `count.value` para obtener el valor actual de la Señal `count`, sin embargo esto es innecesario. En su lugar, podemos dejar que Preact haga todo el trabajo por nosotros usando la Señal `count` directamente en JSX:

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { signal } from '@preact/signals';

const count = signal(0);

function Counter() {
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => count.value++}>click me</button>
		</div>
	);
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

## Instalación

Las Señales se pueden instalar agregando el paquete `@preact/signals` a tu proyecto:

```bash
npm install @preact/signals
```

Una vez instalado a través de tu gestor de paquetes de elección, estás listo para importarlo en tu aplicación.

## Ejemplo de Uso

Usemos señales en un escenario del mundo real. Vamos a construir una aplicación de lista de tareas, donde puedas agregar y eliminar elementos en una lista de tareas. Comenzaremos modelando el estado. Vamos a necesitar una señal que contenga una lista de tareas, que podamos representar con un `Array`:

```jsx
import { signal } from '@preact/signals';

const todos = signal([{ text: 'Buy groceries' }, { text: 'Walk the dog' }]);
```

Para permitir que el usuario ingrese texto para un nuevo elemento de tarea, necesitaremos una señal más que conectaremos a un elemento `<input>` en breve. Por ahora, podemos usar esta señal ya para crear una función que agregue un elemento de tarea a nuestra lista. Recuerda, podemos actualizar el valor de una señal asignando a su propiedad `.value`:

```jsx
// Lo usaremos para nuestra entrada más tarde
const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = ''; // Borrar valor de entrada al agregar
}
```

> :bulb: Consejo: Una señal solo se actualizará si asignas un nuevo valor a ella. Si el valor que asignas a una señal es igual a su valor actual, no se actualizará.
>
> ```js
> const count = signal(0);
>
> count.value = 0; // no hace nada - el valor ya es 0
>
> count.value = 1; // actualiza - el valor es diferente
> ```

Verifiquemos si nuestra lógica es correcta hasta ahora. Cuando actualicemos la señal `text` y llamemos `addTodo()`, deberíamos ver un nuevo elemento siendo agregado a la señal `todos`. Podemos simular este escenario llamando estas funciones directamente - ¡sin necesidad de una interfaz de usuario aún!

```jsx
// --repl
import { signal } from '@preact/signals';

const todos = signal([{ text: 'Buy groceries' }, { text: 'Walk the dog' }]);

const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = ''; // Reinciar input al añadir
}

// Check if our logic works
console.log(todos.value);
// Enseña en consola: [{text: "Buy groceries"}, {text: "Walk the dog"}]

// Simulate adding a new todo
text.value = 'Tidy up';
addTodo();

// Check that it added the new item and cleared the `text` signal:
console.log(todos.value);
// Enseña en consola: [{text: "Buy groceries"}, {text: "Walk the dog"}, {text: "Tidy up"}]

console.log(text.value); // Enseña en consola: ""
```

La última característica que nos gustaría agregar es la capacidad de eliminar un elemento de tarea de la lista. Para esto, agregaremos una función que elimine un elemento de tarea dado del arreglo de tareas:

```jsx
function removeTodo(todo) {
	todos.value = todos.value.filter(t => t !== todo);
}
```

## Construyendo la UI

Ahora que hemos modelado el estado de nuestra aplicación, es hora de conectarlo a una bonita UI con la que los usuarios puedan interactuar.

```jsx
function TodoList() {
	const onInput = event => (text.value = event.currentTarget.value);

	return (
		<>
			<input value={text.value} onInput={onInput} />
			<button onClick={addTodo}>Añadir</button>
			<ul>
				{todos.value.map(todo => (
					<li>
						{todo.text} <button onClick={() => removeTodo(todo)}>❌</button>
					</li>
				))}
			</ul>
		</>
	);
}
```

¡Y con eso tenemos una aplicación de lista de tareas completamente funcional! Puedes probar la aplicación completa [aquí mismo](/repl?example=todo-signals) :tada:

## Derivando estado a través de señales computadas

Vamos a agregar una característica más a nuestra aplicación de lista de tareas: cada elemento de tarea se puede marcar como completado, y mostraremos al usuario el número de elementos completados. Para hacer eso importaremos la función [`computed(fn)`](#computedfn), que nos permite crear una nuevo Señal que se computa basándose en los valores de otras Señales. La Señal computada devuelta es de solo lectura, y su valor se actualiza automáticamente cuando cualquier Señal accedida desde dentro de la función de devolución de llamada cambia.

```jsx
// --repl
import { signal, computed } from '@preact/signals';

const todos = signal([
	{ text: 'Buy groceries', completed: true },
	{ text: 'Walk the dog', completed: false }
]);

// crea una señal computada de otras señales
const completed = computed(() => {
	// Cuando `todos` cambia, esto se ejecuta automáticamente:
	return todos.value.filter(todo => todo.completed).length;
});

// Logs: 1, porque un todo está marcado como completado
console.log(completed.value);
```

Nuestra aplicación simple de lista de tareas no necesita muchas Señales computadas, pero las aplicaciones más complejas tienden a depender de `computed()` para evitar la duplicación de estado en múltiples lugares.

> :bulb: Consejo: Derivar tanto estado como sea posible asegura que tu estado siempre tenga una fuente única de verdad (single source of truth). Es un principio clave de las Señales. Esto hace que la depuración sea mucho más fácil en caso de que haya un error en la lógica de la aplicación más adelante, ya que hay menos lugares de los que preocuparse.

## Administrando el estado global de la aplicación

Hasta ahora, solo hemos creado Señales fuera del árbol de componentes. Esto está bien para una aplicación pequeña como una lista de tareas, pero para aplicaciones más grandes y complejas esto puede hacer que las pruebas sean difíciles. Las pruebas típicamente implican cambiar valores en el estado de tu aplicación para reproducir un cierto escenario, y luego pasar ese estado a componentes y hacer aserciones sobre el HTML renderizado. Para hacer esto, podemos extraer el estado de nuestra lista de tareas en una función:

```jsx
function createAppState() {
	const todos = signal([]);

	const completed = computed(() => {
		return todos.value.filter(todo => todo.completed).length;
	});

	return { todos, completed };
}

```

> :bulb: Nota: Observa que no estamos incluyendo conscientemente las funciones `addTodo()` y `removeTodo(todo)` aquí. Separar los datos de las funciones que los modifican a menudo ayuda a simplificar la arquitectura de la aplicación. Para más detalles, consulta el [diseño orientado a datos](https://www.dataorienteddesign.com/dodbook/).

Ahora podemos pasar el estado de nuestra aplicación de tareas como una prop al renderizar:

```jsx
const state = createAppState();

// ...más tarde:
<TodoList state={state} />;
```

Esto funciona en nuestra aplicación de lista de tareas porque el estado es global, sin embargo, las aplicaciones más grandes suelen terminar con múltiples componentes que requieren acceso a las mismas piezas de estado. Esto generalmente implica "elevar el estado" (lifting state up) a un componente ancestro común compartido. Para evitar pasar el estado manualmente a través de cada componente a través de props, el estado se puede colocar en [Contexto](/guide/v10/context) para que cualquier componente en el árbol pueda acceder a él. Aquí hay un ejemplo rápido de cómo se ve eso típicamente:

```jsx
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { createAppState } from './my-app-state';

const AppState = createContext();

render(
	<AppState.Provider value={createAppState()}>
		<App />
	</AppState.Provider>
);

// ...más tarde cuando necesites acceso al estado de tu aplicación
function App() {
	const state = useContext(AppState);
	return <p>{state.completed}</p>;
}
```

Si quieres aprender más sobre cómo funciona el contexto, dirígete a la [documentación de Contexto](/guide/v10/context).

## Estado local con Señales

La mayoría del estado de la aplicación termina siendo pasado alrededor usando props y contexto. Sin embargo, hay muchos escenarios donde los componentes tienen su propio estado interno que es específico de ese componente. Dado que no hay razón para que este estado viva como parte de la lógica comercial global de la aplicación, debe estar confinado al componente que lo necesita. En estos escenarios, podemos crear Señales así como Señales computadas directamente dentro de componentes usando los hooks `useSignal()` y `useComputed()`:

```jsx
import { useSignal, useComputed } from '@preact/signals';

function Counter() {
	const count = useSignal(0);
	const double = useComputed(() => count.value * 2);

	return (
		<div>
			<p>
				{count} x 2 = {double}
			</p>
			<button onClick={() => count.value++}>click me</button>
		</div>
	);
}
```

Estos dos hooks son contenedores delgados alrededor de [`signal()`](#signalinitialvalue) y [`computed()`](#computedfn) que construyen una Señal la primera vez que se ejecuta un componente, y simplemente usan esa misma Señal en posteriores renderizaciones.

> :bulb: Detrás de las escenas, esta es la implementación:
>
> ```js
> function useSignal(value) {
> 	return useMemo(() => signal(value), []);
> }
> ```

## Uso avanzado de Señales

Los tópicos que hemos cubierto hasta ahora son todo lo que necesitas para comenzar. La siguiente sección está dirigida a lectores que quieren beneficiarse aún más modelando el estado de su aplicación completamente usando Señales.

### Reaccionando a Señales fuera de componentes

Cuando trabaja con Señales fuera del árbol de componentes, es posible que haya notado que las Señales computadas no se recalculan a menos que accedas activamente a su valor. Esto es porque las Señales son perezosas por defecto: solo calculan nuevos valores cuando su valor ha sido accedido.

```js
const count = signal(0);
const double = computed(() => count.value * 2);

// A pesar de actualizar la Señal `count` en la que depende la Señal `double`,
// `double` aún no se actualiza porque nada ha usado su valor.
count.value = 1;

// Leer el valor de `double` desencadena que se recalcule:
console.log(double.value); // Logs: 2
```

Esto plantea una pregunta: ¿cómo podemos suscribirnos a Señales fuera del árbol de componentes? Quizás queremos registrar algo en la consola cada vez que el valor de una Señal cambia, o persistir estado a [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Para ejecutar código arbitrario en respuesta a cambios de Señal, podemos usar [`effect(fn)`](#effectfn). Similar a las Señales computadas, los efectos rastrean qué Señales se acceden y re-ejecutan su devolución de llamada cuando esas Señales cambian. A diferencia de las Señales computadas, [`effect()`](#effectfn) no devuelve una Señal - es el final de una secuencia de cambios.

```js
import { signal, computed, effect } from '@preact/signals';

const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => `${name.value} ${surname.value}`);

// Registra el nombre cada vez que cambia:
effect(() => console.log(fullName.value));
// Enseña en consola: "Jane Doe"

// Actualizar `name` actualiza `fullName`, lo que dispara el efecto de nuevo:
name.value = 'John';
// Enseña en consola: "John Doe"
```

Opcionalmente, puedes devolver una función de limpieza desde la devolución de llamada proporcionada a [`effect()`](#effectfn) que se ejecutará antes de que ocurra la próxima actualización. Esto te permite "limpiar" el efecto secundario y potencialmente restablecer cualquier estado para el siguiente disparo de la devolución de llamada.

```js
effect(() => {
	Chat.connect(username.value);

	return () => Chat.disconnect(username.value);
});
```

Puedes destruir un efecto y cancelar la suscripción a todas las señales a las que accedió llamando a la función devuelta.

```js
import { signal, effect } from '@preact/signals';

const name = signal('Jane');
const surname = signal('Doe');
const fullName = computed(() => name.value + ' ' + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Enseña en consola: "Jane Doe"

// Destruir el efecto y las suscripciones:
dispose();

// Actualizar `name` no ejecuta el efecto porque ha sido desechado.
// Tampoco vuelve a computar `fullName` ahora que nada lo está observando.
name.value = 'John';
```

> :bulb: Consejo: No olvides limpiar los efectos si los estás usando extensamente. De lo contrario, tu aplicación consumirá más memoria de la necesaria.

## Lectura de señales sin suscribirse a ellas

En la rara ocasión de que necesites escribir en una señal dentro de [`effect(fn)`](#effectfn), pero no quieras que el efecto se vuelva a ejecutar cuando esa señal cambie, puedes usar `.peek()` para obtener el valor actual de la señal sin suscribirte.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
	// Actualizar `count` sin suscribirse a `count`:
	count.value = count.peek() + delta.value;
});

// Establecer `delta` vuelve a ejecutar el efecto:
delta.value = 1;

// Esto no volverá a ejecutar el efecto porque no accedió a `.value`:
count.value = 10;
```

> :bulb: Consejo: Los escenarios en los que no quieres suscribirte a una señal son raros. En la mayoría de los casos, querrás que tu efecto se suscriba a todas las señales. Solo usa `.peek()` cuando realmente lo necesites.

Como alternativa a `.peek()`, tenemos la función `untracked` que recibe una función como argumento y devuelve el resultado de la función. En `untracked` puedes hacer referencia a cualquier señal con `.value` sin crear una suscripción. Esto puede ser útil cuando tienes una función reutilizable que accede a `.value` o necesitas acceder a más de 1 señal.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
	// Actualizar `count` sin suscribirse a `count` o `delta`:
	count.value = untracked(() => {
		return count.value + delta.value;
	});
});
```

## Combinando múltiples actualizaciones en una

¿Recuerdas la función `addTodo()` que usamos anteriormente en nuestra aplicación de tareas? Aquí hay un recordatorio de cómo se veía:

```js
const todos = signal([]);
const text = signal('');

function addTodo() {
	todos.value = [...todos.value, { text: text.value }];
	text.value = '';
}
```

Observa que la función dispara dos actualizaciones separadas: una al establecer `todos.value` y la otra al establecer el valor de `text`. Esto a veces puede ser indeseable y justificar la combinación de ambas actualizaciones en una sola, por rendimiento u otras razones. La función [`batch(fn)`](#batchfn) se puede usar para combinar múltiples actualizaciones de valores en un solo "commit" al final de la devolución de llamada:

```js
function addTodo() {
	batch(() => {
		todos.value = [...todos.value, { text: text.value }];
		text.value = '';
	});
}
```

Acceder a una señal que ha sido modificada dentro de un lote (batch) reflejará su valor actualizado. Acceder a una señal computada que ha sido invalidada por otra señal dentro de un lote volverá a calcular solo las dependencias necesarias para devolver un valor actualizado para esa señal computada. Cualquier otra señal invalidada permanece inalterada y solo se actualiza al final de la devolución de llamada del lote.

```js
// --repl
import { signal, computed, effect, batch } from '@preact/signals';

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
	// establecer `count`, invalidando `double` y `triple`:
	count.value = 1;

	// A pesar de estar agrupados, `double` refleja el nuevo valor computado.
	// Sin embargo, `triple` solo se actualizará una vez que se complete la devolución de llamada.
	console.log(double.value); // Logs: 2
});
```

> :bulb: Consejo: Los lotes también pueden estar anidados, en cuyo caso las actualizaciones por lotes se vacían solo después de que se haya completado la devolución de llamada del lote más externo.

## Optimizaciones de renderizado

Con las señales podemos omitir el renderizado del DOM Virtual y vincular los cambios de la señal directamente a las mutaciones del DOM. Si pasas una señal a JSX en una posición de texto, se renderizará como texto y se actualizará automáticamente in-situ sin la diferenciación (diffing) del DOM Virtual:

```jsx
const count = signal(0);

function Unoptimized() {
	// Vuelve a renderizar el componente cuando `count` cambia:
	return <p>{count.value}</p>;
}

function Optimized() {
	// El texto se actualiza automáticamente sin volver a renderizar el componente:
	return <p>{count}</p>;
}
```

Para habilitar esta optimización, pasa la señal a JSX en lugar de acceder a su propiedad `.value`.

También se admite una optimización de renderizado similar al pasar señales como props en elementos del DOM.

## Modelos

Los modelos proporcionan una forma estructurada de construir contenedores de estado reactivos que encapsulan señales, valores computados, efectos y acciones. Ofrecen un patrón limpio para organizar la lógica de estado compleja, al mismo tiempo que aseguran la limpieza automática y las actualizaciones por lotes.

A medida que las aplicaciones crecen en complejidad, administrar el estado con señales individuales puede volverse difícil de manejar. Los modelos resuelven esto agrupando señales relacionadas, valores computados y acciones en unidades cohesivas. Esto hace que tu código sea más mantenible, testeable y fácil de razonar.

### ¿Por qué usar modelos?

Los modelos ofrecen varios beneficios clave:

- **Encapsulación**: Agrupa el estado y la lógica relacionada, dejando claro qué pertenece a cada lugar.
- **Limpieza automática**: Los efectos creados en los modelos se eliminan automáticamente cuando se desecha el modelo, evitando fugas de memoria.
- **Agrupamiento automático (batching)**: Todos los métodos se envuelven automáticamente como acciones, lo que garantiza un rendimiento óptimo.
- **Composibilidad**: Los modelos se pueden anidar y componer, con modelos padres que administran automáticamente los ciclos de vida de los modelos hijos.
- **Reutilización**: Los modelos pueden aceptar parámetros de inicialización, lo que los hace reutilizables en diferentes contextos.
- **Testeabilidad**: Los modelos se pueden instanciar y probar de forma aislada sin requerir el renderizado de componentes.

Aquí hay un ejemplo simple que muestra cómo los modelos organizan el estado:

```js
import { signal, computed, createModel } from '@preact/signals';

const CounterModel = createModel((initialCount = 0) => {
	const count = signal(initialCount);
	const doubled = computed(() => count.value * 2);

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

const counter = new CounterModel(5);
counter.increment();
console.log(counter.count.value); // 6
```

Para obtener más detalles sobre cómo usar modelos en tus componentes y la referencia completa de la API, consulta las [APIs de Modelos](#createmodelfactory) en la sección de la API a continuación.

## API

Esta sección es una descripción general de la API de señales. Está pensada para ser una referencia rápida para quienes ya saben cómo usar señales y necesitan un recordatorio de lo que está disponible.

### signal(initialValue)

Crea una nueva señal con el argumento dado como su valor inicial:

```js
const count = signal(0);
```

La señal devuelta tiene una propiedad `.value` que se puede obtener o establecer para leer y escribir su valor. Para leer de una señal sin suscribirse a ella, usa `signal.peek()`.

#### useSignal(initialValue)

Cuando crees señales dentro de un componente, usa la variante hook: `useSignal(initialValue)`. Funciona de manera similar a `signal()` pero está memorizado para asegurar que se use la misma instancia de señal en todos los renderizados del componente.

```jsx
function MyComponent() {
	const count = useSignal(0);
}
```

### computed(fn)

Crea una nueva señal que se computa basándose en los valores de otras señales. La señal computada devuelta es de solo lectura, y su valor se actualiza automáticamente cuando cualquier señal a la que se acceda desde la función de devolución de llamada cambie.

```js
const name = signal('Jane');
const surname = signal('Doe');

const fullName = computed(() => `${name.value} ${surname.value}`);
```

#### useComputed(fn)

Cuando crees señales computadas dentro de un componente, usa la variante hook: `useComputed(fn)`.

```jsx
function MyComponent() {
	const name = useSignal('Jane');
	const surname = useSignal('Doe');

	const fullName = useComputed(() => `${name.value} ${surname.value}`);
}
```

### effect(fn)

Para ejecutar código arbitrario en respuesta a cambios de señal, podemos usar `effect(fn)`. Al igual que las señales computadas, los efectos rastrean qué señales se acceden y vuelven a ejecutar su devolución de llamada cuando esas señales cambian. Si la devolución de llamada devuelve una función, esta función se ejecutará antes de la siguiente actualización de valor. A diferencia de las señales computadas, `effect()` no devuelve una señal; es el final de una secuencia de cambios.

```js
const name = signal('Jane');

// Registrar en la consola cuando `name` cambie:
effect(() => console.log('Hello', name.value));
// Enseña en consola: "Hello Jane"

name.value = 'John';
// Enseña en consola: "Hello John"
```

#### useSignalEffect(fn)

Cuando respondas a los cambios de señal dentro de un componente, usa la variante hook: `useSignalEffect(fn)`.

```jsx
function MyComponent() {
	const name = useSignal('Jane');

	// Registrar en la consola cuando `name` cambie:
	useSignalEffect(() => console.log('Hello', name.value));
}
```

### batch(fn)

La función `batch(fn)` se puede usar para combinar múltiples actualizaciones de valores en un solo "commit" al final de la devolución de llamada proporcionada. Los lotes pueden estar anidados y los cambios solo se vacían una vez que se completa la devolución de llamada del lote más externo. Acceder a una señal que ha sido modificada dentro de un lote reflejará su valor actualizado.

```js
const name = signal('Jane');
const surname = signal('Doe');

// Combinar ambas escrituras en una sola actualización
batch(() => {
	name.value = 'John';
	surname.value = 'Smith';
});
```

### untracked(fn)

La función `untracked(fn)` se puede usar para acceder al valor de varias señales sin suscribirse a ellas.

```js
const name = signal('Jane');
const surname = signal('Doe');

effect(() => {
	untracked(() => {
		console.log(`${name.value} ${surname.value}`);
	});
});
```

### createModel(factory)

La función `createModel(factory)` crea un constructor de modelo a partir de una función de fábrica. La función de fábrica puede aceptar argumentos para la inicialización y debe devolver un objeto que contenga señales, valores computados y métodos de acción.

```js
import { signal, computed, effect, createModel } from '@preact/signals';

const CounterModel = createModel((initialCount = 0) => {
	const count = signal(initialCount);
	const doubled = computed(() => count.value * 2);

	effect(() => {
		console.log('Count changed:', count.value);
	});

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

// Crea una nueva instancia de modelo usando `new`
const counter = new CounterModel(5);
counter.increment(); // Las actualizaciones se agrupan automáticamente
console.log(counter.count.value); // 6
console.log(counter.doubled.value); // 12

// Limpiar todos los efectos cuando termine
counter[Symbol.dispose]();
```

#### Características clave

- **Argumentos de fábrica**: Las funciones de fábrica pueden aceptar argumentos para la inicialización, lo que hace que los modelos sean reutilizables con diferentes configuraciones.
- **Agrupamiento automático**: Todos los métodos devueltos por la fábrica se envuelven automáticamente como acciones, lo que significa que las actualizaciones de estado dentro de ellos se agrupan y no se rastrean.
- **Limpieza automática de efectos**: Los efectos creados durante la construcción del modelo se capturan y se eliminan automáticamente cuando el modelo se desecha a través de `Symbol.dispose`.
- **Modelos composibles**: Los modelos se componen de forma natural: los efectos de los modelos anidados son capturados por el padre y se eliminan juntos cuando el padre se desecha.

#### Composición de modelos

Los modelos pueden anidarse dentro de otros modelos. Cuando se desecha un modelo padre, todos los efectos de los modelos anidados se limpian automáticamente:

```js
const TodoItemModel = createModel((text) => {
	const completed = signal(false);

	return {
		text,
		completed,
		toggle() {
			completed.value = !completed.value;
		}
	};
});

const TodoListModel = createModel(() => {
	const items = signal([]);

	return {
		items,
		addTodo(text) {
			const todo = new TodoItemModel(text);
			items.value = [...items.value, todo];
		},
		removeTodo(todo) {
			items.value = items.value.filter(t => t !== todo);
			todo[Symbol.dispose]();
		}
	};
});

const todoList = new TodoListModel();
todoList.addTodo('Buy groceries');
todoList.addTodo('Walk the dog');

// Desechar el padre también limpia todos los efectos del modelo anidado
todoList[Symbol.dispose]();
```

### action(fn)

La función `action(fn)` envuelve una función para que se ejecute en un contexto agrupado (batched) y no rastreado (untracked). Esto es útil cuando necesitas crear acciones independientes fuera de un modelo:

```js
import { signal, action } from '@preact/signals';

const count = signal(0);

const incrementBy = action((amount) => {
	count.value += amount;
});

incrementBy(5); // Actualización agrupada
```

### useModel(modelOrFactory)

El hook `useModel` está disponible en los paquetes `@preact/signals` y `@preact/signals-react`. Se encarga de crear una instancia del modelo en el primer renderizado, manteniendo la misma instancia en los renderizados posteriores, y desechando automáticamente el modelo cuando el componente se desmonta.

```jsx
import { signal, createModel } from '@preact/signals';
import { useModel } from '@preact/signals';

const CounterModel = createModel(() => ({
	count: signal(0),
	increment() {
		this.count.value++;
	}
}));

function Counter() {
	const model = useModel(CounterModel);

	return (
		<button onClick={() => model.increment()}>
			Count: {model.count}
		</button>
	);
}
```

Para modelos que requieren argumentos de constructor, envuelve la instanciación en una función de fábrica:

```jsx
const CounterModel = createModel((initialCount) => ({
	count: signal(initialCount),
	increment() {
		this.count.value++;
	}
}));

function Counter({ initialValue }) {
	// Usa una función de fábrica para pasar argumentos
	const model = useModel(() => new CounterModel(initialValue));

	return (
		<button onClick={() => model.increment()}>
			Count: {model.count}
		</button>
	);
}
```

### Patrones recomendados

#### Patrón explícito de Señal de solo lectura

Para una mejor encapsulación, declara la interfaz de tu modelo explícitamente y usa `ReadonlySignal` para las señales que solo deben modificarse a través de acciones:

```ts
import { signal, computed, createModel, ReadonlySignal } from '@preact/signals';

interface Counter {
	count: ReadonlySignal<number>;
	doubled: ReadonlySignal<number>;
	increment(): void;
	decrement(): void;
}

const CounterModel = createModel<Counter>(() => {
	const count = signal(0);
	const doubled = computed(() => count.value * 2);

	return {
		count,
		doubled,
		increment() {
			count.value++;
		},
		decrement() {
			count.value--;
		}
	};
});

const counter = new CounterModel();
counter.increment(); // OK
counter.count.value = 10; // Error de TypeScript: No se puede asignar a 'value'
```

#### Lógica de limpieza personalizada

Si tu modelo necesita una lógica de limpieza personalizada que no esté relacionada con las señales (como cerrar conexiones WebSocket), usa un efecto sin dependencias que devuelva una función de limpieza:

```js
const WebSocketModel = createModel((url) => {
	const messages = signal([]);
	const ws = new WebSocket(url);

	ws.onmessage = (e) => {
		messages.value = [...messages.value, e.data];
	};

	// Este efecto se ejecuta una vez; su limpieza se ejecuta al desechar
	effect(() => {
		return () => {
			ws.close();
		};
	});

	return {
		messages,
		send(message) {
			ws.send(message);
		}
	};
});

const chat = new WebSocketModel('wss://example.com/chat');
chat.send('Hello!');

// Cierra la conexión WebSocket al desechar
chat[Symbol.dispose]();
```

Este patrón refleja `useEffect(() => { return cleanup }, [])` in React y asegura que la limpieza ocurra automáticamente cuando los modelos se componen juntos: los modelos padres no necesitan conocer las funciones de eliminación de los modelos anidados.

## Componentes y Hooks de utilidad

A partir de la versión 2.1.0, el paquete `@preact/signals/utils` proporciona componentes y hooks de utilidad adicionales para facilitar aún más el trabajo con señales.

### Componente Show

El componente `<Show>` proporciona una forma declarativa de renderizar contenido condicionalmente basándose en el valor de una señal.

```jsx
import { signal } from '@preact/signals';
import { Show } from '@preact/signals/utils';

const isVisible = signal(false);

function App() {
	return (
		<Show when={isVisible} fallback={<p>Nada que ver aquí</p>}>
			<p>¡Ahora me ves!</p>
		</Show>
	);
}

// También puedes usar una función para acceder al valor
function App() {
	return <Show when={isVisible}>{value => <p>El valor es {value}</p>}</Show>;
}
```

### Componente For

El componente `<For>` te ayuda a renderizar listas a partir de arreglos de señales con almacenamiento en caché automático de los elementos renderizados.

```jsx
import { signal } from '@preact/signals';
import { For } from '@preact/signals/utils';

const items = signal(['A', 'B', 'C']);

function App() {
	return (
		<For each={items} fallback={<p>No hay elementos</p>}>
			{(item, index) => <div key={index}>Elemento: {item}</div>}
		</For>
	);
}
```

### Hooks adicionales

#### useLiveSignal(signal)

El hook `useLiveSignal(signal)` te permite crear una señal local que se mantiene sincronizada con una señal externa.

```jsx
import { signal } from '@preact/signals';
import { useLiveSignal } from '@preact/signals/utils';

const external = signal(0);

function Component() {
	const local = useLiveSignal(external);
	// local se actualizará automáticamente cuando external cambie
}
```

#### useSignalRef(initialValue)

El hook `useSignalRef(initialValue)` crea una señal que se comporta como una ref de React con una propiedad `.current`.

```jsx
import { useSignalEffect } from '@preact/signals';
import { useSignalRef } from '@preact/signals/utils';

function Component() {
	const ref = useSignalRef(null);

	useSignalEffect(() => {
		if (ref.current) {
			console.log('La Ref se ha establecido en:', ref.current);
		}
	});

	return (
		<div ref={ref}>
			La ref se ha adjuntado a un elemento {ref.current?.tagName}.
		</div>
	);
}
```

## Depuración

Si usas Preact Signals en tu aplicación, hay herramientas de depuración especializadas disponibles:

- **[Signals Debug](https://github.com/preactjs/signals/blob/main/packages/debug)** - Una herramienta de desarrollo que proporciona una salida de consola detallada sobre actualizaciones de señales, ejecuciones de efectos y recalculaciones de valores computados.
- **[Signals DevTools](https://github.com/preactjs/signals/blob/main/packages/devtools-ui)** - UI visual de DevTools para depurar y visualizar Preact Signals en tiempo real. Puedes incrustarlo directamente en su página para demostraciones o integrarlo en herramientas personalizadas.

> **Nota:** Estas son herramientas independientes del framework de la biblioteca Signals. Aunque funcionan muy bien con Preact, no son específicas de Preact.
