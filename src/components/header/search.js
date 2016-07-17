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
		if (!window.docsearch) {
			let script = document.createElement('script');
			script.async = true;
			script.src = '//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js';
			script.onload = script.onerror = this.loaded;
			document.body.appendChild(script);
		}
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
