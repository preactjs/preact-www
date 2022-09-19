---
layout: home
title: Preact
show_title: false
toc: false
description: 'Fast 3kB alternative to React with the same modern API.'
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text inverted>Preact</logo>
    </h1>
    <p class="tagline">Fast 3kB alternative to React with the same modern API</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Get Started</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Switch to Preact</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const count = useSignal(0);

  return (
    <>
      <div>Counter: {count}</div>
      <button onClick={() => count.value += 1}>Increment</button>
      <button onClick={() => count.value -= 1}>Decrement</button>
    </>
  )
}
```

<section class="sponsors">
  <p>Proudly <a href="https://opencollective.com/preact">sponsored by:</a></p>
  <sponsors></sponsors>
</section>

<div class="foo">
  <section class="home-section">
    <h2>Small Size</h2>
    <p>
      Preact is small enough that <em>your code</em> is the largest part of your application. That means less JavaScript to download, parse and execute.
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Big Performance</h2>
    <p>
      We tune Preact to the extreme and work closely with browser engineers together. Preact is one of the fastest Virtual DOM libraries out there.
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Community!!!</h2>
    <p>
      TODO
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Instantly productive</h2>
    <p>
      We provide battle proven primitives to manage application logic in - SOMETHING SIGNALS
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Ecosystem Compatible</h2>
    <p>
      Seamlessly use thousands of components available in the React ecosystem natively in Preact.
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Learn for the web</h2>
    <p>
      Knowledge you gain from working with Preact applies to the web in general. We keep Preact specific things to a minimum.
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>

  <section class="home-section">
    <h2>Portable &amp; Embeddable</h2>
    <p>
      With Preact's tiny footprint you can embed it anywhere and use the same tools that you would use to build a full app.
    </p>
    <a href="#" class="link">Tell me more &rarr;</a>
  </section>
</div>

<section class="home-top">
    <h1>See it in action!</h1>
</section>

<section class="home-split">
    <div>
        <h2>Todo List</h2>
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
