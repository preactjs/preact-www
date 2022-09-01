---
name: CLI's Service worker
permalink: '/cli/service-workers'
description: 'Documentação Preact CLI'
---

# Trabalhando offline com o Preact CLI

O Preact CLI vem com o [workbox](https://developers.google.com/web/tools/workbox). Aproveita o plug-in [InjectManifest](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2) para obter e oferecer alta flexibilidade e mais controle sobre os casos de uso do service worker.

O Preact CLI fornece recursos offline para o javascript/css pré-criado e os dados pré-renderizados imediatamente.

> **Nota:** O Preact CLI busca solicitações de navegação com [Network first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache), o que significa que os usuários sempre verão novos conteúdos, a menos que estejam offline.


## Funcionalidade personalizada para seu service worker

Para fazer alterações na funcionalidade padrão do service worker

- Crie um arquivo `sw.js` na pasta `src`.
- Cole o seguinte trecho neste arquivo para obter a funcionalidade padrão.

```js
self.__precacheManifest = [].concat(self.__precacheManifest || []);

const isNav = event => event.request.mode === 'navigate';

/**
  * Adicionar isso antes do `precacheAndRoute` nos permite lidar com todos
  * as solicitações de navegação, mesmo que estejam no precache.
*/
workbox.routing.registerRoute(
  ({ event }) => isNav(event),
  new workbox.strategies.NetworkFirst({
    // esse cache é mergulhado em cada novo service worker implantado, portanto, não precisamos nos preocupar em limpar o cache.
    cacheName: workbox.core.cacheNames.precache,
    networkTimeoutSeconds: 5, // se você não começar a obter os cabeçalhos dentro de 5 segundos no cache.
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200], // apenas cache respostas válidas, não respostas opacas, por exemplo portal wifi.
      }),
    ],
  })
);

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.setCatchHandler(({ event }) => {
  if (isNav(event))
    return caches.match(workbox.precaching.getCacheKeyForURL('/index.html'));
  return Response.error();
});
```

- Faça alterações de acordo com suas necessidades

## Adicionando outras rotas ao cache de tempo de execução

Se você deseja adicionar outras rotas ou suas chamadas de API ao cache de tempo de execução, siga as etapas a seguir.

- Crie um arquivo `sw.js.` na sua pasta `src`.
- Adicione o seguinte código com suas respectivas configurações.

```js
workbox.routing.registerRoute(
  ({url, event}) => {
    return (url.pathname === '/special/url');
  },
  workbox.strategies.<networkOnly/cacheOnly/cacheFirst/staleWhileRevalidate>()
);
```

- Você pode configurar o trecho acima com `networkOnly` para garantir que `/special/url` nunca seja armazenado em cache no service worker.

> **Nota:** Qualquer código de roteamento personalizado deve ser colocado antes de `workbox.precaching.precacheAndRoute (self .__ precacheManifest, precacheOptions);`

## Usando outros módulos do workbox em seu service worker

Preact CLI importa [worbox-sw](https://developers.google.com/web/tools/workbox/modules/workbox-sw) em seu service worker, portanto, todos os módulos podem ser carregados sob demanda conforme você os usa.
Sinta-se à vontade para usar qualquer módulo do workbox e ele estará disponível no escopo global do service worker em tempo de execução.

por exemplo: Adicionando sincronização em segundo plano

Adicione o seguinte código na parte inferior do seu `sw.js`.

```js
const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Repetir por no máximo 24 horas (especificado em minutos)
});

workbox.routing.registerRoute(
  /\/api\/.*\/*.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
```
