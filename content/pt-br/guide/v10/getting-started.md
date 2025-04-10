---
name: Começando
description: "Como começar com o Preact. Vamos aprender a configurar as ferramentas (se houver) e começar a escrever um aplicativo."
---

# Começando

Este guia ajuda você a começar a desenvolver aplicativos Preact. Existem três maneiras populares de fazer isso.

---

<div><toc></toc></div>

---

## Caminho sem ferramentas de construção

O Preact sempre foi prontamente empacotado para ser usado diretamente no navegador. Isso não requer nenhuma ferramenta de construção.

```js
import { h, Component, render } from 'https://esm.sh/preact';

// Crie seu aplicativo
const app = h('div', null, 'Olá Mundo!');

// Injete sua aplicação no elemento a com o id `app`.
// Certifique-se de que esse elemento exista no dom;)
render(app, document.getElementById('app'));
```

A única diferença é que você não pode usar JSX, porque o JSX precisa ser transpilado. Cobrimos você com uma alternativa na próxima seção. Então continue lendo.

### Alternativas ao JSX

Escrever chamadas brutas `h` ou `createElement` o tempo todo é muito menos divertido do que usar algo semelhante a JSX. O JSX tem a vantagem de parecer semelhante ao HTML, o que facilita o entendimento de muitos desenvolvedores em nossa experiência. Porém, requer uma etapa integrada, portanto, recomendamos uma alternativa chamada [htm].

Em poucas palavras, [htm] pode ser melhor descrito como: sintaxe semelhante a JSX em JavaScript comum, sem a necessidade de um transpiler. Em vez de usar uma sintaxe personalizada, ele se baseia em seqüências de modelos com tags nativas que foram adicionadas ao JavaScript há algum tempo.

```js
import { h, Component, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';

// Inicialize htm com Preact
const html = htm.bind(h);

const app = html`<div>Olá mundo</div>`
render(app, document.getElementById('app'));
```

É uma maneira muito popular de escrever aplicativos Preact e é altamente recomendável verificar o arquivo [README][htm] da htm se você estiver interessado em seguir essa rota.

## Integrando em um pipeline existente

Se você já possui um pipeline de ferramentas existente, é muito provável que isso inclua um bundler. As opções mais populares são [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) ou [parcel](https://parceljs.org/). Prreact funciona imediatamente com todos eles. Não são necessárias alterações!

### Configurando JSX

Para transpilar JSX, você precisa de um plug-in babel que o converta em código JavaScript válido. O que todos nós usamos é [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Depois de instalado, você precisa especificar a função para JSX que deve ser usada:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> [babeljs](https://babeljs.io/) tem uma das melhores documentações disponíveis. É altamente recomendável que você verifique se há questões relacionadas ao babel e como configurá-lo.

### Aliasing React para Preact

Em algum momento, você provavelmente desejará fazer uso do vasto ecossistema de reação. Bibliotecas e componentes originalmente escritos para o React funcionam perfeitamente com a nossa camada de compatibilidade. Para usá-lo, precisamos apontar todas as importações `react` e `react-dom` para o Preact. Esta etapa é chamada de alias.

#### Alias no webpack

Para criar um pseudônimo de qualquer pacote no webpack, você precisa adicionar a seção `resolve.alias`
para sua configuração. Dependendo da configuração que você está usando, esta seção pode
já está presente, mas faltam os aliases para Preact.

```js
const config = {
   //...snip
  "resolve": {
    "alias": {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
}
```

#### Aliasing no parcel

O Parcel usa o arquivo `package.json` padrão para ler as opções de configuração em
uma chave `alias '.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Aliasing no jest

Semelhante aos empacotadores, [jest](https://jestjs.io/) permite reescrever os caminhos do módulo. A sintaxe é um pouco
diferente, por exemplo, webpack, porque é baseado em regex. Adicione isto ao seu
configuração jest:

```json
{
  "moduleNameMapper": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  }
}
```

[htm]: https://github.com/developit/htm
