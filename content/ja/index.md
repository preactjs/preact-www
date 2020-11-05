---
layout: home
title: Preact
show_title: false
toc: false
description: 'Preact is a fast 3kB alternative to React with the same modern API'
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text inverted>Preact</logo>
    </h1>
    <p class="tagline">Fast 3kB alternative to React with the same modern API</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">はじめに</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preactへ移行する</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const [value, setValue] = useState(0);

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={() => setValue(value - 1)}>Decrement</button>
    </>
  )
}
```

<section class="sponsors">
  <p><a href="https://opencollective.com/preact">スポンサー</a></p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h1>Preactの特徴</h1>
</section>

<section class="home-section">
  <img src="/assets/home/metal.svg" alt="metal">

  <div>
    <h2>よりDOMに近い</h2>
    <p>
      Preact(プリアクト)はDOM上に薄い仮想DOMによる抽象化を提供します。
      ブラウザの安定した機能の上に構築され、素のイベントハンドラをそのまま使います。他のライブラリとの連携もスムーズに行えます。
    </p>
    <p>
      Preactはトランスパイルなしで直接ブラウザで使用することができます。
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/size.svg" alt="size">

  <div>
    <h2>サイズが小さい</h2>
    <p>
      ほとんどのUIフレームワークはアプリケーションを構成するJavaScriptのサイズの大部分を占めてしまうくらいの大きさです。
      Preactは違います。あなたが書いたコードがアプリケーションの大部分を占めるようになるくらいの小ささです。
    </p>
    <p>
      つまり、Preactはダウンロードしてパースして実行するJavaScriptが少ないので、実際のアプリケーションの処理により多くの時間を割くことができます。フレームワークと格闘することなく、あなたの望むユーザー体験を実現できます。
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/performance.svg" alt="performance">

  <div>
    <h2>卓越したパフォーマンス</h2>
    <p>
      Preactが高速な理由は単にサイズだけではありません。 Preactはシンプルで安定した差分アルゴリズムの実装によって最も高速な仮想DOMライブラリの1つになりました。
    </p>
    <p>
      私たちは、状態の更新を自動的にバッチにまとめて、Preactのパフォーマンスを極限までチューニングしています。また、Preactのパフォーマンスを最大限引き出せるようにプラウザの開発者とも密接に連携しています。
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/portable.svg" alt="portable">

  <div>
    <h2>ポータブル &amp; 組み込みやすい</h2>
    <p>
      Preactのサイズの小ささは、強力な仮想DOMコンポーネントの枠組みを新しい用途に広げることを可能にしました。
    </p>
    <p>
      Preactを使うと複雑なインテグレーションなしで使用できるアプリケーションのパーツを実装できます。
      また、Preactをウィジェットに組み込む際はアプリケーション全体を構築する時と同じツールやテクニックを使用できます。
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/productive.svg" alt="productive">

  <div>
    <h2>高い生産性</h2>
    <p>
      生産性を犠牲にすることなくアプリケーションを軽量化することができるので、Preactでの開発はより楽しいものになるでしょう。Preactを使うとすぐに生産性が上がります。以下のおまけの機能もあります。
    </p>
    <ul>
      <li><code>props</code>、<code>state</code>、<code>context</code>が追加の引数として<code>render()</code>に渡されます。</li>
      <li><code>class</code>や<code>for</code>のような標準のHTML属性を使用できます。</li>
    </ul>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/compatible.svg" alt="compatible">

  <div>
    <h2>エコシステムの互換性</h2>
    <p>
      仮想DOMコンポーネントは、ボタンからデータプロバイダまですべての再利用可能なコンポーネントの共有を簡単にします。
      PreactはReactのエコシステムにある何千ものコンポーネントをシームレスに利用できるように設計されています。
    </p>
    <p>
      React互換レイヤとしてバンドラに<a href="/guide/v10/switching-to-preact#compatの設定">preact/compat</a>を加えるだけで、どんなに複雑なReactコンポーネントでもそのままアプリケーションに組み込むことができます。
    </p>
  </div>
</section>

<section class="home-top">
    <h1>動くものを見てみましょう。</h1>
</section>

<section class="home-split">
    <div>
        <h2>Todoリスト</h2>
        <pre><code class="lang-jsx">
export default class TodoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.target.value });
    };
    addTodo = () =&gt; {
        let { todos, text } = this.state;
        todos = todos.concat({ text });
        this.setState({ todos, text: '' });
    };
    render({ }, { todos, text }) {
        return (
            &lt;form onSubmit={this.addTodo} action="javascript:"&gt;
                &lt;label&gt;
                  &lt;span&gt;Add Todo&lt;/span&gt;
                  &lt;input value={text} onInput={this.setText} /&gt;
                &lt;/label&gt;
                &lt;button type="submit"&gt;Add&lt;/button&gt;
                &lt;ul&gt;
                    { todos.map( todo =&gt; (
                        &lt;li&gt;{todo.text}&lt;/li&gt;
                    )) }
                &lt;/ul&gt;
            &lt;/form&gt;
        );
    }
}
        </code></pre>
    </div>
    <div>
        <h2>実行結果</h2>
        <pre repl="false"><code class="lang-jsx">
import TodoList from './todo-list';

render(&lt;TodoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>

<section class="home-split">
    <div>
        <h2>GitHubのスター数を取得</h2>
        <pre><code class="lang-jsx">
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = `https://github.com/${repo}`;
        return (
            &lt;a href={url} class="stars"&gt;
                ⭐️ {stars} Stars
            &lt;/a&gt;
        );
    }
}
        </code></pre>
    </div>
    <div>
        <h2>実行結果</h2>
        <pre repl="false"><code class="lang-jsx">
import Stars from './stars';

render(
    &lt;Stars repo="preactjs/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>

<section class="home-top">
    <h1>もっと詳しく知りたいですか？</h1>
</section>

<section style="text-align:center;">
    <p>
        Reactの経験の有無に応じてガイドを別けています。
        <br>
        あなたに合ったガイドを選びましょう。
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">はじめに</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preactへ移行する</a>
    </p>
</section>
