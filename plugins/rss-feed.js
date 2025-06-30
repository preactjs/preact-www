import { Feed } from 'feed';
import config from '../src/config.json';

/**
 * @returns {import('vite').Plugin}
 */
export function rssFeedPlugin() {
	return {
		name: 'rss-feed',
		apply: 'build',
		generateBundle() {
			const feed = new Feed({
				title: 'Preact Blog',
				description: 'Preact news and articles',
				id: 'https://preactjs.com',
				link: 'https://preactjs.com',
				language: 'en',
				image: 'https://preactjs.com/branding/symbol.png',
				favicon: 'https://preactjs.com/favicon.ico',
				copyright: 'All rights reserved 2022, the Preact team',
				feedLinks: {
					rss: 'https://preactjs.com/feed.xml',
					atom: 'https://preactjs.com/feed.atom'
				}
			});

			config.blog.forEach(post => {
				feed.addItem({
					title: post.name.en,
					id: `https://preactjs.com${post.path}`,
					link: `https://preactjs.com${post.path}`,
					description: post.excerpt.en,
					date: new Date(post.date)
				});
			});

			function removeDefaultGenerator(str) {
				return str
					.split('\n')
					.filter(
						line =>
							line.trim() !==
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
