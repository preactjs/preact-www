---
name: Novidades do Preact X
description: 'Novos recursos e alterações no Preact X'
---

# Novidades do Preact X

O Preact X é um grande avanço do Preact 8.x. Repensamos todos os bits e bytes do nosso código e adicionamos uma infinidade de recursos importantes no processo. O mesmo vale para aprimoramentos de compatibilidade para oferecer suporte a mais bibliotecas de terceiros.

Em poucas palavras, o Preact X é o que sempre quisemos que fosse: Uma biblioteca pequena, rápida e cheia de recursos. E por falar em tamanho, você ficará feliz em saber que todos os novos recursos e renderização aprimorada se encaixam no mesmo tamanho de `8.x`!

---

<toc></toc>

---

## Fragmentos

Os fragmentos são um novo recurso importante do Preact X e uma das principais motivações para repensar a arquitetura do Preact. Eles são um tipo especial de componente que processa elementos filhos alinhados com seus pais, sem um elemento DOM de quebra automática. Além disso, eles permitem que você retorne vários nós do `render`.

[Documentação sobre Fragmentos →](/guide/v10/components#fragments)

```jsx
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

Todos desejamos que erros não ocorram em nossos aplicativos, mas às vezes acontecem. Com `componentDidCatch`, agora é possível capturar e manipular quaisquer erros que ocorram nos métodos do ciclo de vida como `render`, incluindo exceções na árvore de componentes. Isso pode ser usado para exibir mensagens de erro amigáveis ou gravar uma entrada de log em um serviço externo, caso algo dê errado.

[Documentação do ciclo de vida →](/guide/v10/components#componentdidcatch)

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

## Hooks

Os Hooks são uma nova maneira de facilitar a lógica de compartilhamento entre os componentes. Eles representam uma alternativa à API do componente baseado em classe existente. No Preact, eles vivem dentro de um addon que pode ser importado via `preact/hooks`

[Documentação dos Hooks →](/guide/v10/hooks)

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Icrementar</button>
    </div>
  );
}
```

## createContext

A API `createContext` é um verdadeiro sucessor de `getChildContext ()`. Enquanto o `getChildContext` é bom quando você tem certeza absoluta de nunca alterar um valor, ele se desfaz assim que um componente entre o provedor e o consumidor bloqueia uma atualização via `shouldComponentUpdate` quando retorna `false`. Com a nova API de contexto, esse problema agora é coisa do passado. É uma verdadeira solução pub / sub para fornecer atualizações no fundo da árvore.

[Documentação do createContext →](/guide/v10/context#createcontext)

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>Tema ativo: {theme}</div>}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
```

## Propriedades personalizadas do CSS

Às vezes, são as pequenas coisas que fazem uma enorme diferença. Com os recentes avanços no CSS, você pode aproveitar [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) para estilizar:

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## Compat vive no core

Embora estivéssemos sempre interessados em adicionar novos recursos e empurrar o Preact para a frente, o pacote `preact-compat` não recebeu tanto amor. Até o momento, ele vivia em um repositório separado, dificultando a coordenação de grandes alterações, abrangendo o Preact e a camada de compatibilidade. Ao mover compat no mesmo pacote que o próprio Preact, não há mais nada a ser instalado para usar as bibliotecas do ecossistema React.

A camada de compatibilidade agora é chamada de [preact/compat](/guide/v10/differences-to-react#features-exclusive-to-preactcompat) e aprendeu vários novos truques, como `forwardRef`, `memo` e inúmeras compatibilidade melhorias.

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## Muitas correções de compatibilidade

São muitos para listar, mas crescemos muito na frente da compatibilidade com as bibliotecas do ecossistema React. Especificamente, incluímos vários pacotes populares em nosso processo de teste para garantir que possamos garantir suporte total a eles.

Se você encontrou uma biblioteca que não funcionou bem com o Preact 8, tente novamente com o X. As chances são altas de que tudo funcione conforme o esperado;)
