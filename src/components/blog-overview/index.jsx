import { blogPosts } from '../../route-config.js';
import { useTranslate } from '../../lib/i18n';
import { Time } from '../time';
import s from './style.module.css';

export default function BlogOverview() {
	const translate = useTranslate();

	return (
		<div>
			<div class={s.postList}>
				{Object.entries(blogPosts).map(([postPath, post]) => {
					const translatedBlog = translate('blogPosts', post.label);

					return (
						<article class={s.post}>
							<div class={s.meta}>
								<Time value={post.date} />
							</div>
							<h2 class={s.title}>
								<a href={postPath}>{translatedBlog.label}</a>
							</h2>
							<p class={s.excerpt}>{translatedBlog.excerpt}</p>
							<a href={postPath} class="btn-small">
								{translate('i18n', 'continueReading')} &rarr;
							</a>
						</article>
					);
				})}
			</div>
		</div>
	);
}
