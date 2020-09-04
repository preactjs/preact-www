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
    <h1>Una librería distinta</h1>
</section>


<section class="home-section">
  <img src="/assets/home/metal.svg">

  <div>
    <h2>Más cerca del DOM</h2>
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
  <img src="/assets/home/size.svg">

  <div>
    <h2>Tamaño reducido</h2>
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
  <img src="/assets/home/performance.svg">

  <div>
    <h2>Gran Rendimiento</h2>
    <p>
        Preact es rápido, y no solo por su peso. Es una de las librerías de Virtual DOM más rápidas que vas a encontrar, gracias a su implementación de diffing simple y predecible.
    </p>
    <p>
        También incluye añadidos extra de rendimientos como actualizaciones customizables en batch, async rendering opcional y reciclado del DOM.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/assets/home/portable.svg">

  <div>
    <h2>Portable y embebible</h2>
    <p>
        La pequeña huella que deja Preact significa que puedes tomar el poderoso paradigma del Componente de Virtual DOM a nuevos lugares donde de otra manera no podría entrar.
    </p>
    <p>
        Usa Preact para crear partes de una aplicación sin integración compleja. Embebe Preact en un widget y usa las mismas herramientas y técnicas que usarías para crear una app completa.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/assets/home/productive.svg">

  <div>
    <h2>Productividad instantánea</h2>
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
  <img src="/assets/home/compatible.svg">

  <div>
    <h2>Ecosistema compatible</h2>
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
    <h1>Míralo en acción!</h1>
</section>


<section class="home-split">
    <div>
        <h2>Componente de Todo List</h2>
        <pre><code class="lang-jsx">
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
                &lt;label&gt;
                  &lt;span&gt;Add Todo&lt;span&gt;
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
        <h2>Ejemplo corriendo</h2>
        <pre repl="false"><code class="lang-jsx">
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
        <h2>Buscando las estrellas de Github</h2>
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
        <h2>Ejemplo corriendo</h2>
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
    <h1>¿Preparada/o para meterte de lleno?</h1>
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
