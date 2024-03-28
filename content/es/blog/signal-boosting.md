---
title: El impulso de signal
date: 2022-09-24
authors:
  - Joachim Viide
translation_by:
  - Ivan Ulloque
---

# El impulso de Signal

La nueva versión de Preact Signals aporta importantes actualizaciones de rendimiento a los fundamentos del sistema reactivo. Sigue leyendo para saber qué tipo de trucos hemos empleado para conseguirlo.

Recientemente hemos [anunciado](https://twitter.com/jviide/status/1572570215350964224) nuevas versiones de los paquetes de Preact Signals:

 * [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core) 1.2.0 para las funciones básicas compartidas
 * [@preact/signals](https://www.npmjs.com/package/@preact/signals) 1.1.0 para las vinculaciones con Preact
 * [@preact/signals-react](https://www.npmjs.com/package/@preact/signals-react) 1.1.0 para las vinculaciones con React

Esta publicación describirá los pasos que tomamos para optimizar **@preact/signals-core**. Es el paquete que actúa como base para los vinculos específicos del framework, pero también se puede utilizar de forma independiente.

Los Signals son la propuesta del equipo de Preact para la programación reactiva. Si quieres una pequeña introducción sobre qué son los Signals y cómo se relacionan con Preact, [la publicación del blog sobre el anuncio de los Signals](/blog/introducing-signals) lo tiene cubierto. Para una inmersión más profunda, consulta la [documentación oficial](/guide/v10/signals).

Cabe señalar que ninguno de estos conceptos los hemos inventado nosotros. La programación reactiva tiene bastante historia, y ya ha sido popularizada ampliamente en el mundo de JavaScript por [Vue.js](https://vuejs.org/), [Svelte](https://svelte.dev/), [SolidJS](https://www.solidjs.com/), [RxJS](https://rxjs.dev/) y demasiados otros para nombrarlos. ¡Felicitaciones a todos ellos!


## Un recorrido rápido por el núcleo de los Signals

Empecemos con una visión general de las características fundamentales del paquete **@preact/signals-core**.

Los siguientes fragmentos de código utilizan funciones importadas del paquete. Las sentencias import sólo se muestran cuando se introduce una nueva función.

### Signals

Los _Signals_ son los valores fundamentales en los que se basa nuestro sistema reactivo. Otras bibliotecas podrían llamarlos, por ejemplo, "observables" ([MobX](https://mobx.js.org/observable-state.html), [RxJS](https://rxjs.dev/guide/observable)) o "refs" ([Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vue)). El equipo de Preact adoptó el término "signal" utilizado por [SolidJS](https://www.solidjs.com/tutorial/introduction_signals).

Los Signals representan valores arbitrarios de JavaScript envueltos en un caparazón reactivo. Proporcionas un signal con un valor inicial, y posteriormente puedes leerla y actualizarla sobre la marcha.

```js
// --repl
import { signal } from "@preact/signals-core";

const s = signal(0);
console.log(s.value); // Consola: 0

s.value = 1;
console.log(s.value); // Consola: 1
```

Por sí solos, los signals no son muy interesantes hasta que se combinan con los otros dos primitivos, los _signals calculados_ y los _efectos_.

### Signals Calculados

Los _signals calculados_ derivan nuevos valores de otros signals mediante _funciones de cálculo_.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hola");
const s2 = signal("Mundo");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
```

La función de cálculo dada a `computed(...)` no se ejecutará inmediatamente. Esto se debe a que los signals calculados se evalúan _perezosamente_, es decir, cuando se leen sus valores.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hola");
const s2 = signal("Mundo");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
// --repl-before
console.log(c.value); // Consola: Hola Mundo
```

Los valores calculados también _se almacenan en caché_. Sus funciones de cálculo pueden ser potencialmente muy caras, por lo que queremos volver a ejecutarlas sólo cuando sea importante. Una función de cálculo en ejecución rastrea qué valores de signals se leen realmente durante su ejecución. Si ninguno de los valores ha cambiado, podemos omitir el recálculo. En el ejemplo anterior, podemos reutilizar indefinidamente el valor `c.value` calculado previamente siempre que tanto `a.value` como `b.value` sigan siendo los mismos. Facilitar este _seguimiento de dependencias_ es la razón por la que necesitamos envolver los valores primitivos en signals en primer lugar.

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hola");
const s2 = signal("Mundo");

const c = computed(() => {
  return s1.value + " " + s2.value;
});

console.log(c.value); // Consola: Hola Mundo
// --repl-before
// s1 y s2 no han cambiado, no hay que volver a calcularlo aquí
console.log(c.value); // Consola: Hola Mundo

s2.value = "oscuridad mi vieja amiga";

// s2 ha cambiado, por lo que la función de cálculo se ejecuta nuevamente
console.log(c.value); // Consola: Hola oscuridad mi vieja amiga
```

Así, los signals calculados son en sí mismos signals. Un signal calculado puede depender de otros signals calculados.

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

console.log(quadruple.value); // Consola: 4
count.value = 20;
console.log(quadruple.value); // Consola: 80
```

El conjunto de dependencias no tiene por qué permanecer estático. El signal calculado sólo reaccionará a los cambios en el último conjunto de dependencias.

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const choice = signal(true);
const funk = signal("Uptown");
const purple = signal("Haze");

const c = computed(() => {
  if (choice.value) {
    console.log(funk.value, "Funk");
  } else {
    console.log("Purple", purple.value);
  }
});
c.value;               // Consola: Uptown Funk

purple.value = "Rain"; // purple no es una dependencia, por lo que
c.value;               // el efecto no se ejecuta

choice.value = false;
c.value;               // Consola: Purple Rain

funk.value = "Da";     // funk no es una dependencia, por lo que
c.value;               // el efecto no se ejecuta
```

Estas tres cosas - seguimiento de dependencias, pereza y almacenamiento en caché - son características comunes en las bibliotecas de reactividad. _Las propiedades computadas_ de Vue son [un ejemplo destacado](https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j).

### Efectos

Los signals computados se prestan bien a [funciones puras](https://en.wikipedia.org/wiki/Pure_function) sin efectos secundarios. También son perezosas. Entonces, ¿qué hacer si queremos reaccionar a los cambios en los valores de los signals sin sondearlas constantemente? ¡Efectos al rescate!

Al igual que los signals computados, los efectos también se crean con una función (_función de efecto_) y también rastrean sus dependencias. Sin embargo, en lugar de ser perezosos, los efectos son _ansiosos_. La función de efecto se ejecuta inmediatamente cuando se crea el efecto, y luego una y otra vez cada vez que cambian los valores de las dependencias.

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";

const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

effect(() => {
  console.log("EL cuádruple ahora es", quadruple.value);
});               // Consola: EL cuádruple ahora es 4

count.value = 20; // Consola: EL cuádruple ahora es 80
```

Estas reacciones se desencadenan mediante _notificaciones_. Cuando un signal simple cambia, notifica a sus dependientes inmediatos. Éstos, a su vez, notifican a sus dependientes inmediatos, y así sucesivamente. Como es [habitual](https://mobx.js.org/computeds.html) en los sistemas reactivos, los signals calculados a lo largo de la ruta de la notificación se marcan a sí mismas como obsoletas y listas para volver a ser calculados. Si la notificación llega hasta un efecto, éste se autoprograma para ejecutarse en cuanto todos los efectos programados anteriormente hayan finalizado.

Cuando haya terminado con un efecto, llame al _disposer_ que se devolvió cuando se creó el efecto por primera vez:

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

const dispose = effect(() => {
  console.log("EL cuádruple ahora es", quadruple.value);
});                 // Consola: EL cuádruple ahora es 4

dispose();
count.value = 20;  // no se imprime nada en la consola
```

Existen otras funciones, como [`batch`](/guide/v10/signals/#batch-fn), pero estas tres son las más relevantes para las notas de implementación que siguen.


# Notas de implementación

Cuando nos propusimos implementar versiones más eficaces de las primitivas anteriores, tuvimos que encontrar formas ágiles de realizar todas las siguientes subtareas:

 * Seguimiento de dependencias: Realiza un seguimiento de los signals utilizados (simples o calculados). Las dependencias pueden cambiar dinámicamente.
 * Pereza: Las funciones de cálculo sólo deben ejecutarse bajo demanda.
 * Almacenamiento en caché: Un signal calculado debe volver a calcularse sólo cuando sus dependencias hayan cambiado.
 * Ansiedad: Un efecto debe ejecutarse lo antes posible cuando cambie algo en su cadena de dependencias.

Un sistema reactivo puede implementarse de un millón de maneras diferentes. La primera versión publicada de **@preact/signals-core** se basaba en Sets, así que seguiremos usando ese enfoque para contrastar y comparar.

### Seguimiento de la dependencia

Cada vez que una función de cálculo/efecto comienza a evaluar, necesita una forma de capturar los signals que se han leído durante su ejecución. Para ello, el signal o efecto calculado se establece como _contexto de evaluación_ actual. Cuando se lee la propiedad `.value` de un signal, se llama a un [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get). El getter añade el signal como dependencia, _fuente_, del contexto de evaluación. El contexto también se añade como dependiente, _objetivo_, del signal.

Al final, los signals y los efectos siempre tienen una visión actualizada de sus dependencias y dependientes. Cada signal puede entonces notificar a sus dependientes cada vez que su valor ha cambiado. Los efectos y los signals calculados pueden referirse a sus conjuntos de dependencias para darse de baja de esas notificaciones cuando, por ejemplo, un efecto es eliminado.

![Signals and effects always have an up-to-date view of their dependencies (sources) and dependents (targets)](/assets/signals/signal-boosting-01.png)

El mismo signal puede leerse varias veces dentro del mismo contexto de evaluación. En tales casos, sería útil hacer algún tipo de deduplicación para las entradas de dependencias y dependientes. También necesitamos una forma de gestionar los conjuntos cambiantes de dependencias: reconstruir el conjunto de dependencias en cada ejecución o añadir/eliminar incrementalmente dependencias/dependientes.

Los objetos [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) de JavaScript se adaptan bien a todo eso. Como muchas otras implementaciones, la versión original de Preact Signals los utilizaba. Los Sets permiten añadir y eliminar elementos en [tiempo O(1) constante](https://en.wikipedia.org/wiki/Time_complexity#Constant_time) (amortizado), así como iterar a través de los elementos actuales en [tiempo O(n) lineal](https://en.wikipedia.org/wiki/Time_complexity#Linear_time). Los duplicados también se gestionan automáticamente. No es de extrañar que muchos sistemas de reactividad utilicen Sets (o [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)). La herramienta adecuada para el trabajo y todo eso.

Sin embargo, nos preguntábamos si existen enfoques alternativos. Los Sets pueden ser relativamente caros de crear, y al menos los signals calculaods pueden necesitar dos Sets separados: uno para las dependencias y otro para los dependientes. Jason estaba siendo un _Jason total_ otra vez y [comparó](https://esbench.com/bench/6317fc2a6c89f600a5701bc9) cómo le va a la iteración de Set frente a Arrays. Habrá mucha iteración, así que todo suma.

![Set iteration is just a tad slower than Array iteration](/assets/signals/signal-boosting-01b.png)

Los Sets también tienen la propiedad de ser iterados en orden de inserción. Lo que está muy bien - que es justo lo que necesitamos más tarde cuando nos ocupamos de almacenamiento en caché. Pero existe la posibilidad de que el orden no sea siempre el mismo. Observa el siguiente escenario:

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const s1 = signal(0);
const s2 = signal(0);
const s3 = signal(0);

const c = computed(() => {
  if (s1.value) {
    s2.value;
    s3.value;
  } else {
    s3.value;
    s2.value;
  }
});
```

Dependiendo de `s1`, el orden de las dependencias es `s1, s2, s3` o `s1, s3, s2`. Hay que tomar medidas especiales para mantener los Sets en orden: eliminar y volver a añadir elementos, vaciar el Set antes de ejecutar una función o crear un nuevo Set para cada ejecución. Cada uno de estos enfoques puede provocar una sobrecarga de memoria. Y todo esto sólo para tener en cuenta el caso teórico, pero probablemente raro, de que el orden de las dependencias cambie.

Hay muchas otras formas de solucionar este problema. Por ejemplo, numerando y luego ordenando las dependencias. Terminamos explorando [listas enlazadas](https://en.wikipedia.org/wiki/Linked_list).

### Listas Enlazadas

Las listas enlazadas a menudo se consideran bastante primitivas, pero para nuestros propósitos tienen algunas propiedades muy interesantes. Si tiene una lista de nodos doblemente enlazados, las siguientes operaciones pueden resultar extremadamente económicas:

 * Insertar un elemento en un extremo de la lista en tiempo O(1).
 * Eliminar un nodo (para el cual ya tienes un puntero) de cualquier lugar de la lista en un tiempo O(1).
 * Iterar a través de la lista en O(n) tiempo (O(1) por nodo)

Resulta que estas operaciones son todo lo que necesitamos para gestionar dependencias/listas de dependientes.

Empecemos creando un "Nodo fuente" para cada relación de dependencia. El atributo `source` del Nodo apunta a la señal de la que depende. Cada Nodo tiene las propiedades `nextSource` y `prevSource` que apuntan al siguiente y anterior Nodo fuente en la lista de dependencias, respectivamente. Los efectos o signals calculados obtienen un atributo `sources` que apunta al primer Nodo de la lista. Ahora podemos iterar a través de las dependencias, insertar una nueva dependencia y eliminar dependencias de la lista para reordenarlas.

![Effects and computed signals keep their dependencies in a doubly-linked list](/assets/signals/signal-boosting-02.png)

Ahora hagamos lo mismo en la otra dirección: Para cada dependiente, creemos un "Nodo objetivo". El atributo `target` del Nodo apunta al efecto dependiente o signal calculado. `nextTarget` y `prevTarget` construyen una lista doblemente enlazada. Los signals simples y computados obtienen un atributo `targets` que apunta al primer Nodo objetivo en su lista de dependientes.

![Signals keep their dependents in a doubly-linked list](/assets/signals/signal-boosting-03.png)

Pero oye, las dependencias y los dependientes vienen en pares. Por cada Nodo fuente **debe** haber un Nodo objetivo correspondiente. Podemos explotar este hecho y fusionar los "Nodos fuente" y "Nodos objetivo" en solo "Nodos". Cada Nodo se convierte en una especie de monstruosidad cuádruple enlazada que el dependiente puede usar como parte de su lista de dependencias, y viceversa.

![Each Node becomes a sort of quad-linked monstrosity that the dependent can use as a part of its dependency list, and vice versa](/assets/signals/signal-boosting-04.png)

A cada Nodo se le pueden adjuntar cosas adicionales con fines de mantenimiento. Antes de cada función de computación/efecto, iteramos a través de las dependencias previas y establecemos la bandera "sin usar" de cada Nodo. También almacenamos temporalmente el Nodo en su propiedad `.source.node` para usarlo después. La función puede entonces comenzar su ejecución.

Durante la ejecución, cada vez que se lee una dependencia, los valores de mantenimiento se pueden usar para descubrir si esa dependencia ya se ha visto durante esta ejecución o la anterior. Si la dependencia es de la ejecución anterior, podemos reciclar su Nodo. Para las dependencias no vistas anteriormente, creamos nuevos Nodos. Luego, los Nodos se reorganizan para mantenerlos en orden inverso de uso. Al final de la ejecución, recorremos la lista de dependencias nuevamente, purgando los Nodos que todavía están colgados con la bandera "sin usar" activada. Luego, invertimos la lista de Nodos restantes para mantenerla ordenada para el próximo uso.

Esta delicada danza de la muerte nos permite asignar solo un Nodo por cada par de dependencia-dependiente y luego usar ese Nodo indefinidamente, siempre y cuando exista la relación de dependencia. Si el árbol de dependencias se mantiene estable, el consumo de memoria también se mantiene efectivamente estable después de la fase inicial de construcción. Mientras tanto, las listas de dependencias se mantienen actualizadas y en orden de uso. Con una cantidad constante de trabajo O(1) por Nodo. ¡Genial!

### Efectos ansiosos

Con el seguimiento de dependencias solucionado, los efectos ansiosos son relativamente sencillos de implementar a través de notificaciones de cambios. Los signals notifican a sus dependientes sobre cambios de valor. Si el dependiente en sí es un signal calculado que tiene dependientes, entonces pasa la notificación hacia adelante, y así sucesivamente. Los efectos que reciben una notificación se programan a sí mismos para ejecutarse.

Agregamos un par de optimizaciones aquí. Si el extremo receptor de una notificación ya había sido notificado antes, y aún no había tenido la oportunidad de ejecutarse, entonces no pasará la notificación hacia adelante. Esto mitiga estampidas en cascada de notificaciones cuando el árbol de dependencias se expande o contrae. Los signals simples tampoco notifican a sus dependientes si el valor del signal no cambia realmente (por ejemplo, `s.value = s.value`). Pero eso es solo ser cortés.

Para que los efectos puedan programarse a sí mismos, debe haber algún tipo de lista de efectos programados. Agregamos un atributo dedicado `.nextBatchedEffect` a cada instancia de Efecto, permitiendo que las instancias de Efecto hagan una doble función como nodos en una lista de programación enlazada simple. Esto reduce el consumo de memoria, porque programar el mismo efecto una y otra vez no requiere asignaciones o liberaciones adicionales de memoria.

### Interludio: Suscripciones a notificaciones vs. GC

No hemos sido completamente honestos. Los signals calculados en realidad no _siempre_ obtienen notificaciones de sus dependencias. Un signal calculado se suscribe a las notificaciones de dependencias solo cuando hay algo, como un efecto, escuchando el propio signal. Esto evita problemas en situaciones como esta:

```js
const s = signal(0);

{
  const c = computed(() => s.value)
}
// c ha salido del ámbito
```

Si `c` se suscribiera siempre a las notificaciones de `s`, entonces `c` no podría ser recolectada por el recolector de basura hasta que `s` también salga del ámbito. Eso es porque `s` seguiría manteniendo una referencia a `c`.

Existen múltiples soluciones a este problema, como usar [WeakRefs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) o requerir que los signals calculados sean desechados manualmente. En nuestro caso, las listas enlazadas proporcionan una forma muy conveniente de suscribirse y cancelar la suscripción a las notificaciones de dependencias sobre la marcha, gracias a todas esas cosas de O(1). El resultado final es que no tienes que prestar atención especial a las referencias colgantes de signals calculados. Pensamos que este era el enfoque más ergonómico y con mejor rendimiento.

En aquellos casos en los que un signal calculado **se ha** suscrito a notificaciones, podemos usar ese conocimiento para optimizaciones adicionales. Esto nos lleva a la pereza y el almacenamiento en caché.

### Signals calculados perezosos y en caché

La forma más fácil de implementar un signal calculado perezoso sería simplemente volver a calcular cada vez que se lee su valor. Sin embargo, no sería muy eficiente. Ahí es donde el almacenamiento en caché y el seguimiento de dependencias ayudan mucho.

Cada signal simple y calculado tiene su propio _número de versión_. Incrementan sus números de versión cada vez que notan un cambio en su propio valor. Cuando se ejecuta una función de calculo, almacena en los Nodos los últimos números de versión vistos de sus dependencias. Podríamos haber optado por almacenar los valores de dependencia anteriores en los nodos en lugar de los números de versión. Sin embargo, dado que los signals calculados son perezosos, podrían aferrarse indefinidamente a valores desactualizados y potencialmente costosos. Así que sentimos que la numeración de versiones era un compromiso seguro.

Terminamos con el siguiente algoritmo para determinar cuándo un signal calculado puede tomarse el día libre y reutilizar su valor almacenado en caché:

 1. Si ningún signal en ningún lugar ha cambiado de valor desde la última ejecución, entonces sal del proceso y devuelve el valor en caché.

 > Cada vez que un signal simple cambia, también incrementa un número de versión global, compartido entre todos los signals simples. Cada signal calculado lleva la cuenta del último número de versión global que ha visto. Si la versión global no ha cambiado desde el último cálculo, entonces el recálculo se puede omitir antes de tiempo. De todos modos, no podría haber ningún cambio en ningún valor calculado en ese caso.

 1. Si el signal calculado está escuchando notificaciones, y no ha sido notificado desde la última ejecución, entonces sal del proceso y devuelve el valor en caché.

 > Cuando un signal calculado recibe una notificación de sus dependencias, marca el valor en caché como obsoleto. Como se describió anteriormente, los signals calculados no siempre reciben notificaciones. Pero cuando lo hacen, podemos aprovecharlo.

 1. Vuelve a evaluar las dependencias en orden. Verifica sus números de versión. Si ninguna dependencia ha cambiado su número de versión, incluso después de la reevaluación, entonces sal del proceso y devuelve el valor en caché.

  > Este paso es la razón por la que dimos amor y cuidado especial para mantener las dependencias en su orden de uso. Si una dependencia cambia, entonces no queremos volver a evaluar las dependencias que vienen más adelante en la lista porque podría ser solo trabajo innecesario. Quién sabe, tal vez el cambio en esa primera dependencia haga que la siguiente función de cálculo que se ejecute elimine las últimas dependencias.

 1. Ejecuta la función de cálculo. Si el valor devuelto es diferente al guardado en caché, entonces incrementa el número de versión del signal calculado. Guarda en caché y devuelve el nuevo valor.

  > ¡Este es el último recurso! Pero al menos si el nuevo valor es igual al guardado en caché, entonces el número de versión no cambiará, y los dependientes en la línea pueden usar eso para optimizar su propio almacenamiento en caché.

Los dos últimos pasos suelen recurrir en las dependencias. Es por eso que los pasos anteriores están diseñados para tratar de cortocircuitar la recursión.


# Final del juego

En el típico estilo de Preact, se agregaron múltiples optimizaciones más pequeñas en el camino. [El código fuente](https://github.com/preactjs/signals/tree/main/packages/core/src) contiene algunos comentarios que pueden o no ser útiles. Echa un vistazo a los [tests](https://github.com/preactjs/signals/tree/main/packages/core/test) si tienes curiosidad sobre qué tipo de casos de esquina se nos ocurrieron para garantizar que nuestra implementación sea robusta.

Este artículo fue una especie de brain dump. Describió los pasos principales que dimos para mejorar **@preact/signals-core** versión 1.2.0 - según alguna definición de "mejor". Con suerte, algunas de las ideas aquí listadas resonarán y serán reutilizadas y remezcladas por otros. ¡Al menos ese es el sueño!

Muchísimas gracias a todos los que contribuyeron. Y gracias a ti por leer hasta aquí. ¡Ha sido todo un viaje!
