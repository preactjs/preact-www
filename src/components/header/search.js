import { h, Component } from 'preact';
import style from './style';
import config from '../../config';
import { lazily, cancelLazily } from '../../lib/lazily';

let docsearchInstance, input;

export default class Search extends Component {
	id = 'docsearch-input';

	load = () => {
		this.lazy = lazily(() => {
			if (window.docsearch) return;

			let head = document.head || document.querySelector('head');

			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css';
			head.appendChild(link);

			let script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js';
			script.onload = script.onerror = this.loaded;
			head.appendChild(script);
		});
	};

	loaded = () => {
		let docsearch = typeof window!=='undefined' && window.docsearch;
		if (docsearch && !docsearchInstance) {
			docsearchInstance = docsearch({
				apiKey: config.docsearch.apiKey,
				indexName: config.docsearch.indexName,
				inputSelector: `#${this.id}`
			});
		}
	};

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		input = input || document.getElementById(this.id);

		if (!input) {
			input = document.createElement('input');
			input.required = true;
			input.id = this.id;
			input.className = style.searchBox;
			this.base.appendChild(input);

			this.load();
			// if (/loaded|complete/.test(document.readyState)) {
			// 	this.load();
			// }
			// else {
			// 	addEventListener('load', this.load);
			// }
		}
	}

	componentWillUnmount() {
		cancelLazily(this.lazy);
		if (input && input.parentNode) input.parentNode.removeChild(input);
	}

	render() {
		return <div class={style.search} />;
	}
}
