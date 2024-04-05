# Contributing

Thanks for contributing to Preact's documentation!

## Repo Setup

To work on the site locally, you'll want to fork the `preact-www` repository and clone it to your local machine. Once cloned, you can get up and running with the following:

```bash
$ npm install

$ npm run dev
```

At this point, you should have the site running at `http://localhost:8080`, ready for you to make any changes.

## Application Structure

This website is built as a [prerendered static app](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#static-rendering), following the [Application Shell pattern](https://developers.google.com/web/fundamentals/architecture/app-shell).

### Content

Content is fetched and rendered on the fly from Markdown documents, similiar to how Jekyll and many other static site generators work. Each page on the site is a separate Markdown file, with optional YAML FrontMatter for specifying page metadata or layout information. Once fetched, the markdown content is then parsed using [`marked`](https://github.com/markedjs/marked) and rendered via [`preact-markup`](https://github.com/developit/preact-markup) to create the HTML you can read and interact with.

### Custom Elements

Since [`preact`](https://github.com/preactjs/preact) is used to render the Markdown content, we can make use of Custom Elements in our Markdown content to easily allow for dynamic or repated content, such as a generated Table of Contents or the Preact logo. These Elements are defined in [`src/components/widget.js`](./src/components/widget.js) and can be used like so:

```md
## Example Page

<!-- Jumbotron and Logo are actually Preact components! -->
<jumbotron>
    <h1><logo text>Preact</logo></h1>
</jumbotron>
```

### Navigation

The navigation menu and route handling are controlled by [`src/config.json`](./src/config.json). Any new documents would need to be added to this file to be accessible via the site's navigation.

## Writing Content

The written content on the site is authored in Markdown, found in the [`content`](./content) directory and split up by language. Additionally, [`src/config.json`](./src/config.json) contains some i18n labels which you may need to alter if you were adding a new translated page.

Any and all content contributions are greatly appreciated, be that typo fixes or completely new translations.

Please author and submit content **only in one language** _(generally your primary written language)_ to facilitate translation. English is the site's default language and is generally the source for translations. Try to follow the existing formatting where possible and treat it (English) as the source of truth in most cases.

### German Version

* German translations can be approved by @marvinhagemeister
