---
title: Diferenças do React
description: Quais são as diferenças entre Preact e React. Este documento as descreve em detalhes
---

# Diferenças do React

O próprio Preact não tem a intenção de ser uma reimplementação do React. Há diferenças. Muitas dessas são triviais, ou podem ser completamente removidas utilizando [preact-compat], que é uma fina camada sobre o Preact que tenta conseguir 100% de compatibilidade com React.

Preact não tenta incluir cada pequeno recurso do React em razão manter-se **pequeno** e **focado** - de outro modo faria mais sentido simplesmente submeter otimizações para o projeto React, que já é atualmente uma _codebase_ muito complexa e bem arquitetada.

---

<toc></toc>

---

## Principais diferenças

A principal diferença ao comparar os aplicativos Preact e React é que não enviamos nosso próprio sistema de evento sintético. O Preact usa o `addEventlistener` nativo do navegador para manipulação de eventos internamente. Consulte [MDN's Event Reference] para obter uma lista completa dos manipuladores de eventos DOM.

Para nós, não faz sentido, pois o sistema de eventos do navegador suporta todos os recursos que precisamos. Uma implementação completa de eventos personalizados significaria mais sobrecarga de manutenção e uma maior área de superfície da API para nós.

A outra principal diferença é que seguimos um pouco mais de perto a especificação DOM. Um exemplo disso é que você pode usar `class` em vez de `className`.

## Compatibilidade de Versões

Para mbos Preact e [preact/compat], a compatibilidade da versão é medida em relação às versões principais _current_ e _previous_ do React. Quando novos recursos são anunciados pela equipe do React, eles podem ser adicionados ao núcleo do Preact, se fizer sentido, considerando os [Objetivos do projeto]. Este é um processo bastante democrático, em constante evolução por meio de discussões e decisões tomadas de forma aberta, usando questões e solicitações de recebimento.

> Assim, o site e a documentação refletem os React `0.16.x` e `15.x` ao discutir compatibilidade ou fazer comparações.

## Recursos exclusivos do Preact

O Preact na verdade adiciona alguns recursos convenientes inspirados no trabalho da comunidade (P) React:

### Argumentos em `Component.render ()`

Por conveniência, passamos `this.props` e `this.state` de um componente de classe para o `render ()`. Dê uma olhada neste componente que usa uma propriedade e uma propriedade de estado.

```jsx
//  Funciona em ambos Preact e React
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

No Preact, isto também pode ser escrito assim:

```jsx
// Funciona apenas no Preact
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

Ambos os trechos processam exatamente a mesma coisa. É apenas uma questão de preferência estilística.

### Nomes de atributo/propriedade HTML brutos

Com o Preact, seguimos mais de perto a especificação DOM suportada por todos os principais navegadores. Uma diferença importante é que você pode usar o
atributo `class` padrão em vez de `className`.

```jsx
// Isso:
<div class="foo" />

// ...é  o mesmo que:
<div className="foo" />
```

A maioria dos desenvolvedores do Preact prefere usar `class` porque é mais curto de escrever, mas ambos são suportados.

### Use `onInput` em vez de` onChange`

Por razões históricas, o React basicamente aliava `onChange` a `onInput`. O último é o nativo do DOM e suportado em todos os lugares. O evento `input` é o que você procura em quase todos os casos em que deseja ser notificado quando o controle do formulário é atualizado.

```jsx
// React
<input onChange={e => console.log(e.currentTarget.value)} />

// Preact
<input onInput={e => console.log(e.currentTarget.value)} />
```

Se você estiver usando [preact/compat], configuraremos esse alias para `onChange` e `onInput` globalmente semelhante ao React. Esse é um dos truques que usamos para garantir a máxima compatibilidade com o ecossistema React.

### JSX-Construtor

Essa ideia foi originalmente chamada [hiperscript] e tem valor muito além do ecossistema React, portanto o Preact promove o padrão original. ([Leia: por que `h ()`?](http://jasonformat.com/wtf-is-jsx)). Se você está olhando para a saída transpilada, é um pouco mais fácil de ler do que `React.createElement`.

```js
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// vs
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

Na maioria dos aplicativos Preact, você encontrará `h ()`, mas suportamos ambos no núcleo, portanto, não importa qual deles você usará.

### Nenhum contextTypes necessários

A API legada `Context` exige que os Componentes implementem `contextTypes` ou `childContextTypes` no React. Com Preact, não temos essa limitação e todos os componentes recebem todas as entradas do `context`, extraídas de `getChildContext ()`.

[Objetivos do projeto]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/getting-started#aliasing-react-to-preact
[MDN's Event Reference]: https://developer.mozilla.org/pt-BR/docs/Web/Events
