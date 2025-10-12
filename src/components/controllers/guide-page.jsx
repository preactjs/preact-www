import { useState, useEffect } from 'preact/hooks';
import { useRoute, ErrorBoundary } from 'preact-iso';
import { useContent } from '../../lib/use-content';
import { useLanguage } from '../../lib/i18n.jsx';
import config from '../../config.json';
import { NotFound } from './not-found';
import cx from '../../lib/cx';
import { MarkdownRegion } from './markdown-region';
import Sidebar from '../sidebar';
import Footer from '../footer/index';
import { flatv10DocPages } from '../../config.js';
//import { docRoutes } from '../../lib/route-utils';
import { LATEST_MAJOR, PREVIEW_MAJOR } from '../doc-version';
import style from './style.module.css';

export function GuidePage() {
	const { version, name } = useRoute().params;
	const isValidRoute = flatv10DocPages['/' + name];

	return (
		<ErrorBoundary>
			{isValidRoute ? <GuideLayout /> : <NotFound />}
		</ErrorBoundary>
	);
}

function GuideLayout() {
	const [isMounted, setMounted] = useState(false);
	const { path } = useRoute();
	const { html, meta } = useContent(path);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div class={cx(style.page, style.withSidebar)}>
			<div class={style.outer}>
				<div class={style.sidebarWrap}>
					<Sidebar />
				</div>
				<div class={style.inner}>
					{<OldDocsWarning />}
					{isMounted && <UnmaintainedTranslationWarning meta={meta} />}
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
	const latestExists = config.docs[LATEST_MAJOR].some(section =>
		section.routes.some(route => route.path === '/' + name)
	);

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

// Maybe include zh? It's received some contributions recently
const MAINTAINED_LANGUAGES = ['en', 'ru', 'zh'];

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentMetaData} props.meta
 */
function UnmaintainedTranslationWarning({ meta }) {
	const { path, params } = useRoute();
	const { name, version } = params;
	const [lang, setLang] = useLanguage();

	if (
		version !== LATEST_MAJOR ||
		MAINTAINED_LANGUAGES.includes(lang) ||
		meta.isFallback
	) {
		return null;
	}

	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}.md`;

	return (
		<div class={style.stickyWarning}>
			<details>
				<summary>You are viewing an unmaintained translation</summary>
				Whilst we try to offer these docs in as many languages as possible, we
				rely upon our community members to help us maintain them. This
				translation has seen little maintenance in recent months and may have
				fallen out of sync with the English version.
			</details>
			<div class={style.unmaintaindTranslationLinks}>
				<a
					href={`/guide/${LATEST_MAJOR}/${name}`}
					onClick={() => setLang('en')}
				>
					Switch to the English version
				</a>
				<a href={editUrl} target="_blank" rel="noopener noreferrer">
					Contribute to this translation
				</a>
			</div>
		</div>
	);
}
