import { Feed } from 'feed';
import { blogPosts } from '../src/route-config.js';
import englishTranslations from '../src/locales/en.json';

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

			Object.entries(blogPosts).map(([postPath, post]) => {
				const postTranslation = englishTranslations.blogPosts[post.label];

				feed.addItem({
					title: postTranslation.label,
					id: `https://preactjs.com${postPath}`,
					link: `https://preactjs.com${postPath}`,
					description: postTranslation.excerpt,
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
