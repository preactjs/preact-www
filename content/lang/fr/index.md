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

    <p>Une alternative à React rapide pesant 3ko et proposant la même API ES6.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Pour commencer</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passer à Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Une blibliothèque différente.</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>Plus proche du DOM</h2>
    
    <p>
        Preact est une couche d’abstraction du DOM conçue pour être la plus légère possible.
        Le web est une plateforme stable, il est temps d'arrêter de le réimplémenter au nom de la sécurité.
    </p>

    <p>
        Preact fait partie intégrante de la plateforme web. Elle fait le différentiel entre le DOM Virtuel et le DOM réel, enregistre de vrais gestionnaires d'évènements, et s'intègre aussi parfaitement avec les autres bibliothèques.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>Une Taille Réduite</h2>
    
    <p>
        La plupart des frameworks UI sont tellement gros qu'ils comptent pour presque la totalité de la taille d'une application JavaScript.
        Preact est différent: sa taille se fait oublier au profit de <em>votre code</em> qui représente la majeure partie de votre application.
    </p>
    
    <p>
        Cela signifie moins de JavaScript à télécharger, parser et exécuter - ce qui vous laisse plus de temps pour coder et vous permettre de concevoir l'expérience que vous souhaitez, sans vous battre avec un framework dont vous n'avez pas le contrôle.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="performance">

    <h2>Une Performance Accrue</h2>
    
    <p>
        Preact est rapide, et pas seulement à cause de sa taille. C'est l'une des bibliothèques de DOM Virtuel les plus rapides du moment, grâce à une implémentation du différentiel simple et prédictible.
    </p>
    
    <p>
        Elle inclut même quelques améliorations de performances en plus comme la mise à jour en lots personnalisable, un rendu asynchrône optionnel, la réutilisation du DOM, et une gestion des évènements optimisée via [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="portable">

    <h2>Portable &amp; Embarquable</h2>
    
    <p>
        La taille réduite de Preact permet d'embarquer le paradigme de Composant du DOM Virtuel dans des environnements où l'on ne pouvait pas le faire jusque-là.
    </p>
    
    <p>
        Utilisez Preact pour construire les éléments composant votre application sans intégration complexe. Embarquez Preact dans un widget et utilisez les mêmes outils et techniques que vous utiliseriez pour construire une application complète.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="productive">

    <h2>Une Productivité Instantanée</h2>
    
    <p>
        Ne sacrifiez plus votre productivité pour concevoir une application légère. Preact vous permet d'être productif dès le début et apporte même quelques fonctionnalités bonus:
    </p>
    
    <ul>
        <li>`props`, `state` et `context` sont passées à `render()`</li>
        <li>Utilisez les attributs HTML standards comme `class` et `for`</li>
        <li>Fonctionne avec React DevTools sans aucune configuration nécessaire</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="compatible">

    <h2>Un Écosystème Compatible</h2>
    
    <p>
        Les Composants du DOM Virtuel permettent de partager des éléments réutilisables - de vos boutons jusqu'à vos fournisseurs de données.
        Le design de Preact vous permet de réutiliser sans aucune modification des milliers de composants de l'écosystème React.
    </p>
    
    <p>
        Ajouter un simple alias <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> à votre bundle fournit une couche de compatibilité qui vous permettra d'utiliser les composants React même les plus complexes dans votre application.
    </p>
</section>


<section class="home-top">
    <h1>Exemple</h1>
</section>


<section class="home-split">
    <div>
        <h2>Composant Liste de Tâches</h2>
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
                &lt;button type="submit"&gt;Ajouter&lt;/button&gt;
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
        <h2>Exemple Interactif</h2>
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
        <h2>Récupérer le nombre de stars d'un dépot GitHub</h2>
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
                ⭐️ {stars} Étoiles
            &lt;/a&gt;
        );
    }
}
        </code></pre>
    </div>
    
    <div>
        <h2>Démonstration</h2>
        
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
    <h1>Prêts pour le grand saut ?</h1>
</section>


<section style="text-align:center;">
    <p>
        Nous avons des guides différents en fonction de votre niveau d'expérience avec React.
        <br>
        Choisissez le guide qui vous convient le mieux !
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Découvrir Preact</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Passer à Preact</a>
    </p>
</section>
