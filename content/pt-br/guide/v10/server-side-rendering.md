---
name: Renderização no servidor
description: 'Renderize seu aplicativo Preact no servidor para mostrar o conteúdo aos usuários mais rapidamente.'
---

# Renderização no lado do servidor

A renderização no servidor (geralmente abreviada como "SSR") permite renderizar seu aplicativo em uma string HTML que pode ser enviada ao cliente para melhorar o tempo de carregamento. Fora isso, existem outros cenários, como testes, nos quais o SSR se mostra realmente útil.

> Nota: O SSR é ativado automaticamente com `preact-cli`: tada:
---

<div><toc></toc></div>

---

## Instalação

O renderizador do lado do servidor para o Preact reside em seu [próprio repositório](https://github.com/preactjs/preact-render-to-string/) e pode ser instalado através do seu gerenciador de pacotes de sua escolha:

```sh
npm install -S preact-render-to-string
```

Após a conclusão do comando acima, podemos começar a usá-lo imediatamente. A superfície da API é bastante pequena e pode ser melhor explicada por meio de um snippet simples:

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class="foo">content</div>;

console.log(render(App));
// <div class="foo">content</div>
```

## Renderização superficial

Para alguns propósitos, geralmente é preferível não renderizar a árvore inteira, mas apenas um nível. Para isso, temos um renderizador superficial que imprimirá os componentes filhos pelo nome, em vez de seu valor de retorno.

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## Modo bonito

Se você precisar obter a saída renderizada de uma maneira mais amigável para o ser humano, temos tudo o que você precisa! Ao passar a opção `pretty`, preservaremos os espaços em branco e indentaremos a saída conforme o esperado.

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(render(App, { pretty: true }));
// Logs:
// <div class="foo">
//   <div>foo</div>
// </div>
```

## JSX Mode

The JSX rendering mode is especially useful if you're doing any kind of snapshot testing. It renders the output as if it was written in JSX.

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App, { jsx: true }));
// Logs: <div data-foo={true} />
```
