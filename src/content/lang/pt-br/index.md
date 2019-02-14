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

    <p>Uma alternativa ao React com apenas 3kB e a mesma API ES6.</p>

    <p>
        <a href="/guide/getting-started" class="home-button">Como começar</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Mudando para Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>Uma biblioteca diferente.</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg">

    <h2>Mais próximo do metal.</h2>

    <p>
        Preact fornece a mais leve abstração de Virtual DOM possível em cima do DOM.
        A web é uma plataforma estável - É tempo de pararmos de reimplementá-la em nome da segurança.
    </p>

    <p>
        Preact é também um cidadão de primeira-classe da plataforma web. Compara a Virtual DOM e o próprio DOM, registra <i>event handlers</i> de verdade, e funciona bem com outras bibliotecas.
    </p>

</section>


<section class="home-section">
    <img src="/assets/home/size.svg">

    <h2>Leve e Pequeno</h2>

    <p>
        A maioria dos frameworks de UI são grandes o suficiente pra serem a maior parte do peso de uma aplicação JavaScript.
        Preact é diferente: é pequeno o suficiente pra que o <em>seu código</em> seja a maior parte da sua aplicação.
    </p>

    <p>
        Isso significa menos <i>download</i>, interpretação e execução - o que deixa mais tempo pro seu código, pra que você possa criar uma experiência definida por você, ao invés de lutar pra manter o <i>framework</i> sobre controle.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg">

    <h2>Alta Performance</h2>

    <p>
        Preact é rápido, e não só por causa do seu tamanho. É uma das bibliotecas Virtual DOM mais rápidas disponíveis, graças a uma simples e rápida implementação do algorítimo de comparação.
    </p>

    <p>
        Até mesmo inclui recursos extra de performance como atualizações em lote customizáveis, renderização assíncrona opcional, reciclagem do DOM e manipulação de eventos otimizado por meio do [Estado Associado (Linked State)](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg">

    <h2>Portável &amp; Embutível</h2>

    <p>
        O pequeno impacto do Preact significa que você pode levar o poderoso paradigma de Componentes Virtual DOM a lugares antes não possíveis.
    </p>

    <p>
        Use Preact para construir partes de um aplicativo sem integrações complexas. Adicione o Preact a um <i>widget</i> e aplique as mesmas ferramentas e técnicas que iria ao construir uma aplicação completa.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg">

    <h2>Produtividade Instantânea</h2>

    <p>
        O "leve" fica muito mais divertido quando você não tem que sacrificar produtividade para alcançá-lo. Preact te torna produtivo imediatamente. Tem até mesmo alguns recursos bônus:
    </p>

    <ul>
        <li>`props`, `state` e `context` são passados pro `render()` como parâmetro</li>
        <li>Uso de atributos HTML padrão como `class` e `for`</li>
        <li>Funciona com o React DevTools sem nenhuma configuração adicional</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg">

    <h2>Ecossistema compatível</h2>

    <p>
        Componentes Virtual DOM tornam fácil o compartilhamento de coisas reutílizáveis - tudo, de botôes a provedores de dado.
        O design do Preact significa que você pode usar de forma harmoniosa os milhares de Componentes disponíveis no ecossistema React.
    </p>

    <p>
        Ao adicionar um simples <i>alias</i> <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> ao seu <i>bundler</i> adiciona uma camada de compatibilidade que possibilita até mesmo os componentes React mais complexos a serem utilizados na sua aplicação.
    </p>
</section>


<section class="home-top">
    <h1>Veja na prática.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Componente de <i>Todo List</i> </h2>
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
        <h2>Exemplo em ação</h2>
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
        <h2>Buscar estrelas no Github</h2>
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
        <h2>Exemplo em ação</h2>

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
    <h1>Pronto pra mergulhar?</h1>
</section>


<section style="text-align:center;">
    <p>
        Temos guias separados, dependendo da sua experiência com React.
        <br>
        Escolha a melhor opção pra você!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Como começar</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Mudando para Preact</a>
    </p>
</section>
