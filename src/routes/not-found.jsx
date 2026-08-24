import { loadContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { NotFound } from '../components/controllers/not-found';
import { createTitle } from '../lib/page-title.js';

/**
 * Rendered with a 404 status whenever nothing matches, and whenever a loader
 * throws `notFound()` — for example `/guide/v10/does-not-exist`.
 *
 * It is deliberately not a route, so it can never shadow a static asset or a
 * path added later.
 */
export const loader = withSiteData(async () => ({
	content: await loadContent('/404')
}));

/**
 * @param {import('@pracht/core').HeadArgs<typeof loader>} args
 */
export function head({ data, url }) {
	const meta = data?.content?.meta ?? {};
	return {
		title: createTitle(meta.title || 'Page not found', url.pathname),
		meta: [{ name: 'robots', content: 'noindex' }]
	};
}

/**
 * @param {import('@pracht/core').RouteComponentProps<typeof loader>} props
 */
export function Component({ data }) {
	return <NotFound content={data.content} />;
}
