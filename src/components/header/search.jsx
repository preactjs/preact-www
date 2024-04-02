import style from './style.module.css';
import config from '../../config.json';
import { DocSearch } from '@docsearch/react';

import './docsearch.css';

// Might be a problem with the Algolia data, but it appends `#app` to all URLs without a hash fragment
const transformItems = (items) =>
	items.map(i =>
		Object.assign(i, { url: new URL(i.url).pathname.replace(/#app$/, '') })
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
