# Contributing

Thanks for contributing to Preact's documentation!

## Repo Setup

To work on the site locally, you'll want to fork the `preact-www` repository and clone it to your local machine. Once cloned, you can get up and running with the following:

```bash
$ npm install

$ npm run dev
```

At this point, you should have the site running at `http://localhost:8080`, ready for you to make any changes.

## Writing Content

The written content on the site is authored in Markdown, found in the [`content`](./content) directory. Each page is a separate Markdown file, split up by language, and [`src/config.js`](./src/config.js) contains both the routing layout as well as general i18n labels. More information about how the site is built can be found in the [README.md](./README.md).

Please author and submit content **only in one language** _(generally your primary written language)_ to facilitate translation.

English is the site's default language and is generally the source for translations. Try to follow the existing formatting where possible and treat it (English) as the source of truth in most cases.

### German Version

* German translations can be approved by @marvinhagemeister
