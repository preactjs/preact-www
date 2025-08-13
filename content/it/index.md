---
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
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

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
  <img src="/home/size.svg" alt="size" loading="lazy" decoding="async" width="54" height="54">

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
  <img src="/home/performance.svg" alt="performance" loading="lazy" decoding="async" width="54" height="54">

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
  <img src="/home/portable.svg" alt="portable" loading="lazy" decoding="async" width="54" height="54">

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
  <img src="/home/productive.svg" alt="productive" loading="lazy" decoding="async" width="54" height="54">

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
  <img src="/home/compatible.svg" alt="compatible" loading="lazy" decoding="async" width="54" height="54">

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
        <h3>Esempio in esecuzione</h3>
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
        <h3>Visualizzare le stelle su GitHub</h3>
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
            		fetch(`https://api.github.com/orgs/${org}/repos`)
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
        <h3>Esempio in esecuzione</h3>
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
