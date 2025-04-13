import { Fragment } from 'preact';
import { useRoute } from 'preact-iso';
import EditThisPage from '../edit-button';
import ContentRegion from '../content-region';
import BlogMeta from '../blog-meta';

/**
 * @param {object} props
 * @param {string} props.html
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 * @param {any} [props.components]
 */
export function MarkdownRegion({ html, meta, components }) {
	const { path } = useRoute();

	const canEdit = path !== '/' && !path.startsWith('/tutorial');
	const isBlogArticle = path.startsWith('/blog/');

	return (
		<Fragment key={path}>
			{canEdit && <EditThisPage isFallback={meta.isFallback} />}
			{isBlogArticle && <BlogMeta meta={meta} />}
			<ContentRegion
				current={path}
				content={html}
				toc={meta.toc}
				components={components}
				canEdit={canEdit}
			/>
		</Fragment>
	);
}
