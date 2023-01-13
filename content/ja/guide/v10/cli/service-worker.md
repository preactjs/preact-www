---
name: Service Worker
permalink: '/cli/service-workers'
description: Service Worker
---

# Preact CLIでオフラインに対応する

Preact CLIはオフラインで使用するために自動的にアプリケーションのコードとプリレンダリングのデータをキャッシュ可能にします。

Preact CLI 3は[Workbox](https://developers.google.com/web/tools/workbox)を内蔵するようになりました。
Workboxは[InjectManifest plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2)を使って幅広い用途をカバーする柔軟なService Workerを生成します。

> **注意:** Preact CLIは画面遷移に[network-first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache)アプローチを採用しているので、ユーザはオフラインの時を除いて常に最新の内容を見ることができます。

## カスタムService Workerを追加する

Preact CLIを使うと、なにもコードを書かなくても、アプリケーションのProductionビルド時にService Workerのコードが自動生成されます。
このService Workerをカスタマイズするためには、プロジェクトの`sw.js`ファイルを変更します。Preact CLIは、このカスタマイズに使用するためのAPIをいくつか提供しています。

**1. `src/`ディレクトリ内に`sw.js`ファイルを作成する**

```sh
package.json
src/
  index.js
  sw.js
```

**2. Preact CLIのService Worker用ライブラリである`preact-cli/sw`を`import`する**

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
```

**3. オフラインルーティングを有効にする**

以下のようにしてオフライン時のnetwork-firstフォールバックの設定をします。
カスタムフォールバックを設定したい場合はこれをスキップしてください。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();
```

**4. リソースのプリキャッシュを有効にする**

`getFiles()`はオフライン時に使用するためにキャッシュしておくべきURLの配列を返します。この配列はビルド時に生成することができます。
これらのURLを`setupPrecaching()`に渡すことで`setupRouting()`が使用するキャッシュにダウンロードして保存されます。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);
```

**4.1 その他のアセットをプリキャッシュマニフェストに追加する**

プリキャッシュマニフェストに何か追加したい場合は以下の例のように`urlsToCache`にエントリー({url, revision})を追加します。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

const urlsToCache = getFiles();
urlsToCache.push({url: '/favicon.ico', revision: null});

setupPrecaching(urlsToCache);
```

> 上記のrevisionはリソースの変更を検知しキャッシュを無効にするために使われます。URLに判別可能な情報(例えばハッシュ)が含まれる場合は`null`を渡して構いません。

**5. カスタムService Workerのロジックを加える**

これでPreact CLIにカスタムService Workerを追加することができました。
必要に応じてプリキャッシュするURLをカスタマイズしたり[push notificationsをセットすることができます。](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications)

## ランタイムキャッシュに他のrouteを追加する

他のrouteやAPIコールをランタイムキャッシュするには、最初に[上記のステップ](#adding-a-custom-service-worker)を参考にしてカスタム`sw.js`を作成します。
それから、Workbox APIを使ってカスタムService Workerを登録します。

```js
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  new NetworkOnly()  // もしくはCacheFirst/CacheOnly/StaleWhileRevalidate
);
```

上記の例の`networkOnly`はService Workerが`/special/url`をキャッシュしないことを意味します。

> **メモ:** カスタムルーティングのコードは`setupRouting()`の前に置く必要があります。

## Service Workerで他のWorkboxのモジュールを使う

Preact CLIは[injectManifestPlugin](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest)を使用して、Service Workerをコンパイルします。
他のWorkbox[モジュール](https://github.com/GoogleChrome/workbox/tree/v6/packages)を使用するためには、それらをNPMからインストールして`src/sw.js`に`import`する必要があります。

**例: Background syncを追加する**

以下のコードを`sw.js`ファイルに加えるとします。
このコードは[Workbox Background Sync](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync)を使って、オフラインの時に失敗したリクエストを再度送信します。

```js
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const bgSyncPlugin = new BackgroundSyncPlugin('apiRequests', {
	maxRetentionTime: 60
});

// 失敗した/api/**.jsonに対するPOSTリクエストをリトライする。
registerRoute(
	/\/api\/.*\/.*\.json/,
	new NetworkOnly({
		plugins: [bgSyncPlugin]
	}),
	'POST'
);

/** Preact CLIをセットする */
setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);
```
