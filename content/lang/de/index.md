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

    <p>Eine schnelle Alternative zu React mit derselben ES6-API in nur 3kB.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Schnelleinstieg</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Zu Preact wechseln</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Eine besondere Library.</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="Metall">

    <h2>Ganz nah dran.</h2>

    <p>
        Preact bietet die denkbar schlankeste Virtual DOM-Abstraktion, die auf das DOM aufsetzt.
        Das Web ist eine stabile Plattform, die nicht immer wieder neu erfunden werden muss, um ihr Sicherheit zu verleihen.
    </p>

    <p>
        Preact ist ein First-Class-Objekt der Web-Plattform. Preact gleicht das Virtual DOM mit dem DOM selbst ab, registriert echte Event-Handler und verträgt sich bestens mit anderen Libraries.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="Größe">

    <h2>Geringe Größe</h2>

    <p>
        Die meisten UI-Frameworks liefern so viel Code aus, dass sie den Großteil des Javascript-Codes einer Anwendung ausmachen.
        Preact ist anders: es ist so klein, dass <em>Dein Code</em> den größten Teil deiner Anwendung darstellt.
    </p>

    <p>
        Damit muss weniger Javascript heruntergeladen, geparst und ausgeführt werden, und das bedeutet mehr Zeit für deinen Code. Damit bist du Herr der Benutzererfahrung und nicht ein Framework, das du erst mühsam unter Kontrolle bringen musst.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="Performance">

    <h2>Starke Performance</h2>

    <p>
        Preact ist schnell, und zwar nicht nur seiner Größe wegen. Es stellt dank seiner einfachen und vorhersehbaren Diff-Implementierung eine der schnellsten Virtual DOM-Libraries dar.
    </p>

    <p>
        Preact enthält sogar weitere Performance-Features wie <a href="/guide/configuration#debounceRendering">anpassbare Stapelung von DOM-Updates</a>, optionales <a href="/guide/configuration#syncComponentUpdates">asynchrones Rendering</a>, DOM-Recycling und optimiertes Event-Handling per [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="Flexibel">

    <h2>Übertragbar & vielseitig</h2>

    <p>
        Durch Preacts geringe Größe kann sein leistungsfähiges Virtual DOM-Komponenten-Paradigma an Orten genutzt werden, die sonst nicht erreichbar wären.
    </p>

    <p>
        Nutze Preact, um Teile einer App ohne komplexe Integration zu entwickeln. Setze Preact in einem Widget ein und wende dieselben Tools und Techniken an, die man auch für eine vollständige App benötigt.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="Produktiv">

    <h2>Sofort produktiv</h2>

    <p>
        Leichtgewichtigkeit macht umso mehr Spaß, je weniger Aufwand nötig ist, um sie zum Einsatz zu bringen. Preact lässt dich sofort produktiv werden. Und es bietet einige Zusatzfeatures:
    </p>

    <ul>
        <li>`props`, `state` und `context` werden an `render()` übergeben</li>
        <li>Standard-HTML-Attribute wie `class` und `for` können genutzt werden</li>
        <li>Wird von React DevTools ohne Zusatzaufwand unterstützt</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="Kompatibel">

    <h2>Kompatibel</h2>

    <p>
        Virtual DOM-Komponenten erlauben die Wiederverwendung von Elementen wie Buttons bis hin zu Datenquellen.
        Das Design von Preact ermöglicht, nahtlos tausende von Komponenten aus dem React-Umfeld zu nutzen.
    </p>

    <p>
        Ersetze React durch das einfache <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a>, um einen Kompatibilitäts-Layer zu nutzen, der die Nutzung selbst komplexester React-Komponenten in deiner Anwendung erlaubt.
    </p>
</section>


<section class="home-top">
    <h1>Und so funktioniert's.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Todo-Listen-Komponente</h2>
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
                &lt;button type="submit"&gt;Hinzufügen&lt;/button&gt;
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
        <h2>Ausführbares Beispiel</h2>
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
        <h2>Github-Bewertungen abrufen</h2>
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
                ⭐️ {stars} Sterne
            &lt;/a&gt;
        );
    }
}
        </code></pre>
    </div>

    <div>
        <h2>Ausführbares Beispiel</h2>

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
    <h1>Bereit loszulegen?</h1>
</section>


<section style="text-align:center;">
    <p>
        Wir stellen verschiedene Anleitungen bereit, je nachdem ob du bereits Erfahrungen mit React hast oder nicht.
        <br>
        Wähle die passende Anleitung!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Schnelleinstieg</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Zu Preact wechseln</a>
    </p>
</section>
