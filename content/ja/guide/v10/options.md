---
name: オプションフック
description: 'Preactにはいつくかのオプションフックがあります。それらを使うと差分処理の各段階で実行されるコールバック関数をセットすることができます。'
---

# オプションフック

オプションフックはPreactのレンダリングを変更するプラグインのためのコールバック機構です。

Preactはレンダリングプロセスの各段階での状態を観察または変更するためのコールバック関数を設定することができます。
それらのコールバック関数は一般的にオプションフックと呼ばれます([フック](https://preactjs.com/guide/v10/hooks)と混同しないよう注意してください。)。
それらはPreactの機能を拡張したりPreact向けのテストツールを作成することに使われます。
`preact/hooks`、`preact/compat`、`devtools`はオプションフックを使っています。

このAPIはPreactを拡張するツールやライブラリの開発者向けです。

---

<div><toc></toc></div>

---

## バージョン管理とサポート

オプションフックは`preact`パッケージに含まれています。そして、それは`preact`と同様にセマンティックバージョニングで管理されています。
しかし、オプションフックは他の`preact`のAPIとはdeprecationポリシーが異なります。
オプションフックのAPIはメジャーバージョンアップ時に長い周知期間がなく変更されることがあります。
これは`VNode`オブジェクトのようにオプションフックで扱う内部APIの構造にも当てはまります。

## オプションフックを設定する

オプションフックは`export`された`options`オブジェクトを変更して設定します。

既に存在するオプションフックと同名のオプションフックを設定する場合は、必ず既存のオプションフックを新しいオプションフック内で実行するように設定してください。
これをしないとコールチェーンが壊れます。そして、既存のオプションフックに依存しているコードは正常に動作しません。その結果、`preact/hooks`やDevToolsのようなアドオンは正常に動作しなくなります。
また、変更する特別な理由がない限り既存のオプションフックにも同じ引数を渡してください。

```js
import { options } from 'preact';

// 既存のvnodeオプションフックを保存する。
const oldHook = options.vnode;

// 新しいvnodeオプションフックを設定する。
options.vnode = vnode => {
  console.log("Hey I'm a vnode", vnode);

  // 既存のオプションフックが存在している場合、それを実行する。
  if (oldHook) {
    oldHook(vnode);
  }
}
```

`event`オプションフック以外のオプションフックは戻り値を返しません。なので、既存のオプションフックの戻り値を気にする必要はありません。

## 利用可能なオプションフック

#### `options.vnode`

**API:** `(vnode: VNode) => void`

最も一般的なオプションフックです。
`vnode`オプションフックはVNodeオブジェクトが生成されるたびに実行されます。
`vnode`はPreactの仮想DOM要素を表します。仮想DOM要素はよくJSX要素とも考えられます。

#### `options.unmount`

**API:** `(vnode: VNode) => void`

`vnode`がアンマウントされる直前(DOMが存在している時)に実行されます。

#### `options.diffed`

**API:** `(vnode: VNode) => void`

`vnode`がレンダリングされた直後、つまり、DOMが構築されるか、あるべき状態に変更された後に実行されます。

#### `options.event`

**API:** `(event: Event) => any`

DOMイベントが仮想DOMのイベントリスナに渡される直前に実行されます。
`options.event`が設定されている場合、イベントリスナの引数として渡される`event`は`options.event`の戻り値に置き換えられます。

#### `options.requestAnimationFrame`

**API:** `(callback: () => void) => void`

`preact/hooks`内の副作用と副作用ベースの処理のスケジューリングを行う関数を設定します。

#### `options.debounceRendering`

**API:** `(callback: () => void) => void`

コンポーネントがレンダリングされる処理を遅延させる処理を行う関数を設定します。

`options.debounceRendering`はデフォルトでは`Promise.resolve()`を遅延処理に使います。Promiseが使えない場合は`setTimeout`を使います。

#### `options.useDebugValue`

**API:** `(value: string | number) => void`

`useDebugValue`フックが実行された時に実行されます。
