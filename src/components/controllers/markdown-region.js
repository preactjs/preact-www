import EditThisPage from '../edit-button';
import ContentRegion from '../content-region';
import { useRoute, useLocation } from 'preact-iso';
import { useTitle, useMeta, useTitleTemplate } from 'hoofd/preact';
import style from './style.module.less';

export function MarkdownRegion({ html, meta }) {
	const { params } = useRoute();
	const { url } = useLocation();

	useTitleTemplate(
		'%s | Preact: Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM.'
	);
	useTitle(meta.title);
	useMeta({ name: 'description', content: meta.description });
	useMeta({ name: 'og:description', content: meta.description });
	useMeta({ name: 'og:title', content: meta.title });
	useMeta({ name: 'og:url', content: url });

	const showTitle = 'show_title' in meta ? !!meta.show_title : true;
	const canEdit = showTitle && params.name != '404';

	return (
		<>
			{canEdit && <EditThisPage />}
			{showTitle && <h1 class={style.title}>{meta.title || meta.title}</h1>}
			<ContentRegion name={name} content={html} toc={meta.toc} />
		</>
	);
}
