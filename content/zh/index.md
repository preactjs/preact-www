---
layout: home
title: Preact
description: 'React 的 3kb 轻量级替代方案，拥有相同的现代 API。'
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">3kb 大小的 React 轻量、快速替代方案，拥有相同的现代 API。</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">开始上手</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">切换到 preact</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const [value, setValue] = useState(0);

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>增加</button>
      <button onClick={() => setValue(value - 1)}>减少</button>
    </>
  )
}
```

<section class="sponsors">
  <p>骄傲地由<a href="https://opencollective.com/preact">以下组织</a>赞助：</p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h2>与众不同的库</h2>
</section>

<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" width="54" height="54">

  <div>
    <h3>贴近实质</h3>
    <p>
      Preact 在 DOM 之上提供了最薄的虚拟 DOM 抽象，在提供稳定的平台特性和注册事件处理程序的同时还确保与其他库无缝兼容。
    </p>
    <p>
      Preact 无需转译即可在浏览器中直接使用。
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" alt="size" loading="lazy" width="54" height="54">

  <div>
    <h3>微小体积</h3>
    <p>
    大多数 UI 框架占了应用 JavaScript 大小的半边天，Preact 却不一样：它的微小让<b>您写的代码</b>成为您应用中占比最大的部分。
    </p>
    <p>
      这也就意味着下载、解析、执行更少的 JavaScript——您可以专心构建绝佳用户体验，而无需花更多的时间在框架本身。
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" alt="performance" loading="lazy" width="54" height="54">

  <div>
    <h3>性能卓越</h3>
    <p>
      Preact 很快，不只是因为其体量微小，更是因为其基于树差异的简单、可预测而极快的虚拟 DOM 实现。
    </p>
    <p>
      我们会与浏览器工程师密切合作，将 Preact 的性能调校到极限，压榨出其每一分性能。
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" alt="portable" loading="lazy" width="54" height="54">

  <div>
    <h3>轻松嵌入</h3>
    <p>
      Preact 的轻量让您可以将强大的虚拟 DOM 实现移植到其他框架无法进入的领域。
    </p>
    <p>
      无需复杂集成即可使用 Preact 来构建应用组件，使用构建应用的相同工具与技巧将 Preact 嵌入一个小部件中。
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" alt="productive" loading="lazy" width="54" height="54">

  <div>
    <h3>即刻生产</h3>
    <p>
      轻量在不牺牲生产性的情况下才有意义。Preact 可让您即刻部署到生产环境，甚至还提供了一些附加功能：
    </p>
    <ul>
      <li>将 <code>props</code>、<code>state</code> 和 <code>context</code> 传递进 <code>render()</code></li>
      <li>使用 <code>class</code> 和 <code>for</code> 一类的标准 HTML 属性</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" alt="compatible" loading="lazy" width="54" height="54">

  <div>
    <h3>生态兼容</h3>
    <p>
      虚拟 DOM 组件让其复用易如反掌——无论是按钮，还是数据提供方，Preact 的设计都能让您轻松、无缝地借用来自 React 生态中的许多组件。
    </p>
    <p>
      为您的打包工具添加一行简单的 <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact/compat</a> 替名即可为即便是最为复杂的 React 组件提供一层无缝兼容。
    </p>
  </div>
</section>


<section class="home-top">
    <h2>『码』上见分晓！</h2>
</section>


<section class="home-split">
    <div>
        <h3>待办事项</h3>
        <pre><code class="lang-jsx">
// --repl
export default class TodoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.currentTarget.value });
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
// --repl-after
render(&lt;TodoList /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>实际示例</h3>
        <pre repl="false"><code class="lang-jsx">
import TodoList from './todo-list';<br>
render(&lt;TodoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>

<section class="home-split">
    <div>
        <h3>获取 GitHub 标星数</h3>
        <pre><code class="lang-jsx">
// --repl
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
// --repl-after
render(&lt;Stars /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>实际示例</h3>
        <pre repl="false"><code class="lang-jsx">
import Stars from './stars';<br>
render(
    &lt;Stars repo="preactjs/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple="true" user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>


<section class="home-top">
    <h2>准备入坑了？</h2>
</section>


<section style="text-align:center;">
    <p>
        根据您对 React 的经验，我们提供了不同的指南。
        <br>
        来看看哪个指南最适合您吧！
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">开始上手</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">切换到 Preact</a>
    </p>
</section>
