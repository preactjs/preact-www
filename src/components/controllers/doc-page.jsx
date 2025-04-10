import { useRoute } from 'preact-iso';
import { useContent } from '../../lib/use-content';
import { useLanguage } from '../../lib/i18n.jsx';
import config from '../../config.json';
import { NotFound } from './not-found';
import cx from '../../lib/cx';
import { MarkdownRegion } from './markdown-region';
import Sidebar from '../sidebar';
import Footer from '../footer/index';
import { docRoutes } from '../../lib/route-utils';
import { LATEST_MAJOR } from '../doc-version';
import style from './style.module.css';

export function DocPage() {
	const { params } = useRoute();
	const { version, name } = params;

	if (!docRoutes[version]['/' + name]) {
		return <NotFound />;
	}

	return <DocLayout isGuide />;
}

export function DocLayout({ isGuide = false }) {
	const { path } = useRoute();
	const { html, meta } = useContent(path === '/' ? 'index' : path);

	return (
		<div class={cx(style.page, isGuide && style.withSidebar)}>
			<div class={style.outer}>
				{isGuide && (
					<div class={style.sidebarWrap}>
						<Sidebar />
					</div>
				)}
				<div class={style.inner}>
					{isGuide && <OldDocsWarning />}
					{isGuide && <UnmaintainedTranslationWarning meta={meta} />}
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

	const latestExists = config.docs[LATEST_MAJOR].some(section =>
		section.routes.some(route => route.path === '/' + name)
	);

	return (
		<div class={style.stickyWarning}>
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

// Maybe include zh? It's received some contributions recently
const MAINTAINED_LANGUAGES = ['en', 'ru'];
function UnmaintainedTranslationWarning({ meta }) {
	const { path, params } = useRoute();
	const { name, version } = params;
	const [lang, setLang] = useLanguage();

	if (version !== LATEST_MAJOR || MAINTAINED_LANGUAGES.includes(lang) || meta.isFallback) {
		return null;
	}

	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}.md`;

	return (
		<div class={style.stickyWarning}>
			<details>
				<summary>You are viewing an unmaintained translation</summary>

				Whilst we try to offer these docs in as many languages as possible, we rely upon
				our community members to help us maintain them. This translation has seen little
				maintenance in recent months and may have fallen out of sync with the English version.
			</details>
			<div class={style.unmaintaindTranslationLinks}>
				<a
					href={`/guide/${LATEST_MAJOR}/${name}`}
					onClick={() => setLang('en')}
				>
					Switch to the English version
				</a>
				<a
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					Contribute to this translation
				</a>
			</div>
		</div>
	);
}
