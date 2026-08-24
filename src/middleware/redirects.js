/**
 * The legacy unversioned `/guide/<page>` URLs, which predate the v8/v10/v11
 * split and are still linked from blog posts and Stack Overflow answers.
 *
 * These used to live in Netlify's `_redirects`. Running them in the app keeps
 * them working on any host, and keeps them next to the route table they point
 * at.
 */

import { redirect } from '@pracht/core';

/** @type {Record<string, string>} */
const REDIRECTS = {
	'/guide/getting-started': '/guide/v10/getting-started',
	'/guide/differences-to-react': '/guide/v10/differences-to-react',
	'/guide/switching-to-preact':
		'/guide/v10/getting-started#aliasing-react-to-preact',
	'/guide/types-of-components': '/guide/v10/components',
	'/guide/api-reference': '/guide/v10/api-reference',
	'/guide/forms': '/guide/v10/forms',
	'/guide/linked-state': '/guide/v8/linked-state',
	'/guide/external-dom-mutations': '/guide/v8/external-dom-mutations',
	'/guide/extending-component': '/guide/v8/extending-component',
	'/guide/unit-testing-with-enzyme': '/guide/v10/unit-testing-with-enzyme',
	'/guide/progressive-web-apps': '/guide/v8/progressive-web-apps',
	'/guide/v10/tutorial': '/tutorial',
	'/guide/v10/switching-to-preact':
		'/guide/v10/getting-started#aliasing-react-to-preact'
};

/**
 * @type {import('@pracht/core').MiddlewareFn}
 */
export const middleware = async ({ request, url }, next) => {
	// The two Netlify functions are now ordinary API routes. Anything still
	// calling the old paths keeps working, query string included.
	const netlify = url.pathname.match(
		/^\/\.netlify\/functions\/(release|repos)$/
	);
	if (netlify) {
		return redirect(`/api/${netlify[1]}${url.search}`, {
			request,
			status: 308
		});
	}

	const target = REDIRECTS[url.pathname.replace(/\/$/, '')];
	// 301, matching what Netlify's `_redirects` served, so the accumulated
	// search ranking of these URLs follows them.
	if (target) return redirect(target, { request, status: 301 });

	return next();
};
