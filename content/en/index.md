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
    <p class="tagline">Fast 3kB alternative to React with the same modern API.</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Get Started</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Switch to Preact</a>
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
  <p>Proudly <a href="https://opencollective.com/preact">sponsored by:</a></p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h1>A different kind of library.</h1>
</section>

<section class="home-section">
  <img src="/assets/home/metal.svg" alt="metal">

  <div>
    <h2>Closer to the DOM</h2>
    <p>
      Preact provides the thinnest possible Virtual DOM abstraction on top of the DOM.
      It builds on stable platform features, registers real event handlers and plays nicely with other libraries.
    </p>
    <p>
      Preact can be used directly in the browser without any transpilation steps.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/size.svg" alt="size">

  <div>
    <h2>Small Size</h2>
    <p>
      Most UI frameworks are large enough to be the majority of an app's JavaScript size.
      Preact is different: it's small enough that <em>your code</em> is the largest part of your application.
    </p>
    <p>
      That means less JavaScript to download, parse and execute - leaving more time for your code, so you can build an experience you define without fighting to keep a framework under control.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/performance.svg" alt="performance">

  <div>
    <h2>Big Performance</h2>
    <p>
      Preact is fast, and not just because of its size. It's one of the fastest Virtual DOM libraries out there, thanks to a simple and predictable diff implementation.
    </p>
    <p>
      We automatically batch updates and tune Preact to the extreme when it comes to performance. We work closely with
      browser engineers to get the maximum performance possible out of Preact.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/portable.svg" alt="portable">

  <div>
    <h2>Portable &amp; Embeddable</h2>
    <p>
      Preact's tiny footprint means you can take the powerful Virtual DOM Component paradigm to new places it couldn't otherwise go.
    </p>
    <p>
      Use Preact to build parts of an app without complex integration. Embed Preact into a widget and apply the same tools and techniques that you would to build a full app.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/productive.svg" alt="productive">

  <div>
    <h2>Instantly Productive</h2>
    <p>
      Lightweight is a lot more fun when you don't have to sacrifice productivity to get there. Preact gets you productive right away. It even has a few bonus features:
    </p>
    <ul>
      <li><code>props</code>, <code>state</code> and <code>context</code> are passed to <code>render()</code></li>
      <li>Use standard HTML attributes like <code>class</code> and <code>for</code></li>
    </ul>
  </div>
</section>

<section class="home-section">
  <img src="/assets/home/compatible.svg" alt="compatible">

  <div>
    <h2>Ecosystem Compatible</h2>
    <p>
      Virtual DOM Components make it easy to share reusable things - everything from buttons to data providers.
      Preact's design means you can seamlessly use thousands of Components available in the React ecosystem.
    </p>
    <p>
      Adding a simple <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact/compat</a> alias to your bundler provides a compatibility layer
      that enables even the most complex React components to be used in your application.
    </p>
  </div>
</section>

<section class="home-top">
    <h1>See it in action.</h1>
</section>

<section class="home-split">
    <div>
        <h2>Todo List Component</h2>
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
        <h2>Running Example</h2>
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
        <h2>Fetch GitHub Stars</h2>
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
        <h2>Running Example</h2>
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
    <h1>Ready to dive in?</h1>
</section>

<section style="text-align:center;">
    <p>
        We've got separate guides based on whether you have experience with React.
        <br>
        Pick the guide that works best for you!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Get Started</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Switch to Preact</a>
    </p>
</section>
