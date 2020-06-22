---
name: CLI's Service worker
permalink: '/cli/service-workers'
description: 'Preact CLI documentation'
---

# Going Offline with Preact CLI

Preact CLI automatically pre-caches your application code and prerendered data for offline use.

Preact CLI version 3 comes bundled with [workbox](https://developers.google.com/web/tools/workbox). It uses the [InjectManifest plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2) to generate a flexible service worker that covers many use cases right out of the box.

> **Note:** Preact CLI fetches navigation requests using a [network-first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache) approach, so users will always see fresh content unless they are offline.

## Adding a custom service worker

Without writing any code, Preact CLI will generate a service worker when building your application for production. To customize the service worker, Preact CLI provides a high-level API for that can be imported and used in an `sw.js` file in your project:

**1. Create a `sw.js` file within your `src/` directory**

```sh
package.json
src/
  index.js
  sw.js
```

**2. Import Preact CLI's service worker library, `preact-cli/sw`**

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
```

**3. Enable offline routing**

This sets up the network-first fallback behaviour for offline users.

Skip this if you want a custom setup for offline fallback behavior.

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();
```

**4. Enable pre-caching of resources**

The `getFiles()` function returns an Array of URLs generated at build time that should be cached for offline use.

These URLs can be passed to `setupPrecaching()` to download and store them in the cache used by `setupRouting()`.

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);
```

**5. Add your custom service worker logic**

Now that the default Preact CLI functionality has been added to your custom service worker, you can now change or extend it to suit your needs - whether that's customizing the list of URLs to precache or [setting up push notifications](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications).

## Adding other routes to runtime caching

To add runtime caching of other routes or API calls, first create a custom `sw.js` by following the [steps above](#adding-a-custom-service-worker). Then, use the Workbox API to customize your service worker:

```js
workbox.routing.registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  workbox.strategies.networkOnly()  // or: cacheFirst(), cacheOnly(), staleWhileRevalidate()
);
```

In the example above, using the `networkOnly` strategy means `/special/url` will never be cached by the service worker.

> **Note:** Any custom routing code should be placed before `setupRouting()`.

## Using other workbox modules in your service worker

Preact CLI imports [worbox-sw](https://developers.google.com/web/tools/workbox/modules/workbox-sw) in its service worker, thus all modules can be loaded on-demand as you use them. Importing any module from workbox will make it available as a global in your service worker.

**Example: Adding Background sync**

The following code can be added to your custom `sw.js`. It uses [Workbox Background Sync](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync) to retry API requests that failed when the user was offline.

```js
const bgSyncPlugin = new workbox.backgroundSync.Plugin('apiRequests', {
  maxRetentionTime: 60  // retry for up to one hour (in minutes)
});

// retry failed POST requests to /api/**.json
workbox.routing.registerRoute(
  /\/api\/.*\/.*\.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
```
