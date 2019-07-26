import { h, Component } from 'preact';
import { Provider } from 'unistore/preact';
import createStore from '../store';
import Routes from './routes';
import Header from './header';
import { storeCtx } from './store-adapter';

/*global ga*/

// `preact-router` doesn't support url paths like `/docs/:version/*`
// so we'll just use a plain regex for now.
const LATEST_MAJOR = 10;
const reg = /\/guide\/v(\d{1,2})\/.*/;
function getCurrentDocVersion(url) {
	const match = url.match(reg);
	return match != null ? match[1] : LATEST_MAJOR;
}

let store = createStore({
	url: location.pathname,
	lang: '',
	docVersion: getCurrentDocVersion(location.pathname)
});

export default class App extends Component {
	handleUrlChange({ url }) {
		let prev = store.getState().url || '/';
		if (url !== prev && typeof ga === 'function') {
			store.setState({ url, docVersion: getCurrentDocVersion(url) });
			ga('send', 'pageview', url);
		}
	}

	render() {
		let url = store.getState().url;
		return (
			<Provider store={store}>
				<storeCtx.Provider value={store}>
					<div id="app">
						<Header url={url} />
						<Routes url={url} onChange={this.handleUrlChange} />
					</div>
				</storeCtx.Provider>
			</Provider>
		);
	}
}
