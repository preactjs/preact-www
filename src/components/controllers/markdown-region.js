import EditThisPage from '../edit-button';
import ContentRegion from '../content-region';
import { useRoute } from 'preact-iso';
import { useTitle, useMeta, useTitleTemplate } from 'hoofd/preact';
import style from './page/style.module.less';

export function MarkdownRegion({ html, meta }) {
	const { params } = useRoute();

	useTitleTemplate(
		'%s | Preact: Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM.'
	);
	useTitle(meta.title);
	useMeta({ name: 'description', content: meta.description });

	const showTitle = params.name != 'index' && meta.show_title !== false;
	const canEdit = showTitle && params.name != '404';

	return (
		<>
			{canEdit && <EditThisPage />}
			{meta.show_title !== false && (
				<h1 class={style.title}>{meta.title || meta.title}</h1>
			)}
			<ContentRegion name={name} content={html} toc={meta.toc} />
		</>
	);
}
