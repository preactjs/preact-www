---
name: 'Preact CLI: Pré-renderização'
permalink: '/cli/pre-rendering'
description: 'Pré-renderize automaticamente as páginas usando Preact CLI.'
---

# Pré-renderização de paginas

O Preact-CLI "pré-renderiza" automaticamente suas páginas em HTML estático, para que sejam carregadas rapidamente.

Ao criar a versão para produção, o Preact CLI renderiza seus componentes e salva o resultado como HTML estático. Isso significa que os visitantes do seu site veem imediatamente a versão HTML pré-renderizada, mesmo antes do carregamento de qualquer JavaScript.

> **⚠️ Importante:** Ao pré-renderizar, seu módulo como componentes é executado em um ambiente Node.js., onde a maioria das APIs da Web não está disponível. Para explicar isso, envolva esse código em uma verificação como `if (typeof window! == 'undefined')`.

## Mutiplas URLs e dados personalizados

Por padrão, apenas a página inicial é pré-renderizada. Para pré-renderizar URLs (rotas) adicionais, você deve adicionar um arquivo `prerender-urls.json` ao seu projeto. Este arquivo também pode passar dados adicionais como props para o componente `<App />` para cada URL.

```json
[
  {
    "url": "/", // required
    "title": "All About Dogs",
    "breeds": ["Shiba", "Golden", "Husky"]
  },
  {
    "url": "/breeds/shiba", // required
    "title": "Shibas!",
    "photo": "/assets/shiba.jpg"
  }
]
```

### Pré-renderização dinâmica

Além do `prerender-urls.json`, também é possível exportar as mesmas informações de um arquivo JavaScript. Este arquivo será executado pelo Preact CLI e pode exportar uma função que retorna a configuração de pré-renderização.

Para usar a configuração dinâmica de pré-renderização, você precisará especificar o nome do arquivo JavaScript para Preact CLI:

`preact build --prerenderUrls./prerender-urls.js`

A versão `prerender-urls.js` dos nossos dados de pré-renderizador é assim:

```js
const breeds = ["Shiba", "Golden", "Husky"];

module.exports = function() {
  return [
    {
      url: "/",
      title: "All About Dogs",
      breeds
    },
    {
      url: "/breeds/shiba",
      title: "Shibas!",
      photo: "/assets/shiba.jpg",
      breeds
    }
  ];
};
```

### Usando uma fonte de dados externa

Você pode usar a pré-renderização personalizada do Preact CLI para integrar-se a uma fonte de dados externa como um CMS. Para buscar páginas de um CMS e gerar URLs pré-renderizados estáticos para cada um, podemos exportar uma função assíncrona do nosso arquivo `prerender-urls.js`:

```js
module.exports = async function() {
  const response = await fetch('https://cms.example.com/pages/');
  const pages = await response.json();
  return pages.map(page => ({
    url: page.url,
    title: page.title,
    meta: page.meta,
    data: page.data
  }));
};
```

## Consumindo dados de pré-renderização

Todas as páginas pré-renderizadas incluem um script embutido contendo os dados pré-renderizados:

```html
<script type="__PREACT_CLI_DATA__">{
  "preRenderData": {
    "url": "/",
    "photo": "/assets/shiba.jpg"
  }
}</script>
```

Você pode acessar isso no seu código para "reidratar" com base nos dados pré-renderizados. Isso é particularmente útil ao usar soluções de gerenciamento de estado como Redux ou GraphQL. Os dados JSON sempre conterão uma chave `" url "`, que é útil para garantir que seja usada apenas ao hidratar a rota pré-renderizada.

> **💡 Dica:** Quando um visitante acessa seu aplicativo pela primeira vez, a marcação contém apenas dados pré-renderizados para essa página específica, para evitar o tamanho desnecessário do download. Quando eles navegam para outra rota por meio da navegação do cliente, não haverá dados de pré-renderização inline para essa página. Para obter os dados, faça uma solicitação para `/<nova-rota>/preact_prerender_data.json` para obter os dados que serão roteados. O Preact CLI permite isso gerando um arquivo `preact_prerender_data.json` próximo a cada página pré-renderizada no tempo de construção.

### Utilizando `@preact/prerender-data-provider`

Para simplificar o uso de dados de pré-renderização no Preact CLI, criamos uma biblioteca de wrapper que faz a hidratação e a busca de dados para você. Ele localiza e analisa os dados pré-renderizados da tag de script embutido quando renderizados em uma página com o URL correspondente ou busca dados de pré-renderização se não houver uma versão embutida ao navegar no cliente.

Para começar, instale a biblioteca a partir do npm:

`npm i -D @preact/prerender-data-provider`

Agora que você possui a biblioteca, importe e use-a no seu componente App (`components/app.js`):

```jsx
import { Provider } from '@preact/prerender-data-provider';

export default class App extends Component {
  // ...
  render(props) {
    return (
      <Provider value={props}>
        // restante do seu aplicativo aqui!
      </Provider>
    )
  }
}
```

Agora, os componentes da sua rota podem usar `prerender-data-provider` para acessar dados de pré-renderização:

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';

export default function MyRoute(props) {

  // Você pode desativar a busca automática realizada por este hook
  // da seguinte maneira: usePrerenderData (props, false);
  const [data, loading, error] = usePrerenderData(props);

  if (loading) return <h1>Loading...</h1>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      // use data here
    </div>
  );
}
```

Passar `false` como um segundo parâmetro para `usePrerenderData` desabilitará a busca dinâmica de `preact_prerender_data.json`. Além do hool mostrado acima, uma variante `<PrerenderData>` está disponível com a mesma assinatura que o hool.
