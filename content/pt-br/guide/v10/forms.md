---
name: Formulários
description: 'Como criar formulários incríveis no Preact que funcionam em qualquer lugar.'
---

# Formulários

Os formulários no Preact funcionam da mesma forma que no HTML. Você processa um controle e anexa um ouvinte de evento a ele.

A principal diferença é que, na maioria dos casos, o `valor 'não é controlado pelo nó DOM, mas pelo Preact.

---

<div><toc></toc></div>

---

## Componentes controlados e não controlados

Ao falar sobre controles de formulário, você encontrará frequentemente as palavras "Componente controlado" e "Componente não controlado". A descrição refere-se à maneira como o fluxo de dados é tratado. O DOM possui um fluxo de dados bidirecional, porque todo controle de formulário gerenciará a entrada do usuário. Uma entrada de texto simples sempre atualiza seu valor quando um usuário digita nela.

Uma estrutura como Preact, em contraste, geralmente possui um fluxo de dados unidirecional. O componente não gerencia o valor em si, mas algo mais alto na árvore de componentes.


```jsx
// Não controlado, porque Preact não define o valor
<input onInput={myEventHandler} />;

// Controlado, porque Preact gerencia o valor da entrada agora
<input value={someValue} onInput={myEventHandler} />;
```

Geralmente, você deve tentar usar Componentes _Controlados_ o tempo todo. No entanto, ao criar componentes independentes ou agrupar bibliotecas de interface do usuário de terceiros, ainda pode ser útil simplesmente usar seu componente como um ponto de montagem para funcionalidades que não são de pré-execução. Nesses casos, os componentes "não controlados" são adequados para a tarefa.

> Um ponto a ser observado aqui é que definir o valor como `indefinido 'ou' nulo 'se tornará essencialmente descontrolado.


## Criando um formulário simples

Vamos criar um formulário simples para enviar itens de tarefas. Para isso, criamos um elemento `<form>` e vinculamos um manipulador de eventos que é chamado sempre que o formulário é enviado. Fazemos uma coisa semelhante para o campo de entrada de texto, mas observe que estamos armazenando o valor em nossa classe. Você adivinhou, estamos usando uma entrada _controlada_ aqui. Neste exemplo, é muito útil, porque precisamos exibir o valor da entrada em outro elemento.

```jsx
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Select Input

Um elemento `<select>` é um pouco mais envolvido, mas funciona de maneira semelhante a todos os outros controles de formulário:

```jsx
class MySelect extends Component {
  state = { value: '' };

  onInput = e => {
    this.setState({ value: e.target.value });
  }

  onSubmit = e => {
    alert("Submitted something");
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onInput={this.onInput}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Caixas de seleção e botões de opção

Caixas de seleção e botões de opção (`<input type="checkbox|radio">`) podem inicialmente causar confusão ao criar formulários controlados. Isso ocorre porque, em um ambiente não controlado, normalmente permitiríamos ao navegador "alternar" ou "marcar" uma caixa de seleção ou botão de opção, ouvindo um evento de mudança e reagindo ao novo valor. No entanto, essa técnica não faz a transição para uma visão do mundo em que a interface do usuário é sempre atualizada automaticamente em resposta a alterações de estado e suporte.

> **Passo a passo:** Digamos que ouvimos um evento de "alteração" em uma caixa de seleção, que é acionada quando a caixa de seleção é marcada ou desmarcada pelo usuário. Em nosso manipulador de eventos de alteração, definimos um valor em `state 'para o novo valor recebido da caixa de seleção. Fazer isso acionará uma nova renderização do nosso componente, que irá atribuir novamente o valor da caixa de seleção ao valor do estado. Isso é desnecessário, porque apenas pedimos um valor ao DOM, mas pedimos que ele renderizasse novamente com o valor que desejávamos.

Portanto, em vez de ouvir um evento `input`, devemos ouvir um evento `click`, que é disparado sempre que o usuário clica na caixa de seleção _ou um `<label>` _associado_. As caixas de seleção alternam entre booleano `true` e `false`; portanto, ao clicar na caixa de seleção ou no rótulo, apenas inverteremos qualquer valor que tenhamos no estado, acionando uma nova renderização, definindo o valor exibido da caixa de seleção para o desejado.

### Exemplo da caixa de seleção

```jsx
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
      </label>
    );
  }
}
```
