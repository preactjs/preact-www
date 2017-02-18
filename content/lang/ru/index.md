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

    <p>Быстрая и лёгкая (размером 3kB) альтернатива React с совместимым ES6 API.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Начать работу</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Перейти на Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Другой тип библиотеки.</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>Ближе к железу</h2>
    
    <p>
        Preact — тончайшая абстракция Virtual DOM  над настоящим DOM-ом.
        Веб — стабильная платформа, пришло время перестать изобретать его
        заново во имя безопасности.
    </p>

    <p>
        Также, Preact — это первоклассный представитель веб-платформы.
        Он сравнивает DOM непосредственно с DOM-ом, регистрирует обработчики
        реальных событий и хорошо совместим с другими библиотеками.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>Небольшой размер</h2>
    
    <p>
        Большинство UI-фреймворков достаточно велики, чтобы занимать самую
        весомую часть JavaScript приложения. Preact не такой: он достаточно
        мал, чтобы <em>ваш код</em> был большей частью вашего приложения.
    </p>
    
    <p>
        Это означает, что меньше JavaScript кода скачивается, обрабатывается и
        выполняется, остаётся больше ресурсов для вашего кода, таким образом
        вы можете строить своё приложение без опасений, что фреймворк выйдет
        из-под контроля.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="производительность">

    <h2>Высокая производительность</h2>
    
    <p>
        Preact быстр не только из-за своего небольшого размера. Это одна
        из самых быстрых библиотек, работающих с Virtual DOM благодаря
        простоте и предсказуемости реализации сравнения.
    </p>
    
    <p>
        Также он содержит дополнительные функции, повышающие
        производительность, такие как
        <a href="/guide/configuration#debounceRendering">настраиваемое
        пакетное обновление</a>, опциональный <a href="/guide/
        configuration#syncComponentUpdates">асинхнонный рендеринг</a>,
        повторное использование DOM и оптимизированная обработка событий
        при помощи [Связанных состояний](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="переносимость">

    <h2>Переносимый и встраиваемый</h2>
    
    <p>
        Лёгкость Preact означает, что вы можете использовать мощь парадигмы
        компонентов Virtual DOM там, где это было невозможно ранее.
    </p>
    
    <p>
        Применяйте Preact для построения частей приложения без сложной
        интеграции. Встраивайте Preact в виджет и применяйте те же инструменты
        и техники, что и для построения целого приложения.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="продуктивность">

    <h2>Продуктивность немедленно</h2>
    
    <p>
        Легковесность — это большое удовольствие от отсутствия необходимости
        жертвовать продуктивностью. Preact предоставляет продуктивность
        сразу. При этом он имеет несколько дополнительных возможностей:
    </p>
    
    <ul>
        <li>`props`, `state` и `context` передаются в `render()`</li>
        <li>Используйте стандартные HTML атрибуты, например `class` и `for`</li>
        <li>Работает с React DevTools из коробки</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="совместимость">

    <h2>Совместимая экосистема</h2>
    
    <p>
        Компоненты Virtual DOM позволяют легко переиспользовать всё от кнопок
        до поставщиков данных. Дизайн Preact означает, что вы можете легко
        использовать тысячи компонентов из экосистемы React.
    </p>
    
    <p>
        Добавление простого алиаса <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a>
        в ваш пакет предоставляет слой совместимости, позволяющий использовать
        в вашем приложении даже сложные компоненты React.
    </p>
</section>


<section class="home-top">
    <h1>Preact в действии.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Todo List компонент</h2>
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
        <h2>Живой пример</h2>
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
        <h2>Получение количества звёзд из Github</h2>
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
        <h2>Живой пример</h2>
        
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
    <h1>Готовы начать?</h1>
</section>


<section style="text-align:center;">
    <p>
        Мы подготовили разные руководства в зависимости от вашего опыта
        с React.
        <br>
        Выберите подходящее вам руководство!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Начать работу</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Перейти на Preact</a>
    </p>
</section>
