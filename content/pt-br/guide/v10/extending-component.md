---
name: Extendendo Componentes
permalink: '/guide/extending-component'
---

# Extendendo Componentes

É possível que alguns projetos queiram extender `Component` com funcionalidade adicional.

Opniões sobre o valor da herança em JavaScript são variadas, mas se você deseja criar sua própria "class base" da qual todos os seus componentes herdem, Preact tem o que você precisa.

Talvez você queira fazer conexão automática a `stores`/`reducers` dentro de uma arquitetura Flux. Talvez você queira adicionar _mixins_ baseados em propriedades para o fazer mais parecido com o `React.createClass()` _(nota: o [decorador `@bind`](https://github.com/developit/decko#bind) é preferível)_.

Em qualquer caso, apenas use a herança de classes do ES2015 para extender a class `Component` do Preact:


```js
class BoundComponent extends Component {
    // Exemplo: obter métodos vinculados
    binds() {
        let list = this.bind || [],
            binds = this._binds;
        if (!binds) {
            binds = this._binds = {};
            for (let i=list.length; i--; ) {
                binds[list[i]] = this[list[i]].bind(this);
            }
        }
        return binds;
    }
}
```

Exemplo de uso:

```js
class Link extends BoundComponent {
    bind = ['click'];
    click() {
        open(this.props.href);
    }
    render({ children }) {
        let { click } = this.binds();
        return <span onClick={ click }>{ children }</span>;
    }
}

render(
    <Link href="http://example.com">Click Me</Link>,
    document.body
);
```

As possibilidades são sem fim. Aqui, uma class `Componente` que suporta _mixins_ rudimentares:


```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Nota:** Vale a pena atentar-se de que a herança pode te prender em relacões _parent-child_ frágeis. Frequentemente quando encontra-se uma tarefa que pode ser resolvida com herança há uma maneira mais funcional de alcançar o mesmo objetivo que evitaria a criação de tal relacionamento.
