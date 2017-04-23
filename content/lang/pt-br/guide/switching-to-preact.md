---
name: Mudando para Preact do React
permalink: '/guide/switching-to-preact
---

# Mudando para Preact (do React)

Há duas abordagens diferentes para mudar do React pro Preact:

1. Instalar o alias `preact-compact`
2. Mudar seus imports pra `preact` e remover código incompatível

## Fácil: `preact-compat` Alias

A mudança pra Preact pode ser tão fácil quanto instalar e criar o _alias_ `preact-compat` para `react` e `react-dom`.
Isso te permite continuar escrevendo código React/ReactDOM sem mudanças ao seu _workflow_ ou _codebase_.
`preact-compat` adiciona algo em torno de 2kb ao tamanho do seu _bundle_, mas tem a vantagem de suportar a vasta maioria
 dos módulos React existentes que você possa encontrar no npm. O pacote `preact-compat` provê todos os _tweaks_ necessários
 sobre o _core_ do Preact para fazê-lo funcionar do mesmo modo do `react` e `react-dom`, em um único módulo.

O processo pra instalação é de apenas dois passos.
Primeiro, você precisa instalar `preact` e `preact-compat` (eles são pacotes separados):

```sh
npm i -S preact preact-compat
```

Com tais dependências instaladas, configure seu sistema de _build_ para apontar imports de React para Preact.


### Como fazer o Alias do preact-compat

Agora que você tem suas dependências instaladas, você irá necessitar configurar seu sistema de _build_
para redirectionar qualquer import/require procurando por `react` ou `react-dom` para `preact-compat`;

#### Alias pelo Webpack

Simplesmente adicione o seguinte [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias) ao seu `webpack.config.js`:

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Aliasing pelo Browserify

