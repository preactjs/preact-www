---
title: Preact X, una historia de estabilidad
date: 2024-05-24
authors:
  - Jovi De Croock
translation_by:
  - Ezequiel Mastropietro
---

# Preact X, una historia de estabilidad

Muchos de ustedes han estado esperando la llegada de [Preact 11](https://github.com/preactjs/preact/issues/2621), anunciada en una Issue abierta en julio de 2020, y, a decir verdad, yo era una de las personas más emocionadas por la v11. 

Cuando empezamos a pensar en Preact 11, creíamos que no había forma de introducir los cambios que teníamos en mente en Preact X sin cambios que rompieran la compatibilidad; algunas de las cosas que teníamos en mente:

- Usar una estructura de VNode de respaldo para reducir el GC (recolección de basura); al hacer esto, solo usaríamos el resultado de `h()` para actualizar nuestro nodo de respaldo.
- Rendimiento del reconciliador, para permitir rutas optimizadas para montaje/desmontaje/etc.
- Algunos cambios como eliminar el sufijo `px`, `forwardRef` y romper el soporte para IE11.
- Mantener `ref` en las props
- Abordar errores en el diffing de eventos e hijos.

Estos eran nuestros objetivos iniciales para la v11, pero al recorrer este camino, nos dimos cuenta de que muchos de esos cambios no eran realmente cambios que rompían la compatibilidad y podían lanzarse directamente en la v10 de una manera no disruptiva. Solo el tercer punto, eliminar el sufijo `px` y pasar `ref` directamente en las props, así como eliminar el soporte de IE11, entran en la categoría de cambios que rompen la compatibilidad. Decidimos lanzar las otras características en la línea de versiones estables de la v10, lo que permite a cualquier usuario de Preact beneficiarse de ellas inmediatamente sin tener que cambiar su código.

Preact tiene una base de usuarios mucho mayor hoy en día en comparación con cuando hicimos los planes originales para la v11. Goza de un amplio uso en muchas empresas, de pequeñas a grandes, para software de misión crítica. Realmente queremos asegurarnos de que cualquier cambio que rompa la compatibilidad que podamos introducir valga absolutamente el costo de mover todo el ecosistema hacia él.

Mientras estábamos [experimenting](https://github.com/preactjs/preact/tree/v11) optamos por un nuevo tipo de diffing, llamado
[skew based diffing](https://github.com/preactjs/preact/pull/3388) (diffing basado en sesgo), vimos mejoras reales de rendimiento, así como la corrección de un montón de errores de larga data. A medida que pasaba el tiempo e invertíamos más tiempo en estos experimentos para Preact 11, empezamos a notar que las mejoras que estábamos logrando no necesitaban ser exclusivas de Preact 11.

## Lanzamientos

Desde la mencionada incidencia de Preact 11 ha habido 18 (!!) versiones menores de Preact X.
Muchas de ellas han sido inspiradas directamente por el trabajo realizado en Preact 11. Repasemos algunas y veamos el impacto.

### 10.5.0

La introducción de la [hidratación reanudada](https://github.com/preactjs/preact/pull/2754) -- esta funcionalidad básicamente permite suspender durante la re-hidratación de tu árbol de componentes. Esto significa que, por ejemplo, en el siguiente árbol de componentes re-hidrataremos y haremos que el `Header` sea interactivo mientras el `LazyArticleHeader` se suspende; mientras tanto, el DOM renderizado en el servidor permanecerá en pantalla. Cuando la carga diferida termine continuaremos re-hidratando, se podrá interactuar con nuestro `Header` y `LazyArticleHeader` mientras nuestros `LazyContents` se resuelven. Esta es una característica bastante potente para hacer que tus cosas más importantes sean interactivas sin sobrecargar el tamaño del bundle/tamaño de descarga de tu bundle inicial.

```jsx
const App = () => {
  return (
    <>
      <Header>
      <main>
        <Suspense>
          <LazyArticleHeader />
          <Suspense>
            <article>
              <LazyContents />
            </article>
          </Suspense>
        </Suspense>
      </main>
    </>
  )
}
```

### 10.8.0

En la 10.8.0 introdujimos el [asentamiento de estado](https://github.com/preactjs/preact/pull/3553), esto aseguraría que si un componente actualiza el estado de un hook durante el renderizado, nosotros lo detectaríamos, cancelaríamos los efectos anteriores y continuaríamos renderizando. Por supuesto, tendríamos que asegurarnos de que esto no entrara en bucle, pero esta característica reduce la cantidad de renderizados que se encolan debido a invocaciones de estado dentro del renderizado; esta característica también aumentó nuestra compatibilidad con el ecosistema de React, ya que muchas bibliotecas confiaban en que los efectos no se llamaran varias veces debido a actualizaciones de estado dentro del renderizado.

### 10.11.0

Después de mucha investigación encontramos una manera de introducir [useId](https://github.com/preactjs/preact/pull/3583) n Preact, esto requirió un montón de investigación sobre cómo podríamos agregar valores únicos para una estructura de árbol dada. Uno de nuestros mantenedores escribió sobre
[nuestra investigación en ese momento](https://www.jovidecroock.com/blog/preact-use-id) y hemos iterado sobre ello desde entonces tratando de hacerlo tan libre de colisiones como sea posible...

### 10.15.0

Encontramos que un re-renderizado de paso que resultaba en múltiples componentes nuevos re-renderizándose podía resultar en que nuestra `rerenderQueue` estuviera desordenada; esto podía resultar en que nuestras actualizaciones (de contexto) se propagaran a componentes que luego se renderizarían *de nuevo* con valores obsoletos, ¡puedes consultar [el mensaje del commit](https://github.com/preactjs/preact/commit/672782adbf9ccefa7a4d7c175f0adf8580f73c92) para una explicación realmente detallada! Hacer esto tanto agrupa estas actualizaciones como aumenta nuestra alineación con las bibliotecas de React.

### 10.16.0

En nuestra investigación para la v11 profundizamos en el diffing de hijos ya que éramos conscientes de que había algunos casos donde nuestro algoritmo actual se quedaba corto, simplemente listando algunas de estas incidencias:

- [eliminar un elemento antes que otro causaría una re-inserción](https://github.com/preactjs/preact/issues/3973)
- [re-inserciones al eliminar más de 1 hijo](https://github.com/preactjs/preact/issues/2622)
- [desmontaje innecesario de nodos con keys](https://github.com/preactjs/preact/issues/2783)

No todas estas resultaban en un mal estado, algunas solo significaban una disminución del rendimiento... Cuando descubrimos que podíamos portar el diffing basado en sesgo a Preact X estábamos emocionados, ¡no solo arreglaríamos muchos casos, sino que podríamos ver cómo se comporta este algoritmo en el mundo real! Lo cual, en retrospectiva, funcionó muy bien; a veces hubiese deseado que tuviéramos buenos bancos de pruebas para ejecutar esto primero en lugar de que nuestra comunidad tuviera que reportar incidencias. Quiero aprovechar esta oportunidad para agradecerles a todos por ayudarnos enviando siempre incidencias consideradas con reproducciones, ¡ustedes son absolutamente los mejores!

### 10.19.0

En la 10.19.0 Marvin aplicó su investigación de [fresh](https://fresh.deno.dev/) para agregar [funciones JSX pre-compiladas](https://github.com/preactjs/preact/pull/4177), esto básicamente te permite pre-compilar tus componentes durante la transpilación, cuando se ejecuta render-to-string solo tenemos que concatenar las cadenas en lugar de asignar memoria para todo el árbol de VNodes. ¡La transformación para esto es exclusiva de Deno por el momento, pero el concepto general está presente en Preact!

### 10.20.2

Hemos enfrentado una serie de incidencias donde un evento podía burbujear hacia un VNode recién insertado, lo que resultaba en un comportamiento no deseado; esto se solucionó [agregando un reloj de eventos](https://github.com/preactjs/preact/pull/4322). En el siguiente escenario, harías clic en el botón que establece el estado, el navegador intercala el burbujeo de eventos con micro-ticks, que también es lo que usa Preact para programar actualizaciones. Esta combinación significa que Preact actualizará la UI, lo que significa que el `<div>` obtendrá ese manejador `onClick` hacia el cual burbujearemos e invocaremos el `click` de nuevo, apagando inmediatamente este estado otra vez.

```jsx
const App = () => {
	const [toggled, setToggled] = useState(false);

	return toggled ? (
		<div onClick={() => setToggled(false)}>
			<span>clear</span>
		</div>
	) : (
		<div>
			<button onClick={() => setToggled(true)}>toggle on</button>
		</div>
	);
};
```

## Estabilidad

Los anteriores son algunos lanzamientos seleccionados de cosas que nuestra comunidad recibió _sin_ cambios que rompen la compatibilidad, pero hay mucho más... Agregar una nueva versión mayor siempre deja atrás a una parte de la comunidad y no queremos hacer eso. Si miramos la línea de lanzamientos de Preact 8 podemos ver que todavía hay 100.000 descargas en la última semana, el último lanzamiento de 8.x fue hace 5 años, solo para mostrar que una parte de la comunidad se queda atrás.

La estabilidad es genial, nosotros como el equipo de Preact amamos la estabilidad. De hecho lanzamos múltiples características mayores en otros proyectos del ecosistema:

- [Signals](https://github.com/preactjs/signals)
- [Renderizado asíncrono](https://github.com/preactjs/preact-render-to-string/pull/333)
- [Renderizado en streaming](https://github.com/preactjs/preact-render-to-string/pull/354)
- [Prefresh](https://github.com/preactjs/prefresh)
- [El preset de vite con pre-renderizado](https://github.com/preactjs/preset-vite#prerendering-configuration)
- [Un nuevo enrutador asíncrono](https://github.com/preactjs/preact-iso)
- [Create Preact](https://github.com/preactjs/create-preact)

Valoramos nuestro ecosistema y valoramos las extensiones que se construyen a través de nuestra [`options API`](https://www.google.com/search?q=%5Bhttps://marvinh.dev/blog/preact-options/%5D(https://marvinh.dev/blog/preact-options/)), este es uno de los principales impulsores detrás de no querer introducir estos cambios que rompen la compatibilidad, sino en su lugar, permitirles a todos beneficiarse de nuestra investigación sin un camino de migración doloroso.

Esto no significa que Preact 11 no sucederá, pero podría no ser lo que pensamos inicialmente que sería. En su lugar, podríamos simplemente eliminar el soporte de IE11 y darles esas mejoras de rendimiento, todo mientras les damos la estabilidad de Preact X. Hay muchas más ideas flotando y estamos muy interesados en la experiencia más amplia de Preact en el contexto de meta-frameworks que proporcionan cosas como enrutamiento listo para usar. Estamos explorando este ángulo en nuestro preset de vite así como en [Fresh](https://fresh.deno.dev/) para tener una buena idea de cómo debería verse un meta framework que priorice Preact.