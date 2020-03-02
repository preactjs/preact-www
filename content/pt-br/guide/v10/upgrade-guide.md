---
name: Atualizando do Preact 8.x
description: 'Atualize seu aplicativo Preact 8.x para o Preact X'
---

# Atualizando do Preact 8.x

Este documento tem como objetivo guiá-lo na atualização de um aplicativo Preact 8.x existente para o Preact X e está dividido em 3 seções principais

O Preact X traz muitos novos recursos interessantes, como `Fragments`,` hooks 'e uma compatibilidade muito melhorada com o ecossistema React. Tentamos manter as alterações mais recentes possíveis, mas não conseguimos eliminá-las completamente sem comprometer nosso conjunto de recursos.

---

<toc></toc>

---

## Atualizando dependências

_Nota: Neste guia, usaremos o cliente `npm` e os comandos devem ser facilmente aplicáveis a outros gerenciadores de pacotes, como o `yarn`._

Vamos começar! Primeiro instale o Preact X:

```bash
npm install preact
```

Como compat mudou para o core, não há mais necessidade de `preact-compat`. Remova-o com:

```bash
npm remove preact-compat
```

### Atualizando bibliotecas relacionadas ao Preact

Para garantir um ecossistema estável para nossos usuários (especialmente para usuários corporativos), lançamos grandes atualizações de versão nas bibliotecas relacionadas ao Preact X. Se você estiver usando o `preact-render-to-string`, precisará atualizá-lo para a versão que funciona com o X.

| Bibliotecas               | Preact 8.x | Preact X |
| ------------------------- | ---------- | -------- |
| `preact-render-to-string` | 4.x        | 5.x      |
| `preact-router`           | 2.x        | 3.x      |
| `preact-jsx-chai`         | 2.x        | 3.x      |
| `preact-markup`           | 1.x        | 2.x      |

### Compat mudou para o core

Para fazer com que as bibliotecas React de terceiros funcionem com o Preact, enviamos uma camada de **compatibilidade** que pode ser importada via `preact/compat`. Ele estava disponível anteriormente como um pacote separado, mas, para facilitar a coordenação, a transferimos para o repositório principal. Portanto, você precisará alterar as declarações de importação ou alias existentes de `preact-compat` para `preact/compat` (observe a barra).

Cuidado para não introduzir erros de ortografia aqui. Um comum parece ser escrever `compact 'em vez de` compat`.`Se você está tendo problemas com isso, pense em `compat` como a camada de `compatibilidade` para reagir. É daí que o nome vem.

> Se você estiver usando o `preact-cli`, esta etapa já será executada para você: tada:

### Bibliotecas de terceiros

Devido à natureza das alterações mais recentes, algumas bibliotecas existentes podem deixar de funcionar com o X. A maioria delas já foi atualizada após a programação beta, mas você pode encontrar uma onde esse não é o caso.

#### preact-redux

O `preact-redux` é uma dessas bibliotecas que ainda não foi atualizada. A boa notícia é que o `preact/compat` é muito mais compatível com o React e funciona imediatamente com as ligações do React chamadas `react-redux`. Mudar para ele resolverá a situação. Certifique-se de que você alias `react` e `react-dom` a `pré-execute/compat` no seu bundler.

1. Remova o `preact-redux`
2. Instale o `react-redux`

#### mobx-preact

Devido à nossa maior compatibilidade com o ecossistema react, este pacote não é mais necessário. Use `mobx-react` em seu lugar.

1. Remova o `mobx-preact`
2. Instale o `mobx-react`

#### componentes estilizados

