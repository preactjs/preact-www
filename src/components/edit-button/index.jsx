import { useRoute } from 'preact-iso';
import { useLanguageContext } from '../../lib/i18n.jsx';
import style from './style.module.css';

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 * @param {boolean} [props.inline] - Render in the flow, rather than floating over the content
 */
export default function EditThisPage({ meta, inline }) {
	let { path } = useRoute();
	const { lang } = useLanguageContext();

	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${meta.translationExists ? path + '.md' : ''}`;

	const linkText = !meta.translationExists
		? 'Translate this Page'
		: !meta.translationEnabled
			? 'Update outdated translation'
			: 'Edit this Page';

	return (
		<div class={inline ? style.inline : style.wrapper}>
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
