---
title: Novedades de Preact X
description: 'Nuevas funciones y cambios en Preact X'
---

# Novedades de Preact X

Preact X es un gran paso adelante desde Preact 8.x. Hemos repensado cada bit y byte de nuestro código y hemos añadido una plétora de características importantes en el proceso. Lo mismo ocurre con las mejoras de compatibilidad para admitir más bibliotecas de terceros.

En pocas palabras Preact X es lo que siempre quisimos que fuera Preact: Una librería pequeña, rápida y llena de funciones. Y hablando de tamaño, ¡te alegrará saber que todas las nuevas características y mejoras de renderizado caben en el mismo tamaño que `8.x`!

---

<toc></toc>

---

## Fragmentos

Los `Fragmentos` son una de las principales novedades de Preact X, y una de las principales motivaciones para repensar la arquitectura de Preact. Son un tipo especial de componente que renderiza los elementos hijos en línea con su padre, sin un elemento DOM adicional de envoltura. Además, permiten devolver múltiples nodos desde `render`.

[Documentación sobre fragmentos →](/guide/v10/components#fragments)

```jsx
// --repl
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

Todos deseamos que no se produzcan errores en nuestras aplicaciones, pero a veces ocurren. Con `componentDidCatch`, ahora es posible capturar y manejar cualquier error que ocurra dentro de métodos del ciclo de vida como `render`, incluyendo excepciones en lo más profundo del árbol de componentes. Esto se puede utilizar para mostrar mensajes de error fáciles de usar, o escribir una entrada de registro a un servicio externo en caso de que algo vaya mal.

[Documentos sobre el ciclo de vida →](/guide/v10/components#componentdidcatch)

```jsx
// --repl
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Algo salió mal</p>;
    }
    return props.children;
  }
}
```

## Hooks

Los `Hooks` son una nueva forma de facilitar el intercambio de lógica entre componentes. Representan una alternativa a la actual API de componentes basada en clases. En Preact viven dentro de un addon que puede ser importado a través de `preact/hooks`.

[Documentos sobre Hooks →](/guide/v10/hooks)

```jsx
// --repl
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Incremento</button>
    </div>
  );
}
```

## createContext

La API `createContext` es la verdadera sucesora de `getChildContext()`. Mientras que `getChildContext` está bien cuando estás absolutamente seguro de no cambiar nunca un valor, se viene abajo en cuanto un componente intermedio entre el proveedor y el consumidor bloquea una actualización a través de `shouldComponentUpdate` cuando devuelve `false`. Con la nueva API de contexto, este problema pertenece al pasado. Es una verdadera solución pub/sub para entregar actualizaciones en lo más profundo del árbol.

[Documentos sobre createContext →](/guide/v10/context#createcontext)

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>Tema activo: {theme}</div>}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
```

## Propiedades personalizables CSS

A veces son los pequeños detalles los que marcan la diferencia. Con los recientes avances en CSS puedes aprovechar las [variables CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) para aplicar estilos:

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## Compat vive en el núcleo

Aunque siempre hemos querido añadir nuevas funcionalidades e impulsar Preact, el paquete `preact-compat` no ha recibido tanto cariño. Hasta ahora vivía en un repositorio separado, lo que dificultaba la coordinación de grandes cambios entre Preact y la capa de compatibilidad. Al mover compat al mismo paquete que Preact, no hay nada extra que instalar para usar librerías del ecosistema React.

La capa de compatibilidad se llama ahora [preact/compat](/guide/v10/differences-to-react#features-exclusive-to-preactcompat), y ha aprendido varios trucos nuevos como `forwardRef`, `memo` e innumerables mejoras de compatibilidad.

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## Numerosas correcciones de compatibilidad

Son demasiados para enumerarlos, pero hemos crecido a pasos agigantados en el frente de la compatibilidad con bibliotecas del ecosistema React. Nos hemos asegurado específicamente de incluir varios paquetes populares en nuestro proceso de pruebas para asegurarnos de que podemos garantizar una compatibilidad total con ellos.

Si te encontraste con una librería que no funcionaba bien con Preact 8, deberías probarla de nuevo con X. Hay muchas posibilidades de que todo funcione como esperabas ;)
