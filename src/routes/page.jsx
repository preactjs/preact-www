import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { PageLayout } from '../components/controllers/page';
import { pageHead } from '../lib/route-head.js';

/**
 * The generic markdown pages: `/`, `/about/*` and `/branding`. Each has its own
 * entry in the manifest, so an unknown path falls through to `notFound` rather
 * than rendering an empty shell.
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
	return <PageLayout content={data.content} />;
}
