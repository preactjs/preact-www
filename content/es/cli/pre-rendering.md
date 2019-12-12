---
name: 'Preact CLI: Pre-rendering'
permalink: '/cli/pre-rendering'
description: 'Pre-renderice automáticamente las páginas usando Preact CLI.'
---

# Pre-renderizando Páginas

Preact CLI "pre-renderiza" automáticamente sus páginas a HTML estático para que se carguen rápidamente.

Al construir para producción, Preact CLI procesa sus componentes y guarda el resultado como HTML estático. Esto significa que los visitantes del sitio ven inmediatamente la versión HTML previamente renderizada, incluso antes de que se haya cargado JavaScript.

> **⚠️ Importante:** Cuando pre-renderiza, sus módulos como componentes se ejecuta en un entorno Node.js, donde la mayoría de las API web no están disponibles. Para tomar en cuenta esto, envuelva el código en una validación como `if (typeof window !== 'undefined')`.

## Múltiples URL y datos personalizados

Como lista para usar, solo se presenta la página de inicio. Para pre-renderizar URL (rutas) adicionales, querrás agregar un archivo `prerender-urls.json` al proyecto. Este archivo también puede pasar datos adicionales como props al componente `<App />` para cada URL.

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

### Pre-renderizado dinámico

Además de `prerender-urls.json`, también es posible exportar la misma información desde un archivo JavaScript. Este archivo será ejecutado por Preact CLI, y puede exportar una función que devuelve la configuración previa.

Para usar la configuración de pre-renderizado dinámico, deberá especificar el nombre de archivo JavaScript para Preact CLI:

`preact build --prerenderUrls ./prerender-urls.js`

La versión `prerender-urls.js` de los datos de pre-renderizado se vería así:

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

### Usar una fuente de datos externa

Se puede utilizar el pre-renderizado personalizado de Preact CLI para integrarse con una fuente de datos externa como un CMS. Para obtener páginas de un CMS y generar URL estáticas pre-renderizadas para cada una, se puede exportar una función asíncrona desde el archivo `prerender-urls.js`:

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

## Consumir datos pre-renderizados

Todas las páginas pre-renderizadas incluyen un script en línea que contiene los datos pre-renderizados:

```html
<script type="__PREACT_CLI_DATA__">{
  "preRenderData": {
    "url": "/",
    "photo": "/assets/shiba.jpg"
  }
}</script>
```

Puede acceder a esto en el código para "rehidratar" en función de los datos pre-renderizados. Esto es particularmente útil cuando se usan soluciones de administración de estado como Redux o GraphQL. Los datos JSON siempre contendrán una clave `"url"`, que es útil para garantizar que solo se use al hidratar la ruta pre-renderizada.

> **💡 Tip:** Cuando un visitante navega por primera vez en la aplicación, el marcador contendrá solo datos pre-renderizados para esa página específica para evitar tamaño de descarga innecesario. Cuando se navega a otra ruta a través de la navegación del lado del cliente, no habrá datos pre-renderizados en línea para esa página. Para obtener los datos, solicitar a `/<new-route>/preact_prerender_data.json` para obtener los datos de esa ruta. Preact CLI permite esto al generar un archivo `preact_prerender_data.json` junto a cada página pre-renderizada en el momento de la compilación.

### Usando `@preact/prerender-data-provider`

Para simplificar el uso de los datos pre-renderizados en Preact CLI, se ha creado una librería de encapsulamiento que hace la hidratación y la obtención de datos. Esta encuentra y analiza los datos preprocesados de la etiqueta del script cuando se procesa en una página con la URL coincidente, o recupera datos preprocesados si no hay una versión en línea al navegar en el cliente.

Para iniciar, instale la librería como dependencia de desarrollo desde npm:

`npm i -D @preact/prerender-data-provider`

Ahora teniendo la librería, importarla y usarla en el componente de la aplicación (`components/app.js`):

```jsx
import { Provider } from '@preact/prerender-data-provider';

export default class App extends Component {
  // ...
  render(props) {
    return (
      <Provider value={props}>
        // resto de tu aplicación aquí!
      </Provider>
    )
  }
}
```

Ahora los componentes de ruta pueden usar `prerender-data-provider` para acceder a los datos de pre-renderizado:

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';

export default function MyRoute(props) {

  // Puede deshabilitar la recuperacion de datos automática realizada por este hook de la
  // siguiente forma: usePrerenderData (props, false);
  const [data, loading, error] = usePrerenderData(props);

  if (loading) return <h1>Loading...</h1>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      // usa los datos aquí
    </div>
  );
}
```

Pasar `false` como segundo parámetro a` usePrerenderData` deshabilitará la recuperacion de datos dinámica de `preact_prerender_data.json`. Además del hook que se muestra arriba, una variante `<PrerenderData>` está disponible con la misma firma que el hook.