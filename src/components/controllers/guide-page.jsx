import { useLayoutEffect, useRef } from 'preact/hooks';
import { useRoute, ErrorBoundary } from 'preact-iso';
import { useContent } from '../../lib/use-content.js';
import { NotFound } from './not-found.jsx';
import cx from '../../lib/cx.js';
import { MarkdownRegion } from './markdown-region.jsx';
import EditThisPage from '../edit-button/index.jsx';
import Sidebar from '../sidebar/index.jsx';
import Footer from '../footer/index.jsx';
import { docPages, flatDocPages } from '../../route-config.js';
import { useTranslate } from '../../lib/i18n.jsx';
import { LATEST_MAJOR, PREVIEW_MAJOR } from '../doc-version/index.jsx';
import style from './style.module.css';

export function GuidePage() {
	const { version, name } = useRoute().params;
	// Unknown versions (e.g. `/guide/v99/...`) are 404s too
	const isValidRoute = flatDocPages[version]?.['/' + name];

	return (
		<ErrorBoundary>
			{isValidRoute ? <GuideLayout /> : <NotFound />}
		</ErrorBoundary>
	);
}

function GuideLayout() {
	const { path } = useRoute();
	const { html, meta } = useContent(path);
	// Same headings as the inline table of contents, which this replaces
	const tocItems = (meta.toc || []).filter((item) => item.level >= 2);

	return (
		<div class={style.docs}>
			<div class={style.docsInner}>
				<div class={style.docsSidebar}>
					<Sidebar />
				</div>
				{/* Before the article in tab order, shown on its right (`order`) */}
				<PageToc items={tocItems} />
				<div
					class={style.docsMain}
					data-has-page-toc={tocItems.length > 0 || undefined}
				>
					<OldDocsWarning />
					<div class={style.docsMeta}>
						<Breadcrumb />
						<EditThisPage meta={meta} inline />
					</div>
					<MarkdownRegion html={html} meta={meta} showEditLink={false} />
				</div>
			</div>
			<Footer />
		</div>
	);
}

function Breadcrumb() {
	const { version, name } = useRoute().params;
	const translate = useTranslate();
	const sections = docPages[version];

	let section = null;
	if (version !== 'v8') {
		for (const key in sections) {
			if ('/' + name in sections[key]) {
				section = translate('sidebarSections', key);
				break;
			}
		}
	}

	return (
		<p class={style.breadcrumb}>
			Preact / {translate('headerNav', 'docs')}
			{section && <span> / {section}</span>}
		</p>
	);
}

/**
 * "On this page" navigation, built from the page's h2 and deeper headings.
 *
 * @param {{ items: import('../../types.d.ts').TableOfContents[] }} props
 */
function PageToc({ items }) {
	const translate = useTranslate();
	// A plain column: the <nav> inside is the landmark (and there's none,
	// rather than an empty one, on pages without headings)
	if (items.length === 0) return <div class={style.docsToc} />;

	return (
		<div class={style.docsToc}>
			<div class={style.tocInner}>
				<p class={style.tocLabel}>{translate('i18n', 'onThisPage')}</p>
				<nav aria-label={translate('i18n', 'onThisPage')}>
					{items.map(({ id, text, level }, i) => (
						<a
							// Headings (and so ids) can repeat on a page
							key={`${i}-${id}`}
							href={'#' + id}
							class={cx(level > 2 && style.tocNested)}
							data-depth={level > 3 ? 2 : undefined}
						>
							{text.replace(/`/g, '')}
						</a>
					))}
				</nav>
			</div>
		</div>
	);
}

function OldDocsWarning() {
	const { name, version } = useRoute().params;
	const ref = useRef(/** @type {HTMLDivElement | null} */ (null));

	// It's sticky at the top: keep #fragment targets (via the headings'
	// `scroll-margin-top`) and focused content (e.g. a link reached via
	// Shift+Tab) clear of it
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || typeof ResizeObserver == 'undefined') return;
		const root = document.documentElement;
		const observer = new ResizeObserver(() =>
			root.style.setProperty(
				'--sticky-warning-space',
				// Its height plus a small gap
				`${el.getBoundingClientRect().height + 8}px`
			)
		);
		observer.observe(el);
		// Browsers only scroll a focused element into view if it's off-screen:
		// move it out from under the warning
		/** @param {FocusEvent} e */
		const onFocusIn = (e) => {
			const target = /** @type {Element} */ (e.target);
			// Only what scrolls under it: not the header, the mobile menu or the
			// docs drawer (fixed dialogs), which merely sit at the same height
			if (
				el.contains(target) ||
				!target.closest?.('main') ||
				target.closest('[role="dialog"]')
			) {
				return;
			}
			const warning = el.getBoundingClientRect();
			const rect = target.getBoundingClientRect();
			if (
				rect.top < warning.bottom &&
				rect.bottom > warning.top &&
				rect.left < warning.right &&
				rect.right > warning.left
			) {
				scrollBy({ top: rect.top - warning.bottom - 8 });
			}
		};
		addEventListener('focusin', onFocusIn);
		return () => {
			observer.disconnect();
			removeEventListener('focusin', onFocusIn);
			root.style.removeProperty('--sticky-warning-space');
		};
	}, [version]);

	if (version === LATEST_MAJOR) {
		return null;
	}

	const outdatedVersion = version !== PREVIEW_MAJOR;
	const latestExists = flatDocPages[LATEST_MAJOR]['/' + name];

	return (
		<div ref={ref} class={style.stickyWarning}>
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
