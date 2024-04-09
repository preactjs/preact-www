import { useRoute } from 'preact-iso';
import EditThisPage from '../edit-button';
import ContentRegion from '../content-region';
import BlogMeta from '../blog-meta';

/**
 * @param {object} props
 * @propery {string} html
 * @propery {any} meta
 * @propery {any} [components]
 */
export function MarkdownRegion({ html, meta, components }) {
	const { path } = useRoute();

	const canEdit = path !== '/' && !path.startsWith('/tutorial');
	const isBlogArticle = path.startsWith('/blog/');

	return (
		<>
			{canEdit && <EditThisPage isFallback={meta.isFallback} />}
			{isBlogArticle && <BlogMeta meta={meta} />}
			<ContentRegion
				current={path}
				content={html}
				toc={meta.toc}
				components={components}
				canEdit={canEdit}
			/>
		</>
	);
}
