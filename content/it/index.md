---
layout: home
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Un alternativa veloce e leggera 3Kb a React con le stesse moderne API</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Primi Passi</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Passare a Preact</a>
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

<div class="sponsors">
  <p><a href="https://opencollective.com/preact">Sponsorizzata da:</a></p>
  <sponsors></sponsors>
</div>

<section class="home-top">
    <h2>Una Libreria differente</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" alt="metal">

  <div>
    <h3>Più vicino alla macchina</h3>
    <p>
        Preact fornisce la più leggera astrazione possibile del Virtual DOM.
        Il web è una piattaforma stabile, è giunto il momento in cui dobbiamo smettere di reimplementarlo in nome della sicurezza.
    </p>
    <p>
       Preact è in prima linea nella piattaforma Web. Compara il virtual DOM con il DOM stesso,
       registra i gestori di eventi, ed è compatibile, senza grossi problemi, con altre librerie.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" alt="size">

  <div>
    <h3>Piccolo nelle dimensioni</h3>
    <p>
        Molti degli UI framework sono grandi abbastanza per essere la parte più pesante del Javascript di un applicazione.
        Preact è differente: è così piccolo che il tuo codice sarà la parte più grande nella tua applicazione
    </p>
    <p>
        Questo significa meno Javascript da scaricare, analizzare ed eseguire - lasciando più tempo per il tuo codice,
        così che tu possa costruire un'esperienza da te definita, senza dover combattere per tenere il framework sotto controllo.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" alt="performance">

  <div>
    <h3>Grandi Perfomance</h3>
    <p>
        Preact è veloce, e non solo per il suo peso. Ha una delle implementazioni più veloci per rilevare le differenze tra il DOM sulla pagina e il DOM virtuale.
    </p>
    <p>
        Include anche funzionalità aggiuntive per le prestazoni, come l'aggiornamento personalizzabile dei batch, un opzionale e asincrono rendering e DOM riutilizzabile.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" alt="portable">

  <div>
    <h3>Portatile ed Integrabile</h3>
    <p>
        La minuscola impronta di Preact permette di usare il potente paradigma dei Componenti del Virtual DOM in posti dove altrimenti non avresti potuto.
    </p>
    <p>
        Usa Preact per costruire parti della tua applicazione, senza una complicata integrazione. Integra Preact in un widget e applica gli stessi strumenti e tecniche che useresti per costruire un intera applicazione.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" alt="productive">

  <div>
    <h3>Immediatamente Produttivo</h3>
    <p>
        La leggerezza è molto più divertente quando non si deve sacrificare la produttività. Preact ti rende subito
        produttivo. Ha anche alcune caratteristiche bonus:
    </p>
    <ul>
        <li>`props`, `state` e `context` sono passati a `render()`</li>
        <li>Usa attributi standard dell' HTML come `class` e `for`</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" alt="compatible">

  <div>
    <h3>Compatibile con l'Ecosistema</h3>
    <p>
        I componenti DOM virtuali facilitano la condivisione di cose riutilizzabili - qualsiasi cosa dai bottoni ai fornitori di dati.
        Il design di Preact ti permette di utilizzare senza problemi migliaia di componenti disponibili nell'ecosistema React.
    </p>
    <p>
        La semplice aggiunta dell'alias <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> al tuo bundler fornisce un livello di compatibilità che permette anche al più complesso componente React di essere utilizzato nella tua applicaizone.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Guardalo in azione!</h2>
</section>


<section class="home-split">
    <div>
        <h3>Componente Lista delle attività</h3>
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
        <h3>Esempio in esecuzione</h3>
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
        <h3>Visualizzare le stelle su GitHub</h3>
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
        <h3>Esempio in esecuzione</h3>
        <pre repl="false"><code class="lang-jsx">
import Stars from './stars';<br>
render(
    &lt;Stars repo="developit/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple="true" user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>


<section class="home-top">
    <h2>Pronto a tuffarti?</h2>
</section>


<section style="text-align:center;">
    <p>
        Abbiamo guide separate in base alla tua esperienza con React.
        <br>
        Scegli la guida migliore per te!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Primi passi</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Passa a Preact</a>
    </p>
</section>
