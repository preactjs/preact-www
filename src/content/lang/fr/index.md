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

    <p>Alternative à React de seulement 3Ko, rapide et avec la même API ES6.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Commencer</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passer à preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Un concept différent</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>Plus proche de la machine</h2>
    
    <p>
        Preact possède l'abstraction la plus fine au-dessus du DOM.
        Le web est une plateforme stable, il est temps d'arrêter de réinventer la roue.
    </p>
    
    <p>
        Preact est aussi au premier rang de la plateforme web. Il compare le DOM Virtuel avec le DOM "réel", enregistre de vrais gestionnaires d'événement et fonctionne très bien avec d'autres bibliothèques.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>Petite taille</h2>
    
    <p>
        La plupart des framesworks UI est très large et possède généralement plus de code que votre application. Preact est différent : la majorité du code de votre application sera le votre.
    </p>
    
    <p>
        Concrètement moins de code Javascript sera à télécharger, analyser et exécuter. De ce fait votre code sera privilégié.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="performance">

    <h2>Grande performance</h2>
    
    <p>
        Preact est performant. Il possède une des implémentations les plus rapides pour détecter les différences entre le DOM dans la page et le Virtual DOM.
    </p>
    
    <p>
        Il implémente certains extras comme <a href="/guide/configuration#debounceRendering">les updates en batch</a>, <a href="/guide/configuration#syncComponentUpdates">des mises à jour asynchrones</a>, la réutilisation du DOM et l'optimisation de la gestion des évènements avec [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="portable">

    <h2>Portable &amp; embarquable</h2>
    
    <p>
        Contrairement aux autres Preact ne possède pas un énorme surcoût, il vous permettra de bénéficier de la puissance du Virtual DOM.
    </p>
    
    <p>
        Vous pouvez utiliser Preact dans votre application sans intégration complexe. Embarquer Preact dans un widget n'est pas différent.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="productive">

    <h2>Productif instantanément</h2>
    
    <p>
        La légereté est plus amusante quand vous n'avez pas à sacrifier la productivité pour y arriver. Avec Preact vous serez productif en quelques instants avec certains extras :
    </p>
    
    <ul>
        <li>`props`, `state` et `context` sont papssés en arguments de la méthode `render()`</li>
        <li>Utiliser les attributs standard HTML comme `class` et `for`</li>
        <li>Fonctionnne avec React DevTools sans effort</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="compatible">

    <h2>Compatible avec l'écosystème</h2>
    
    <p>
        Les composants de Virtual DOM vous permet de réutiliser des briques de votre application. D'un simple bouton aux sources de données. Grâce à la conception de Preact vous avez à votre disposition les composants de l'écosystème React.
    </p>
    
    <p>
        Un simple alias vers <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> apporte une couche de compatibilité qui apporte les fonctionnalités les plus complexes de React.
    </p>
</section>


<section class="home-top">
    <h1>Voir en action</h1>
</section>


<section class="home-split">
    <div>
        <h2>Composant liste de tâches</h2>
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
        <h2>Exemple interactif</h2>
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
        <h2>Récupérer les Stars Github</h2>
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
        <h2>Exemple fonctionnel</h2>
        
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
    <h1>Pret à vous lancer ?</h1>
</section>


<section style="text-align:center;">
    <p>
        Nous avons séparé les guides en fonction de votre expérience avec React.
        <br>
        Choissiez celui qui vous convient.
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Commencer</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passer à Preact</a>
    </p>
</section>
