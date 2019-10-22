---
name: CLI's Service worker
permalink: '/cli/service-workers'
description: 'Preact CLI documentation'
---

# Going Offline with Preact CLI

Preact CLI comes bundled with [workbox](https://developers.google.com/web/tools/workbox). It takes advantage of [InjectManifest](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2) plugin to gain and give high flexibility and more control over service worker use cases.

Preact CLI gives offline capabilities to the pre-built javascript/css and pre-rendered data out of the box.

> **Note:** Preact CLI fetches navigation requests with [Network first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache) approach, meaning that you users will always see fresh content unless they are offline.

## Custom functionality to your service worker

In order to make any changes to the default service worker functionality,

- Create a `sw.js` file in `src` folder.
- Paste the following snippet in this file to get the default functionality.

```js
self.__precacheManifest = [].concat(self.__precacheManifest || []);

const isNav = event => event.request.mode === 'navigate';

/**
 * Adding this before `precacheAndRoute` lets us handle all
 * the navigation requests even if they are in precache.
 */
workbox.routing.registerRoute(
  ({ event }) => isNav(event),
  new workbox.strategies.NetworkFirst({
    // this cache is plunged with every new service worker deploy so we dont need to care about purging the cache.
    cacheName: workbox.core.cacheNames.precache,
    networkTimeoutSeconds: 5, // if u dont start getting headers within 5 sec fallback to cache.
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200], // only cache valid responses, not opaque responses e.g. wifi portal.
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

- Make changes according to your needs

## Adding other routes to runtime caching

If you want to add other routes or your API calls to runtime caching, follow the following steps.

- Create a `sw.js` file in your `src` folder.
- Add the following code with your respective settings.

```js
workbox.routing.registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  workbox.strategies.<networkOnly/cacheOnly/cacheFirst/staleWhileRevalidate>()
);
```

- You can configure the above snippet with `networkOnly` to make sure that `/special/url` is never cached in service worker.

> **Note:** Any custom routing code should be put before `workbox.precaching.precacheAndRoute(self.__precacheManifest, precacheOptions);`

## Using other workbox modules in your service worker

Preact CLI imports [worbox-sw](https://developers.google.com/web/tools/workbox/modules/workbox-sw) in its service worker, thus all modules can be loaded on-demand as you use them.
Feel free to use any module from workbox offering and it will be available on the global scope of service worker at runtime.

e.g.: Adding Background sync

Add the following code to the bottom of your `sw.js`.

```js
const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

workbox.routing.registerRoute(
  /\/api\/.*\/*.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
```
