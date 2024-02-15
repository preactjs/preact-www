import { useLocation } from 'preact-iso';
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
	const { url } = useLocation();

	const canEdit = url !== '/' && !url.startsWith('/tutorial');
	const isBlogArticle = url.startsWith('/blog/');

	return (
		<>
			{canEdit && <EditThisPage isFallback={meta.isFallback} />}
			{isBlogArticle && <BlogMeta meta={meta} />}
			<ContentRegion
				current={url}
				content={html}
				toc={meta.toc}
				components={components}
			/>
		</>
	);
}
