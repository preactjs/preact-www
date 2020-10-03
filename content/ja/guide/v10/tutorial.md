---
name: チュートリアル
description: '初めてのPreactアプリケーションを書きましょう。'
---

# チュートリアル

このガイドではシンプルなClockコンポーネントを開発していきます。各トピックの詳細はガイドメニューにある専用ページを見てください。

> :information_desk_person: このガイドは[はじめに](/guide/v10/getting-started)を読み終えてツールの設定が完了していることを前提としています。そうでないなら、[preact-cli](/guide/v10/getting-started#best-practices-powered-with-preact-cli)から読み始めてください。

---

<div><toc></toc></div>

---

## Hello World

Preactのコードベースですぐに目にする2つの関数があります。それは`h()`と`render()`です。
`h()`関数はJSXをPreactで利用できるデータに変換するために使われます。
JSXを使わずに直接`h()`を使用することもできます。

```jsx
// JSX版
const App = <h1>Hello World!</h1>;

// 上記と同じ内容のJSX使わない版
const App = h('h1', null, 'Hello World');
```

これだけでは何も起きません。Hello-WorldアプリケーションをDOMに挿入する必要があります。
そのために`render()`関数を使います。

```jsx
const App = <h1>Hello World!</h1>;

// アプリケーションをDOMに挿入する
render(App, document.body);
```

おめでとう。あなたは初めてのPreactアプリケーションを構築しました。

## インタラクティブなHello World

最初の一歩としてテキストのレンダリングを行いました。これを少しだけインタラクティブにしたいと思います。
データの変更を反映できるようにします。 :star2:

ユーザが名前を入力してsubmitボタンを押した時に、それが表示されるようにします。
このために入力した値を保存する場所が必要です。
このために[コンポーネント](/guide/v10/components)を使います。

既存のアプリケーションを[コンポーネント](/guide/v10/components)にしましょう。

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}

render(<App />, document.body);
```

上記では上部で`Component`をインポートして`App`をクラスに変更しています。
これだけでは何も変わりませんが、これはこれからの変更のための用意です。
次にtext input要素とsubmitボタンを追加します。

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

徐々にアプリケーションの形になってきました。
次にインタラクティブな処理を追加します。
`"Hello, world!"`を`"Hello, <ユーザが入力した文字列>!"`に変更します。それには入力した値を得る必要があります。

入力した値をコンポーネントの`state`という特別なプロパティに保存します。
`state`は`setState`メソッドで更新されます。その際に、ただ更新されるだけでなくコンポーネントのレンダリングリクエストがスケジュールされます。
リクエストを受けるとコンポーネントは更新された`state`を使って再レンダリングします。

最後に、input要素の`value`属性への値の設定と`input`イベントハンドラの設定を行います。

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  // stateを初期化します。入力された値の保存のみに使用します。
  state = { value: '' }

  onInput = ev => {
    // stateを更新してコンポーネントの再レンダリングを行います。
    this.setState({ value: ev.target.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

この時点では見た目は余り変わっていません。次で結構変わります。

ちょうど`<input>`に対してしたように、`<form>`の`submit`イベントへのイベントハンドラを付与します。
`state`の`name`プロパティに入力された値を保存します。そして、`<h1>`に`state.name`を挿入します。

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  // `name`を初期stateに追加します。
  state = { value: '', name: 'world' }

  onInput = ev => {
    this.setState({ value: ev.target.value });
  }

  // nameに最新のinput要素の値をセットするためのsubmitイベントハンドラを追加します。
  onSubmit = () => {
    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

これで完成です。input text要素に名前を入力して"Update"ボタンをクリックすると入力した名前がh1要素に反映されます。

## Clockコンポーネント

最初のコンポーネントを作りました。もう少し練習しましょう。今度は時計を作ります。

```jsx
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.body);
```

簡単でしたね。でも、時刻が変わりません。Clockコンポーネントをレンダリングした瞬間に止まってしまいました。

これを解決するために、コンポーネントがDOMにマウントされた時に1秒ごとのタイマーをスタートして、コンポーネントが削除されたら停止するようにします。
タイマーを`componentDidMount`で作成して、その参照を保存します。そして、`componentWillUnmount`でタイマーを停止します。
タイマーに指定した時間が経過するたびに、コンポーネントの`state`オブジェクトが新しい時刻の値に更新され、自動的にコンポーネントが再レンダリングされます。

```jsx
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // コンポーネントがマウントされた時に実行されます。
  componentDidMount() {
    // 1秒ごとに時刻を更新します。
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // コンポーネントが削除される直前に実行されます。
  componentWillUnmount() {
    // 再レンダリングを停止します。
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.body);
```

[動く時計](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)が完成しました。
