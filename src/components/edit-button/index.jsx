import { useRoute } from 'preact-iso';
import { useLanguageContext } from '../../lib/i18n';
import style from './style.module.css';

export default function EditThisPage({ isFallback }) {
	let { path } = useRoute();
	const { lang } = useLanguageContext();

	path = !isFallback ? path + '.md' : '';
	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}`;
	return (
		<div class={style.wrapper}>
			{!isFallback ? (
				<a
					class={style.edit}
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					Edit this Page
				</a>
			) : (
				<div class={style.fallback}>
					<div class={style.fallbackInner}>
						Could not find a translation for this page. You can help us out by{' '}
						<a href={editUrl} target="_blank" rel="noopener noreferrer">
							adding one here
						</a>
						.
					</div>
				</div>
			)}
		</div>
	);
}
