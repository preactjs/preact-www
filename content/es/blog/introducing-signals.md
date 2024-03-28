---
title: Introduciendo los Signals
date: 2022-09-06
authors:
  - Marvin Hagemeister
  - Jason Miller
translation_by:
  - Ivan Ulloque
---

# Introduciendo los Signals

Los signals son una forma de expresar el estado que garantiza la rapidez de las aplicaciones, independientemente de su complejidad. Las señales se basan en principios reactivos y proporcionan una excelente ergonomía al desarrollador, con una implementación única optimizada para el Virtual DOM.

En esencia, un signal es un objeto con una propiedad `.value` que contiene algún valor. Al acceder a la propiedad value de un signal desde un componente, éste se actualiza automáticamente cuando cambia su valor.

Además de ser sencillo y fácil de escribir, también garantiza que las actualizaciones de estado sean rápidas, independientemente del número de componentes que tenga la aplicación. Los signals son rápidos por defecto, optimizando automáticamente las actualizaciones tras bambalinas.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal, computed } from "@preact/signals";
 
const count = signal(0);
const double = computed(() => count.value * 2);
 
function Counter() {
  return (
    <button onClick={() => count.value++}>
      {count} x 2 = {double}
    </button>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```
Los signals pueden utilizarse dentro o fuera de los componentes, a diferencia de los hooks. Los signals también funcionan muy bien junto con hooks **_y_** componentes de clase, por lo que puedes introducirlos a tu propio ritmo y llevar contigo tus conocimientos existentes. Pruébalas en unos pocos componentes y adóptalas gradualmente con el tiempo.

Por cierto, nos mantenemos fieles a nuestras raíces de ofrecerte las librerías más pequeñas posibles. Los signals en Preact sólo añaden **1.6kB** al tamaño del paquete.

Si quiere empezar de inmediato, consulte nuestra [documentación](/guide/v10/signals) para obtener más información sobre los signals.

## ¿Qué problemas se resuelven con los signals?

En los últimos años hemos trabajado en una amplia gama de aplicaciones y equipos, desde pequeñas startups hasta monolitos con cientos de desarrolladores trabajando al mismo tiempo. Durante este tiempo, todos los miembros del equipo central han observado problemas recurrentes con la forma en que se gestiona el estado de las aplicaciones.

Se han creado soluciones fantásticas para resolver estos problemas, pero incluso las mejores soluciones requieren una integración manual en el framework. Como resultado, los desarrolladores se resisten a adoptar estas soluciones y prefieren utilizar las primitivas de estado proporcionadas por el framework.

Hemos creado los signals para que sea una solución atractiva que combine un rendimiento óptimo y ergonomía para el desarrollador con una integración perfecta con el framework.

## La lucha del estado global

El estado de una aplicación suele empezar siendo pequeño y sencillo, quizás con unos pocos hooks `useState`. A medida que una aplicación crece y más componentes necesitan acceder a la misma parte del estado, ese estado se eleva finalmente a un componente antepasado común. Este patrón se repite varias veces hasta que la mayor parte del estado termina viviendo cerca de la raíz del árbol de componentes.

![Image showing how the depth of the component tree directly affects rendering performance when using standard state updates.](/signals/state-updates.png)

Este escenario plantea un reto para los frameworks tradicionales basados en DOM virtual, que deben actualizar todo el árbol afectado por una invalidación de estado. En esencia, el rendimiento de la renderización dependerá del número de componentes del árbol. Podemos solucionar esto memorizando partes del árbol de componentes utilizando `memo` o `useMemo` para que el framework reciba los mismos objetos. Cuando nada ha cambiado, esto permite al framework omitir el renderizado de algunas partes del árbol.

Aunque en teoría esto suena razonable, la realidad suele ser mucho más complicada. En la práctica, a medida que crecen las bases de código, se vuelve difícil determinar dónde se deben colocar estas optimizaciones. Con frecuencia, incluso la memoización bien intencionada se vuelve ineficaz por valores de dependencia inestables. Dado que los hooks no tienen un árbol de dependencias explícito que pueda ser analizado, las herramientas no pueden ayudar a los desarrolladores a diagnosticar **_por qué_** las dependencias son inestables.

## El caos del contexto

Otra solución común que los equipos utilizan para compartir el estado es colocar el estado en un contexto. Esto permite cortocircuitar la renderización, ya que puede omitir la renderización de componentes entre el proveedor de contexto y los consumidores. Sin embargo, hay un problema: sólo se puede actualizar el valor pasado al proveedor de contexto, y sólo como un todo. Actualizar una propiedad de un objeto expuesto a través de un contexto no actualiza a los consumidores de ese contexto: no es posible realizar actualizaciones granulares. Las opciones disponibles para solucionar este problema son dividir el estado en varios contextos o invalidar el objeto de contexto clonándolo cuando cambie alguna de sus propiedades.

![Context can skip updating components until you read the value out of it. Then it's back to memoization.](/signals/context-chaos.png)

Al principio, trasladar los valores al contexto parece una solución que merece la pena, pero las desventajas de aumentar el tamaño del árbol de componentes sólo para compartir valores acaban convirtiéndose en un problema. La lógica de negocio inevitablemente acaba dependiendo de múltiples valores de contexto, lo que puede obligar a implementarla en una ubicación específica del árbol. Añadir un componente que se suscriba al contexto en medio del árbol es costoso, ya que reduce el número de componentes que pueden saltarse al actualizar el contexto. Además, todos los componentes situados por debajo del suscriptor deben renderizarse de nuevo. La única solución a este problema es el uso intensivo de la memoización, lo que nos lleva de nuevo a los problemas inherentes a la memoización.

## En busca de una mejor gestión del Estado

Volvimos a la mesa de dibujo en busca de una primitiva de estado de nueva generación. Queríamos crear algo que abordara simultáneamente los problemas de las soluciones actuales. La integración manual de frameworks, la excesiva dependencia de la memoización, el uso poco eficiente del contexto y la falta de observabilidad programática nos echaban para atrás.

Los desarrolladores tienen que "optar" por el rendimiento con estas estrategias. ¿Qué pasaría si pudiéramos invertir esta situación y ofrecer un sistema que fuera **rápido por defecto**, haciendo que el rendimiento óptimo fuera algo en lo que tuvieras que esforzarte para no participar?

Nuestra respuesta a estas preguntas son los Signals. Es un sistema que es rápido por defecto sin requerir memoization o trucos a través de su aplicación. Los signals proporcionan los beneficios de las actualizaciones de estado detalladas, independientemente de si ese estado es global, pasado a través de props o contexto, o local en un componente.

## Los signals para el futuro

La idea principal de los signals es que, en lugar de pasar un valor directamente a través del árbol de componentes, pasamos un objeto signal que contiene el valor (similar a un `ref`). Cuando el valor de un signal cambia, el signal permanece igual. Como resultado, los signals pueden actualizarse sin tener que volver a renderizar los componentes por los que han pasado, ya que los componentes ven el signal y no su valor. Esto nos permite saltarnos todo el costoso trabajo de renderizar los componentes y saltar inmediatamente a los componentes específicos del árbol que realmente acceden al valor del signal.

![Signals can continue to skip Virtual DOM diffing, regardless of where in the tree they are accessed.](/signals/signals-update.png)

Aprovechamos el hecho de que el gráfico de estado de una aplicación suele ser mucho menos profundo que su árbol de componentes. Esto conduce a un renderizado más rápido, porque se requiere mucho menos trabajo para actualizar el gráfico de estado en comparación con el árbol de componentes. Esta diferencia es más evidente cuando se mide en el navegador - la captura de pantalla de abajo muestra un seguimiento de Profile en las DevTools para la misma aplicación medida dos veces: una vez usando hooks como primitiva de estado y una segunda vez usando signals:

![Showing a comparison of profiling Virtual DOM updates vs updates through signals which bypasses nearly all of the Virtual DOM diffing.](/signals/virtual-dom-vs-signals-update.png)

Los signals superan ampliamente el mecanismo de actualización de cualquier framework tradicional basado en DOM virtual. En algunas aplicaciones que hemos probado, Los signals son tan rápidos que resulta difícil encontrarlos en el flamegraph.

Los signals le dan la vuelta al rendimiento: en lugar de optar por el rendimiento mediante memoization o selectores, los signals son rápidos por defecto. Con los signals, el rendimiento se excluye (al no usar signals).

* **Perezoso por defecto:** Sólo los signals que se utilizan actualmente en algún lugar son observados y actualizados - los signals desconectados no afectan al rendimiento.
* **Actualizaciones óptimas:** Si el valor de una señal no ha cambiado, los componentes y efectos que utilicen el valor de esa señal no se actualizarán, aunque las dependencias de la señal hayan cambiado.
* **Seguimiento óptimo de las dependencias:** El framework rastrea las señales de las que depende cada cosa, sin matrices de dependencias como en el caso de los hooks.
* **Acceso directo:** Al acceder al valor de Los signals en un componente, se suscribe automáticamente a las actualizaciones, sin necesidad de selectores ni hooks.

Estos principios hacen que los signals se adapten bien a una amplia gama de casos de uso, incluso a escenarios que no tienen nada que ver con la representación de interfaces de usuario.

## Llevando señales a Preact

Una vez identificado el estado primitivo adecuado, nos pusimos a conectarlo a Preact. Lo que siempre nos ha gustado de los hooks es que pueden utilizarse directamente dentro de los componentes. Esta es una ventaja ergonómica en comparación con soluciones de gestión de estado de terceros, que por lo general se basan en funciones de "selector" o envolver componentes en una función especial para suscribirse a las actualizaciones de estado.

```js
// Suscripción basada en selector :(
function Counter() {
  const value = useSelector(state => state.count);
  // ...
}
 
// Suscripción basada en una función envolvente :(
const counterState = new Counter();
 
const Counter = observe(props => {
  const value = counterState.count;
  // ...
});
```

Ninguno de los dos enfoques nos parecía satisfactorio. El enfoque del selector requiere envolver todo el acceso al estado en un selector, lo que resulta tedioso para el estado complejo o anidado. El enfoque de envolver los componentes en una función requiere un esfuerzo manual para envolver los componentes, lo que conlleva una serie de problemas como la falta de nombres de componentes y propiedades estáticas.

Hemos tenido la oportunidad de trabajar estrechamente con muchos desarrolladores en los últimos años. Una lucha común, particularmente para aquellos nuevos en (p)react, es que conceptos como selectores y wrappers son paradigmas adicionales que deben ser aprendidos antes de sentirse productivos con cada solución de gestión de estados.

Idealmente, no necesitaríamos conocer selectores o funciones envolventes y podríamos simplemente acceder al estado directamente dentro de los componentes:

```jsx
// Imagina que este es un estado global y toda la aplicación necesita acceso a:
let count = 0;
 
function Counter() {
 return (
   <button onClick={() => count++}>
     value: {count}
   </button>
 );
}
```

El código es claro y es fácil de entender lo que está pasando, pero por desgracia no funciona. El componente no se actualiza al pulsar el botón porque no hay forma de saber que `count` ha cambiado.

Sin embargo, no podíamos quitarnos este escenario de la cabeza. ¿Qué podríamos hacer para convertir un modelo tan claro en una realidad? Empezamos a prototipar varias ideas e implementaciones utilizando el [renderizador conectable](/guide/v10/options) de Preact. Nos llevó tiempo, pero al final dimos con la forma de hacerlo realidad:

```jsx
// --repl
import { render } from "preact";
import { signal } from "@preact/signals";
// --repl-before
// Imagina que este es un estado global al que toda la aplicación necesita acceso:
const count = signal(0);
 
function Counter() {
 return (
   <button onClick={() => count.value++}>
     Value: {count.value}
   </button>
 );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

No hay selectores, ni funciones envolventes, nada. Acceder al valor de la señal es suficiente para que el componente sepa que necesita actualizarse cuando el valor del signal cambia. Después de probar el prototipo en algunas aplicaciones, estaba claro que habíamos dado en el clavo. Escribir el código de esta manera era intuitivo y no requería ninguna gimnasia mental para mantener las cosas funcionando de manera óptima.

## ¿Podemos ir aún más rápido?

Podríamos habernos detenido aquí y liberar los signals tal cual, pero así es el equipo de Preact: nos necesitaban para ver hasta dónde podíamos llevar la integración con Preact. En el ejemplo anterior del contador, el valor de `count` sólo se utiliza para mostrar texto, lo que realmente no debería requerir volver a renderizar un componente entero. En lugar de volver a renderizar automáticamente el componente cuando cambia el valor de la señal, ¿qué pasaría si sólo volviéramos a renderizar el texto? Mejor aún, ¿qué pasaría si nos saltáramos por completo el DOM virtual y actualizáramos el texto directamente en el DOM?

```jsx
const count = signal(0);
 
// En lugar de esto:
<p>Value: {count.value}</p>
 
// … podemos pasar el signal directamente al JSX:
<p>Value: {count}</p>
 
// … o incluso pasándolo como propiedades del DOM:
<input value={count} onInput={...} />
```

Así que sí, hicimos eso también. Puedes pasar un signal directamente al JSX en cualquier lugar donde normalmente usarías una cadena. El valor del signal se mostrará como texto, y se actualizará automáticamente cuando el signal cambie. Esto también funciona para props.

## Próximos pasos

Si tienes curiosidad y quieres ponerte manos a la obra, visita nuestra [documentación](/guide/v10/signals) sobre signals. Nos encantaría saber cómo vas a utilizarlas.

Recuerde que no hay prisa por cambiar a los signals. Los hooks seguirán siendo compatibles, y también funcionan muy bien con los signals. Recomendamos probar los signals gradualmente, empezando con unos pocos componentes para acostumbrarse a los conceptos.
