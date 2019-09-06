---
name: Componentes
descriptions: 'Os componentes são o coração de qualquer aplicativo Preact. Aprenda a criá-los e usá-los para compor UIs juntos'
---

# Componentes

Os componentes representam o componente básico do Preact. Eles são fundamentais para facilitar a criação de UIs complexas a partir de pequenos blocos de construção. Eles também são responsáveis ​​por anexar o estado à nossa saída renderizada.

Existem dois tipos de componentes no Preact, sobre os quais falaremos neste guia.
---

<toc></toc>

---

## Componente Funcional

Componentes funcionais são funções simples que recebem `props` como o primeiro argumento. O nome da função **deve** começar com uma letra maiúscula para que funcionem em JSX.

```jsx
function MyComponent(props) {
  return <div>My name is {props.name}.</div>;
}

// Uso
const App = <MyComponent name="John Doe" />;

// Renders: <div>Meu nome é John Doe.</div>
render(App, document.body);
```

> Observe nas versões anteriores que eles eram conhecidos como `"Componentes sem estado"`.Isso não se aplica mais com o[hooks-addon](/guide/v10/hooks).

##  Componentes de classe

Os componentes de classe podem ter métodos de estado e ciclo de vida. Os últimos são métodos especiais, que serão chamados quando um componente for anexado ao DOM ou destruído, por exemplo.

Aqui temos um componente de classe simples chamado `<Clock>` que exibe a hora atual

```js
class Clock extends Component {
  state = { time: Date.now() }

  // Ciclo de vida: chamado sempre que nosso componente é criado
  componentDidMount() {
    // hora de atualização a cada segundo
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Ciclo de vida: Chamado imediatamente antes do nosso componente ser destruído
  componentWillUnmount() {
    // pare quando não for renderizável
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
```

### Métodos do ciclo de vida


Para que a hora do relógio seja atualizada a cada segundo, precisamos saber quando`<Clock>` é montado no DOM. _Se você usou elementos personalizados em HTML5, isso é semelhante ao `attachedCallback` and `detachedCallback` métodos de ciclo de vida._  Preact chama os seguintes métodos de ciclo de vida se eles estiverem definidos para um Componente:
| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | (descontinuado) antes que o componente seja montado no DOM    |
| `componentDidMount`         | depois que o componente é montado no DOM     |
| `componentWillUnmount`      | antes da remoção do DOM                    |
| `componentWillReceiveProps` | (descontinuado) antes que novos adereços sejam aceitos                    |
| `getDerivedStateFromProps` | logo antes `shouldComponentUpdate`. Use com cuidado. |
| `shouldComponentUpdate`     | antes `render()`. Retorna `false` para pular o render |
| `componentWillUpdate`       | (deprecated) antes `render()`                                |
| `getSnapshotBeforeUpdate` |chamado apenas antes `render()` |
| `componentDidUpdate`        | depois de `render()`                                 |

> Vejá [this diagram](https://twitter.com/dan_abramov/status/981712092611989509) para obter uma visão geral visual de como eles se relacionam.

#### componentDidCatch

Existe um método de ciclo de vida que merece um reconhecimento especial e que é`componentDidCatch`. 

É especial porque permite que você lide com os erros que ocorrem durante a renderização. Isso inclui erros que ocorreram em um gancho do ciclo de vida, mas exclui quaisquer erros lançados de forma assíncrona, como após uma chamada `fetch ()`.

Quando um erro é detectado, podemos usar esse ciclo de vida para reagir a qualquer erro e exibir uma boa mensagem de erro ou qualquer outro conteúdo de fallback.

```jsx
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Algo deu muito errado</p>;
    }
    return props.children;
  }
}
```

## Fragmentos

Um `Fragment` permite retornar vários elementos ao mesmo tempo. Eles resolvem a limitação do JSX, onde cada "bloco" deve ter um único elemento raiz. Você geralmente os encontra em combinação com listas, tabelas ou com CSS flexbox, onde qualquer elemento intermediário afetaria o estilo.

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
// Renders:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```
Observe que a maioria dos transpilers modernos permite que você use uma sintaxe mais curta para `Fragment`. O menor é muito mais comum e é o que você normalmente encontra.

```jsx
// This:
const Foo = <Fragment>foo</Fragment>;
// ...is the same as this:
const Bar = <>foo</>;
```

Você também pode retornar matrizes de seus componentes:

```js
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```

Não se esqueça de adicionar chaves aos `Fragments` se você as criar em um loop:m seus componentes:

```js
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without a key, Preact has to guess which items have
        // changed when re-rendering.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
