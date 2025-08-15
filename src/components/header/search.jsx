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

// Inject DocSearch styles into the document head *before* app styles
function injectDocsearchCSS() {
	if (document.querySelector(`link[href="${DocSearchStylesURL}"]`)) return;

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.crossOrigin = '';
	link.href = DocSearchStylesURL;
	document.head.insertAdjacentElement('afterbegin', link);
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
	const ref = useRef(null);
	const rendered = useRef(false);

	const loadDocSearch = () => {
		if (ref.current && !rendered.current) {
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
				ref.current
			);
			rendered.current = true;
		}
	};

	return (
		<div class={style.search} ref={ref}>
			{/* Copy/paste of the HTML DocSearch normally generates, used as a placeholder */}
			<button
				type="button"
				aria-label="Search"
				class="DocSearch DocSearch-Button"
				onMouseOver={loadDocSearch}
				onTouchStart={loadDocSearch}
				onFocus={loadDocSearch}
			>
				<span class="DocSearch-Button-Container">
					<span class="DocSearch-Button-Placeholder">Search</span>
				</span>
			</button>
		</div>
	);
}
