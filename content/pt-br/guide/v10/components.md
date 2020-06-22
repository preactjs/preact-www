---
name: Componentes
descriptions: 'Componentes são o coração de qualquer aplicativo Preact. Aprenda a criá-los e usá-los para compor UIs juntos'
---

# Componentes

Os componentes representam o componente básico do Preact. Eles são fundamentais para facilitar a criação de UIs complexas a partir de pequenos blocos de construção. Eles também são responsáveis por anexar o estado à nossa saída renderizada.

Existem dois tipos de componentes no Preact, sobre os quais falaremos neste guia.

---

<div><toc></toc></div>

---

## Componentes Funcionais

Componentes funcionais são funções simples que recebem `props 'como o primeiro argumento. O nome da função **devem** começar com uma letra maiúscula para que funcionem em JSX.

```jsx
function MeuComponente(props) {
  return <div>Meu nome é {props.name}.</div>;
}

// Uso
const App = <MeuComponente name="John Doe" />;

// Renderiza: <div>Meu nome é John Doe.</div>
render(App, document.body);
```

> Note que nas versões anteriores eles eram conhecidos como "Stateless Components". Isso não se aplica mais com o [hooks-addon](/guide/v10/hooks).

## Componentes de classe

Os componentes de classe podem ter métodos de estado e ciclo de vida. Os últimos são métodos especiais, que serão chamados quando um componente for anexado ao DOM ou destruído, por exemplo.

Aqui temos um componente de classe simples chamado `<Clock>` que exibe a hora atual:

```jsx
class Clock extends Component {
  state = { time: Date.now() }

  // CicloDeVida: Chamado sempre que nosso componente é criado
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // CicloDeVida: Chamado antes de nosso componente ser destruído
  componentWillUnmount() {
    // para quando não é renderizável
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
```

### Métodos do ciclo de vida

Para que a hora do relógio seja atualizada a cada segundo, precisamos saber quando o `<Clock>` é montado no DOM. _Se você usou Elementos Customizados em HTML5, isso é semelhante aos métodos de ciclo de vida `attachCallback` e` detachedCallback`._ Preact chama os seguintes métodos de ciclo de vida se eles estiverem definidos para um Componente:

| Método do ciclo de vida     | Quando é chamado                                 |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | (descontinuado) antes que o componente seja montado no DOM     |
| `componentDidMount`         | depois que o componente é montado no DOM      |
| `componentWillUnmount`      | antes da remoção do DOM                    |
| `componentWillReceiveProps` | (descontinuado) antes que novos adereços sejam aceitos                    |
| `getDerivedStateFromProps`  | imediatamente antes de `shouldComponentUpdate`. Use com cuidado. |
| `shouldComponentUpdate`     | antes de `render ()`. Retorne `false 'para pular a renderização |
| `componentWillUpdate`       | (descontinuado) antes de `render ()`                                |
| `getSnapshotBeforeUpdate`   | chamado lo  go antes de `render ()` |
| `componentDidUpdate`        | chamado logo depois do  `render()`                                 |

> Veja [Esse diagrama](https://twitter.com/dan_abramov/status/981712092611989509) para obter uma visão geral visual de como eles se relacionam.

#### componentDidCatch

Há um método de ciclo de vida que merece um reconhecimento especial e é `componentDidCatch`. É especial porque permite que você lide com os erros que ocorrem durante a renderização. Isso inclui erros que ocorreram em um hook do ciclo de vida, mas exclui quaisquer erros lançados de forma assíncrona, como após uma chamada `fetch ()`.

Quando um erro é detectado, podemos usar esse ciclo de vida para reagir a qualquer erro e exibir uma boa mensagem de erro ou qualquer outro conteúdo de fallback.

```jsx
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Algo de errado aconteceu</p>;
    }
    return props.children;
  }
}
```

## Fragmentos

Um "Fragmento" permite retornar vários elementos ao mesmo tempo. Eles resolvem a limitação do JSX, onde cada "bloco" deve ter um único elemento raiz. Você geralmente os encontra em combinação com listas, tabelas ou com CSS flexbox, onde qualquer elemento intermediário afetaria o estilo.

```jsx
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Renderiza:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Observe que a maioria dos transpilers modernos permitem que você use uma sintaxe mais curta para `Fragmentos`. O menor é muito mais comum e é o que você normalmente encontra.

```jsx
// isto:
const Foo = <Fragment>foo</Fragment>;
// ...é o mesmo que:
const Bar = <>foo</>;
```

Você também pode retornar arrays de seus componentes:

```jsx
function Columns() {
  return [
    <td>Olá</td>,
    <td>Mundi</td>
  ];
}
```

Não se esqueça de adicionar chaves ao `Fragments` se você as criar em um loop:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sem uma chave, o Preact precisa adivinhar quais itens têm  de ser
        // alterado ao renderizar novamente.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
