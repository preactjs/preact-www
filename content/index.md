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

    <p>Fast 3kB alternative to React with the same ES6 API.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Get Started</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Switch to Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>A different kind of library.</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>Closer to the Metal</h2>
    
    <p>
        Preact provides the thinnest possible Virtual DOM abstraction on top of the DOM.
        The web is a stable platform, it's time we stopped reimplementing it in the name of safety.
    </p>

    <p>
        Preact is also a first-class citizen of the web platform. It diffs Virtual DOM against the DOM itself, registers real event handlers, and plays nicely with other libraries.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>Small Size</h2>
    
    <p>
        Most UI frameworks are large enough to be the majority of an app's JavaScript size.
        Preact is different: it's small enough that <em>your code</em> is the largest part of your application.
    </p>
    
    <p>
        That means less JavaScript to download, parse and execute - leaving more time for your code, so you can build an experience you define without fighting to keep a framework under control.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="performance">

    <h2>Big Performance</h2>
    
    <p>
        Preact is fast, and not just because of its size. It's one of the fastest Virtual DOM libraries out there, thanks to a simple and predictable diff implementation.
    </p>
    
    <p>
        It even includes extra performance features like customizable update batching, optional async rendering, DOM recycling, and optimized event handling via [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="portable">

    <h2>Portable &amp; Embeddable</h2>
    
    <p>
        Preact's tiny footprint means you can take the powerful Virtual DOM Component paradigm to new places it couldn't otherwise go.
    </p>
    
    <p>
        Use Preact to build parts of an app without complex integration. Embed Preact into a widget and apply the same tools and techniques that you would to build a full app.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="productive">

    <h2>Instantly Productive</h2>
    
    <p>
        Lightweight is a lot more fun when you don't have to sacrifice productivity to get there. Preact gets you productive right away. It even has a few bonus features:
    </p>
    
    <ul>
        <li>`props`, `state` and `context` are passed to `render()`</li>
        <li>Use standard HTML attributes like `class` and `for`</li>
        <li>Works with React DevTools right out of the box</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="compatible">

    <h2>Ecosystem Compatible</h2>
    
    <p>
        Virtual DOM Components make it easy to share reusable things - everything from buttons to data providers.
        Preact's design means you can seamlessly use thousands of Components available in the React ecosystem.
    </p>
    
    <p>
        Adding a simple <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> alias to your bundler provides a compatibility layer
        that enables even the most complex React components to be used in your application.
    </p>
</section>


<section class="home-top">
    <h1>See it in action.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Todo List Component</h2>
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
        <h2>Running Example</h2>
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
        <h2>Fetch Github Stars</h2>
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
        <h2>Running Example</h2>
        
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
    <h1>Ready to dive in?</h1>
</section>


<section style="text-align:center;">
    <p>
        We've got separate guides based on whether you have experience with React.
        <br>
        Pick the guide that works best for you!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Get Started</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Switch to Preact</a>
    </p>
</section>
