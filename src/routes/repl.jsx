import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { ReplPage } from '../components/controllers/repl-page';
import { pageHead } from '../lib/route-head.js';

/**
 * The REPL bundles CodeMirror and an in-browser Rollup, and its initial code
 * depends on `?code` / `?example` / `localStorage`. None of that is meaningful
 * on the server, so the route renders client-side under the shared shell; the
 * loader exists only to give the document its title and description.
 */
export const loader = withSiteData(async () => ({
	content: await requireContent('/repl')
}));

/**
 * @param {import('@pracht/core').HeadArgs<typeof loader>} args
 */
export function head(args) {
	return pageHead(args);
}

export function Component() {
	return <ReplPage />;
}
