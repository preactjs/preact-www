---
name: Signals (Señales)
description: 'Signals: estado reactivo componible con renderización automática'
---

# Signals

Signals son primitivas reactivas para gestionar el estado de las aplicaciones.

Lo que hacen únicas a los Signals es que los cambios de estado actualizan automáticamente los componentes y la interfaz de usuario de la forma más eficiente posible. La vinculación automática de estados y el seguimiento de dependencias permiten a Signals ofrecer una ergonomía y una productividad excelentes, al tiempo que elimina las pegas más comunes en la gestión de estados.

Signals son eficaces en aplicaciones de cualquier tamaño, con ergonomias que acelera el desarrollo de aplicaciones pequeñas, y caracteristicas de rendimiento que garantizan que las aplicaciones de cualquier tamaño sean rapidas por defecto.

---

**Importante**

Esta guía tratará sobre el uso de Signals en Preact, y aunque es aplicable tanto a la librería Core como a React, habrá algunas diferencias de uso. Las mejores referencias para su uso están en sus respectivas documentaciones: `@preact/signals-core`, `@preact/signals-react`.

---

<div><toc></toc></div>

---

## Introducción

Gran parte de la dificultad de la gestión de estados en JavaScript es reaccionar a los cambios de un valor dado, porque los valores no son directamente observables.Las soluciones suelen resolver este problema almacenando los valores en una variable y comprobando continuamente si han cambiado, lo cual es engorroso y no es ideal para el rendimiento. Idealmente, queremos una forma de expresar un valor que nos diga cuándo cambia. Eso es lo que hacen los Signals.

En esencia, una signal es un objeto con una propiedad `.value` que contiene un valor. Esto tiene una característica importante: el valor de una signal puede cambiar, pero la signal en sí siempre permanece igual:

```js
// --repl
import { signal } from "@preact/signals";

const count = signal(0);

// Lee el valor de un signal al acceder a .value
console.log(count.value);   // 0

// Actualiza el valor de un signal
count.value += 1;

// El valor de la signal ha cambiado
console.log(count.value);  // 1
```

En Preact, cuando una signal se pasa a través de un arbol como props o contexto, sólo estamos pasando referencias a la signal. La signal puede ser actualizado sin volver a renderizar ningún componente, ya que los componentes ven la signal y no su valor. Esto nos permite saltarnos todo el costoso trabajo de renderizado y saltar inmediatamente a cualquier componente en el árbol que actualmente acceda a la propiedad `.value` de la signal.

Las signals tienen una segunda caracteristica importante, y es que rastrean cuándo se accede a su valor y cuándo se actualiza. En Preact, al accceso a la propiedad `.value` de una signal dentro de un componente vuelve a renderizar automáticamente el componente cuando el valor de la signal cambia.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

// Crea una signal a la que se puede suscribir:
const count = signal(0);

