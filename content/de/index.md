---
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Schnelle 3kB-Alternative zu React mit der gleichen ES6-API</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Fang an</a>
        <a href="/guide/v10/getting-started#aliasing-react-to-preact" class="btn secondary">Wechsle zu Preact</a>
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
  <p><a href="https://opencollective.com/preact">Gesponsort von:</a></p>
  <sponsors></sponsors>
</div>

<section class="home-top">
    <h2>Eine Bibliothek der anderen Art</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Näher am Geschehen</h3>
    <p>
        Preact bietet die kleinstmögliche Virtual DOM Abstraktion auf dem DOM.
        Das Web ist eine stabile Plattform und es ist an der Zeit, dass wir es im Namen der Sicherheit neu implementieren.
    </p>
    <p>
        Preact ist außerdem ein Vorzeigemitglied der Web-Plattform. Es differenziert Virtual DOM gegen das DOM selbst, registriert reale Event-Handler und funktioniert Hand in Hand mit anderen Bibliotheken.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" alt="größe" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Kleine Größe</h3>
    <p>
        Die meisten UI-Frameworks sind so riesig, dass sie den Großteil einer JavaScript-App ausmachen.
        Mit Preact ist das anders: Es ist winzig genug, damit <em>eigener Code</em> den Großteil der Application ausmacht.
    </p>
    <p>
        Dies bedeutet weniger JavaScript zum herunterladen, analysieren und ausführen - das Resultat ist mehr Zeit für den eigenen Code, sodass eine selbstbestimmte Erfahrung ohne den Kampf ein Framework unter Kontrolle zu halten, möglich ist.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" alt="leistung" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Große Leistung</h3>
    <p>
        Preact ist schnell, was nicht nur an seiner Größe liegt. Dank einer simplen und vorhersehbaren Differenzierungsimplementation ist es eine der schnellsten Virtual DOM-Bibliotheken überhaupt.
    </p>
    <p>
        Preact batched automatisch updates und ist stark auf Performance getuned. Wir arbeiten direkt mit Entwicklern von Browsern zusammen und die maximalste Performance aus Preact heraus zu holen.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" alt="portabel" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Portabel &amp; Einbettbar</h3>
    <p>
        Preacts winziger Fußabdruck ermöglicht dem ressourcenreichen Virtual DOM-Komponentenparadigma Dinge, von dem es sonst nur träumen könnte.
    </p>
    <p>
        Verwende Preact, um Teile einer App ohne komplizierte Integration zu erstellen. Bette Preact in einem Widget ein und wende die selben Werkzeuge und Techniken an, die man normalerweise in einer vollständigen App verwenden würde.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" alt="produktiv" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Sofort produktiv</h3>
    <p>
        Leichtigkeit ist deutlich spaßiger, wenn man dafür Produktivität nicht einbüßen muss. Preacts macht dich von Anfang an produktiv! Es hat sogar einige Bonusfunktionen:
    </p>
    <ul>
        <li>`props`, `state` und `context` werden zu `render()` weitergegeben</li>
        <li>Standard HTML-Attribute (z.B. `class` und `for`) können verwendet werden</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" alt="kompatibel" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Ökosystem-kompatibel</h3>
    <p>
        Virtual DOM-Komponenten machen es einfach, Dinge wieder zu verwenden - alles vom Knopf bis hin zu Datenquellen.
        Preacts Gestaltung lässt dich tausende Komponenten, die bereits im React-Ökosystem verfügbar sind, verwenden.
    </p>
    <p>
        Das Hinzufügen eines einfachen <a href="/guide/v10/getting-started#aliasing-react-to-preact">preact-compat</a>-Alias zum Bundler fügt eine Kompatibilitätsschicht hinzu, die es erlaubt, selbst die komplexesten React-Komponenten in der eigenen Preact-App zu verwenden.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Erlebe es in freier Wildbahn!</h2>
</section>


<section class="home-split">
    <div>
        <h3>To Do-Listen-Komponente</h3>
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
        <h3>Laufendes Beispiel</h3>
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
        <h3>Zeige GitHub-Stars</h3>
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
        <h3>Laufendes Beispiel</h3>
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
    <h2>Bereit einzutauchen?</h2>
</section>


<section style="text-align:center;">
    <p>
        Wir haben verschiedene Anleitungen basierend auf deinem React-Kenntnisstand.
        <br>
        Wähle die Anleitung aus, die für dich am besten geeignet ist!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Fang an</a>
        <a href="/guide/v10/getting-started#aliasing-react-to-preact" class="btn secondary">Wechsle zu Preact</a>
    </p>
</section>
