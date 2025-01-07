import config from '../../config.json';
import { useLanguage, useTranslation } from '../../lib/i18n';
import { getRouteName } from '../header';
import { Time } from '../time';
import { prefetchContent } from '../../lib/use-content';
import { BlogPage } from '../routes.jsx';
import s from './style.module.css';

export default function BlogOverview() {
	const [lang] = useLanguage();
	const continueReading = useTranslation('continueReading');

	return (
		<div>
			<div class={s.postList}>
				{config.blog.map(post => {
					const name = getRouteName(post, lang);
					const excerpt = post.excerpt[lang] || post.excerpt.en;
					const onMouseOver = () => {
						BlogPage.preload();
						prefetchContent(post.path);
					};

					return (
						<article class={s.post}>
							<div class={s.meta}>
								<Time value={post.date} />
							</div>
							<h2 class={s.title}>
								<a href={post.path} onMouseOver={onMouseOver}>{name}</a>
							</h2>
							<p class={s.excerpt}>{excerpt}</p>
							<a href={post.path} onMouseOver={onMouseOver} class="btn-small">
								{continueReading} &rarr;
							</a>
						</article>
					);
				})}
			</div>
		</div>
	);
}
