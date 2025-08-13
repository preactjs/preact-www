---
title: Preact
description: Preact is a fast 3kB alternative to React with the same modern API
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
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
    <h2>Preactの特徴</h2>
</section>

<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>よりDOMに近い</h3>
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
  <img src="/home/size.svg" alt="size" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>サイズが小さい</h3>
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
  <img src="/home/performance.svg" alt="performance" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>卓越したパフォーマンス</h3>
    <p>
      Preactが高速な理由は単にサイズだけではありません。 Preactはシンプルで安定した差分アルゴリズムの実装によって最も高速な仮想DOMライブラリの1つになりました。
    </p>
    <p>
      私たちは、状態の更新を自動的にバッチにまとめて、Preactのパフォーマンスを極限までチューニングしています。また、Preactのパフォーマンスを最大限引き出せるようにプラウザの開発者とも密接に連携しています。
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/portable.svg" alt="portable" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>ポータブル &amp; 組み込みやすい</h3>
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
  <img src="/home/productive.svg" alt="productive" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>高い生産性</h3>
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
  <img src="/home/compatible.svg" alt="compatible" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>エコシステムの互換性</h3>
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
    <h2>動くものを見てみましょう。</h2>
</section>

<section class="home-split">
    <div>
        <h3>Todoリスト</h3>
        <pre><code class="language-jsx">
            // --repl
            import { Component, render } from "preact";
            // --repl-before
            export default class TodoList extends Component {
            	state = { todos: [], text: "" };<br>
            	setText = (e) => {
            		this.setState({ text: e.currentTarget.value });
            	};<br>
            	addTodo = () => {
            		let { todos, text } = this.state;
            		todos = todos.concat({ text });
            		this.setState({ todos, text: "" });
            	};<br>
            	render({}, { todos, text }) {
            		return (
            			<form onSubmit={this.addTodo} action="javascript:">
            				<label>
            					<span>Add Todo</span>
            					<input value={text} onInput={this.setText} />
            				</label>
            				<button type="submit">Add</button>
            				<ul>
            					{todos.map((todo) => (
            						<li>{todo.text}</li>
            					))}
            				</ul>
            			</form>
            		);
            	}
            }
            // --repl-after
            render(<TodoList />, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>実行結果</h3>
        <pre repl="false"><code class="language-jsx">
            import TodoList from './todo-list';<br>
            render(<TodoList />, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>

<section class="home-split">
    <div>
        <h3>GitHubのスター数を取得</h3>
        <pre><code class="language-jsx">
            // --repl
            import { render } from "preact";
            import { useState, useEffect } from "preact/hooks";
            // --repl-before
            const compare = (a, b) =>
            	(a.stargazers_count < b.stargazers_count ? 1 : -1);<br>
            export default function GitHubRepos({ org }) {
            	const [items, setItems] = useState([]);<br>
            	useEffect(() => {
            		fetch(`https://api.github.com/orgs/${org}/repos?per_page=50`)
            			.then((res) => res.json())
            			.then((repos) =>
            				setItems(repos.sort(compare).slice(0, 5))
            			);
            	}, []);<br>
            	return (
            		<div>
            			<h1 class="repo-list-header">
            				Preact Repositories
            			</h1>
            			<div>
            				{items.map((result) => (
            					<Result {...result} />
            				))}
            			</div>
            		</div>
            	);
            }<br>
            function Result(result) {
            	return (
            		<div class="repo-list-item">
            			<div>
            				<a
            					href={result.html_url}
            					target="_blank"
            					rel="noopener noreferrer"
            				>
            					{result.full_name}
            				</a>
            				{" - "}
            				<strong>
            					⭐️{result.stargazers_count.toLocaleString()}
            				</strong>
            			</div>
            			<p>{result.description}</p>
            		</div>
            	);
            }
            // --repl-after
            render(<GitHubRepos org="preactjs" />, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>実行結果</h3>
        <pre repl="false"><code class="language-jsx">
            import GitHubRepos from './github-repos';<br>
            render(
                <GitHubRepos org="preactjs" />,
                document.body
            );
        </code></pre>
        <div class="home-demo">
            <github-repos org="preactjs"></github-repos>
        </div>
    </div>
</section>

<section class="home-top">
    <h2>もっと詳しく知りたいですか？</h2>
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
