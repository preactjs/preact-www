---
name: 'Preact CLI: Pre-rendering'
permalink: '/cli/pre-rendering'
description: 'Automatically pre-render pages using Preact CLI.'
---

# Pre-rendering Pages

Preact CLI automatically "pre-renders" your pages to static HTML so they load fast.

When building for production, Preact CLI renders your components and saves the result as static HTML. This means visitors to your site immediately see the pre-rendered HTML version, even before any JavaScript has loaded.

> **⚠️ Important:** When pre-rendering, your module as components are executed in a Node.js environment, where most Web APIs are not available. To account for this, wrap that code in a check like `if (typeof window !== 'undefined')`.

## Multiple URLs and custom data

Out of the box only the homepage is pre-rendered. In order to pre-render additional URLs (routes), you'll want to add a `prerender-urls.json` file to your project. This file can also pass additional data as props to the `<App />` component for each URL.

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

### Dynamic pre-rendering

In addition to the `prerender-urls.json`, it's also possible to export the same information from a JavaScript file. This file will be executed by Preact CLI, and it can export a function that returns the prerender configuration.

To use dynamic pre-rendering configuration, you'll need to specify the JavaScript filename to Preact CLI:

`preact build --prerenderUrls ./prerender-urls.js`

The `prerender-urls.js` version of our prerender data looks like this:

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

#### Using pre-rendering values in your markup

The values provided during pre-rendering via any of the abovesaid methods can be used in the `template.html` file to be used in all generated `html` files. This can be used to provide values for meta tags or other useful data in the markup itself.
To consume the values use `htmlWebpackPlugin.options.CLI_DATA.preRenderData.<key>` in the markup.

```html
  <html>
    <head>
      <meta name="demo-keyword" content="<%= htmlWebpackPlugin.options.CLI_DATA.preRenderData.blah %>">
    </head>
  </html>
```

### Using an external data source

You can use Preact CLI's custom pre-rendering to integrate with an external data source like a CMS. To fetch pages from a CMS and generate static pre-rendered URLs for each, we can export an async function from our `prerender-urls.js` file:

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

## Consuming pre-render data

All pre-rendered pages include an inline script containing the pre-rendered data:

```html
<script type="__PREACT_CLI_DATA__">{
  "preRenderData": {
    "url": "/",
    "photo": "/assets/shiba.jpg"
  }
}</script>
```

You can access this in your code in order to "rehydrate" based on the pre-rendered data. This is particularly useful when using state management solutions like Redux or GraphQL. The JSON data will always contain a `"url"` key, which is useful for ensuring it's only used when hydrating the pre-rendered route.

> **💡 Tip:** When a visitor first navigates to your app, the markup will contain only pre-rendered data for that specific page to avoid unnecessary download size. When they navigate to another route via client-side navigation, there won't be inlined pre-render data for that page. To get the data, make a request to `/<new-route>/preact_prerender_data.json` to get the data that route. Preact CLI enables this by generating a `preact_prerender_data.json` file next to each pre-rendered page at build time.

### Using `@preact/prerender-data-provider`

To simplify usage of pre-render data in Preact CLI, we've created a wrapper library that does hydration and data fetching for you. It finds and parses the pre-rendered data from the inline script tag when rendered on a page with the matching URL, or fetches pre-render data if there's no inlined version when navigating on the client.

To get started, install the library from npm:

`npm i -D @preact/prerender-data-provider`

Now that you have the library, import and use it in your App component (`components/app.js`):

```jsx
import { Provider } from '@preact/prerender-data-provider';

export default class App extends Component {
  // ...
  render(props) {
    return (
      <Provider value={props}>
        // rest of your app here!
      </Provider>
    )
  }
}
```

Now your route components can use `prerender-data-provider` to access pre-render data:

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';

export default function MyRoute(props) {

  // You can disable auto fetching performed by this hook in the
  // following way: usePrerenderData(props, false);
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

Passing `false` as a second parameter to `usePrerenderData` will disable dynamic fetching of `preact_prerender_data.json`. In addition to the hook shown above, a `<PrerenderData>` variant is available with the same signature as the hook.
