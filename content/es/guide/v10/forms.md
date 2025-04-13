---
title: Forms
description: 'La forma de construir formularios en Preact que siempre funcionen.'
---

# Formularios

Los formularios en Preact funcionan de manera similar a como lo hacen en HTML. Renderizas un elemento de control, y luego colocas un event listener para escuchar eventos del mismo.

La principal diferencia es que en muchos casos el `value` no es controlado por un nodo del DOM, sino por Preact.

---

<toc></toc>

---

## Componentes controlados y no controlados

Cuando se habla sobre controladores de formularios a menudo entrarás los términos "Componente controlado" y "Componente no controlado". Esta descripción se refiere a la forma en que el flujo de datos es manejado. El DOM tiene un flujo de datos bidireccional, debido a que cada controlador de formulario será manejado por la misma entrada del usuario. Una entrada de texto simple siempre actualizará su valor cuando el usuario escribe en ella.

Un framework como Preact, en contraste, mayormente trabaja con un flujo de datos undireccional. El componente no maneja su valor, sino algo más que se encuentra en una posición superior en el árbol de componentes.

```jsx
// Esta es una entrada no controlada, ya que Preact no interviene en insertar el valor
<input onInput={myEventHandler} />;

// Esta es una entrada controlada, ya que Preact sí controla el valor de la entrada ahora
<input value={someValue} onInput={myEventHandler} />;
```

Generalmente, deberías tratar de utilizar componentes _Controlados_ en todos los casos. No obstante, cuando se construyen componentes que se sostienen por sí mismos o se encapsulan librerías de UI de terceros, puede ser útil simplemente usar tu componente como un punto donde implementar funcionalidad ajena a Preact. En estos casos, los componentes no controlados son aptos para lograr el cometido. 

> Advertencia:  Cambiar el 'value' a `undefined` o `null` va a resultar en componentes no controlados.

## Creando un formulario simple

Creemos un formulario simple con el cual subir items de tareas (to-do). Para esto vamos a crear un elemento `<form>` y enlazarlo con un manejador de eventos que es llamado en el momento en que el formulario es enviado. Hacemos algo similar para el siguiente campo de entrada de texto, pero recordar que estamos almacenando el 'value' en nuestra propia clase. Por lo tanto, usamos una entrada _controlada_ aquí. En este ejemplo, es muy conveniente, debido a que existe la necesidad de mostrar el 'value' de esta entrada de texto en otro elemento.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    this.setState({ value: e.currentTarget.value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
// --repl-after
render(<TodoForm />, document.getElementById("app"));
```

## Select

Una entrada de `<select>` se involucra un poco más, pero es similar a todos los demás controladores de formularios.

```jsx
// --repl
import { render, Component } from "preact";

// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.currentTarget.value });
  }

  onSubmit = e => {
    alert("Submitted " + this.state.value);
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

## Checkboxes & Botones de Radio

Los checkboxes y botones de radio inicialmente pueden causar confusión al construir formularios controlados. Esto se da porque en un entorno no controlado, tipicamente permitiríamos al navegador activar o hacer 'check' una 'checkbox' o botón de radio por nosotros, escuchando a futuros eventos de cambio y reaccionando al nuevo 'value'. Sin embargo, esta técnica no se alinea muy bien con la visión que dicta que la UI debe actualizarse instantáneamente como respuesta a los cambios de estado y de 'prop'.

> **Guia:** Digamos que escuchamos un evento de cambio en un 'checkbox', el cual es activado cuando el 'checkbox' es marcado o desmarcado por el usuario. En nuestro manejador de eventos, cambiamos el actual valor del `state` al nuevo valor recibido desde la 'checkbox'. Hacer esto activaría un re-renderizado de nuestro componente, lo cual reasignaría el valor de la checkbox a el del 'state'. Esto es innecesario, porque nosotros acabamos de preguntar al DOM por un valor pero luego le pedimos renderizar con el valor cualquiera que queríamos.

Así que, en vez de escuchar por evento de `input`, deberíamos escuchar por un evento de `click`, el cual es activado cada vez que el usuario hace clic en la 'checkbox' _en un elemento `<label>` asociado_. Las 'checkbox' solo alternan entre booleanos `true` y `false`; por ende, al hacer clic en la 'checkbox' o la etiqueta, estaremos regresando el valor cualquiera que teníamos en el 'state', desencadenando un re-renderizado y alterando el valor de la 'checkbox' que se mostraba al que de verdad queríamos.

### Ejemplo de 'checkbox'

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
        check this box
      </label>
    );
  }
}
// --repl-after
render(<MyForm />, document.getElementById("app"));
```
