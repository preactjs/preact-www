---
name: CLI's Service worker
permalink: '/cli/service-workers'
description: 'Documentación Preact CLI'
---

# Estar offline con Preact CLI

Preact CLI viene incluido con [workbox](https://developers.google.com/web/tools/workbox). Hace provecho de la extensión [InjectManifest](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2) para obtener y dar una alta flexibilidad y un mayor control sobre los casos de uso de los trabajadores de servicios.

Preact CLI brinda capacidades fuera de línea a javascript/css preconstruido y datos pre-renderizados listos para usar.

> **Note:** Preact CLI obtiene solicitudes de navegación con el enfoque [Network first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache), lo que significa que sus usuarios siempre verán contenido nuevo a menos que estén fuera de línea.

## Funcionalidad personalizada para service worker

Para realizar cambios en la funcionalidad predeterminada del service worker,

- Crear un archivo `sw.js` en la carpeta `src`.
- Pegue el siguiente fragmento en este archivo para obtener la funcionalidad predeterminada.

```js
self.__precacheManifest = [].concat(self.__precacheManifest || []);

const isNav = event => event.request.mode === 'navigate';

/**
 * Agregar esto antes de `precacheAndRoute` nos permite manejar todas
 * las solicitudes de navegación incluso si están en precache.
 */
workbox.routing.registerRoute(
  ({ event }) => isNav(event),
  new workbox.strategies.NetworkFirst({
    // esta caché se tira con cada implementación de un nuevo trabajador de servicio, por lo que no debemos preocuparnos por purgar el caché.
    cacheName: workbox.core.cacheNames.precache,
    networkTimeoutSeconds: 5, // si no comienza a obtener encabezados dentro de los 5 segundos de reserva en caché.
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200], // solo almacena en caché las respuestas válidas, no las respuestas opacas, p. ej. portal wifi
      }),
    ],
  })
);

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.setCatchHandler(({ event }) => {
  if (isNav(event))
    return caches.match(workbox.precaching.getCacheKeyForURL('/index.html'));
  return Response.error();
});
```

- Hacer cambios de acuerdo a las necesidades

## Agregar otras rutas al almacenamiento en caché en tiempo de ejecución

Si se desea agregar otras rutas o llamadas API al almacenamiento en caché en tiempo de ejecución, seguir los siguientes pasos.

- Crear un archivo `sw.js` en la carpeta `src`.
- Agregue el siguiente código con sus respectivas configuraciones.

```js
workbox.routing.registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  workbox.strategies.<networkOnly/cacheOnly/cacheFirst/staleWhileRevalidate>()
);
```

- Se puede configurar el fragmento anterior con `networkOnly` para asegurarse de que`/special/url` nunca se almacene en caché en el service worker.

> **Note:** Cualquier código de enrutamiento personalizado debe colocarse antes de `workbox.precaching.precacheAndRoute(self.__precacheManifest, precacheOptions);`

## Usando otros módulos de workbox en el service worker

Preact CLI importa [worbox-sw] (https://developers.google.com/web/tools/workbox/modules/workbox-sw) en su service worker, por lo que todos los módulos se pueden cargar a pedido mientras los usa.
Siéntase libre de usar cualquier módulo ofrecido por workbox y estará disponible en el alcance global del service worker en tiempo de ejecución.

p.ej.: Agregar sincronización en segundo plano

Agrega el siguiente código al final del `sw.js`.

```js
const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Vuelve a intentar por un máximo de 24 horas (especificado en minutos)
});

workbox.routing.registerRoute(
  /\/api\/.*\/*.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);```
