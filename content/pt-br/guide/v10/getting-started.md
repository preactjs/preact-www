---
name: Começando
description: "Como começar com o Preact. Vamos aprender a configurar as ferramentas (se houver) e começar a escrever um aplicativo."
---

# Começando

Este guia ajuda você a começar a desenvolver aplicativos Preact. Existem três maneiras populares de fazer isso.

Se você está apenas começando, é altamente recomendável usar o [preact-cli](#best-practices-powered-with-preact-cli).

---

<div><toc></toc></div>

---

## Caminho sem ferramentas de construção

O Preact sempre foi prontamente empacotado para ser usado diretamente no navegador. Isso não requer nenhuma ferramenta de construção.

```js
import { h, Component, render } from 'https://unpkg.com/preact?module';

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
import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

// Inicialize htm com Preact
const html = htm.bind(h);

const app = html`<div>Olá mundo</div>`
render(app, document.getElementById('app'));
```

É uma maneira muito popular de escrever aplicativos Preact e é altamente recomendável verificar o arquivo [README][htm] da htm se você estiver interessado em seguir essa rota.

## Práticas recomendadas com `preact-cli`

O projeto `preact-cli` é uma solução pronta para agrupar aplicativos Preact com a configuração ideal de empacotador, melhor para aplicativos web modernos. Ele é construído em projetos de ferramentas padrão como `webpack`, `babel` e `postcss`. Por causa da simplicidade, é a maneira mais popular de usar o Preact entre nossos usuários.

Como o nome indica, `preact-cli` é uma ferramenta **c**ommand-**li** ne que pode ser executada no terminal da sua máquina. Instale-o globalmente executando:

```bash
npm install -g preact-cli
```

Depois disso, você terá um novo comando no seu terminal chamado `preact`. Com ele, você pode criar um novo aplicativo executando o seguinte comando:

```bash
preact create default my-project
```

O comando acima extrai o modelo de `preactjs-templates/default`, solicita algumas informações e gera o projeto em `./ my-project/`.

> Dica: Qualquer repositório do Github com uma pasta `template` pode ser usado como um modelo personalizado: `preact create <username> / <repository> <project-name>`


### Preparando-se para o desenvolvimento

Agora estamos prontos para iniciar nosso aplicativo. Para iniciar o servidor de desenvolvimento, execute o seguinte comando dentro da pasta do projeto recém-gerada (`my-project` neste exemplo):

```bash
# Vá para a pasta do projeto gerado
cd my-project/

# iniciar o servidor em dev
npm run dev
```

Depois que o servidor estiver ativo, você poderá acessar seu aplicativo no URL que foi impresso no console. Agora você está pronto para desenvolver seu aplicativo!

### Criando uma construção de produção

Chega um momento em que você precisa implantar seu aplicativo em algum lugar. A CLI é fornecida com um comando útil `build` que irá gerar uma compilação altamente otimizada

```bash
npm run build
```

Após a conclusão, você terá uma nova pasta `build /` que pode ser implantada diretamente em um servidor.

> Para obter uma lista completa de todos os comandos disponíveis, consulte a lista na documentação do preact-cli [README file](https://github.com/preactjs/preact-cli#cli-options).

Preact works out of the box with all of them. No changes needed!

## Integrando em um pipeline existente

Se você já possui um pipeline de ferramentas existente, é muito provável que isso inclua um bundler. As opções mais populares são [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) ou [parcel](https://parceljs.org/). Preact funciona imediatamente com todos eles. Não são necessárias alterações!

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

> **Nota:** se você estiver usando [Preact CLI], esses aliases são configurados automaticamente para você por padrão.

#### Alias no Webpack

Para criar um pseudônimo de qualquer pacote no Webpack, você precisa adicionar a seção `resolve.alias`
para sua configuração. Dependendo da configuração que você está usando, esta seção pode
já está presente, mas faltam os aliases para Preact.

```js
const config = {
   //...snip
  "resolve": {
    "alias": {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // 👈 Deve ficar abaixo de `test-utils`
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  }
}
```

#### Alias no Node

Quando estamos em um server Node.js nossos aliases do Webpack não funcionarão, isso pode ser visto em Next/...
aqui teremos que usar um alias no nosso `package.json` 

```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat",
  }
}
```

Agora o Node irá usar corretamente o Preact no lugar do REact.

#### Alias no Rollup

Para usar um alias com o Rollup, você precisará instalar [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
Esse plugin precisar ser colocado antes do [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    })
  ]
};
```

#### Alias no Parcel

O Parcel usa o arquivo `package.json` padrão para ler as opções de configuração em
uma chave `alias`.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Alias no Jest

Semelhante aos empacotadores, [Jest](https://jestjs.io/) permite reescrever os caminhos do módulo. A sintaxe é um pouco
diferente, por exemplo, Webpack, porque é baseado em regex. Adicione isso na configuração do jest:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime"
  }
}
```

#### Alias no Snowpack

Para configurar um alias com o [Snowpack](https://www.snowpack.dev/), você precisará adicionar um package import alias ao arquivo `snowpack.config.mjs`.

```js
// snowpack.config.mjs
export default {
  alias: {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime",
  }
}
```

## Configuração TypeScript + preact/compat

Seu projeto pode precisar de um suporte amplo para o ecossistema React. Para fazer sua aplicação compilar, é aconselhável desabilitar a checagem de tipos no seu 
`node_modules` e adicionar paths para os tipos, como no exemplo. Dessa maneira, seu alias irá funcionar corretamente quando 
as bibliotecas importarem o React.

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```

[htm]: https://github.com/developit/htm
[Preact CLI]: https://github.com/preactjs/preact-cli
