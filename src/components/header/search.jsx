import { render } from 'preact';
import { useRef } from 'preact/hooks';
import { lazy, ErrorBoundary } from 'preact-iso';
import style from './style.module.css';
import config from '../../config.json';

const DocSearch = lazy(() => import('@docsearch/react').then(m => m.DocSearch));
const DocSearchStylesURL = new URL(
	'@docsearch/css/dist/style.css',
	import.meta.url
).href;

/**
 * Inject Docsearch styles into the document head above app styles,
 * solving some specificity issues w/ Vite's default lazy loading of CSS.
 */
function injectDocsearchCSS() {
	if (document.querySelector(`link[href="${DocSearchStylesURL}"]`)) return;

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.crossOrigin = '';
	link.href = DocSearchStylesURL;
	document.head.insertAdjacentElement('afterbegin', link);
}

/**
 * Wait for Docsearch to initialize so we can trigger a click if the user
 * interacted with the placeholder button prior to Docsearch fully loading.
 *
 * @param {HTMLElement} root
 * @returns {Promise<HTMLElement>}
 */
function waitForDocsearch(root) {
	return new Promise(resolve => {
		const getDocSearchButton = () =>
			document.querySelector('.DocSearch.DocSearch-Button');

		// Not included in the initial render, as we always style it w/ `display: none`,
		// so useful as a marker for whether DocSearch has been initialized.
		let target = root.querySelector('.DocSearch-Button-Keys');
		if (target) return resolve(getDocSearchButton());

		const observer = new MutationObserver(() => {
			target = getDocSearchButton();
			if (target) {
				observer.disconnect();
				resolve(getDocSearchButton());
			}
		});

		observer.observe(root, { childList: true, subtree: true });
	});
}

// Might be a problem with the Algolia data, but it seemingly
// appends `#app` to all URLs without a hash fragment.
//
// It also returns the full prod URL, which isn't ideal for dev/staging
const transformItems = items =>
	items.map(i => {
		const url = new URL(i.url);
		return Object.assign(i, {
			url: url.pathname + url.hash.replace(/#app$/, '')
		});
	});

export default function Search() {
	const root = useRef(null);
	const rendered = useRef(false);
	const interactedWith = useRef(false);

	const loadDocSearch = () => {
		if (!rendered.current) {
			// The <loading-bar> is sat alongside the router & has it's state controlled by it,
			// so while we could create a new context to be able to set it here, direct DOM
			// manipulation is a heck of a lot simpler.
			const loadingBar = document.querySelector('loading-bar');
			loadingBar.setAttribute('showing', 'true');

			injectDocsearchCSS();
			render(
				<ErrorBoundary>
					<DocSearch
						apiKey={config.docsearch.apiKey}
						indexName={config.docsearch.indexName}
						appId={config.docsearch.appId}
						transformItems={transformItems}
					/>
				</ErrorBoundary>,
				root.current
			);

			waitForDocsearch(root.current).then(docsearchButton => {
				loadingBar.removeAttribute('showing');
				if (interactedWith.current) {
					docsearchButton.click();
				}
			});
			rendered.current = true;
		}
	};

	// Is `onClick` the only one we need? Enter key will trigger `click` events too on buttons
	const onInteraction = () => {
		interactedWith.current = true;
	};

	return (
		<div class={style.search} ref={root}>
			{/* Copy/paste of the HTML DocSearch normally generates, used as a placeholder */}
			<button
				type="button"
				aria-label="Search"
				class="DocSearch DocSearch-Button"
				onMouseOver={loadDocSearch}
				onTouchStart={loadDocSearch}
				onFocus={loadDocSearch}
				onClick={onInteraction}
			>
				<span class="DocSearch-Button-Container">
					<span class="DocSearch-Button-Placeholder">Search</span>
				</span>
			</button>
		</div>
	);
}
