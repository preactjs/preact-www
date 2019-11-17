---
name: Começando
permalink: '/cli/getting-started'
description: 'Introdução à documentação do Preact CLI'
---

# Instalação

Para iniciar o Preact CLI, instale-o em [npm](https://npmjs.com/package/preact-cli):

```shell
npm i -g preact-cli
```

Isso instala um comando global `preact`, que usaremos para configurar um novo projeto.

## Criação de projeto

### Modelos

Use um de nossos modelos oficiais para começar

- **Padrão**

Este modelo é um excelente ponto de partida para a maioria dos aplicativos. Ele vem com o `preact-router` e algumas rotas de amostra e faz a divisão de código baseada em rotas por padrão.

- **Simples**

Um modelo "básico", a partir de um aplicativo "Hello World". Se você deseja escolher suas próprias ferramentas ou já tem uma configuração em mente, esta é uma boa maneira de começar.

- **Material**

Este modelo vem pré-configurado com [preact-material-components](https://material.preactjs.com) e um pequeno aplicativo de exemplo para você começar com rapidez e facilidade.

- **Netlify CMS**

Deseja criar um blog? Não procure mais! Este modelo fornece um blog simples e elegante com o Preact que você pode editar usando o [Netlify CMS](https://www.netlifycms.org/).

Para começar com qualquer um desses modelos, execute `preact create` para criar um novo projeto com o seu modelo de escolha:

```sh
preact create <template-name> <app-name>
```

Agora que seu projeto está configurado, você pode `cd` no diretório recém-criado e iniciar um servidor de desenvolvimento:

```sh
cd <app-name>
npm start
```

Agora abra seu editor e comece a editar! Para a maioria dos modelos, o melhor lugar para começar é `src/index.js` ou `src/components/app/index.js`.

## Builds em produção

O comando `npm run build` compila uma compilação pronta para produção do seu aplicativo e coloca um diretório `build` na raiz do projeto.

As construções de produção podem ser ajustadas para atender às suas necessidades com uma série de sinalizadores. Encontre a lista completa de sinalizadores [Aqui](https://github.com/preactjs/preact-cli#preact-build).

**Exemplo de uso:**

por exemplo.

Isso irá gerar o recurso json do webpack, que pode ser usado em um webpack [analyzer](https://chrisbateman.github.io/webpack-visualizer/).

```sh
preact build --json
```

## Edição de index.html

Se você deseja adicionar ou editar a marcação gerada pelo `preact-cli` para adicionar metatags, scripts personalizados ou fontes, você pode editar o `src/template.html`:

Isso é gerado pelo `preact-cli` v3.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><% preact.title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <% preact.headEnd %>
  </head>
  <body>
    <% preact.bodyEnd %>
  </body>
</html>
```

> **Nota:** se você estiver atualizando de uma versão antiga, poderá criar um `src/template.html` e ele será usado na próxima vez que você criar o aplicativo ou iniciar o servidor de desenvolvimento.
