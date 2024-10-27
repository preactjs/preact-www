---
title: Simplifying Islands Architecture
date: 2024-10-27
authors:
  - reaper
---
 
# Islands

## Intro

This guide is a simple walkthrough to understand how island architechture works
and being able to setup your own using tools you already have around you.

First off, what are islands ? You can read more about it's origin from 

[Islands Architecture - Jason Miller &rarr;](https://jasonformat.com/islands-architecture/)

## Why ?

For a lot of devs who've worked with server rendering for a while, we kinda
expected frontend tech to take a turn towards server rendering at some point in
time since data fetching and processing is almost always faster on the server
where you are closer to the data.

Which is one of many reasons but then there's others that the entire web is
debating over, so we'll leave it to the smart people.

Let's move on to implementing the concept

# Getting Started

## Basic Implementation

The basic implementation can be generalized for most SSR + Client Hydration
apps.

Here's an overview

1. Intially render the view on the server as a static page.
2. Hydrate the app on client

To go into the details of each.

### Initial Server Render

In this step, you still build the component tree with whatever UI library you're
using, Vue, React, Preact, Solid, etc. And then flatten the component tree to
only have the static and immediately computable data. In this case, no
side-effects and state management based code is run.

The output is a static html document that you can send to the client.

Since this guide is tied to [preact](https://preactjs.com/), we're going to use
a library from the preact team that helps us achieve this.

Here's what a very rudimentary implementation of rendering a component on the
server would look like.

We're using `express.js` here as an example due to it being the first choice of
most beginners, the process is mostly same for any other web server engine you
pick up. Hapi, Koa, Fastify, etc.

```js
// server.js
import { h } from 'preact'
import preactRenderToString from 'preact-render-to-string'

// ...remainig express.js setup

const HomePage = () => {
  return h('h1', {}, 'hello')
}

app.get('/', async (req, res) => {
  res.send(preactRenderToString(h(HomePage, {})))
})
```

Here most work is done by `preactRenderToString` , and all we are doing is
writing components. With a little bit of bundling magic, we should be able to
write in JSX to make it a little more friendly to work with.

### Hydrate

Okay, so a term you'll see smart people use around a lot online.

- Partial Hydration
- Progressive Hydration
- add more as they find more such ways etc

To be put simply, it's to bind the interactivity to a DOM element with
_existing_ state/effects/events

This _existing_ state/effects/events might be sent from the server, but if
working with a component that can handle it's own and the logic is well
contained in it, you just mount the component on the DOM with the necessary
bindings.

As an example, this might looks a little something like this

```js
// client.js
import { hydrate } from 'preact'
import Counter from './Counter'

const main = () => {
  // assuming the server rendered the component with the following ID as well.
  const container = document.getElementById('counter')
  hydrate(h(Counter, {}), container)
}

main()
```

Similar to the server render phase, we use a helper from `preact` to help
hydrate a component. You could use `render` but then the actual element is
already something that was rendered by the server, rendering it again would make
no sense and so we just ask preact to try to add in the needed event and state
data instead

What I've explained above is called Partial Hydration, since you don't hydrate
the entire app and just hydrate certain parts of it.

## Into the Deep

There's nothing more that you need to know to understand how to make an island
arch based app but, let's now get into implementing this.

# The Code

The code level architecture for this is very similar to most SSR models and Vite
has a good explanation for how to write your own ssr with vite

[&rarr; Vite Guides - Server-Side Rendering](https://vitejs.dev/guide/ssr.html)

We used webpack instead, to make it a little more verbose which is easier to explain.

> Note: You can get the referenced code from [barelyhuman/preact-islands-diy](http://github.com/barelyhuman/preact-islands-diy/)

## `server/app.js`

Starting with `server/app.js` file. If you have the codebase open locally it
would be helpful while reading this.

The below code snippet only highlights the needed areas

```js
import preactRenderToString from 'preact-render-to-string'
import HomePage from '../pages/HomePage.js'
import { h } from 'preact'
import { withManifestBundles } from '../lib/html.js'

const app = express()

app.get('/', async (req, res) => {
  res.send(
    withManifestBundles({
      body: preactRenderToString(h(HomePage, {})),
    })
  )
})
```

Looking at the imports, we have the same imports as mentioned in the
[Getting Started](#getting-started) section and not much has changed.

The only addition here is the `withManifestBundles` helper which is what we'll
talk about next.

## `lib/html.js`

The HTML helper is different in different variants of the template but we'll be
only going through `webpack` version which is on the `main` branch.

The base usecase of the helper is to be able to go through a manifest json that
lists what files are being bundled by webpack and their hashed paths when being
used in production.

This is required since we will not know the hash and we need a programmatic way
to find it out.

This manifest is generated by webpack's client configuration which we'll take a
look at in a minute.

```js
// fetch the manifest from the client output
import manifest from '../../dist/js/manifest.json'

export const withManifestBundles = ({ styles, body }) => {
  // go through each key in the manifest and construct
  // a script tag for each.
  const bundledScripts = Object.keys(manifest).map(key => {
    const scriptPath = `/public/js/${manifest[key]}`
    return `<script src=${scriptPath}></script>`
  })

  return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style id="_goober">
        ${styles}
      </style>
    </head>

    <body>
      ${body}
    </body>
    ${bundledScripts.join('')}
  </html>`
}
```

As explained in the comments, we just grab all the files we need from the
manifest and inject them as script tags into the final HTML that is sent from
the server.

Moving onto the configuration that makes it possible to build this.

## `webpack.config.*.js`

I tried to keep the webpack configuration as minimal as possible to avoid
scaring people away from the whole idea so let's go through the configuration.

```js
// webpack.config.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: process.env.NODE_ENV != 'production' ? 'development' : 'production',
  target: 'node',
  entry: path.resolve(__dirname, './src/server/app.js'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, './dist'),
  },
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{ test: /\.jsx?$/, loader: 'babel-loader' }],
  },
  externals: [nodeExternals()],
}
```

Most of them need no explanation, and the only loader we have in place is the
`babel-loader` since we are using a CSS-IN-JS solution for styling.

There's nothing magical going on here, we just give it the entry point of
`server/app.js` and let it build itself to the same folder as the client's
output.

moving on to the client side config, which does add a few more things than
simply providing an entry and getting an output.

This is shortened out to explain the relavant bits

```js
// webpack.config.client.js

