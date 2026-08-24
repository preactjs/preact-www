import { defineApp, group, route } from '@pracht/core';

import { headerNav } from './route-config.js';

/**
 * The generic markdown pages in the header nav — `/`, `/about/*`, `/branding`,
 * `/blog`. `/tutorial`, `/guide/*` and `/repl` have their own modules, so they
 * are filtered out here and declared explicitly below.
 */
const contentPages = Object.keys(headerNav).filter(
	path =>
		!path.startsWith('/guide') &&
		!path.startsWith('/tutorial') &&
		!path.startsWith('/repl')
);

/**
 * Every page on preactjs.com is content that changes only when the repository
 * changes, so the whole site is statically generated. The server runtime is
 * still in the request path — it is what lets any of these URLs answer
 * `Accept: text/markdown` with the source document.
 *
 * Those routes carry `markdown: true`. pracht otherwise infers Markdown
 * capability from a route module's `markdown` export, which cannot work here:
 * that export is one static string per module, and `/guide/:version/:name` is a
 * single module standing in for several hundred documents. The flag tells the
 * adapter to route these URLs through the framework instead of answering them
 * from prerendered HTML, so `src/middleware/markdown.js` gets to negotiate.
 */
export const app = defineApp({
	shells: {
		public: './shells/public.jsx'
	},
	middleware: {
		markdown: './middleware/markdown.js',
		'agent-skills': './middleware/agent-skills.js',
		redirects: './middleware/redirects.js'
	},
	// Typed operations agents can call directly, instead of scraping pages for
	// the same answers. Each is projected to `POST /api/capabilities/<name>`
	// and registered as a WebMCP page tool.
	capabilities: {
		'docs.search': './capabilities/search-docs.js',
		'docs.page': './capabilities/get-page.js',
		'preact.latestRelease': './capabilities/latest-release.js'
	},
	notFound: {
		component: './routes/not-found.jsx',
		shell: 'public',
		// Unmatched URLs are the only place the legacy `/guide/<page>` paths can
		// still show up, so the redirect table runs here rather than as a
		// catch-all route that would shadow real pages.
		// 'markdown' handles the `<path>.md` suffix form, which matches no route.
		middleware: ['agent-skills', 'markdown', 'redirects']
	},
	routes: [
		group({ shell: 'public', render: 'ssg', middleware: ['markdown'] }, [
			...contentPages.map(path =>
				route(path, './routes/page.jsx', { id: routeId(path), markdown: true })
			),
			route('/blog/:slug', './routes/blog-post.jsx', {
				id: 'blog-post',
				markdown: true
			}),
			route('/guide/:version/:name', './routes/guide.jsx', {
				id: 'guide',
				markdown: true
			}),
			route('/tutorial', './routes/tutorial-index.jsx', {
				id: 'tutorial',
				markdown: true
			}),
			route('/tutorial/:step', './routes/tutorial.jsx', {
				id: 'tutorial-step',
				markdown: true
			}),
			route('/repl', './routes/repl.jsx', { id: 'repl', markdown: true })
		])
	]
});

/**
 * `/about/we-are-using` -> `about-we-are-using`, `/` -> `home`.
 *
 * @param {string} path
 * @returns {string}
 */
function routeId(path) {
	if (path === '/') return 'home';
	return path.replace(/^\//, '').replace(/\//g, '-');
}
