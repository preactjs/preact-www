---
layout: home
title: Preact
show_title: false
toc: false
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text>Preact</logo>
    </h1>

   <p>React 的 3kb 轻量化方案，拥有同样的 ES6 API</p>

    <p>
        <a href="/guide/getting-started" class="home-button">如何开始</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">切换到 preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>与众不同的库</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg">

    <h2>更接近于实质</h2>

    <p>
		Preact 在 DOM 上实现一个可能是最薄的一层虚拟 DOM 实现。web 是一个稳定的平台，我们是时候停止以安全的名义重新去实现它（一套新的 DOM 实现框架）。
    </p>

    <p>
		Preact 也是 web 平台的一等公民，他将虚拟 DOM 与 DOM 本身区别开，注册真实的事件处理函数，很好地与其它库一起工作。
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg">

    <h2>小体积</h2>

    <p>
		大多数 UI 框架是相当大的，是应用程序 javascript 体积的大部份。Preact 不同：他足够小，<em > 你的代码</em > 是你的应用程序最大的部分。
    </p>

    <p>
		这将意味可以下载更少的 javascript 代码，解析和执行 - 为您的代码节省更多的时间，所以你可以构建一个你定义的体验，而不需要受一个框架的控制.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg">

    <h2>高性能</h2>

    <p>
		Preact 是快速的，不仅是因为他的体积，因为一个简单和可预测的 diff 实现，使它成为最快的虚拟 DOM 框架之一。
    </p>

    <p>
        他甚至包含额外的性能特性，如 批量自定义更新，可选的 异步渲染，DOM 回收和通过[关联状态](/guide/linked-state) 优化的事件处理。
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg">

    <h2>轻量 &amp; 可嵌入</h2>

    <p>
        Preact 是轻量的意味着你可以把一个强大的虚拟 DOM 组件范例带到一个新的地方。
    </p>

    <p>
        使用 Preact 构建应用程序的各个部分，而无需复杂的集成。将 Preact 嵌入到窗口小部件中并应用相同的工具或技术，你将可以构建一个完整的应用程序。
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg">

    <h2>即时生产</h2>

    <p>
        轻量可以让你在不需要牺牲生产力的前提下得到更多的乐趣。Preact 让你立即获得生产力。他甚至有一些额外的功能：
    </p>

    <ul>
        <li>`props`, `state` 和 `context` 可以被传递给 `render()`</li>
        <li>可以使用标准的 HTML 属性，如 `class` 和 `for`</li>
        <li>可以使用 React 开发工具</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg">

    <h2>生态系统兼容</h2>

    <p>
        虚拟 DOM 组件使得易于共享可重用的事物 —— 从按钮到数据提供程序。Preact 的设计意味着您可以无缝使用 React 生态系统中可用的数千个组件。
    </p>

    <p>
        增加一个简单的兼容层 <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> 到你的绑定库中，你甚至可以在你的系统中使用非常复杂的 React 组件。
    </p>
</section>


<section class="home-top">
    <h1>『码』上见分晓</h1>
</section>


<section class="home-split">
    <div>
        <h2>Todo List 组件</h2>
        <pre><code class="lang-js">
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
                &lt;input value={text} onInput={this.setText} /&gt;
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
        <h2>运行例子</h2>
        <pre repl="false"><code class="lang-js">
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
        <h2>获取 Github Stars</h2>
        <pre><code class="lang-js">
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = \`//github.com/${repo}\`;
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
        <h2>运行例子</h2>

        <pre repl="false"><code class="lang-js">
import Stars from './stars';

render(
    &lt;Stars repo="developit/preact" /&gt;,
    document.body
);
        </code></pre>

        <div class="home-demo">
            <github-stars simple user="developit" repo="preact"></github-stars>
        </div>
    </div>
</section>


<section class="home-top">
    <h1>准备入坑了？</h1>
</section>


<section style="text-align:center;">
    <p>
        我们将根据您是否有 Preact 的经验提供不同的指导。
        <br>
        选取最适合您的指导规范！
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">如何开始</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">切换到 Preact</a>
    </p>
</section>
