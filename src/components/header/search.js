import { h, Component } from 'preact';
import style from './style';
import config from '../../config';

let counter = 0;

export default class Search extends Component {
	id = `docsearch-input-${++counter}`;

	loaded = () => {
		let { docsearch } = window;
		if (docsearch) {
			docsearch({
				apiKey: config.docsearch.apiKey,
				indexName: config.docsearch.indexName,
				inputSelector: `#${this.id}`,
				autocompleteOptions: {
					dropdownMenuContainer: 'body'
				}
			});
		}
	};

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		setTimeout( () => {
			if (!window.docsearch) {
				let head = document.head || document.querySelector('head');

				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css';
				head.appendChild(link);

				let script = document.createElement('script');
				script.src = '//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js';
				script.onload = script.onerror = this.loaded;
				head.appendChild(script);
			}
		}, 500);
	}

	render() {
		return (
			<div class={style.search}>
				<input
					id={this.id}
					class={style.searchBox}
					required
				/>
			</div>
		);
	}
}
