import config from '../../config.json';
import { useTranslation } from '../../lib/i18n';
import { getRouteName } from '../header';
import { useStore } from '../store-adapter';
import { Time } from '../time';
import s from './blog.less';

export default function BlogOverview() {
	const { lang } = useStore(['lang']).state;
	const continueReading = useTranslation('continueReading');

	return (
		<div>
			<div class={s.postList}>
				{config.blog.map(post => {
					const name = getRouteName(post, lang);
					const excerpt = post.excerpt[lang] || post.excerpt.en;

					return (
						<article class={s.post}>
							<div class={s.meta}>
								<Time value={post.date} />
							</div>
							<h2 class={s.title}>
								<a href={post.path}>{name}</a>
							</h2>
							<p class={s.excerpt}>{excerpt}</p>
							<a href={post.path} class="btn-small">
								{continueReading} &rarr;
							</a>
						</article>
					);
				})}
			</div>
		</div>
	);
}
