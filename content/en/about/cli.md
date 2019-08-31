---
name: Preact CLI
permalink: '/about/cli'
description: 'Learn how to use preact-cli with Preact to speed up your development workflow'
---

# Preact CLI

Start building a [Preact] Progressive Web App in seconds 🔥

### Features

- **100/100 Lighthouse score**, right out of the box ([proof])
- Fully **automatic code splitting** for routes
- Transparently code-split any component with an [`async!`] prefix
- Auto-generated [Service Workers] for offline caching powered by [sw-precache]
- [PRPL] pattern support for efficient loading
- Zero-configuration pre-rendering / server-side rendering hydration
- Support for CSS Modules, LESS, Sass, Stylus; with Autoprefixer
- Monitor your bundle/chunk sizes with built-in tracking
- Automatic app mounting, debug helpers & Hot Module Replacement
- Fully customizable (Babel, [`"browserslist"`], webpack, template support, [plugins]
- In just **4.5kb** you get a productive environment:
  - [preact]
  - [preact-router]
  - 1.5kb of conditionally-loaded polyfills for [fetch] & [Promise]

### [Get Started on Github](https://github.com/preactjs/preact-cli) 
[![Build Status](https://travis-ci.org/preactjs/preact-cli.svg?branch=master)](https://travis-ci.org/preactjs/preact-cli) [![NPM Downloads](https://img.shields.io/npm/dm/preact-cli.svg?style=flat)](https://www.npmjs.com/package/preact-cli) [![NPM Version](https://img.shields.io/npm/v/preact-cli.svg?style=flat)](https://www.npmjs.com/package/preact-cli) [![Lighthouse score: 100/100](https://lighthouse-badge.appspot.com/?score=100)](https://github.com/developit/preact-cli)

[Promise]: https://npm.im/promise-polyfill
[fetch]: https://github.com/developit/unfetch
[preact]: https://github.com/preactjs/preact
[`"browserslist"`]: https://github.com/ai/browserslist
[sw-precache]: https://github.com/GoogleChrome/sw-precache
[preact-router]: https://github.com/preactjs/preact-router
[plugins]: https://github.com/preactjs/preact-cli/wiki/Plugins
[PRPL]: https://developers.google.com/web/fundamentals/performance/prpl-pattern
[proof]: https://googlechrome.github.io/lighthouse/viewer/?gist=142af6838482417af741d966e7804346
[Service Workers]: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
[`async!`]: https://github.com/developit/preact-cli/blob/222e7018dd360e40f7db622191aeca62d6ef0c9a/examples/full/src/components/app.js#L7
