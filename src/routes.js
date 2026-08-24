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

/** Every page is content-backed and statically generated. */
export const app = defineApp({
	shells: {
		public: './shells/public.jsx'
	},
	middleware: {
		'agent-skills': './middleware/agent-skills.js',
		redirects: './middleware/redirects.js'
	},
	notFound: {
		component: './routes/not-found.jsx',
		shell: 'public',
		// Unmatched URLs are the only place the legacy `/guide/<page>` paths can
		// still show up, so the redirect table runs here rather than as a
		// catch-all route that would shadow real pages.
		middleware: ['agent-skills', 'redirects']
	},
	routes: [
		group({ shell: 'public', render: 'ssg' }, [
			...contentPages.map(path =>
				route(path, './routes/page.jsx', { id: routeId(path) })
			),
			route('/blog/:slug', './routes/blog-post.jsx', { id: 'blog-post' }),
			route('/guide/:version/:name', './routes/guide.jsx', { id: 'guide' }),
			route('/tutorial', './routes/tutorial-index.jsx', { id: 'tutorial' }),
			route('/tutorial/:step', './routes/tutorial.jsx', {
				id: 'tutorial-step'
			}),
			route('/repl', './routes/repl.jsx', { id: 'repl' })
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
