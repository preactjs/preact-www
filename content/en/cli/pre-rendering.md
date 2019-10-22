---
name: CLI's Pre rendering
permalink: '/cli/pre-rendering'
description: 'Preact CLI documentation for pre-rendering'
---

# Pre rendering pages

Preact CLI supports out of the box automatic pre-rendering of pages. By default the homepage is always pre-rendered by executing your code in a node environment.

You can give additional props and details and other URLs that you want to be pre-rendered in a js/json file as shown below.

> **⚠️ Important:** Since the same client side code is executed on node, please be aware that most of the DOM/Web APIs are not available for pre-rendering. If you're using one of those, please wrap them in an `if (x !== undefined)` block.

## Using a static JS/JSON file

By simply adding a `prerender-urls.json` at the root of your project you can give additional config for pre-rendering to Preact CLI.

```json
[
  {
    "url": "/", // required
    "title": "My webapp's homepage",
    "prop1": "foo",
    "prop2": "bar"
  },
  {
    "url": "/profile", // required
    "title": "My webapp's profile page",
    "prop1": "foo",
    "prop2": "bar"
  }
  ...
]
```

You can also export the same config from a `.js` file. However for using other file names/extensions use a `--prerenderUrls` flag. e.g. `preact build --prerenderUrls ./prerender-urls.js`.

```js
module.exports = () => {
  return [
    {
      'url': '/', // required
      'title': 'My webapp's homepage',
      'prop1': 'foo',
      'prop2': 'bar'
    },
    {
      'url': '/profile', // required
      'title': 'My webapp's profile page',
      'prop1': 'foo',
      'prop2': 'bar'
    }
    ...
  ];
};
```

### Pre-rendering with data from an external source

You can also configure your Preact CLI app to work with a CMS. In order to fetch details from a CMS and generate static webpage for the same you can wire up pre-rendering with an async function.

```js
module.exports = async () => {
  const result = await fetch('/url-ot-cms/');
  const data = await results.json();
  return data.pages.map(page => ({
    url: page.url,
    title: page.title,
    prop1: page.details.foo,
    prop2: page.details.bar
  }))
};
```

## Consuming Pre-rendering data

All the pre-rendered pages have an inline script tag with the pre-rendered data inside it.

e.g.

```html
<script type="__PREACT_CLI_DATA__"> {
  "preRenderData": {
    "url":"/",
    "seo": {
      "cover": "/assets/profile.jpg"
    }
  }
}
</script>
```

You can access this tag in your code to hydrate the data for a custom store like redux or graph QL.
This data will always have a `URL` key which you can use to ensure that the correct route is being hydrated.

> **💡 Tip:** When the user opens a Preact CLI app's page, the markup will only contain the pre-rendered data for that specific page to avoid unnecessary download size. Thus when user navigates to other pre-rendered routes via client side navigation, you'll need to do a fetch call for `/<new-route>/preact_prerender_data.json` to get the data for next route. Preact CLI enables this, by keeping a `preact_prerender_data.json` next to every pre-rendered page at the build time.

### Using `@preact/prerender-data-provider`

Preact CLI has a solution for you to do the pre-rendered data fetching for you automatically. This package will either give you the pre-rendered data from the inline script tag, or if the user has navigated to other route then it will perform a network fetch and get the pre-rendered data for the next page for you.

To use `@preact/prerender-data-provider`, take the following steps.

- `npm i -D @preact/prerender-data-provider`
- Add prerender-data-provider to you `app.js`

```jsx
import { Provider } from '@preact/prerender-data-provider';
...

export default class App extends Component {
  ...
  render(props) {
    return (
      <Provider value={props}>
        ...
      </Provider>
    )
  }
}
```

- in your route components use prerender-data-provider.

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';
const profileComponent = (props) => {
  
  // You can disable auto fetching performed by this hook in the
  // following way: usePrerenderData(props, false);
  const [data, isLoading, error] = usePrerenderData(props);

  if (isLoading) {
    return (<h1>Loading...</h1>);
  }

  if (error) {
    return (<h1>Loading...</h1>);
  }

  return (
    <div>
      // use data here
    </div>
  );
};
```

> **Note:** `@preact/prerender-data-provider` also comes with a render prop implementatation with the same function signature as hook, if in case your route component is a class and you cannot use a hook in it.
