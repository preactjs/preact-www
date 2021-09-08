import style from './style.module.less';
import { useLocation } from 'preact-iso';
import { useLanguage } from '../../lib/i18n';

export default function EditThisPage({ isFallback }) {
	const { url } = useLocation();
	const [lang] = useLanguage();

	let path = url.replace(/\/$/, '') || '/index';
	path = !isFallback ? path + '.md' : '';
	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}`;
	return (
		<>
			<div class={style.wrapper}>
				<a
					class={style.edit}
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{!isFallback ? 'Edit this Page' : 'Add translation'}
				</a>

				{isFallback && (
					<div class={style.fallback}>
						<div class={style.fallbackInner}>
							Could not find a translation for this page. You can help us out by{' '}
							<a href={editUrl}>adding one here</a>.
						</div>
					</div>
				)}
			</div>
		</>
	);
}
