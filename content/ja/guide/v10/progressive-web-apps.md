---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
description: 'Progressive Web Apps (PWA)はアプリケーションをオフラインで動作させることができます。PreactはPWAの開発に非常に適しています。'
---

# Progressive Web Apps

Preactはすぐにロードされ操作が可能になることを求められる[Progressive Web Apps](https://web.dev/learn/pwa/)に向いています。
[Preact CLI](https://github.com/preactjs/preact-cli/)を使うと、[Lighthouse][LH]で100点を記録するPWAとそのビルド環境をすぐに構築できます。


[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>ロードするスクリプトが小さい</h3>
          </div>
          <p class="_summary">
	    パフォーマンスバジェットに余裕がない時、<a href="/about/project-goals">Preactのサイズの小ささ</a>には価値があります。
	    平均的なモバイルハードウェアでは大きなサイズのJSのバンドルをロードするとロード、パース、評価に長い時間がかかるようになります。
	    これではユーザがアプリケーションを操作可能になるまで長い時間待たせてしまう可能性があります。
	    バンドル内のライブラリのコードを削減することによって、ユーザがロードするコードを小さくすることができます。これによって、ロード時間が短くなります。
	  </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>操作可能になるまでの時間が短い</h3>
          </div>
          <p class="_summary">
	    <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">5秒以内で操作可能な状態</a>を目指すならkB単位で注意する必要があります。
	    <a href="/guide/v10/switching-to-preact">ReactからPreactに移行する</a>ことで数kB削減することができます。そして、アプリケーションを1回のラウンドトリップタイム(RTT)で操作可能な状態にすることができます。
	    これは各ページで可能な限り容量を削減しようとしているProgressive Web Appsに適しています。
	  </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Reactのエコシステムとうまく連携することが可能</h3>
          </div>
          <p class="_summary">
	    Reactの<a href="https://facebook.github.io/react/docs/react-dom-server.html">サーバサイドレンダリング</a>を使って高速に表示する必要がある場合でも<a href="https://github.com/ReactTraining/react-router">React Router</a>を使ってナビゲーションする必要がある場合でも、Preactは多くのReactエコシステムのライブラリとうまく連携します。
	  </p>
        </div>
    </li>
</ol>

## このサイトはPWAです

あなたが見ているこのサイトは、実は、Progressive Web Appです。
このサイトは3G回線のNexus 5Xで5秒以内に操作可能になります。

<img src="/pwa-guide/timeline.jpg" alt="A DevTools Timeline trace of the preactjs.com site on a Nexus 5X" style="display: block;" />

静的なサイトのコンテンツは(Service Worker) Cache Storage APIに保存されます。そして、再び訪問した時にすぐにロードされます。

## パフォーマンスTips

PreactはPWAにとても適しているだけではなく、それ以外のパフォーマンスを改善するツールやテクニックと一緒に使うことができます。
それらの一部を以下に記述します。

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary">
	    <strong><a href="https://webpack.js.org/guides/code-splitting/">code-splitting</a></strong>はコードを分割して最初のページを表示するために必要な物のみを提供し、残りは遅延ロードで必要な時にロードします。
	    これによってロード時間が短くなります。
	    webpackとRollupでサポートされています。
	  </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary">
	    <strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Workerによるキャッシング</a></strong>は
	    アプリケーションの静的なリソースと動的なリソースをオフラインでキャッシュすることを可能にします。その結果、再度サイトを訪れた場合はより早くに操作することができる状態になります。
	    <a href="https://developers.google.com/web/tools/workbox">Workbox</a>はこれに役立ちます。
	  </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary">
	    <strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong>は
	    ブラウザにアセットを事前にプッシュまたはプリロードするようにして次のページのロードをスピードアップします。
	    PRPLはcode-splittingとService Workerによるキャッシングで構築されています。
	  </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary">
	    <strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong>はProgressive Web Appのパフォーマンスやベストプラクティスへの適合をチェックして改善点を示します。
	  </p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/)はPreactの公式のビルドツールです。
このコマンドラインツールだけで高度に最適化されたPreact製のProgressive Web Appを作ることできます。
これは上記の推奨事項をすべて備えたものを自動的に作るので、あなたは良いコンポーネントを書くことに集中できます。

Preact CLIにあるいくつかの機能を紹介します。

- URLルーティングに対する自動的かつシームレスなcode-splitting
- ServiceWorkerを自動的に生成してインストールします
- URLに基づいたHTTP2/Push(もしくはプリロードメタタグ)を生成します
- 最初の表示までの時間(Time To First Paint)を高速化するためのPre-rendering
- 必要に応じてpolyfillをロードします

[Preact CLI](https://github.com/preactjs/preact-cli/)は内部的には[webpack](https://webpack.js.org)を使っています。必要に応じて`preact.config.js`を定義してビルドプロセスをカスタマイズすることができます。
カスタマイズを行ったとしても、Preact CLIによるデフォルトの設定の恩恵を受けることができます。そして、`preact-cli`の新バージョンがリリースされたとき更新することができます。
