---
title: Preact
description: Быстрая 3КБ-альтернатива React с тем же современным API
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Быстрая альтернатива React весом 3 КБ с тем же современным API.</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Начать</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Перейти на Preact</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const [value, setValue] = useState(0);

  return (
    <>
      <div>Счётчик: {value}</div>
      <button onClick={() => setValue(value + 1)}>Увеличить</button>
      <button onClick={() => setValue(value - 1)}>Уменьшить</button>
    </>
  );
}
```

<section class="sponsors">
  <p>С гордостью <a href="https://opencollective.com/preact">спонсируется</a>:</a></p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h2>Библиотека другого типа</h2>
</section>

<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Ближе к DOM</h3>
    <p>
      Preact предоставляет максимально тонкую абстракцию Virtual DOM поверх DOM.
      Она опирается на стабильные возможности платформы, регистрирует реальные обработчики событий и хорошо взаимодействует с другими библиотеками.
    </p>
    <p>
      Preact может использоваться непосредственно в браузере без каких-либо шагов по транспиляции.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/size.svg" alt="size" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Малый размер</h3>
    <p>
      Большинство UI-фреймворков достаточно велики и составляют большую часть объема JavaScript в приложении.
      Preact — это совсем другое: он достаточно мал, чтобы <em>ваш код</em> был самой большой частью вашего приложения.
    </p>
    <p>
      Это означает, что нужно загружать, разбирать и выполнять меньше JavaScript, что оставляет больше времени для работы с кодом, и вы можете создавать свой опыт, не борясь за контроль над фреймворком.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/performance.svg" alt="performance" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Большая производительность</h3>
    <p>
      Preact работает быстро, и не только благодаря своим размерам. Это одна из самых быстрых библиотек Virtual DOM, благодаря простой и предсказуемой реализации diff.
    </p>
    <p>
      Мы автоматически выполняем пакетное обновление и настраиваем Preact до предела, когда речь идет о производительности. Мы тесно сотрудничаем с инженерами браузеров, чтобы добиться максимальной производительности Preact.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/portable.svg" alt="portable" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Портативная и встраиваемая</h3>
    <p>
      Небольшой размер Preact позволяет использовать мощную парадигму компонентов Virtual DOM в новых местах, куда иначе не попасть.
    </p>
    <p>
      Используйте Preact для создания частей приложения без сложной интеграции. Встраивайте Preact в виджет и применяйте те же инструменты и методы, что и при создании полноценного приложения.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/productive.svg" alt="productive" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Мгновенная продуктивность</h3>
    <p>
      Легкий вес гораздо интереснее, когда для его достижения не приходится жертвовать производительностью. Preact позволяет сразу же повысить производительность труда. В нем даже есть несколько бонусов:
    </p>
    <ul>
      <li>Передача <code>props</code>, <code>state</code> и <code>context</code> в <code>render()</code></li>
      <li>Использование стандартных атрибутов HTML, таких как <code>class</code> и <code>for</code></li>
    </ul>
  </div>
</section>

<section class="home-section">
  <img src="/home/compatible.svg" alt="compatible" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Совместимость с экосистемой</h3>
    <p>
      Компоненты Virtual DOM упрощают совместное использование многократно используемых элементов — от кнопок до поставщиков данных.
      Дизайн Preact позволяет легко использовать тысячи компонентов, доступных в экосистеме React.
    </p>
    <p>
      Добавление простого <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact/compat</a> псевдонима в вашу сборку обеспечивает совместимость даже с самыми сложными компонентами React.
    </p>
  </div>
</section>

<section class="home-top">
    <h2>Посмотрите в действии!</h2>
</section>

<section class="home-split">
    <div>
        <h3>Список дел</h3>
        <pre><code class="language-jsx">
// --repl
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
            					<span>Новый пункт</span>
            					<input value={text} onInput={this.setText} />
            				</label>
            				<button type="submit">Добавить</button>
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
        <h3>Пример выполнения</h3>
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
        <h3>Получение звёзд GitHub</h3>
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
            				Репозитории Preact
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
        <h3>Пример выполнения</h3>
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
    <h2>Готовы к погружению?</h2>
</section>

<section style="text-align:center;">
    <p>
        Мы подготовили отдельные руководства в зависимости от того, есть ли у вас опыт работы с React.
        <br>
        Выберите руководство, которое подойдет вам лучше всего!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Начать</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Перейти на Preact</a>
    </p>
</section>
