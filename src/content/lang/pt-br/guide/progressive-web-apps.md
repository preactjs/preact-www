---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

## Visão Geral

Preact é uma excelente escolha para [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) que desejam carregar e tornarem-se interativos rapidamente.

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Carregue menos scripts</h3>
          </div>
          <p class="_summary">
            O [tamanho pequeno](/about/project-goals) do Preact é valioso quando você tem um planejamento restrito de performance. Em _hardware_ móvel mediano, carregar grandes quantidades de JS leva a um maior tempo de carregamento, interpretação e análise.
            Isso pode deixar usuários esperando por bastante tempo até que possam interagir com sua aplicação. Ao reduzir o código de bibliotecas nos seus _bundles_, você carrega mais rápido por enviar menos código aos seus usuários.
            </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Tempo mais veloz para interatividade</h3>
          </div>
          <p class="_summary">
            Se você busca ser [interativo em menos 5 segundos](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/), cada KB importa.
            [Trocar React pelo Preact](/guide/switching-to-preact) em seus projetos pode cortar múltiplos KB e permitir a você oferecer interatividade imediata.
            Isso é muito adequado para Progressive Web Apps que tentam remover o máximo de código possível para cada rota.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Uma peça de montar que funciona bem com o ecossistema React</h3>
          </div>
          <p class="_summary">
            Caso precise usar _[server-side rendering](https://facebook.github.io/react/docs/react-dom-server.html)_ do React pra mostrar pixels na tela o mais rápido possível
            ou usar [React Router](https://github.com/ReactTraining/react-router) para navegação, Preact funciona bem com muitas bibliotecas no ecossistema. </p>
        </div>
    </li>
</ol>

## Esse site é um PWA

Na verdade, o site que você está nesse exato momento é um Progressive Web App!. Aqui ele está oferencendo interação em menos de 5 segundos num _trace_ de um Nexus 5X no 3G:

<img src="../assets/pwa-guide/timeline.jpg" alt="Um trace da Timeline do DevTools do preactjs.com num Nexus 5X"/>

Conteúdo estático do site é guardado pela _Cache Storage API_ (do Service Worker), permitindo carregamento instantâneo numa visita repetida.


## Dicas de Performance

Mesmo o Preact devendo funcionar bem para seu PWA, ele também pode ser utilizado com uma gama de outras ferramentas e técnicas. Essas incluem:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">Code-splitting</a></strong> quebra seu código em pedacinhos para que o usuário receba só o que necessita para uma página. Utilizando _Lazy-loading_, carrega-se o resto quando necessário o que melhora o tempo de carregamento das páginas. Suportado via Webpack.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Caching via Service Worker</a></strong> permite que você faça _cache_ offline de conteúdo estático e dinâmico na sua aplicação, permitindo carregamento instantâneo e interatividade mais rápida em visitas repetidas. Utilize [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) ou [offline-plugin](https://github.com/NekR/offline-plugin) pra isso.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong>
          encoraja enviar ou pré-carregar _assets_ para o navegador, acelerando o tempo de carregamento das páginas seguintes. É criado a partir de _code-splitting_ e _SW caching_.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong>
          permite a você auditar a performance e melhores práticas do seu PWA pra que saiba quão bem seu app _performa_.</p>
        </div>
    </li>
</ol>
