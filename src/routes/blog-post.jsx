import { requireContent } from '../lib/content-server.js';
import { withSiteData } from '../data/site.js';
import { BlogLayout } from '../components/controllers/blog-page';
import { pageHead } from '../lib/route-head.js';
import { blogPosts } from '../route-config.js';

/**
 * @returns {import('@pracht/core').RouteParams[]}
 */
export function getStaticPaths() {
	return Object.keys(blogPosts).map(path => ({
		slug: path.replace('/blog/', '')
	}));
}

export const loader = withSiteData(async ({ url }) => ({
	content: await requireContent(url.pathname)
}));

/**
 * @param {import('@pracht/core').HeadArgs<typeof loader>} args
 */
export function head(args) {
	const head = pageHead(args);
	const meta = args.data?.content?.meta ?? {};

	// Blog posts are articles, and their cards should say so.
	head.meta = [
		...(head.meta ?? []),
		{ property: 'og:type', content: 'article' },
		...(meta.date
			? [{ property: 'article:published_time', content: meta.date }]
			: [])
	];

	return head;
}

/**
 * @param {import('@pracht/core').RouteComponentProps<typeof loader>} props
 */
export function Component({ data }) {
	return <BlogLayout content={data.content} />;
}
