import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { TutorialLayout } from '../components/controllers/tutorial-page';
import { pageHead } from '../lib/route-head.js';

/**
 * `/tutorial` — the landing chapter. It is a separate module from
 * `/tutorial/:step` so that only the parameterised route enumerates static
 * paths.
 */
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
