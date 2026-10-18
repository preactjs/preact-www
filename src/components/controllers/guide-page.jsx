import { useRoute, ErrorBoundary } from 'preact-iso';
import { useContent } from '../../lib/use-content.js';
import { NotFound } from './not-found.jsx';
import cx from '../../lib/cx.js';
import { MarkdownRegion } from './markdown-region.jsx';
import Sidebar from '../sidebar/index.jsx';
import Footer from '../footer/index.jsx';
import { flatDocPages } from '../../route-config.js';
import { LATEST_MAJOR, PREVIEW_MAJOR } from '../doc-version/index.jsx';
import style from './style.module.css';

export function GuidePage() {
	const { version, name } = useRoute().params;
	const isValidRoute = flatDocPages[version]['/' + name];

	return (
		<ErrorBoundary>
			{isValidRoute ? <GuideLayout /> : <NotFound />}
		</ErrorBoundary>
	);
}

function GuideLayout() {
	const { path } = useRoute();
	const { html, meta } = useContent(path);

	return (
		<div class={cx(style.page, style.withSidebar)}>
			<div class={style.outer}>
				<div class={style.sidebarWrap}>
					<Sidebar />
				</div>
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

	if (version === LATEST_MAJOR) {
		return null;
	}

	const outdatedVersion = version !== PREVIEW_MAJOR;
	const latestExists = flatDocPages[LATEST_MAJOR]['/' + name];

	return (
		<div class={style.stickyWarning}>
			You are viewing the documentation for an{' '}
			{outdatedVersion ? 'older' : 'upcoming'} version of Preact.
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
