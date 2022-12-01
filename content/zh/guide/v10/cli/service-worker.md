---
name: CLI 的 Service worker
permalink: '/cli/service-workers'
description: 'Preact CLI 文档'
---

# 搭配 Preact CLI 离线使用

Preact CLI 会为离线使用自动预缓存您的应用代码和预渲染数据。

Preact CLI v3 自带 [Workbox](https://developers.google.com/web/tools/workbox)，此技术使用 [InjectManifest 插件](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2)来生成灵活且兼容大部分用例的 Service Worker。 

> **小提示：**Preact CLI 使用[网络优先](https://web.dev/i18n/zh/offline-cookbook/#network-falling-back-to-cache)的方式获取导航请求，故用户总是能在非离线情况下获取最新内容。

## 添加自定义 Service Worker

Preact CLI 会在构建生产模式应用时自动为您生成 Service Worker。您可以在项目中添加 `sw.js` 文件并导入高级 API 来自定义它。

**1. 在 `src/` 文件夹中创建 `sw.js` 文件**

```sh
package.json
src/
  index.js
  sw.js
```

**2. 导入 Preact CLI 的 Service Worker 库——`preact-cli/sw`**

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
```

**3. 启用离线路由**

这一步骤将为离线用户配置网络优先的加载行为。

您若是想自己配置的话，可以跳过这一步。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();
```

**4. 启用资源预缓存**

`getFiles()` 函数会在构建时返回一个包含离线需要的资源 URL 数组。

此数组将传递进 `setupPrecaching()`，随后该方法会下载并将资源存储到 `setupRouting()` 的缓存。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);
```

**4.1 将其他资源添加到预缓存清单**

如您需要将其他资源添加到预缓存清单的话，您可以为上例中的 `urlsToCache` 对象添加新的记录 ({url, revision}))，比如：
```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

const urlsToCache = getFiles();
urlsToCache.push({url: '/favicon.ico', revision: null});

setupPrecaching(urlsToCache);
```

> 上例中的 Revision (修订版本) 是为了在文件变化时自动删除缓存而添加。若 URL 包含此信息 (如哈希)，您可将其设为 `null`。

**5. 添加您自己的 Service Worker 逻辑**

现在，您的 Service Worker 里已有默认的 Preact CLI 功能了，您可以对其自由拓展——比如添加预缓存的 URL 列表，或是[设置推送通知](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications)。

## 将其他路由添加到运行时缓存

您需要遵循[上述步骤](#添加自定义-service-worker)创建自定义 `sw.js` 文件后才能为其他路由或 API 调用添加运行时缓存。然后，您可以使用 Workbox API 来自定义您的 Service Worker：

```js
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  new NetworkOnly()  // 或者 CacheFirst/CacheOnly/StaleWhileRevalidate
);
```

上例中的 `networkOnly` 策略让 Service Worker 不缓存 `/special/url`。

> **小提示：**路由代码应放在 `setupRouting()` 之前。

## 在您的 Service Worker 使用其他的 Workbox 模块

Preact CLI 使用 [InjectManifestPlugin](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest) 编译 Service Worker。
这意味着若您需要使用其他 Workbox [模块](https://github.com/GoogleChrome/workbox/tree/v6/packages)的话，您需要通过 NPM 安装模块，然后在 `src/sw.js` 中导入。 

**示例：添加后台同步功能**

下列代码使用 [Workbox 后台同步](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync)功能在用户离线时自动重试失败的 API 请求，您可以在您的 `sw.js` 中添加：

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const bgSyncPlugin = new BackgroundSyncPlugin('apiRequests', {
	maxRetentionTime: 60  // 重试一小时 (以分钟为单位)
});

// 重试失败的对 /api/**.json 的 POST 请求 
registerRoute(
	/\/api\/.*\/.*\.json/,
	new NetworkOnly({
		plugins: [bgSyncPlugin]
	}),
	'POST'
);

/** Preact CLI 配置 */
setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);
```
