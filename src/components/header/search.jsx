import { lazy } from 'preact-iso';
import style from './style.module.css';
import config from '../../config.json';

const DocSearch = lazy(() => import('@docsearch/react').then(m => m.DocSearch));

// Might be a problem with the Algolia data, but it seemingly
// appends `#app` to all URLs without a hash fragment.
//
// It also returns the full prod URL, which isn't ideal for dev/staging
const transformItems = (items) =>
	items.map(i => {
			const url = new URL(i.url);
			return Object.assign(i, { url: url.pathname + url.hash.replace(/#app$/, '') });
		}
	);

export default function Search() {
	return (
		<div class={style.search}>
			<DocSearch
				apiKey={config.docsearch.apiKey}
				indexName={config.docsearch.indexName}
				appId={config.docsearch.appId}
				transformItems={transformItems}
			/>
		</div>
	);
}
