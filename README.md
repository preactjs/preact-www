# Preact Documentation Website

[![Preact Slack Community](https://img.shields.io/badge/slack-Preact%20Slack%20Community-blue?logo=slack)](https://chat.preactjs.com/)

> :rocket: `master` is automatically deployed to [preactjs.com](https://preactjs.com)

---

## Stack

The site runs on [pracht](https://pracht.resynapse.dev/) — a Preact framework on Vite with an explicit route manifest, per-route render modes, and server-side loaders.

Every page is statically generated at build time, so what a reader downloads is a prerendered HTML document. The server runtime stays in front of those pages because it is what lets the same URLs serve Markdown to agents, and what backs the docs-search and page-read capabilities.

See the [Contributing Guide](./CONTRIBUTING.md) for how to run it and how it is put together.

## For AI agents

preactjs.com is designed to be read by agents without scraping:

| Surface | What it gives you |
| --- | --- |
| `Accept: text/markdown` on any page URL | The page's Markdown source. `<path>.md` works too. Add `?lang=<code>` for a translation. |
| [`/llms.txt`](https://preactjs.com/llms.txt) | Index of every page with its description and Markdown URL |
| [`/llms-full.txt`](https://preactjs.com/llms-full.txt) | The full corpus in one file |
| `POST /api/capabilities/docs/search` | Search the documentation |
| `POST /api/capabilities/docs/page` | Read one page as Markdown |
| `POST /api/capabilities/preact/latestRelease` | The current Preact version |
| [`/.well-known/agent-skills/index.json`](https://preactjs.com/.well-known/agent-skills/index.json) | Claude Code [skills](./skills) for working with Preact |

```sh
curl -H 'Accept: text/markdown' https://preactjs.com/guide/v10/hooks
curl https://preactjs.com/guide/v10/hooks.md

curl -X POST https://preactjs.com/api/capabilities/docs/search \
  -H 'content-type: application/json' -d '{"query":"hydration mismatch"}'
```

The capabilities are also registered as [WebMCP](https://developer.chrome.com/docs/ai/webmcp) page tools, so an in-browser agent can call them directly.

## Deployment

Netlify, configured by [`netlify.toml`](./netlify.toml). `npm run build` produces:

- `dist/client/` — hashed assets, the translation JSON, and one prerendered HTML file per page (the publish directory)
- `dist/server/server.js` — the request handler
- `netlify/functions/pracht.mjs` — a generated Netlify Function v2 entry wrapping it

**Why the function claims `/*`.** Netlify serves the publish directory from its CDN *before* invoking functions. If prerendered pages went out that way, `/guide/v10/hooks` would never reach the framework and `Accept: text/markdown` would silently stop working. So the function claims every path except the asset prefixes in `excludedPath` and serves the prerendered HTML itself, tagged with `Netlify-CDN-Cache-Control` so the edge still answers virtually every request.

To move hosts, swap the adapter in [`vite.config.js`](./vite.config.js) — the Node, Cloudflare and Vercel adapters are drop-in replacements.

> **Note:** the old deploy published a purely static `build/` with `_redirects` and two Netlify Functions. Those functions are now API routes (`/api/release`, `/api/repos`; the old paths 308 to them), and the redirect table lives in `src/middleware/redirects.js`. Netlify's build settings need `publish` changed from `build` to `dist/client` — or, better, deleted from the UI so `netlify.toml` is the single source of truth.

---

## Chat with Us

We have a [Slack community](https://chat.preactjs.com/) where you can chat with the Preact team and the wider Preact community. Come stop by to get support, ask questions, or just to introduce yourself!

## Issues

If something doesn't look quite right, or maybe the wording is confusing, please let us know by opening an issue!

## Contributing

Check out the [Contributing Guide](./CONTRIBUTING.md) for information on how to contribute to the site and work on it locally.

## License

[MIT](./LICENSE)
