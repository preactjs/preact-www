---
name: 'Preact CLI: Pre-rendering'
permalink: '/cli/pre-rendering'
description: 'Preact CLIを使ってページを自動的にプリレンダリング(Pre-rendering)する'
---

# ページをプリレンダリング(Pre-rendering)する

Preact CLIは自動的にページをプリレンダリング(Pre-rendering)して静的なHTMLに変換します。これによって、高速なロードが可能になります。

Productionビルドする場合、Preact CLIはコンポーネントをレンダリングして、その結果を静的なHTMLとして保存します。
これによって、サイトの閲覧者はJavaScriptのロードが完了する前でも、すぐにプリレンダリングされたHTMLを見ることができます。

> **⚠️ 注意:** プリレンダリングはNodeJS環境で実行されるため、ほとんどのWeb APIは使用できません。NodeJS環境かどうか判断するには`if (typeof window !== 'undefined')`のようなコードを使います。

## URLとカスタムデータの設定

デフォルトでは`/`にrouteされたページのみプリレンダリングします。
他のURL(route)を追加するには、以下のような`prerender-urls.json`ファイルを作成する必要があります。
このファイルを使用して、各URLの`<App />`コンポーネントのpropsに追加のデータを渡すことも出来ます。

```json
[
  {
    "url": "/", // 必須
    "title": "All About Dogs",
    "breeds": ["Shiba", "Golden", "Husky"]
  },
  {
    "url": "/breeds/shiba", // 必須
    "title": "Shibas!",
    "photo": "/assets/shiba.jpg"
  }
]
```

### 動的プリレンダリング

`prerender-urls.json`だけでなく、JavaScriptファイルを使用して同様の設定を行うことができます。
そのJavaScriptファイルではプリレンダリングで使用する設定データを返す関数を定義する必要があります。
その関数はPreact CLIで実行されます。

動的プリレンダリングを行う場合は、以下のようにPreact CLIにJavaScriptファイルを指定する必要があります。

`preact build --prerenderUrls ./prerender-urls.js`

例えば、`prerender-urls.js`は以下のようにします。

```js
const breeds = ["Shiba", "Golden", "Husky"];

module.exports = function() {
  return [
    {
      url: "/",
      title: "All About Dogs",
      breeds
    },
    {
      url: "/breeds/shiba",
      title: "Shibas!",
      photo: "/assets/shiba.jpg"
    }
  ];
};
```

#### マークアップ内でプリレンダリングの設定データを使う

以上で設定したデータは`html`ファイルを生成する際に使用する`src/template.html`ファイル内で使用することができます。
このデータを使ってmetaタグ等の有用なデータをすべてのページに加えることができます。
値を使用するにはマークアップ内で`htmlWebpackPlugin.options.CLI_DATA.preRenderData.<key>`を使います。

```html
  <html>
    <head>
      <meta name="demo-keyword" content="<%= htmlWebpackPlugin.options.CLI_DATA.preRenderData.blah %>">
    </head>
  </html>
```

### 外部のデータソースを使う

Preact CLIのカスタムプリレンダリングを使用することでCMSのような外部のデータソースと連携することができます。
CMSからデータを取得して、URLごとにプリレンダリングするには、以下のように`prerender-urls.js`ファイルからasync関数を`export`します。

```js
module.exports = async function() {
  const response = await fetch('https://cms.example.com/pages/');
  const pages = await response.json();
  return pages.map(page => ({
    url: page.url,
    title: page.title,
    meta: page.meta,
    data: page.data
  }));
};
```

## プリレンダリング用のデータを使う

プリレンダリングで生成されたページには、以下のようにプリレンダリング用のデータがインラインスクリプトとして含まれます。

```html
<script type="__PREACT_CLI_DATA__">{
  "preRenderData": {
    "url": "/",
    "photo": "/assets/shiba.jpg"
  }
}</script>
```

このプリレンダリング用のデータを使って"rehydrate"することができます。
これは、特にReduxのようなステート管理ソリューションやGraphQLを使う場合に役立ちます。
HTMLに出力されたJSONデータは常に`url`キーを含みます。これはrouteされたページをhydrateすることに役立ちます。

> **💡 メモ:** ユーザが最初にアプリケーションにアクセスした時、ダウンロードサイズを節約するためにページのマークアップにはそのrouteのプリレンダリングのデータのみが含まれます。ユーザがブラウザを操作して他のrouteに遷移した場合はマークアップにはそのページのプリレンダリング用のデータはありません。そのrouteのプリレンダリングのデータを取得したい場合は`/<routeのパス>/preact_prerender_data.json`にリクエストをしてください。Preact CLIはビルド時に、プリレンダリングされた各ページと同じディレクトリに`preact_prerender_data.json`ファイルを生成します。

### `@preact/prerender-data-provider`を使う

Preact CLIでプリレンダリングデータを簡単に扱うために、hydrationとデータの取得を行うラッパーライブラリを用意しています。
このラッパーライブラリは、URLとプリレンダリングデータの`url`が一致する場合は、インラインスクリプトタグからプリレンダリングデータを取得します。
ユーザがブラウザ上でページ遷移した場合など、URLとプリレンダリングデータの`url`が一致しない場合は、サーバにリクエストを行ってプリレンダリングデータを取得します。

最初に以下のようにnpmからライブラリをインストールします。

`npm i -D @preact/prerender-data-provider`

これでライブラリをインストールできました。
次にAppコンポーネント(`components/app.js`)にそれを`import`して使います。

```jsx
import { Provider } from '@preact/prerender-data-provider';

export default class App extends Component {
  // ...
  render(props) {
    return (
      <Provider value={props}>
        // アプリケーションをここに置きます。
      </Provider>
    )
  }
}
```

これで、routeされているコンポーネントは`prerender-data-provider`を通じてプリレンダリングのデータにアクセスすることが可能になりました。

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';

export default function MyRoute(props) {

  // usePrerenderData(props, false)とするとこのフックが自動的にデータ取得リクエストを送信することを無効にします。
  const [data, loading, error] = usePrerenderData(props);

  if (loading) return <h1>Loading...</h1>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      // データはここで使う。
    </div>
  );
}
```

`usePrerenderData`の第2引数にfalseを渡すと`preact_prerender_data.json`を自動的に取得しません。
`usePrerenderData`フックと同じ役割を持つ`<PrerenderData>`もあります。
