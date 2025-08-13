---
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Una alternativa veloz a React en 3kB con la misma API de ES6</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Primeros pasos</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Cambiar a Preact</a>
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
  <p><a href="https://opencollective.com/preact">Patrocinado por:</a></p>
  <sponsors></sponsors>
</div>

<section class="home-top">
    <h2>Una librería distinta</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Más cerca del DOM</h3>
    <p>
        Preact provee la abstracción más pequeña del Virtual DOM sobre el DOM.
        Se basa en características estables de la plataforma, registra manejadores de eventos reales y funciona muy bien con otras librerías.
    </p>
    <p>
        Preact puede ser usado directamente en el navegador sin necesidad de ningún proceso de transpilación.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Tamaño reducido</h3>
    <p>
        La mayoría de los frameworks de UI son suficientemente grandes como para ser la mayor parte del tamaño del JavaScript de una app.
        Preact es distinto: es lo suficientemente pequeño como para que <em>tu código</em> sea la parte más pesada de tu aplicación.
    </p>
    <p>
        Esto significa menos JavaScript para descargar, interpretar y ejecutar - dejando más tiempo para tu código, para que puedas construir una experiencia que tú definas sin tener que pelear para mantener el framework bajo control.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Gran Rendimiento</h3>
    <p>
        Preact es rápido, y no solo por su peso. Es una de las librerías de Virtual DOM más rápidas que vas a encontrar, gracias a su implementación de diffing simple y predecible.
    </p>
    <p>
        También incluye añadidos extra de rendimientos como actualizaciones customizables en batch, async rendering opcional y reciclado del DOM.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Portable y embebible</h3>
    <p>
        La pequeña huella que deja Preact significa que puedes tomar el poderoso paradigma del Componente de Virtual DOM a nuevos lugares donde de otra manera no podría entrar.
    </p>
    <p>
        Usa Preact para crear partes de una aplicación sin integración compleja. Embebe Preact en un widget y usa las mismas herramientas y técnicas que usarías para crear una app completa.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Productividad instantánea</h3>
    <p>
        La liviandad es mucho más divertida cuando no tienes que sacrificar productividad para llegar a ella.
        Preact habilita tu productividad desde el comienzo. De hecho tiene algunos bonus:
    </p>
    <ul>
        <li>`props`, `state` y `context` son pasados a `render()`</li>
        <li>Usa atributos HTML estandar como `class` y `for`</li>
        <li>Compatible con las herramientas de desarrollo de React</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Ecosistema compatible</h3>
    <p>
        Los Componentes de Virtual DOM hacen simple compartir elementos reusables - desde botones hasta proveedores de data.
        El diseño de Preact significa también que tienes miles de Componentes disponibles desde el ecosistema de React.
    </p>
    <p>
        Agregando un simple alias a
        <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> en tu bundler provee una capa de compatibilidad que habilita incluso los componentes de React más complejos para ser usados en tu aplicación.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Míralo en acción!</h2>
</section>


<section class="home-split">
    <div>
        <h3>Componente de Todo List</h3>
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
        <h3>Ejemplo corriendo</h3>
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
        <h3>Buscando las estrellas de Github</h3>
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
        <h3>Ejemplo corriendo</h3>
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
    <h2>¿Preparada/o para meterte de lleno?</h2>
</section>


<section style="text-align:center;">
    <p>
        Tenemos guías separadas basadas en tus conocimientos de React.
        <br>
        ¡Elige la guía que mejor te funcione!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Primeros pasos</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Cambiando a Preact</a>
    </p>
</section>
