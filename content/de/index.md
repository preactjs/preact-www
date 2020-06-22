---
layout: home
title: Preact
show_title: false
toc: false
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text inverted>Preact</logo>
    </h1>
    <p class="tagline">Schnelle 3kB-Alternative zu React mit der gleichen ES6-API.</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Fang an</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Wechsle zu Preact</a>
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
    <h1>Eine Bibliothek der anderen Art.</h1>
</section>


<section class="home-section">
  <img src="/assets/home/metal.svg" alt="metal">

  <div>
    <h2>Näher am Geschehen</h2>
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
  <img src="/assets/home/size.svg" alt="größe">

  <div>
    <h2>Kleine Größe</h2>
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
  <img src="/assets/home/performance.svg" alt="leistung">

  <div>
    <h2>Große Leistung</h2>
    <p>
        Preact ist schnell, was nicht nur an seiner Größe liegt. Dank einer simplen und vorhersehbaren Differenzierungsimplementation ist es eine der schnellsten Virtual DOM-Bibliotheken überhaupt.
    </p>
    <p>
        Preact batched automatisch updates und ist stark auf Performance getuned. Wir arbeiten direkt mit Entwicklern von Browsern zusammen und die maximalste Performance aus Preact heraus zu holen.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/assets/home/portable.svg" alt="portabel">
  <div>
    <h2>Portabel &amp; Einbettbar</h2>
    <p>
        Preacts winziger Fußabdruck ermöglicht dem ressourcenreichen Virtual DOM-Komponentenparadigma Dinge, von dem es sonst nur träumen könnte.
    </p>
    <p>
        Verwende Preact, um Teile einer App ohne komplizierte Integration zu erstellen. Bette Preact in einem Widget ein und wende die selben Werkzeuge und Techniken an, die man normalerweise in einer vollständigen App verwenden würde.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/assets/home/productive.svg" alt="produktiv">
  <div>
    <h2>Sofort produktiv</h2>
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
  <img src="/assets/home/compatible.svg" alt="kompatibel">
  <div>
    <h2>Ökosystem-kompatibel</h2>
    <p>
        Virtual DOM-Komponenten machen es einfach, Dinge wieder zu verwenden - alles vom Knopf bis hin zu Datenquellen.
        Preacts Gestaltung lässt dich tausende Komponenten, die bereits im React-Ökosystem verfügbar sind, verwenden.
    </p>
    <p>
        Das Hinzufügen eines einfachen <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a>-Alias zum Bundler fügt eine Kompatibilitätsschicht hinzu, die es erlaubt, selbst die komplexesten React-Komponenten in der eigenen Preact-App zu verwenden.
    </p>
  </div>
</section>


<section class="home-top">
    <h1>Erlebe es in freier Wildbahn!</h1>
</section>


<section class="home-split">
    <div>
        <h2>To Do-Listen-Komponente</h2>
        <pre><code class="lang-jsx">
export default class ToDoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.target.value });
    };
    addToDo = () =&gt; {
        let { todos, text } = this.state;
        todos = todos.concat({ text });
        this.setState({ todos, text: '' });
    };
    render({ }, { todos, text }) {
        return (
            &lt;form onSubmit={this.addToDo} action="javascript:"&gt;
                &lt;label&gt;
                  &lt;span&gt;Add Todo&lt;/span&gt;
                  &lt;input value={text} onInput={this.setText} /&gt;
                &lt;/label&gt;
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
        <h2>Laufendes Beispiel</h2>
        <pre repl="false"><code class="lang-jsx">
import ToDoList from './todo-list';

render(&lt;ToDoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>


<section class="home-split">
    <div>
        <h2>Zeige GitHub-Stars</h2>
        <pre><code class="lang-jsx">
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = \`https://github.com/${repo}\`;
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
        <h2>Laufendes Beispiel</h2>
        <pre repl="false"><code class="lang-jsx">
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
    <h1>Bereit einzutauchen?</h1>
</section>


<section style="text-align:center;">
    <p>
        Wir haben verschiedene Anleitungen basierend auf deinem React-Kenntnisstand.
        <br>
        Wähle die Anleitung aus, die für dich am besten geeignet ist!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Fang an</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Wechsle zu Preact</a>
    </p>
</section>