O Preact 8.x funcionava apenas com `styled-components @ 3.x`. Com o Preact X, essa barreira não existe mais e trabalhamos com a versão mais recente do `styled-components`. Certifique-se de que você  [converteu react para preact](#setting-up-aliases) correctly. corretamente.

#### preact-portal

O componente `Portal` agora faz parte do `preact/compat`.

1. Remova o `preact-portal`
2. Importe `createPortal` de `preact/compat`

## Preparando seu código

### Usando exportações nomeadas

Para suportar melhor a trepidação de árvores, não enviamos mais uma exportação `padrão 'no núcleo de pré-ação. A vantagem dessa abordagem é que apenas o código necessário será incluído no seu pacote.

```js
// Preact 8.x
import Preact from "preact";

// Preact X
import * as preact from "preact";

// Preferencial: exportações nomeadas (funciona em 8.xe no Preact X)
import { h, Component } from "preact";
```

_Nota: Esta alteração não afeta o `preact/compat`. Ele ainda tem uma exportação nomeada e padrão para permanecer compatível com o react._

### `render ()` substitui um componente Preact existente

No Preact 8.x, `render ()` acrescenta um componente Preact quando `render ()` é repetido. No Preact X, `render ()` substitui um componente Preact existente quando `render ()` é repetido.

```jsx
render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact 8.x: <p>foo</p><p>bar</p>
// Preact 10: <p>bar</p>
```

### `props.children` nem sempre é um `array`

No Preact X, não podemos garantir que `props.children 'sempre seja do tipo` array'. Essa alteração foi necessária para resolver ambiguidades de análise em relação a `Fragmentos` e componentes que retornam um `array` de filhos. Na maioria dos casos, você pode nem perceber. Somente em lugares onde você usará métodos de array em `props.children` diretamente precisa ser envolvido com `toChildArray`. Esta função sempre retornará um array.

```jsx
// Preact 8.x
function Foo(props) {
  // `.length` é um método de matriz. No Preact X, quando `props.children` não é um
  // array, esta linha lançará uma exceção
  const count = props.children.length;
  return <div>Eu tenho {count} filhos </div>;
}

// Preact X
import { toChildArray } from "preact";

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>Eu tenho {count} filhos </div>;
}
```

### Não acesse `this.state` de forma síncrona

No Preact-X, o estado de um componente não será mais alterado de forma síncrona. Isto significa que a leitura de `this.state` logo após uma chamada `setState` retornará os valores anteriores. Em vez disso, você deve usar uma função de retorno de chamada para modificar o estado que depende dos valores anteriores.

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter++ });

// Preact X
this.setState(prevState => {
  // Como alternativa, retorne 'null` aqui para abortar a atualização do estado
  return { counter: prevState.counter++ };
});
```

_Nota: No momento, estamos investigando se podemos facilitar isso enviando um `LegacyComponent` com o comportamento antigo._

### `DangerouslySetInnerHTML` ignorará a diferença entre filhos

Quando um `vnode` possui a propriedade `dangerouslySetInnerHTML` set, o Preact ignora as diferenças dos filhos do `vnode`.

```jsx
<div dangerouslySetInnerHTML="foo">
  <span>Serei ignorado</span>
  <p>So do I</p>
</div>
```

## Notas para autores da biblioteca

Esta seção é destinada a autores de bibliotecas que estão mantendo pacotes a serem usados com o Preact X. Você pode pular esta seção com segurança se não estiver escrevendo um.

### O formato `VNode` mudou

Renomeamos/movemos as seguintes propriedades:

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

Por mais que tentássemos, sempre enfrentávamos casos extremos com bibliotecas de terceiros escritas para reagir. Esta mudança na forma do `vnode` removeu muitos bugs difíceis de detectar e torna nosso código `compat` muito mais limpo.

### Nós de texto adjacentes não são mais unidos

No Preact 8.x, tínhamos esse recurso em que juntávamos nós de texto adjacentes como uma otimização. Isso não se aplica mais ao X, porque não estamos mais nos diferenciando diretamente do dom. Na verdade, percebemos que isso prejudicava o desempenho no X, e é por isso que o removemos. Veja o seguinte exemplo:

```jsx
// Preact 8.x
console.log(<div>foo{"bar"}</div>);
// Registra uma estrutura como esta:
//   div
//     texto

// Preact X
console.log(<div>foo{"bar"}</div>);
// Registra uma estrutura como esta:
//   div
//     texto
//     texto
```
