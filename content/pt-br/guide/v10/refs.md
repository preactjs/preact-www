---
name: Referências
description: 'As referências podem ser usadas para acessar nós DOM brutos que o Preact renderizou'
---

# Referências

Sempre haverá cenários em que você precisa de uma referência direta ao elemento DOM ou componente que foi renderizado pelo Preact. As referências permitem que você faça exatamente isso.

Um caso de uso típico para medir o tamanho real de um nó DOM. Embora seja possível obter a referência à instância do componente via `ref`, geralmente não a recomendamos. Isso criará um acoplamento rígido entre um pai e um filho, o que quebra a composição do modelo de componentes. Na maioria dos casos, é mais natural passar apenas o retorno de chamada como suporte, em vez de tentar chamar o método de um componente de classe diretamente.

---

<div><toc></toc></div>

---

## `createRef`

A função `createRef` retornará um objeto simples com apenas uma propriedade: `current`. Sempre que o método `render` é chamado, o Preact atribui o nó ou componente DOM ao `atual`.

```jsx
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }

  render() {
    return <div ref={this.ref}>foo</div>
  }
}
```

## Refs de retorno de chamada

Outra maneira de obter a referência a um elemento pode ser feita passando um retorno de chamada de função. É um pouco mais para digitar, mas funciona de maneira semelhante ao `createRef`.

```jsx
class Foo extends Component {
  ref = null;
  setRef = (dom) => this.ref = dom;

  componentDidMount() {
    console.log(this.ref);
    // Logs: [HTMLDivElement]
  }

  render() {
    return <div ref={this.setRef}>foo</div>
  }
}
```

> Se o retorno de chamada ref for definido como uma função embutida, ele será chamado duas vezes. Uma vez com `null` e depois com a referência real. Este é um erro comum e a API `createRef` facilita um pouco, forçando o usuário a verificar se `ref.current` está definido.

## Reunindo tudo

Digamos que temos um cenário em que precisamos obter a referência a um nó DOM para medir sua largura e altura. Temos um componente simples no qual precisamos substituir os valores do espaço reservado pelos reais medidos.

```jsx
class Foo extends Component {
  // Queremos usar a largura real do nó DOM aqui
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return <div>largura: {width}, altura: {height}</div>;
  }
}
```

A medição só faz sentido depois que o método `render` for chamado e o componente estiver montado no DOM. Antes disso, o nó DOM não existia e não faria muito sentido tentar medi-lo.

```jsx
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // Por segurança: verifique se uma referência foi fornecida
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        Width: {width}, Height: {height}
      </div>
    );
  }
}
```

É isso aí! Agora, o componente sempre exibirá a largura e a altura quando montado.
