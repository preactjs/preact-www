---
title: Tutorial rápido
description: 'Escriba su primera aplicación Preact'
---

# Tutorial

Esta guía le guiará en la construcción de un simple componente "tic-tac". Si eres nuevo en Virtual DOM, prueba el [tutorial completo de Preact](/tutorial).

> :information_desk_person: Esta guía asume que ha completado el documento [Primeros pasos](/guide/v10/getting-started) y ha configurado con éxito sus herramientas.

---

<div><toc></toc></div>

---

## Hola Mundo

Fuera de la caja, las dos funciones que siempre verás en cualquier código base de Preact son `h()` y `render()`. La función `h()` se utiliza para convertir JSX en una estructura que Preact entienda. Pero también puede usarse directamente sin ningún JSX involucrado:

```jsx
// Con JSX
const App = <h1>Hola Mundo!</h1>;

// ...lo mismo sin JSX
const App = h('h1', null, 'Hello World');
```

Esto por sí solo no hace nada y necesitamos una manera de inyectar nuestra aplicación Hola-Mundo en el DOM. Para ello utilizamos la función `render()`.

```jsx
// --repl
import { render } from 'preact';

const App = <h1>Hola Mundo!</h1>;

// Inyectar nuestra aplicación en el DOM
render(App, document.getElementById('app'));
```

Enhorabuena, has creado tu primera aplicación Preact.

## Hola Mundo Interactivo

Renderizar texto es un comienzo, pero queremos que nuestra aplicación sea un poco más interactiva. Queremos actualizarla cuando cambien los datos. :star2:

Nuestro objetivo final es que tenemos una aplicación donde el usuario puede introducir un nombre y mostrarlo, cuando se envía el formulario. Para ello necesitamos tener algo donde podamos almacenar lo que hemos enviado. Aquí es donde [Componentes](/guide/v10/components) entran en juego.

Así que vamos a convertir nuestra App existente en un [Componentes](/guide/v10/components):

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hola Mundo!</h1>;
  }
}

render(<App />, document.getElementById("app"));
```

Notarás que hemos añadido un nuevo import `Component` en la parte superior y que hemos convertido `App` en una clase. Esto por sí solo no es útil, pero es el precursor de lo que vamos a hacer a continuación. Para hacer las cosas un poco más emocionantes vamos a añadir un formulario con una entrada de texto y un botón de envío.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hola Mundo!</h1>
        <form>
          <input type="text" />
          <button type="submit">Actualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

¡Ya estamos hablando! Empieza a parecer una aplicación de verdad. Pero aún tenemos que hacerla interactiva. Recuerda que querremos cambiar `"¡Hola mundo!"` a `"¡Hola, [userinput]!"`, así que necesitamos una forma de conocer el valor de entrada actual.

Lo almacenaremos en una propiedad especial llamada `state` de nuestro Componente. Es especial, porque cuando se actualiza a través del método `setState`, Preact no sólo actualizará el estado, sino que también programará una petición de renderizado para este componente. Una vez que la solicitud es manejada, nuestro componente será re-renderizado con el estado actualizado.

Por último, tenemos que adjuntar el nuevo estado a nuestra entrada mediante el establecimiento de `value` y adjuntar un controlador de eventos para el evento `input`.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Inicializar nuestro estado. Por ahora sólo almacenamos el valor de entrada
  state = { value: '' }

  onInput = ev => {
    // Esto programará una actualización del estado. Una vez actualizado, el componente
    // volverá a renderizarse automáticamente.
    this.setState({ value: ev.currentTarget.value });
  }

  render() {
    return (
      <div>
        <h1>Hola Mundo!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Actualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

En este punto la aplicación no debería haber cambiado mucho desde el punto de vista del usuario, pero uniremos todas las piezas en nuestro siguiente paso.

Añadiremos un manejador al evento `submit` de nuestro `<form>` de forma similar a como lo hicimos para el input. La diferencia es que escribe en una propiedad diferente de nuestro `state` llamada `name`. Entonces cambiamos nuestro encabezado e insertamos nuestro valor `state.name` allí.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Add `name` to the initial state
  state = { value: '', name: 'world' }

  onInput = ev => {
    this.setState({ value: ev.currentTarget.value });
  }

  // Añade un gestor de envíos que actualice `name` con el último valor introducido.
  onSubmit = ev => {
    // Evitar el comportamiento predeterminado del navegador (es decir, no enviar el formulario aquí)
    ev.preventDefault();

    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Actualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

¡Boom! ¡Ya está! Ahora podemos introducir un nombre personalizado, hacer clic en "Actualizar" y nuestro nuevo nombre aparecerá en nuestro encabezamiento.

## Un componente de reloj

Hemos escrito nuestro primer componente, así que vamos a practicar un poco más. Esta vez construiremos un reloj.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

Vale, ¡ha sido muy fácil! El problema es que la hora no cambia. Está congelada en el momento en que renderizamos nuestro componente reloj.

Por lo tanto, queremos tener un temporizador de 1 segundo que se inicie una vez que el componente se añade al DOM, y se detenga si se elimina. Crearemos el temporizador y almacenaremos una referencia a él en `componentDidMount`, y detendremos el temporizador en `componentWillUnmount`. En cada tick del temporizador, actualizaremos el objeto `state` del componente con un nuevo valor de tiempo. Esto hará que el componente se vuelva a renderizar automáticamente.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // Se ejecuta cada vez que se crea nuestro componente
  componentDidMount() {
    // tiempo de actualización cada segundo
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Llamada justo antes de que nuestro componente sea destruido
  componentWillUnmount() {
    // parar cuando no se pueda renderizar
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

Y lo hemos vuelto a hacer. Ahora tenemos [un tic-tac del reloj](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!
