---
name: Tutorial
description: 'Escreva seu primeiro aplicativo Preact'
---

# Tutorial

Este guia mostra a construção de um simples componente "relógio". Informações mais detalhadas sobre cada tópico podem ser encontradas nas páginas dedicadas no menu Guia.

> :information_desk_person: Este guia pressupõe que você tenha concluído o documento [Introdução](/guide/v10/getting-started)  e que tenha configurado com êxito as ferramentas. Caso contrário, comece com [preact-cli](/guide/v10/getting-started#best-practices-powered-with-preact-cli).

---

<div><toc></toc></div>

---

## Olá Mundo

logo de inicio, as duas funções que você sempre verá em qualquer base de código Preact são `h ()` e `render ()`. A função `h ()` é usada para transformar JSX em uma estrutura que o Preact entende. Mas também pode ser usado diretamente sem nenhum JSX envolvido:

```jsx
// com JSX
const App = <h1>Olá mundo!</h1>;

// ...o mesmo sem JSX
const App = h('h1', null, 'Olá Mundo');
```

Isso por si só não faz nada e precisamos de uma maneira de injetar nosso aplicativo Hello-World no DOM. Para isso, usamos a função `render ()`.

```jsx
const App = <h1>Olá mundo!</h1>;

// Injete nosso aplicativo no DOM
render(App, document.body);
```

Parabéns, você criou seu primeiro aplicativo Preact!

## Olá mundo interativo

A renderização de texto é um começo, mas queremos tornar nosso aplicativo um pouco mais interativo. Queremos atualizá-lo quando os dados forem alterados. : star2:

Nosso objetivo final é que tenhamos um aplicativo em que o usuário possa inserir um nome e exibi-lo quando o formulário for enviado. Para isso, precisamos ter algo em que possamos armazenar o que enviamos. É aqui que os [Componentes](/guide/v10/components) entram em cena.

Então, vamos transformar nosso aplicativo existente em um [Componente](/guide/v10/components):

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Olá mundo!</h1>;
  }
}

render(<App />, document.body);
```

Você notará que adicionamos uma nova importação de `Component` na parte superior e que transformamos `App` em uma classe. Isso por si só não é útil, mas é o precursor do que faremos a seguir. Para tornar as coisas um pouco mais emocionantes, adicionaremos um formulário com uma entrada de texto e um botão de envio.

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Olá, Mundo!</h1>
        <form>
          <input type="text" />
          <button type="submit">Atualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

Agora estamos a falar! Está começando a parecer um aplicativo real! Ainda precisamos torná-lo interativo. Lembre-se de que queremos alterar `" Olá mundo! "` Para `" Olá, [userinput]! "`, Portanto precisamos de uma maneira de conhecer o valor atual da entrada.

Nós o armazenaremos em uma propriedade especial chamada `state 'do nosso Component. É especial, porque quando é atualizado através do método setState`, o Preact não apenas atualiza o estado, mas também agenda uma solicitação de renderização para este componente. Depois que a solicitação for tratada, nosso componente será renderizado novamente com o estado atualizado.

Por fim, precisamos anexar o novo estado à nossa entrada, definindo `value` e anexando um manipulador de eventos ao evento `input`.

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  // Inicialize nosso estado. Por enquanto, apenas armazenamos o valor de entrada
  state = { value: '' }

  onInput = ev => {
    // Isso agendará uma atualização de estado. Uma vez atualizado o componente
     // será automaticamente renderizado automaticamente.
    this.setState({ value: ev.target.value });
  }

  render() {
    return (
      <div>
        <h1>Olá, Mundo!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Atualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

Nesse momento, o aplicativo não deveria ter mudado muito do ponto de vista dos usuários, mas reuniremos todas as peças na próxima etapa.

Bem, adicione um manipulador ao evento `submit` do nosso `<form>`da mesma maneira que fizemos na entrada. A diferença é que ele escreve em uma propriedade diferente do nosso `state` chamado `name`. Então trocamos nosso cabeçalho e inserimos nosso valor `state.name` lá.

```jsx
import { h, render, Component } from 'preact';

class App extends Component {
  // Adicione `nome` ao estado inicial
  state = { value: '', name: 'world' }

  onInput = ev => {
    this.setState({ value: ev.target.value });
  }

  // Adicione um manipulador de envio que atualize o `name` com o valor de entrada mais recente
  onSubmit = ev => {
    ev.preventDefault();
    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Atualizar</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.body);
```

Estrondo! Foram realizadas! Agora podemos inserir um nome personalizado, clicar em "Atualizar" e nosso novo nome aparece em nosso cabeçalho.

## Um componente de relógio

Nós escrevemos nosso primeiro componente, então vamos praticar um pouco mais. Desta vez, construímos um relógio.

```jsx
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.body);
```

Ok, isso foi fácil! O problema é que o tempo não muda. Está congelado no momento em que renderizamos nosso componente de relógio.

Portanto, queremos que o cronômetro de 1 segundo seja iniciado assim que o componente for adicionado ao DOM e pare se for removido. Criaremos o timer e armazenaremos uma referência a ele em `componentDidMount`, e pararemos o timer em `componentWillUnmount`. Em cada marca de timer, atualizaremos o objeto `state 'do componente com um novo valor de tempo. Fazer isso renderiza automaticamente o componente.

```jsx
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

// Chamado sempre que nosso componente é criado
  componentDidMount() {
    // hora da atualização a cada segundo
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Chamado logo antes do nosso componente ser destruído
  componentWillUnmount() {
    // para quando não é renderizável
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.body);
```

E nós fizemos isso de novo! Agora temos [um relógio](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!
