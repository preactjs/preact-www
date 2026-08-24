import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { GuideLayout } from '../components/controllers/guide-page';
import { pageHead } from '../lib/route-head.js';
import { flatDocPages } from '../route-config.js';

/**
 * Every documentation page across v8, v10 and v11 is enumerated here rather
 * than in the manifest, so `src/routes.js` stays one line for the whole guide
 * while the build still prerenders each page individually.
 *
 * @returns {import('@pracht/core').RouteParams[]}
 */
export function getStaticPaths() {
	return Object.keys(flatDocPages).flatMap(version =>
		Object.keys(flatDocPages[version]).map(name => ({
			version,
			name: name.replace(/^\//, '')
		}))
	);
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
	return <GuideLayout content={data.content} />;
}
