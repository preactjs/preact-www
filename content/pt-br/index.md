---
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Uma alternativa ao React com apenas 3kB e a mesma API ES6</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Como começar</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Mudando para Preact</a>
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
    <h2>Uma biblioteca diferente</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Mais próximo do DOM.</h3>
    <p>
        Preact fornece uma abstração de Virtual DOM mais fina possível sobre o DOM.
        Se baseia em recursos de plataformas estáveis, registra manipuladores de eventos reais e funciona bem com outras bibliotecas.
    </p>
    <p>
        Preact pode ser usado diretamente no navegador, sem nenhuma etapa de transpilação.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/size.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Leve e Pequeno</h3>
    <p>
        A maioria dos frameworks de UI são grandes o suficiente pra serem a maior parte do peso de uma aplicação JavaScript.
        Preact é diferente: é pequeno o suficiente pra que o <em>seu código</em> seja a maior parte da sua aplicação.
    </p>
    <p>
        Isso significa menos <i>download</i>, interpretação e execução - o que deixa mais tempo pro seu código, pra que você possa criar uma experiência definida por você, ao invés de lutar pra manter o <i>framework</i> sobre controle.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Alta Performance</h3>
    <p>
        Preact é rápido, e não só por causa do seu tamanho. É uma das bibliotecas Virtual DOM mais rápidas disponíveis, graças a uma simples e rápida implementação do algorítimo de comparação.
    </p>
    <p>
        Até mesmo inclui recursos extra de performance como atualizações em lote customizáveis, renderização assíncrona opcional e reciclagem do DOM.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Portável &amp; Embutível</h3>
    <p>
        O pequeno impacto do Preact significa que você pode levar o poderoso paradigma de Componentes Virtual DOM a lugares antes não possíveis.
    </p>
    <p>
        Use Preact para construir partes de um aplicativo sem integrações complexas. Adicione o Preact a um <i>widget</i> e aplique as mesmas ferramentas e técnicas que iria ao construir uma aplicação completa.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Produtividade Instantânea</h3>
    <p>
        O "leve" fica muito mais divertido quando você não tem que sacrificar produtividade para alcançá-lo. Preact te torna produtivo imediatamente. Tem até mesmo alguns recursos bônus:
    </p>
    <ul>
        <li>`props`, `state` e `context` são passados pro `render()` como parâmetro</li>
        <li>Uso de atributos HTML padrão como `class` e `for`</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" loading="lazy" decoding="async" width="54" height="54">
  <div>
    <h3>Ecossistema compatível</h3>
    <p>
        Componentes Virtual DOM tornam fácil o compartilhamento de coisas reutílizáveis - tudo, de botôes a provedores de dado.
        O design do Preact significa que você pode usar de forma harmoniosa os milhares de Componentes disponíveis no ecossistema React.
    </p>
    <p>
        Ao adicionar um simples <i>alias</i> <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> ao seu <i>bundler</i> adiciona uma camada de compatibilidade que possibilita até mesmo os componentes React mais complexos a serem utilizados na sua aplicação.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Veja na prática!</h2>
</section>


<section class="home-split">
    <div>
        <h3>Componente de <i>Todo List</i> </h3>
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
        <h3>Exemplo em ação</h3>
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
        <h3>Buscar estrelas no Github</h3>
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
        <h3>Exemplo em ação</h3>
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
    <h2>Pronto pra mergulhar?</h2>
</section>


<section style="text-align:center;">
    <p>
        Temos guias separados, dependendo da sua experiência com React.
        <br>
        Escolha a melhor opção pra você!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Como começar</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Mudando para Preact</a>
    </p>
</section>
