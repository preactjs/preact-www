import { blogPosts } from '../../route-config.js';
import { useTranslate } from '../../lib/i18n';
import { Time } from '../time';
import s from './style.module.css';

/**
 * @typedef {import('../../locales/en.json')} Translations
 */

export default function BlogOverview() {
	const translate = useTranslate();

	const posts = [];
	for (const post in blogPosts) {
		const translatedBlog = translate(
			'blogPosts',
			/** @type {keyof Translations['blogPosts']} */ (blogPosts[post].label)
		);

		posts.push(
			<article class={s.post}>
				<div class={s.meta}>
					<Time value={blogPosts[post].date} />
				</div>
				<h2 class={s.title}>
					<a href={post}>{translatedBlog.label}</a>
				</h2>
				<p class={s.excerpt}>{translatedBlog.excerpt}</p>
				<a href={post} class="btn-small">
					{translate('i18n', 'continueReading')} &rarr;
				</a>
			</article>
		);
	}

	return (
		<div>
			<div class={s.postList}>{posts}</div>
		</div>
	);
}
