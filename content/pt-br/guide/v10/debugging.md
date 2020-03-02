---
name: Depurando Preact Apps
description: 'Como debugar aplicativos preact quando algo der errado.'
---

# Depurando Preact Apps

O Preact é fornecido com muitas ferramentas para facilitar a depuração. Eles são empacotados em uma única importação e podem ser incluídos importando `preact / debug`.

Isso inclui uma ponte para a excelente [Preact Devtools] Extenção para o  Chrome e Firefox. Se você já os tiver instalado, pode **experimentá-lo neste site.** Basta abrir os devtools e começar a inspecionar como o construímos.

imprimiremos um aviso ou erro sempre que detectarmos algo errado, como aninhamento incorreto nos elementos `<table>`.

---

<toc></toc>

---

## Intalação

O [Preact Devtools] pode ser instalado no loja de extensões do seu navegador.

- [Para o Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [Para o Firefox](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)
- [Para o Edge](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

Uma vez instalado, precisamos importar o `preact / debug` em algum lugar para inicializar a conexão com a extensão. Verifique se essa importação é **a primeira** importação em todo o aplicativo.

> O `preact-cli` inclui o pacote `preact/debug` automaticamente. Você pode pular com segurança o próximo passo se estiver usando!

Aqui está um exemplo de como pode ser o arquivo de entrada principal do seu aplicativo.

```jsx
// Deve ser o primeiro import
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Remover devtools em produção

A maioria dos bundlers permite remover o código quando eles detectam que um ramo dentro de uma instrução `if` nunca será atingido. Podemos usar isso para incluir apenas `preact/debug` durante o desenvolvimento e salvar esses bytes preciosos em uma applição em produção.

```jsx
// Deve ser o primeiro import
if (process.env.NODE_ENV==='development') {
  // Deve ser obrigatório o uso aqui, pois as instruções de importação são permitidas apenas
  // existe na parte superior de um arquivo.
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

Certifique-se de definir a variável NODE_ENV no valor correto na sua ferramenta de build.

## Avisos e erros de depuração

Às vezes, você pode receber avisos ou erros sempre que o Preact detectar código inválido. Tudo isso deve ser corrigido para garantir que seu aplicativo funcione perfeitamente.

### `undefined` passado para `render ()`

Isso significa que o código está tentando transformar seu aplicativo em nada, em vez de em um nó DOM. É a diferença entre:

```jsx
// O que o Preact recebeu
render(<App />, undefined);

// vs o que esperava
render(<App />, actualDomNode);
```

A principal razão pela qual esse erro ocorre é que o nó DOM não está presente quando a função `render ()` é chamada. Verifique se existe.

### componente `undefined` passado para `createElement ()`

Preact lançará esse erro sempre que você passar `indefinido` em vez de um componente. A causa comum para esta é misturar as exportações `default` e `named`.

```jsx
// app.js
export default function App() {
  return <div>Olá Mundo</div>;
}

// index.js: Errado, porque `app.js` não possui uma exportação nomeada
import { App } from './app';
render(<App />, dom);
```

O mesmo erro será gerado quando for o contrário. Quando você declara uma exportação `nomeada` e está tentando usá-la como uma exportação `padrão`. Uma maneira rápida de verificar isso (caso o seu editor ainda não o faça) é apenas desconectar a importação:

```jsx
// app.js
export function App() {
  return <div>Olá Mundo</div>;
}

// index.js
import App from './app';

console.log(App);
// Logs: { default: [Function] } em vez do componente
```

### Passou um literal JSX como JSX duas vezes

Passar um JSX-Literal ou Componente para JSX novamente é inválido e acionará esse erro.

```jsx
const Foo = <div>foo</div>;
// Inválido: Foo já contém um elemento JSX
render(<Foo />, dom);
```

Para consertar isso, podemos apenas passar a variável diretamente:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Aninhamento inadequado da tabela detectado

O HTML tem instruções muito claras sobre como as tabelas devem ser estruturadas. Desviar-se disso levará à renderização de erros muito difíceis de depurar. No Preact, detectaremos isso e imprimiremos um erro. Para saber mais sobre como as tabelas devem ser estruturadas, é altamente recomendável [a documentação da mdn](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)

### Propriedade `ref` inválida

Quando a propriedade `ref` contiver algo inesperado, lançaremos este erro. Isso inclui `refs` baseados em string que foram descontinuado há um tempo atrás.

```jsx
// válido
<div ref={e => {/* ... */)}} />

// válido
const ref = createRef();
<div ref={ref} />

// Inválido
<div ref="ref" />
```

### Manipulador de eventos inválido

Às vezes, você acidentalmente pode passar um valor errado para um manipulador de eventos. Elas devem sempre ser uma `função` ou `null` se você deseja removê-la. Todos os outros tipos são inválidos.

```jsx
// válido
<div onClick={() => console.log("click")} />

// inválido
<div onClick={console.log("click")} />
```

### Hook pode ser invocado apenas a partir de métodos de renderização

Este erro ocorre quando você tenta usar um hook fora de um componente. Eles são suportados apenas dentro de um componente de função.

```jsx
// Inválido, deve ser usado dentro de um componente
const [value, setValue] = useState(0);

// válido
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</div>;
}
```

### Obtendo `vnode.[property]` está descontinuada

Com o Preact X, fizemos algumas mudanças no formato interno do 'vnode'.

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### Encontrou filhos com a mesmas chaves

Um aspecto exclusivo das bibliotecas baseadas no dom virtual é que elas precisam detectar quando filhos são movidas. No entanto, para saber qual filho é qual, precisamos sinalizá-lo de alguma forma. _Isso é necessário apenas quando você cria filhos dinamicamente._

```jsx
// Ambos os filhos terão a mesma chave "A"
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

A maneira correta de fazer isso é fornecendo chaves exclusivas. Na maioria dos casos, os dados sobre os quais você está interagindo terão alguma forma de `id '.

```jsx
const pessoas = [
  { nome: 'John', idade: 22 },
  { nome: 'Sarah', idade: 24}
];

// Em algum momento mais tarde no seu componente
<div>
  {pessoas.map(({ nome, idade }) => {
    return <p key={nome}>{nome}, Idade: {idade}</p>;
  })}
</div>
```

[Preact Devtools]: https://preactjs.github.io/preact-devtools/
