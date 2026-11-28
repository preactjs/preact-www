import style from './style.module.css';

/**
 * @param {object} props
 * @param {string} props.path - The page `meta` is for (see `MarkdownRegion`)
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 * @param {boolean} [props.inline] - Render in the flow, rather than floating over the content
 */
export default function EditThisPage({ path, meta, inline }) {
	// The content's, as the previous content stays while a translation loads
	const lang = meta.locale;

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
				lang="en"
			>
				{linkText}
			</a>
		</div>
	);
}
