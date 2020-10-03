---
name: サーバサイドレンダリング
description: 'サーバでPreactアプリケーションをレンダリングして高速に表示します。'
---

# サーバサイドレンダリング

サーバサイドレンダリング(よくSSRと略される)を使うとアプリケーションをHTMLにレンダリングしてクライアントに送信することができます。
これによってロード時間を短くすることができます。
それ以外にも、テストに役立てることができます。

> SSRは`preact-cli`ではデフォルトで有効です。 :tada:

---

<div><toc></toc></div>

---

## インストール

Preact用のサーバサイドレンダラ(`preact-render-to-string`)は[こちらのレポジトリ](https://github.com/preactjs/preact-render-to-string/)にあります。
好きなパッケージマネージャを使ってインストールできます。

```sh
npm install -S preact-render-to-string
```

上記のコマンドが終了したら、すぐに使い始めることができます。
`preact-render-to-string`のAPI数は少ないので簡単な例を使って説明します。

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class="foo">content</div>;

console.log(render(App));
// <div class="foo">content</div>
```

## 浅い(shallow)レンダリング

ツリー全体をレンダリングするのではなく1段階のみレンダリングすることが望ましい場合があります。
浅い(shallow)レンダリングはコンポーネントを展開せずにコンポーネントの名前でレンダリングした文字列を返します。

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## 整形(pretty)モード

`preact-render-to-string`は読みやすいように整形することもできます。
`pretty`オプションを渡すと適切にインデントされた文字列を返します。

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(render(App, { pretty: true }));
// Logs:
// <div class="foo">
//   <div>foo</div>
// </div>
```

## JSXモード

JSXレンダリングモードはスナップショットテストをする時にとても役立ちます。
JSX形式の文字列を返します。

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App));
// Logs: <div data-foo={true} />
```
