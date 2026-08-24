import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { TutorialLayout } from '../components/controllers/tutorial-page';
import { pageHead } from '../lib/route-head.js';
import { tutorialPages } from '../route-config.js';

/**
 * `/tutorial` itself is registered as its own route, so this only enumerates
 * the numbered chapters.
 *
 * @returns {import('@pracht/core').RouteParams[]}
 */
export function getStaticPaths() {
	return Object.keys(tutorialPages)
		.filter(path => path !== '/tutorial')
		.map(path => ({ step: path.replace('/tutorial/', '') }));
}

export const loader = withSiteData(async ({ url }) => ({
	content: await requireContent(url.pathname)
}));

/**
 * @param {import('@pracht/core').HeadArgs<typeof loader>} args
 */
export function head(args) {
	return pageHead(args);
}

/**
 * @param {import('@pracht/core').RouteComponentProps<typeof loader>} props
 */
export function Component({ data }) {
	return <TutorialLayout content={data.content} />;
}
