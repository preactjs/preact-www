---
name: Mutações Externas de DOM
permalink: '/guide/external-dom-mutations'
---

# Mutações Externas de DOM


## Visão Geral

Algumas vezes há a necessidade de trabalhar com bibliotecas _third-party_ que esperam liberdade para mudar livremente o DOM, persistir estado nele ou que não tem qualquer tipo de limites de componentes. Há diversos _toolkits_ de UI ou elementos reutilizáveis que operam dessa maneira. No Preact (e similarmente no React) trabalhar com esse tipo de bibliotecas requer que você diga ao algoritmo de renderização/_diff_ do Virtual DOM de que ele não deve tentar desfazer tais mudanças externas ao DOM realizadas dentro de um Componente (ou o elemento DOM que ele representa).

## Técnica

Isso pode resolvido simplesmente com a definição de um `shouldComponentUpdate` no seu `Component` que retornara `false`;

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... ou, simplificado:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Com esse gancho no _lifecycle_ adicionado, dizendo ao Preact para não re-renderizar o Componente quando as mudanças ocorrerem na árvore VDOM, teu componente tem agora uma referencia para seu próprio elemento DOM raiz que pode ser tratado como estático até que o componente seja desmontado. Como qualquer componente, essa referência é chamada simplesmente `this.base`, e corresponde ao elemento JSX raiz que foi retornado do `render()`.

---

## Guia Exemplo

Aqui está um exemplo para "desligar" a re-renderização de com Componente. Note que `render()` ainda é invocado com parte da criação e montagem do Componente, de modo a gerar sua estrutura geral DOM.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // não renderize via diff:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // você pode fazer algo com as props aqui, se precisar.
  }

  componentDidMount() {
    // agora montado, você pode livremente modificar o DOM.
    let thing = document.createElement('talvez-um-elemento-customizado');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // componente está perto de ser removido do DOM, faça qualquer limpeza.
  }

  render() {
    return <div class="exemplo" />;
  }
}
```


## Demonstração

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


[**Veja esse demo no Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Exemplos do Mundo-Real

Alternativamente, veja essa técnica em ação em [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - usa um componente âncora no DOM, mas então desabilita as atualizações e deixa que [tags-input](https://github.com/developit/tags-input) tome controle a partir daí.
Um exemplo mais complexo seria [preact-richtextarea](https://github.com/developit/preact-richtextarea), que usa essa técnica para evitar a re-renderização de um `<iframe>` editável.
