import { blogPosts } from '../../route-config.js';
import { useTranslate, useBlogTranslate } from '../../lib/i18n';
import { Time } from '../time';
import { prefetchContent } from '../../lib/use-content';
import { BlogPage } from '../routes.jsx';
import s from './style.module.css';

export default function BlogOverview() {
	const translate = useTranslate();
	const translateBlog = useBlogTranslate();

	const posts = [];
	for (const post in blogPosts) {
		const translatedBlog = translateBlog(
			/** @type {keyof typeof blogPosts} */ (post)
		);

		const prefetchAndPreload = () => {
			BlogPage.preload();
			prefetchContent(post);
		};

		posts.push(
			<article class={s.post}>
				<div class={s.meta}>
					<Time value={blogPosts[post].date} />
				</div>
				<h2 class={s.title}>
					<a
						href={post}
						onMouseOver={prefetchAndPreload}
						onTouchStart={prefetchAndPreload}
					>
						{translatedBlog.label}
					</a>
				</h2>
				<p class={s.excerpt}>{translatedBlog.excerpt}</p>
				<a
					href={post}
					onMouseOver={prefetchAndPreload}
					onTouchStart={prefetchAndPreload}
					class="btn-small"
				>
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
