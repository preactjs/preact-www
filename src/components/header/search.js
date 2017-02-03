import { h, Component } from 'preact';
import style from './style';
import config from '../../config';

let docsearchInstance, input;

export default class Search extends Component {
	id = 'docsearch-input';

	load = () => this.timer = setTimeout(() => {
		if (window.docsearch) return;

		let head = document.head || document.querySelector('head');

		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = '//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css';
		head.appendChild(link);

		let script = document.createElement('script');
		script.src = '//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js';
		script.onload = script.onerror = this.loaded;
		head.appendChild(script);
	}, 2000);

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

			if (/loaded|complete/.test(document.readyState)) {
				this.load();
			}
			else {
				addEventListener('load', this.load);
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		if (input && input.parentNode) input.parentNode.removeChild(input);
	}

	render() {
		return <div class={style.search} />;
	}
}
