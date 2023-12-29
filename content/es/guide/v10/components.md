---
name: Componentes
descriptions: 'Los componentes son el corazón de cualquier aplicación de Preact. Aprenda como crearlos y usarlos para componer una interfaces de usuario '
---

# Componentes

Los componentes representa el elemento mas básicos en Preact. Son lo fundamental para facilitar la creación de Uis complejas a partir de pequeños bloques de construcción. Ellos también son responsables de acoplar el estado hacia a nuestra salida renderizada. 

Existen dos tipos de componentes en Preact, de los que hablaremos en esta guía.


---

<div><toc></toc></div>

---

## Componentes Funcionales

Los componentes funcionales son funciones simples que reciben `props` como primer argumento. El nombre de la función **debe** empezar con una letra mayúscula para que funcionen en JSX.


```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>Mi nombre es {props.name}.</div>;
}

// Uso
const App = <MyComponent name="John Doe" />;

// renderiza : <div>Mi nombre es John Doe.</div>
render(App, document.body);
```
> nota en versiones anteriores eran conocidos como `"Stateless Components"`. Esto ya no es válido con [hooks-addon](/guide/v10/hooks). 

## Componentes de Clase

 Los componentes de clase pueden tener métodos de estados y de ciclo de vida. Lo ultimo son métodos especiales, que pueden ser llamados cuando el componente es acoplado al DOM or destruido, por ejemplo.

Aquí tenemos un simple componente de clase llamado `<Clock>` que muestra la hora actual:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Ciclo de vida: LLamado siempre que nuestro componente es creado
  componentDidMount() {
    // actualizar el tiempo cada segundo
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Ciclo de vida: llamado  antes de que nuestro componente sea destruido
  componentWillUnmount() {
    // Parar cuando no es renderizable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Métodos del ciclo de vida

Para que el tiempo sea actualizado cada segundo, necesitamos saber cuando `<Clock>` ha sido montado en el DOM, _Si ha utilizado los Custom ELements en HTML5,eso es similar al `attachedCallback` y `detachedCallback` métodos de ciclo de vida._ Preact llama a los siguientes métodos de ciclo de vida si son definidos para el componente:

| Métodos del ciclo de vida         | Cuando es llamado                            |
|-----------------------------|--------------------------------------------------|
| `componentWillMount()`        | (obsoleto) antes de que el componente sea montado en el DOM
| `componentDidMount()`         | Luego de que el componente sea montado en el DOM
| `componentWillUnmount()`      | antes de que el componente sea removido del DOM
| `componentWillReceiveProps(nextProps, nextState)` | antes de que nuevas props sean aceptadas _(obsoleto)_
| `getDerivedStateFromProps(nextProps)` |justo antes de `shouldComponentUpdate`. use con cuidado
| `shouldComponentUpdate(nextProps, nextState)` | antes del `render()`. devuelve `false` para saltar el renderizado
| `componentWillUpdate(nextProps, nextState)` | antes del `render()` _(obsoleto)_
| `getSnapshotBeforeUpdate(prevProps, prevState)` | llamado justo antes del `render()`. el valor de retorno es pasado a `componentDidUpdate`.
| `componentDidUpdate(prevProps, prevState, snapshot)` | luego `render()`

> mira [este diagrama](https://twitter.com/dan_abramov/status/981712092611989509) para ver como se relacionan entre si.


### Error Boundaries

Un error boundary es un componente que implementa `componentDidCatch()` o el método estático `getDerivedStateFromError()` (o ambos). Estos son métodos especiales que te permiten atrapar cualquier error que ocurra durante el renderizado y es usualmente usado para proveer buenos mensajes de error o otros contenidos alternativos. es importante tener en cuenta que Error Boundaries no puede atrapar todos los errores como aquellos lazados por manejadores de evento o código asíncrono (como una llamada al `fetch`) debe tratase por separado. 

 Cuando un error es atrapado, podemos usar estos métodos para reaccionar a cualquier error y  mostrar un buen mensaje de error o cualquier contenido alternativo.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { errored: false };
  }

  static getDerivedStateFromError(error) {
    return { errored: true };
  }

  componentDidCatch(error, errorInfo) {
    errorReportingService(error, errorInfo);
  }

  render(props, state) {
    if (state.errored) {
      return <p>Algo salió mal</p>;
    }
    return props.children;
  }
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## Fragmentos

 Un `Fragment` te permite retorna multiple elementos a la vez.
Ellos resuelven la limitación del JSX donde cada "bloque" debe tener un único elemento raíz. frecuentemente  los encontraras en combinación con listas, tablas o con un CSS flexbox donde cualquier elemento intermedio podría afectar  los estilos

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// renderizara:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```
cabe mencionar  que la mayoría de los transpiladores modernos te permitirán utilizar una sintaxis mas corta para `Fragments`. La forma corta es mucho mas común y es la que mas usualmente te encontraras.

```jsx
// esto:
const Foo = <Fragment>foo</Fragment>;
// ...es lo mismo que esto:
const Bar = <>foo</>;
```
también puedes devolver arrays de tus componentes:

```jsx
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```
no  olvides añadir `keys` a los `Fragments` si los creas en un bucle

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // sin una key, Preact tendrá que adivinar 
        // que elementos han cambiado al volver a renderizar
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