function Counter() {
  // Al acceder a `.value` en un componente, se vuelve a mostrar automáticamente cuando cambia:
  const value = count.value;

  const increment = () => {
    // Una signal es actualizado al asignar a la propiedad `.value`:
    count.value++;
  }

  return (
    <div>
      <p>Conteo: {value}</p>
      <button onClick={increment}>hazme clic</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Por último, las signals están profundamente integradas en Preact para proporcionar el mejor rendimiento y ergonomía posibles. En el ejemplo anterior, accedimos a `count.value` para recuperar el valor actual de la signal `count`, sin embargo esto es innecesario. En su lugar, podemos dejar que Preact haga todo el trabajo por nosotros utilizando la signal `count` directamente en JSX:

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

const count = signal(0);

function Counter() {
  return (
    <div>
      <p>Conteo: {count}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## Instalación

Los signals pueden ser instalado al añadir el paquete `@preact/signals` a tu proyecto:

```bash
npm install @preact/signals
```

Una vez instalado por medio del gestor de paquetes de preferencia, estas listo para importalo en tu aplicación.

## Ejemplo de Uso

Vamos a utilizar los signals en un escenario del mundo real. Vamos a construir una aplicación de lista de tareas, donde se puede añadir y eliminar elementos en una lista de tareas. Empezaremos modelando el estado. Primero necesitaremos un signal que contengan el listado de tareas, el cual puede ser representado con un `Array`:

```jsx
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Comprar víveres" },
  { text: "Pasear el perro" },
]);
```

Para permitir al usuario introduzca el texto de un nuevo elemento, necesitaremos un signal más que conectaremos a un elemento `<input>` en breve. Por ahora, podemos usar este signal para crear una función que añada un elemento a nuestra lista. Recuerda, podemos actualizar el valor de un signal al asignar a su propiedad `.value`:

```jsx
// Usaremos esto para una entrada más tarde
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Limpiar valor de entrada al agregar
}
```

> :bulb: Consejo: Un signal sólo se actualizará si le asignas un nuevo valor. Si el valor que le asignas a un signal es igual a su valor actual, no se actualizará.
>
> ```js
> const count = signal(0);
>
> count.value = 0; // no hace nada - value ya es 0
>
> count.value = 1; // se actualiza - value es diferente
> ```

Comprobemos si nuestra lógica es correcta hasta ahora. Cuando actualizamos el signal de `text` y llamamos a `addTodo()`, deberíamos ver que se añade un nuevo elemento al signal `todos`. Podemos simular este escenario al llamar directamente estas funciones - ¡No hay necesidad de una interfaz de usuario de momento!

```jsx
// --repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Comprar víveres" },
  { text: "Pasear el perro" },
]);

const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Borra el valor de la entrada al añadir 
}

// Comprueba si nuestra logica funciona
console.log(todos.value);
// Registra: [{text: "Comprar víveres"}, {text: "Pasear el perro"}]


// Simula añadir una nueva tarea
text.value = "Poner orden";
addTodo();

// Comprueba que se ha añadido el nuevo elemento y se ha borrado el signal `text`:
console.log(todos.value);
// Registra: [{text: "Comprar víveres"}, {text: "Pasear el perro"}, {text: "Poner orden"}]

console.log(text.value);  // Registra: ""
```

La última característica que nos gustaría añadir es la posibilidad de eleminar un elemento de la lista. Para ello, añadiremos una función que borre un elemento dad de la lista de tareas:

```jsx
function removeTodo(todo) {
  todos.value = todos.value.filter(t => t !== todo);
}
```

## Construyendo la Interfaz de Usuario

Ahora que hemos modelado el estado de nuestra aplicación, es hora de conectarla a una interfaz de usuario agradable con la que los usuarios puedan interactuar.

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
            {todo.text}{' '}
            <button onClick={() => removeTodo(todo)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

¡Y con eso ya tenemos una aplicación de tareas totalmente funcional!. Puedes probar la aplicación completa [aquí](/repl?example=todo-signals) :tada:

## Derivación del estado mediante signals calculadas

Vamos a añadir una característica más a nuestra aplicación de tareas: cada elemento de tareas se puede marcar como completado, y mostraremos al usuario el número de elementos que ha completado. Para ello importaremos la función [`computed(fn)`](#computedfn), que nos permite crear un nuevo signal que se calcula a partir de los valores de otros signals. El signal calculado devuelto es de sólo lectura, y su valor se actualiza automáticamente cuando cambia cualquier signal a la que se acceda desde la función callback.

```jsx
// --repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Comprar víveres", completed: true },
  { text: "Pasear el perro", completed: false },
]);

// Crea un signal calculado a partir de otros signals
const completed = computed(() => {
  // Cuando `todos` cambia, esto se ejecuta automaticamente de nuevo:
  return todos.value.filter(todo => todo.completed).length;
});

// Registra: 1, porque una tarea es marcada como completada
console.log(completed.value);
```

Nuestra sencilla aplicación de lista de tareas no necesita muchos signals calculados, pero las aplicaciones más complejas tienden a confiar en computed() para evitar duplicar el estado en varios lugares.

> :bulb: Consejo: Derivar tanto estado como sea posible garantiza que tu estado siempre tenga una única fuente de verdad. Es un principio clave de las señales. Esto hace que la depuración sea mucho más fácil en caso de que haya un fallo en la lógica de la aplicación más adelante, ya que hay menos lugares de los que preocuparse.

## Gestión del estado global de la aplicación

Hasta ahora, sólo hemos creado signals fuera del árbol de componentes. Esto está bien para una aplicación pequeña como una lista de tareas, pero para aplicaciones más grandes y complejas puede dificultar las pruebas. Las pruebas suelen implicar el cambio de valores en el estado de su aplicación para reproducir un determinado escenario, a continuación, pasar ese estado a los componentes y la afirmación en el HTML renderizado. Para ello, podemos extraer el estado de nuestra lista de tareas en una función:

```jsx
function createAppState() {
  const todos = signal([]);

  const completed = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completed }
}
```

> :bulb: Consejo: Observa que conscientemente no estamos incluyendo las funciones `addTodo()` y `removeTodo(todo)` aquí. Separar los datos de las funciones que los modifican, a menudo ayuda a simplificar la arquitectura de la aplicación. Para más detalles, consulta [disdiseño orientado a datos](https://en.wikipedia.org/wiki/Data-oriented_design).

Ahora podemos pasar nuestro estado de la aplicación de tareas como un prop al renderizar:

```jsx
const state = createAppState();

// ...más adelante:
<TodoList state={state} />
```

Esto funciona en nuestra aplicación de lista de tareas porque el estado es global. Sin embargo, las aplicaciones más grandes suelen tener varios componentes que requieren acceso a los mismos fragmentos de estado. Esto suele implicar "elevar el estado" a un componente ancestro compartido. Para evitar pasar el estado mantualmente a cada componente mediante props, el estado puede ser colocado dentro de un [Context](https://preactjs.com/guide/v10/context) para que cualquier componente en el árbol pueda accerder a él. Aquí hay un ejemplo rápido de como se ve esto:

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { createAppState } from "./my-app-state";

const AppState = createContext();

render(
  <AppState.Provider value={createAppState()}>
    <App />
  </AppState.Provider>
);

// ...más adelante cuando necesites acceso al estado de tu aplicación
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

Si quieres aprender más de como context funciona, diríge a la [documentación de Context](https://preactjs.com/guide/v10/context).

## Estado local con signals

La mayor parte del estado de la aplicación termina siendo pasado usando props y context. Sin embargo, hay muchos escenarios donde los componentes tienen su propio estado interno que es específico para ese componente. Puesto que no hay razón para que este estado forme parte del estado global de la lógica del negocio de la aplicación, debería limitarse al componente que lo necesita. En estos escenarios, podemos crear signals al igual que signals calculados directamente dentro del componente usando los hooks `useSignal()` y `useComputed()`:

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>{count} x 2 = {double}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

Estos dos hooks son finas envolturas alrededor de [`signal()`](#signalinitialvalue) y [`computed()`](#computedfn) que construyen un signal la primera vez que se ejecuta un componente, y simplemente usan ese mismo signal en las siguientes renderizaciones.

> :bulb: Tras bambalinas, esta es la implementación:
>
> ```js
> function useSignal(value) {
>  return useMemo(() => signal(value), []);
> }
> ```

## Uso avanzado de signals

Los temas que hemos abarcado hasta el momento son todo lo que necesitas para ponerte en marcha. La siguiente sección está dirigida a los lectores que quieran beneficiarse aun más modelando el estado de su aplicación completamente mediante signals.

### Reaccionar a signals externos a los componentes

Al trabajar con signals fuera del árbol de componentes, puede que hayas notado que los signals calculados no vuelven a calcular al menos que activamente se lea su valor. Esto se debe a que los signals son perezosos por defecto: Sólo computan nuevos valores cuando se ha accedido a su valor.

```js
const count = signal(0);Reading the value of `double` triggers it to be re-computed:
const double = computed(() => count.value * 2);

// A pesar de actualizar el signal `count` de la que depende el signal `double`,
// `double` aún no se actualiza porque nada ha usado su valor.
count.value = 1;

// Al leer el valor de `double`, se vuelve a calcular:
console.log(double.value); // Registra: 2
```

Esto plantea una pregunta: ¿Cómo podemos suscribirnos a los signlas fuera del árbol de componentes? Quizás queramos registrar algo en la consola cada vez que el valor de un signal cambie, o persistir el estado en [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Para ejecutar código arbitrario en respuesta a los cambios de signals, podemos utilizar [`effect(fn)`](https://preactjs.com/guide/v10/signals/#effectfn). De forma similar a los signals calculados, los effect rastrean a qué signals se accede y vuelven a ejecutar su callback cuando esos signals cambian. A diferencia de los signals calculados, [`effect()`](https://preactjs.com/guide/v10/signals/#effectfn) no devuelve una señal, es el final de una secuencia de cambios.

```js
import { signal, computed, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => `${name.value} ${surname.value}`);

// Registra el nombre cada vez que cambia.
effect(() => console.log(fullName.value));
// Registra: "Jane Doe"

// Actualizar `name` actualiza `fullName`, lo que activa el effect de nuevo:
name.value = "John";
// Registra: "John Doe"
```

Opcionalmente, puede devolver una función de limpieza al callback proporcionado a [`effect()`](https://preactjs.com/guide/v10/signals/#effectfn) que se ejecutará antes de que se produzca la siguiente actualización. Esto le permite "limpiar" el efecto secundario y potencialmente restablecer cualquier estado para el posterios disparo del callback.

```js
effect(() => {
  Chat.connect(username.value)

  return () => Chat.disconnect(username.value)
})
```

Puedes destruir un effect y desuscribir de todos los signals a las que accedió llamando la función devuelta.

```js
import { signal, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Registra: "Jane Doe"

// Destruye el effect y las suscripciones:
dispose();

// Actualizar `nombre` no ejecuta el effect porque ha sido eliminado.
// Tampoco recalcula `fullName` ahora que nada lo observa.
name.value = "John";
```

> :bulb: Consejo: No olvides limpiar los effects si los usas mucho. De lo contrario, tu aplicación consumir más memoria de la necesaria.


## Leyendo signals sin suscribirse a ellos

En las raras ocasiones en las que necesitas escribir un signal dentro de [`effect(fn)`](https://preactjs.com/guide/v10/signals/#effectfn), pero no quieras que el effect se vuelva a ejecutar cuando ese signal cambie, puedes usar `.peek()` para obtener el valor actual del signal sin suscribirte.


```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Actualiza `count` sin suscribirte a `count`
  count.value = count.peek() + delta.value;
});

// Establecer `delta` vuelve a ejecutar el effect:
delta.value = 1;

// Esto no volverá a ejecutar el effect porque no accedio a `.value`:
count.value = 10;
```

> :bulb: Consejo: Los escenarios en los que no quieres suscribirte a un signal son raros. En la mayoría de los casos quieres que tu efecto se suscriba a todos los signals. Utiliza `.peek()` sólo cuando sea realmente necesario.

Como alternativa a `.peek()`, tenemos la función [`untracked`](https://preactjs.com/guide/v10/signals/#untrackedfn) que recibe una función como argumento y devuelve el resultado de la función. En [`untracked`](https://preactjs.com/guide/v10/signals/#untrackedfn) puedes hacer referencia a cualquier signal con `.value` sin crear una suscripción. Esto puede ser útil cuando tienes una función reutilizable que accede a `.value` or necesitas acceder a más de 1 signal.



```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Actualiza `count` sin suscribirse a `count` o `delta`:
  count.value = untracked(() => {
    return count.value + delta.value
  });
});
```


## Combinando múltiples actualizaciones en una sola

¿Recuerdas la función `addTodo()` que usamos anteriormente en la aplicación de tareas? Aquí esta un pequeño recordatorio de como lucía:

```js
const todos = signal([]);
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = "";
}
```

Observa que la función desencadena dos actualizaciones separadas: una al establecer `todos.value` y otrar cuando establecemos el valor de `.text`. Esto a veces puede ser indeseable y justificar combinar ambas actualizaciones en una, por rendimiento u otras razones. La función [`batch(fn)`](https://preactjs.com/guide/v10/signals/#batchfn) puede usarse para combinar múltiples actualizaciones de valores en una sola "asignación" al final del callback:

```js
function addTodo() {
  batch(() => {
    todos.value = [...todos.value, { text: text.value }];
    text.value = "";
  });
}
```

El acceso a un singal que ha sido modificada dentro de un batch reflejará su valor actualizado. El acceso al signal calculado que ha sido invalidado por otro signal dentro de un batch volverá a calcular sólo las dependencias necesarias para devolver una valor actualizado para ese signal calculado. Los demás signals invalidados no se verán afectadas y sólo se actualizarán al final del callback del batch.

```js
// --repl
import { signal, computed, effect, batch } from "@preact/signals";

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
  // Establece `count`, invalidando `double` y `triple`
  count.value = 1;

  // A pesar de estar en un batch, `double` refleja el nuevo valor calculado.
  // Sin embargo, `triple` sólo se actualizará una vez que se complete el callback.
  console.log(double.value); // Registra: 2
});
```


> :bulb: Consejo: Los batches se pueden anidar, en cuyo caso las actualizaciones se vierten sólo despues de que se haya completado el callback del batch más externo.


### Optimizaciones de renderizado

Con los signals podemos evitar el renderizado del Virtual DOM y vincular los cambios del signal directamente a las mutaciones del DOM. Si pasas un signal a JSX en una posición de texto, se va a renderizar como un texto y se actualizará automáticamente en el lugar sin la difusión del Virtual DOM:

```jsx
const count = signal(0);

function Unoptimized() {
  // Vuelve a renderizar el componente cuando `count` cambia:
  return <p>{count.value}</p>;
}

function Optimized() {
  // El texto automaticamente cambia sin volver a renderizar el componente:
  return <p>{count}</p>;
}
```

Para habilitar esta optimización, pase el signal a JSX en lugar de acceder a su propieda `.value`.

Una optimización de renderizado similar también es soportada cuando se pasan signals como props en elementos DOM.

## API

Esta sección es una visión general de la API. Pretende ser una referencia rápida para quienes ya saben utilizar los signals y necesitan un recordatorio de lo que está disponible.

### signal(initialValue)

Crea un nuevo signal con el argumento dado como su valor inicial:

```js
const count = signal(0);
```

Al crear signals dentro de un componente, utilice la variante del hook: `useSignal(initialValue)`.

El signal devuleto tienen una propiedad `.value` que puede ser get o set para leer o escribir su valor. Para leer un signal sin suscribirse a ella, utilice `signal.peek()`.

### computed(fn)

Crea un nuevo signal que es calculada basado en los valores de otros signals. El signal calculado es de sólo lectura, y su valor se actualiza automáticamente cuando cambia cualquier signal a la que se acceda desde la función callback.

```js
const name = signal("Jane");
const surname = signal("Doe");

const fullName = computed(() => `${name.value} ${surname.value}`);
```

Al crear un signal calculado dentro de un componente, utilice la variante del hook: `useComputed(fn)`.

### effect(fn)

Para ejecutar código arbitario en respuesta a los cambios de signal, podemos utilizar `effect(fn)`. De forma similar a los signals calculados, los effects rastrean a qué signals se accede y vuelven a ejecutar su callback cuando esos signals cambian. Si el callback devuelve una función, ésta se ejecutará antes de la siguiente actualización del valor. A diferencia de los signals calculados, `effect()` no devuelve un signal, ese el final de una secuencia de cambios.

```js
const name = signal("Jane");

// Registra a la consola cuando `name` cambia:
effect(() => console.log('Hola', name.value));
// Registra: "Hola Jane"

name.value = "John";
// Registra: "Hola John"
```

Al responder a los cambios de signal dentro de un componente, utilice la variente del hook: `useSignalEffect(fn)`.

### batch(fn)

La funcion `batch(fn)` puede ser usado para combinar varias actualizaciones de valor en una sola "asignación" al final del callback proporcionado. Los batches pueden anidarse y los cambios sólo se envían una vez que finaliza el callback más externo. El acceso a un signal que ha sido modificado dentro un batch reflejará su valor actualizado.

```js
const name = signal("Jane");
const surname = signal("Doe");

// Combina ambas escrituras en una sola actualización
batch(() => {
  name.value = "John";
  surname.value = "Smith";
});
```

### untracked(fn)

La función `untracked(fn)` puede ser usado para acceder al valor de varios signals sin suscribirse a ellos.

```js
const name = signal("Jane");
const surname = signal("Doe");

effect(() => {
  untracked(() => {
    console.log(`${name.value} ${surname.value}`)
  })
})
```
