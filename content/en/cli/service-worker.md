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

Peract CLI has a 3 line service worker API which you can edit in order to make any changes to the default service worker functionality.

- Create a `sw.js` file in `src` folder.
- import preact-cli's sw library
  ```js
    import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
  ```
- Setup NetworkFirst fallback routing.
  ```js
    import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
    /**
     * This sets up the Network first fallback behaviour for offline users.
     * Skip this if you want a custom setup for offline fallback behavior.
     */
    setupRouting();
  ```
- Setup Precaching.
  ```js
    import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
    /**
     * This sets up the Network first fallback behaviour for offline users.
     * Skip this if you want a custom setup for offline fallback behavior.
     */
    setupRouting();
    /**
     * This sets up precaching for all the files returned from the `getFiles`.
     * If you want to modify the list of files being pre-cached than just modify the result of `getFiles()` and pass it to the `setupPrecaching`
     */
    setupPrecaching(getFiles());
  ```
- Make changes according to your needs

## Adding other routes to runtime caching

If you want to add other routes or your API calls to runtime caching, follow the following steps.

- Create a `sw.js` file in your `src` folder.
- Add the following code at the end with your respective settings.

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
