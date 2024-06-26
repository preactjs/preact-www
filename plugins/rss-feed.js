import { Feed } from 'feed';
import config from '../src/config.json';

/**
 * @returns {import('vite').Plugin}
 */
export function rssFeedPlugin(deployURL) {
	return {
		name: 'rss-feed',
		apply: 'build',
		generateBundle() {
			const feed = new Feed({
				title: 'Preact Blog',
				description: 'Preact news and articles',
				id: deployURL,
				link: deployURL,
				language: 'en',
				image: `${deployURL}/assets/branding/symbol.png`,
				favicon: `${deployURL}/favicon.ico`,
				copyright: 'All rights reserved 2022, the Preact team',
				feedLinks: {
					json: `${deployURL}/json`,
					atom: `${deployURL}/atom`
				}
			});

			config.blog.forEach(post => {
				feed.addItem({
					title: post.name.en,
					id: `${deployURL}${post.path}`,
					link: `${deployURL}${post.path}`,
					description: post.excerpt.en,
					date: new Date(post.date)
				});
			});

			function removeDefaultGenerator(str) {
				return str
					.split('\n')
					.filter(
						line =>
							line !==
							'<generator>https://github.com/jpmonette/feed</generator>'
					)
					.join('\n');
			}

			this.emitFile({
				type: 'asset',
				fileName: 'feed.xml',
				source: removeDefaultGenerator(feed.rss2())
			});

			this.emitFile({
				type: 'asset',
				fileName: 'feed.atom',
				source: removeDefaultGenerator(feed.atom1())
			});
		}
	};
}
