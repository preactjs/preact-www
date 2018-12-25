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
    <p>Un alternativa veloce e leggera 3Kb a React con le stesse moderne API.</p>
    <p>
        <a href="/guide/getting-started" class="home-button">Primi Passi</a>
        <span class="home-button-sep">&nbsp; &nbsp; &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passare a Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">19,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Una Libreria differente!</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>Più vicino alla macchina</h2>
    
    <p>
        Preact fornisce la più leggera astrazione possibile del Virtual DOM sopra al DOM
        Il web è una piattaforma stabile, è il tempo in cui dobbiamo smettere di reimplementarlo in nome della sicurezza
    </p>

    <p>

       Preact è anche un cittadino di prima classe della piattaforma Web. Compara il virtual DOM con il DOM stesso,
       registra gestori di eventi reali, ed è compatibile, senza grossi problemi, con altre librerie
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>Piccolo nella dimensione</h2>
    
    <p>
        Molti degli UI framework sono grandi abbastanza per essere la parte più pesante del Javascript di un applicazione.
        Preact è differente: è piccolo abbastanza affinchè il tuo codice sia la parte più grande della tua applicazione
    </p>

    <p>
        Questo significa meno Javascript da scaricare, analizzare ed eseguire - lasciando più tempo per il tuo codice,
        così che tu possa costruire un esperienza da te definita senza combattere per tenere il framework sotto controllo.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="performance">

    <h2>Grandi Perfomance</h2>
    
    <p>
        Preact è veloce, e non solo per il suo peso. è una delle più veloci librerie del Virtual DOM disponibili,
        grazie alla sua semplice e prevedibile implementazione.
    </p>
    
    <p>
        Include anche funzionalità aggiuntive per le prestazoni, come l'aggiornamento personalizzabile dei batch, un opzionale e asincrono rendering, riciclaggio del DOM, e una gestione ottimizzata degli eventi tramite lo  [Stato Collegato](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="portable">

    <h2>Portatile ed Integrabile</h2>
    
    <p>
        La minuscola impronta di Preact permette di usare il potente paradigma dei Componenti del Virtual DOM in nuovi posti dove altrimenti non avresti potuto.
    </p>
    
    <p>
        Usa Preact per costruire parti della tua applicazione, senza una complicata integrazione. Integrare Preact in un widget e applica gli stessi strumenti e tecniche che useresti per costruire un intera applicazione.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="productive">

    <h2>Immediatamente Produttivo</h2>
    
    <p>
        La leggerezza è molto più divertente quando non si deve sacrificare la produttività. Preact ti rende subito
        produttivo. Ha anche alcune caratteristiche bonus:
    </p>

    <ul>
        <li>`props`, `state` e `context` sono passati a `render()`</li>
        <li>Usa attributi standard dell' HTML come `class` e `for`</li>
        <li>Funziona con React DevTools senza alcuna configurazione</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="compatible">

    <h2>Compatibile con l'Ecosistema</h2>
    
    <p>
        I componenti DOM virtuali facilitano la condivisione di cose riutilizzabili - qualcsiasi cosa dai bottoni ai fornitori di dati.
        Il design di pract significa che puoi utilizzare senza problemi migliaia di componenti disponibili nell'ecosistema React.
    </p>
    
    <p>
        La semplice aggiunta dell'alias <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> al tuo bundler fornisce un livello di compatibilità che permette anche al più complesso componente React di essere utilizzato nella tua applicaizone.
    </p>
</section>


<section class="home-top">
    <h1>Guardalo in azione.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Componente Lista delle attività</h2>
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
        <h2>Esempio in esecuzione</h2>
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
        <h2>Visualizzare le stelle su GitHub</h2>
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
        <h2>Esempio in esevuzione</h2>
        
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
    <h1>Pronto a tuffarti?</h1>
</section>


<section style="text-align:center;">
    <p>
        Abbiamo guide separate in base al fatto che tu abbia esperienza più o meno esperienza con React.
        <br>
        Scegli la guida migliore per te!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Primi passi</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passa a Preact</a>
    </p>
</section>
