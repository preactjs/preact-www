import { useRoute, useLocation } from 'preact-iso';
import { useContent } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import config from '../../config.json';
import { NotFound } from './not-found';
import cx from '../../lib/cx';
import { LATEST_MAJOR, isDocPage } from '../../lib/docs';
import { useLanguage } from '../../lib/i18n';
import { MarkdownRegion } from './markdown-region';
import Sidebar from '../sidebar';
import Footer from '../footer/index';
import { docRoutes } from '../../lib/route-utils';
import style from './style.module.css';

export function DocPage() {
	const { params } = useRoute();
	const { version, name } = params;

	if (!docRoutes[version]['/' + name]) {
		return <NotFound />;
	}

	return <DocLayout />;
}

export function DocLayout() {
	const { path } = useLocation();
	const [lang] = useLanguage();

	const { html, meta } = useContent([lang, path === '/' ? 'index' : path]);
	useTitle(meta.title);
	useDescription(meta.description);

	const hasSidebar = meta.toc !== false && isDocPage(path);

	return (
		<div class={cx(style.page, hasSidebar && style.withSidebar)}>
			<div class={style.outer}>
				{hasSidebar && (
					<div class={style.sidebarWrap}>
						<Sidebar />
					</div>
				)}
				<div class={style.inner}>
					<OldDocsWarning />
					<MarkdownRegion html={html} meta={meta} />
					<Footer />
				</div>
			</div>
		</div>
	);
}

function OldDocsWarning() {
	const { name, version } = useRoute().params;
	const { path } = useLocation();

	if (!isDocPage(path) || version === LATEST_MAJOR) {
		return null;
	}

	const latestExists = config.docs[LATEST_MAJOR].some(section =>
		section.routes.some(route => route.path === '/' + name)
	);

	return (
		<div class={style.oldDocsWarning}>
			You are viewing the documentation for an older version of Preact.
			{latestExists ? (
				<>
					{' '}
					Switch to the{' '}
					<a href={`/guide/${LATEST_MAJOR}/${name}`}>current version</a>.
				</>
			) : (
				<>
					{' '}
					Get started with the{' '}
					<a href={`/guide/${LATEST_MAJOR}/getting-started`}>current version</a>
					.
				</>
			)}
		</div>
	);
}
