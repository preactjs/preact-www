# Preact Documentation Website

[![Build Status](https://travis-ci.org/preactjs/preact-www.svg?branch=master)](https://travis-ci.org/preactjs/preact-www)
[![Preact Slack Community](https://preact-slack.now.sh/badge.svg)](https://preact-slack.now.sh)


Built with [preact-cli](https://github.com/preactjs/preact-cli)

> :rocket: `master` is automatically deployed to [preactjs.com](https://preactjs.com)


---


# Application Structure

This website is built as a [prerendered static app](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#static-rendering), following the [Application Shell pattern](https://developers.google.com/web/fundamentals/architecture/app-shell).


#### Content

Content is fetched and rendered on the fly from Markdown documents located in `content/`, similar to how Jekyll works.
Documents can contain optional YAML FrontMatter for specifying page metadata or layout information.
Once fetched, content is parsed using [marked] and rendered to VDOM via [preact-markup].

#### Custom Elements

Since [preact] is used to render the Markdown content, HTML contained in a document reference any of the Components listed in `src/components/widget.js` as Custom Elements, useful for dynamic content:

```md
## Example Page

<!-- Jumbotron and Logo are actually Preact components! -->
<jumbotron>
    <h1><logo text>Preact</logo></h1>
</jumbotron>
```

#### Navigation

Currently, the navigation menu and route handling is controlled by `src/config.json`.
This is likely to change, but in the meantime it means any new pages must be linked from the `"nav"` section of the config.


---


# Local Development

### Clone & Install Dependencies

```sh
git clone https://github.com/preactjs/preact-www.git
cd preact-www

npm install
```


## Development Workflow

**To start a live-reload development server:**

```sh
PORT=8080 npm run dev
```

> Any time you make changes within the `src` directory, it will rebuild and even refresh your browser.


**Generate a production build in `./build`:**

```sh
npm run build
```


---


## License

MIT


[marked]: https://github.com/chjj/marked
[preact]: https://github.com/preactjs/preact
[preact-markup]: https://github.com/developit/preact-markup
