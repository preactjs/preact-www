---
name: リファレンス(Ref) 
description: 'Preactがレンダリングした生のDOM Nodeにアクセスするにはリファレンス(Ref)を使います。'
---

# リファレンス(Ref)

PreactがレンダリングしたDOM要素やコンポーネントを直接参照する必要がある時がよくあります。その時はリファレンス(Ref)を使います。

典型的なユースケースはDOM要素の画面上での実際のサイズを測りたいケースです。

コンポーネントに`ref`属性を付与してコンポーネントインスタンスの参照を取得することは可能ですが、これは一般的に推奨されません。
親コンポーネントと子コンポーネントの間に強い結合関係が生じるため、コンポーネントの組み合わせに制限が発生してしまいます。
ほとんどの場合でクラスコンポーネントのメソッドを直接実行するよりもコールバック関数をpropsで渡す方が自然です。

---

<div><toc></toc></div>

---

## `createRef`

`createRef`関数は`current`プロパティが`null`にセットされたオブジェクトを返します。
以下のように`createRef`関数の戻り値を`ref`属性にセットすると、`render`メソッドが実行されるたびに、DOM Nodeもしくはコンポーネントインスタンスが`current`プロパティに代入されます。

```jsx
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.ref}>foo</div>
  }
}
```

## リファレンスコールバック

要素へ参照を取得するもう1つの方法は以下のようにコールバック関数を渡すことです。
少し長くなりますが`createRef`と似たような動作をします。

```jsx
class Foo extends Component {
  ref = null;
  setRef = (dom) => this.ref = dom;

  componentDidMount() {
    console.log(this.ref);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.setRef}>foo</div>
  }
}
```

> ref属性へ渡すコールバック関数がインライン関数で定義されている場合、コールバック関数は2回実行されます。1回目は`null`、2回目は実際の参照が渡されます。これはよくある間違いです。`createRef`APIの場合、`ref.current`が定義されているかのチェックをユーザーに強制することでこのようなバグが起きにくくなっています。

## まとめ

次のようなシンプルなコンポーネントがありますが、実際に計測した値を表示するように書き換えてみましょう。

```jsx
class Foo extends Component {
  // ここではDOM Nodeの実際の横幅と高さを使用したいと思います
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return <div>Width: {width}, Height: {height}</div>;
  }
}
```

計測が意味を持つのは`render`メソッドが実行されてコンポーネントがDOMにマウントされた後です。
それより前はDOM Nodeが存在していないので、測定しても意味がありません。

```jsx
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // 安全のためにリファレンスがあるか確認する
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        Width: {width}, Height: {height}
      </div>
    );
  }
}
```

完成です！これでコンポーネントはマウントされた時に常に横幅と高さを表示するようになりました。
