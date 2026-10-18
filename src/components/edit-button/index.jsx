import { useRoute } from 'preact-iso';
import { useLanguageContext } from '../../lib/i18n.jsx';
import style from './style.module.css';

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 */
export default function EditThisPage({ meta }) {
	let { path } = useRoute();
	const { lang } = useLanguageContext();

	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${meta.translationExists ? path + '.md' : ''}`;

	const linkText = !meta.translationExists
		? 'Translate this Page'
		: !meta.translationEnabled
			? 'Update outdated translation'
			: 'Edit this Page';

	return (
		<div class={style.wrapper}>
			<a
				class={style.edit}
				href={editUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				{linkText}
			</a>
		</div>
	);
}
