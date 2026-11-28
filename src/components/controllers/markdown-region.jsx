import { Fragment } from 'preact';
import EditThisPage from '../edit-button/index.jsx';
import ContentRegion from '../content-region/index.jsx';
import BlogMeta from '../blog-meta/index.jsx';
import { useContentLang } from '../../lib/i18n.jsx';

/**
 * @param {object} props
 * @param {string} props.path - The page `html` is for: the route's path changes before the next page's content has loaded
 * @param {string} props.html
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 * @param {any} [props.components]
 * @param {boolean} [props.showEditLink] - Set to `false` when the layout renders `EditThisPage` itself
 */
export function MarkdownRegion({
	path,
	html,
	meta,
	components,
	showEditLink = true
}) {
	const lang = useContentLang(meta);

	const canEdit = path !== '/' && !path.startsWith('/tutorial');
	const isBlogArticle = path.startsWith('/blog/');

	return (
		<Fragment key={path}>
			{canEdit && showEditLink && <EditThisPage path={path} meta={meta} />}
			{isBlogArticle && <BlogMeta meta={meta} />}
			<ContentRegion
				current={path}
				lang={lang}
				content={html}
				toc={meta.toc}
				components={components}
				canEdit={canEdit}
			/>
		</Fragment>
	);
}