Se você está usando Browserify, _aliases_ podem ser definidos adicionando o transform [aliasify](https://www.npmjs.com/package/aliasify).

Primeiro, instale o transform:  `npm i -D aliasify`
Então, em seu `package.json`, diga ao aliasify para redirectiona imports React para preact-compat:

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Fazendo Alias manualmnete

Se você não está utilizando um sistema de build ou quer permanentemente trocar para `preact-compat`,
você pode também utilizar _find & replace_ para substituir os _imports/requires_ na sua _codebase_ como um alias faz:

> **find:**    `(['"])react(-dom)?\1`
>
> **replace:** `$1preact-compat$1`

Neste caso, no entanto, pode ser interessante trocar diretamente para o próprio `preact`, ao invés de depender do `preact-compat`
O _core_ do Preact é cheio de _features_ e muitas _codebases_ idiomáticas em React podem, na verdade, serem transferidas diretamente para `preact` com pouco esforço.

Falaremos dessa abordagem na próxima seção.


### Build & Teste

**Pronto!**
Agora quando você rodar sua _build_, todos os seus _imports_ React estarão ao invés importante `preact-compat` e o seu _bundle_ será muito menor.
É sempre uma boa ideia rodar os seus testes e, claro, carregar sua aplicação para checar seu funcionamento.

---


## Ótima: Mudar para o Preact

Você não tem de usar `preact-compat` na sua própria codebase para migrar de React pra Preact.
A API do Preact é quase identica a do React, e muitas _codebases_ React podem ser migradas com poucas ou nenhuma mudanças sendo necessárias.

Geralmente, o processo de mudança involve alguns passos:

### 1. Instalar o Preact

Esta é simples: você precisará instalar a biblioteca pra utilizá-la!

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX Pragma: transpilar para `h()`

> **Background:** Enquanto a extensão de linguagem [JSX] é independente do React, transpiladores
> populares como [Babel] e [Bublé] padronizam a conversão para chamadas de `React.createElement()`
> Há razões históricas para isso, mas é válido entender que as chamadas de função que o JSX transpila
> para, na verdade são uma tecnologia pre-existente chamada [Hyperscript]. Preact presta homenagem
> a isso e tenta promover um melhor entendimento da simplicidade do JSX atraveś de utilização do `h()`
> como o seu [JSX Pragma].
>
> **TL;DR:** Precisamos mudar os `React.createElement()` para os `h()` do Preact

Em JSX, o "pragma" é o nome da função que administra a criação de cada elemento:

> `<div />` transpila para `h('div')`
>
> `<Foo />` transpila para `h(Foo)`
>
> `<a href="/">Olá</a>` para `h('a', { href:'/' }, 'Olá')`

Em cada exemplo acima, `h` é o nome da funçãp que declaramos como o JSX Pragma.

#### Via Babel
Se você está usando Babel, você pode definir o JSX Pragma o seu `.babelrc` ou `package.json` (qual você preferir):

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Via Commentários

Se você está trabalhando num editor online que utilizar Babel (como JSFiddle ou Codepen)
vocÊ pode definir o JSX Pragma através de um comentário perto do topo do seu código:

`/** @jsx h */`


#### Via Bublé

[Bublé] tem suporte a JSX por padrão. Apenas defina a opção `jsx`:

`buble({ jsx: 'h' })`


### 3. Atualize qualquer código legado

Enquanto Preact esforça-se para ser compatível com a API do React, porções da interface são intencionalmente não inclusas.
A mais notável delas é `createClass()`. Opniões divergem fortemente no assunto das classes e OOP, mas é válido entendermos
que classes JavaScript são internamente em bibliotecas VDOM apenas uma representacao dos tipos de Componentes, o que é
importante quando lida-se com as nuances do ciclo de vida dos Componentes.

Se sua codebase é altamente dependente de `createClass()`, você ainda tem uma boa opção:
Laurence Dorman mantém uma [implementação _standalone_ do `createClass()`](https://github.com/ld0rman/preact-classless-component) que funciona diretamente com Preact e tem apenas algumas centenas de bytes.
Alternativamente, você pode automaticamente converter suas chamadas `createClass()` pra classes ES6 utilizando [preact-codemod](https://github.com/vutran/preact-codemod) por Vu Tran.

Outra diferença a se notar é que o Preact só funciona _Function Refs_ como padrão. _String refs_ foram descontinuadas no React e serão removidas logo, visto que introduziam uma quantidade surpreendente de complexidade pra pouco ganho.
Se você deseja continuar usando _String refs_ [essa pequena função linkedRef](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)
oferece uma versão a-prova-de-futuro que ainda popula `this.refs.$$` como String Refs fazia.

A simplicidade desse pequeno wrapper em torno das _Function Refs_ também auxilia ilustrar o porque _Function Refs_ são a maneira recomendada daqui em diante.

### 4. Simplifique o Render raiz
Desde o React 0.13, `render()` é provido pelo módulo `react-dom`
Preact não usa módulos separados pra renderização de DOM, já que é focado somente em ser um bom renderizador DOM.
Então, o último passo pra converter sua codebase para Preact é trocar `ReactDOM.render()` para o `render()` do Preact:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Também é válido notar que o `render()` do Preact é não destrutivo, então renderizar em `<body>` é totalmente okay (até encorajado).
Isso é possível porque Preact não assume que tem total controle do elemento raiz que você passa. O segundo argumento de `render()`
que é na verdade o `parent` - o que significa que é um elemento DOM pra renderizar _em_. Se você gostaria de re-renderizar a partir da
raiz (talvez para Hot Module Replacement), `render()` aceita um elemento pra substituir como um terceiro argumento:

```js
// renderização inicial:
render(<App />, document.body);

// atualização no lugar:
render(<App />, document.body, document.body.lastElementChild);
```

No exemplo acima, estamos confiando em que a última _child_ seja nosso raiz previamente renderizado.
Enquanto isso funciona em muitos casos (jsfiddles, codepens, etc), é melhor ter mais controle.
É por isso que `render()` retorna o elemento raiz: você o passa como o terceiro argumento para re-renderizar no mesmo lugar.
O exemplo a seguir mostra como re-renderizar em resposta as atualizações do Hot Module Replacement do Webpack:

```js
// root contem o nosso elemento DOM raiz da aplicação:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// examplo: Re-renderizar a partir do Webpack HMR update:
if (module.hot) module.hot.accept('./app', init);
```
A técnica completa pode ser vista em [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