const entryPoints = glob
  .sync(path.resolve(__dirname, './src/client') + '/**/*.js', {
    absolute: true,
  })
  .reduce((acc, path) => {
    const entry = path.match(/[^\/]+\.jsx?$/gm)[0].replace(/.jsx?$/, '')
    acc[entry] = path
    return acc
  }, {})
```

So the first section is basically finding all files in `src/client` and creating
an object of entries for webpack.

Example: if `src/client/app.client.js` is a file then the output of the above
would be

```json
{
  "app.client": "./src/client/app.client.js"
}
```

this is nothing special, it's just how webpack expects entries to be defined.

Everything else is generic configuration that's also present on the server side

```js
{
  plugins: [
    new WebpackManifestPlugin({
      publicPath: '',
      basePath: '',
      filter: file => {
        return /\.mount\.js$/.test(file.name)
      },
    }),
  ]
}
```

Then we have the manifest plugin, which checks for files that have the string
`mount` in their name, this is done to make sure that only the entry files are
loaded and not random files and we do this by specifying a specific extension
type for the file.

Some frameworks use a `islands` folder to separate islands from entry files. We
instead separate the entry files from islands and have the user decide what
mounts as an island and what doesn't.

The above `WebpackManifestPlugin` generates a `manifest.json` file in
`dist/public/js` which has the bundled file names which we were using in the
`lib/html.js` file.

## `.babelrc`

This is the last part of the configuration, where you ask babel to make sure
that the JSX runtime it uses is from preact and not react.

Pretty self explanatory, but if you need details about the option, please go
through the docs of [babel](https://babeljs.io/) and
[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)

```json
// .babelrc
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      { "runtime": "automatic", "importSource": "preact" }
    ]
  ]
}
```

## Folders

We can now move on to each folders' significance here.

> **Note**: Please know that you can mix and match the folders if needed, just
> make sure the configurations are edited to handle the changes you do. If not,
> the current structure is good enough for most applications

## `client`

The `src/client` in this `main` branch is used to write the `mount` point code
that get's sent with the rendered html.

You add selective mounting based on pages and selectors that you wish to use,
even though it would fetch multiple JS files, these files are never to have
anything more than the mounting code , your islands should be self serving and
self reliant. You can however send an initial dataset from the server as a
`data-*` attribute but this has to be serializable data or will be lost.

You can also add a wrapper around to create a island manually, but
web-components are not widely supported so if using for a legacy level support
system, you are better off manually mounting like mentioned above.

example:

```js
// src/client/index.mount.js

import { h, hydrate } from 'preact'

// setup goober
import { setup } from 'goober'
setup(h)

// can be moved to a util file and used from there,
// in this file as an example for now.
const mount = async (Component, elm) => {
  if (elm?.dataset?.props) {
    const props = JSON.parse(elm.dataset.props)
    delete elm.dataset.props
    hydrate(<Component {...props} />, elm)
  }
}

const main = async () => {
  // lazy load and re-mount counter as a client side component if needed
  // A better way would be to check if the `counter` element exists on
  // the DOM before even importing the component to avoid un-needed
  // JS downloads.

  const Counter = (await import('../components/Counter.js')).default
  mount(Counter, document.getElementById('counter'))
}

main()
```

## components

The name is pretty self explanatory, since we aren't doing any segregation here
as to what is and what isn't an island, you can shove all your components here
like you normally would.

## layouts

These are separated since I like to keep the layouts far away from components
since sometimes they have more than just rendering conditions. It's not needed
in this specific case because in most cases you'd be running your layouts on the
server and not on the client.

## lib

Contains common helper funcs for both client and server, since both are bundled
separately and dependencies will be inlined as needed.

## pages

This folder acts as the storage for templates. So anything that the server will
be rendering as a page would be put in here. The ability to use layouts and
other components like a normal preact app helps with building composable
templates but still it's easier to just have them separate from the actual
component code.

## public

Stuff that needs to be delivered statically by express is put here, webpack
takes care of copying the whole thing to the final folder.

## server

Self explanatory, server sided files, in most cases you'd like to move routes to
a separate file and maybe add in middlewares to add a helper function to render
preact components for you.

Something like this is definitely a part of the server and not going to be
client sided so just keep it in this folder.

Example

```js
app.use((req, res, next) => {
  res.render = (comp, data) => {
    return res.write(preactRenderToString(h(comp, { ...data })))
  }
})

// and somewhere else in the app

const handler = (req, res) => {
  return res.status(200).render(Homepage, { username: 'reaper' })
}
```

That's actually all the code that contributes to setting up your own partial
hydration / island styled hydration with nodejs.

Most of this can be achieved with almost all bundlers and a little more
modification to how the configurations are generated, can help you achieve a
similar DX to astro though you are better off using astro if you aren't a fan of
maintaining configs.