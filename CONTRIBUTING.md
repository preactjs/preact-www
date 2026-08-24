# Contributing

Thanks for contributing to Preact's documentation!

## Repo Setup

To work on the site locally, you'll want to fork the `preact-www` repository and clone it to your local machine. Once cloned, you can get up and running with the following:

```bash
$ npm install

$ npm run dev
```

At this point, you should have the site running at `http://localhost:8080`, ready for you to make any changes.

Other useful commands:

```bash
$ npm run build      # client bundle, server bundle, and every page prerendered
$ npm run preview    # netlify dev, against the production build
$ npm run doctor     # check the app wiring
```

## Application Structure

The site runs on [pracht](https://pracht.resynapse.dev/), a Preact framework built on Vite. Every page is statically generated at build time; the server runtime stays in the request path so that any URL can also answer with its Markdown source.

### Routing

Routes are declared explicitly in [`src/routes.js`](./src/routes.js) — there is no file-system routing. A route names a URL pattern, the module that renders it, and the shell it renders inside. Route modules live in [`src/routes/`](./src/routes), and the single shell (header, `<main>`, language context) is [`src/shells/public.jsx`](./src/shells/public.jsx).

The documentation, tutorial and blog use one module each with a dynamic segment; `getStaticPaths()` in those modules enumerates the pages to prerender, reading from [`src/route-config.js`](./src/route-config.js).

`npx pracht inspect routes` prints the resolved table, including which middleware applies where.

### Content

Each page on the site is a separate Markdown file with YAML FrontMatter, found in [`content/`](./content) and split by language.

A route's **loader** reads and compiles that Markdown on the server — at build time for the prerender, and per request otherwise. Markdown is parsed with [`marked`](https://github.com/markedjs/marked) and rendered via [`preact-markup`](https://github.com/developit/preact-markup). Because this happens server-side, the prose is in the initial HTML rather than fetched after paint.

Translations still load at runtime: switching language does not change the URL, so there is no navigation for a loader to hang off. Those are served from the prebuilt `/content/<lang>/**.json` assets emitted by the [`@pracht/content` collection](./content.js).

Loaders, `head()`, and middleware are stripped from the client bundle, so anything they import — the Markdown compiler, Prism, the content reader — never reaches the browser.

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

The navigation menu and the set of documentation pages are controlled by [`src/route-config.js`](./src/route-config.js); [`src/config.json`](./src/config.json) holds locales and third-party keys. Any new document needs an entry in `src/route-config.js` to be reachable — it feeds the nav, the sidebar, `getStaticPaths()`, and `llms.txt` alike.

### Serving agents

The site is readable by AI agents as a first-class case, not as an afterthought:

- **Markdown at the same URLs.** `curl -H 'Accept: text/markdown' https://preactjs.com/guide/v10/hooks` returns the source document. So does appending `.md` to the path. Both are handled by [`src/middleware/markdown.js`](./src/middleware/markdown.js); browsers are unaffected, and responses carry `Vary: Accept`.
- **`/llms.txt`** is an index of every page with its description and Markdown URL; **`/llms-full.txt`** inlines the whole corpus. Generated from the shared [`@pracht/content` collection](./content.js).
- **Capabilities** — `docs.search`, `docs.page`, and `preact.latestRelease` in [`src/capabilities/`](./src/capabilities) are typed operations exposed at `POST /api/capabilities/<name>` and as WebMCP page tools, so an agent can search or read the docs without scraping HTML.
- **Skills** — [`skills/`](./skills) holds Claude Code skills for working with Preact, published at `/skills/<name>/SKILL.md` with an integrity manifest at `/.well-known/agent-skills/index.json`.

If you add a page, all of the content-backed surfaces pick it up automatically from `src/route-config.js`.

## Writing Content

The written content on the site is authored in Markdown, found in the [`content`](./content) directory and split up by language. Additionally, [`src/config.json`](./src/config.json) contains some i18n labels which you may need to alter if you were adding a new translated page.

Any and all content contributions are greatly appreciated, be that typo fixes or completely new translations.

Please author and submit content **only in one language** _(generally your primary written language)_ to facilitate translation. English is the site's default language and is generally the source for translations. Try to follow the existing formatting where possible and treat it (English) as the source of truth in most cases.

### German Version

* German translations can be approved by @marvinhagemeister
