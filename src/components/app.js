import { h, Component } from 'preact';
import { Provider } from 'unistore/preact';
import createStore from '../store';
import Routes from './routes';
import Header from './header';
import { storeCtx } from './store-adapter';
import { getCurrentDocVersion } from '../lib/docs';

export default class App extends Component {
	store = createStore({
		url: this.props.url || location.pathname,
		lang: 'en',
		docVersion: getCurrentDocVersion(location.pathname),
		toc: null
	});

	handleUrlChange = ({ url }) => {
		let prev = this.store.getState().url || '/';
		if (url !== prev) {
			this.store.setState({
				...this.store.getState(),
				toc: null,
				url,
				docVersion: getCurrentDocVersion(url)
			});
			if (typeof ga === 'function') {
				ga('send', 'pageview', url);
			}
		}
	};

	render() {
		const { url } = this.store.getState();
		return (
			<Provider store={this.store}>
				<storeCtx.Provider value={this.store}>
					<div id="app">
						<Header url={url} />
						<Routes url={url} onChange={this.handleUrlChange} />
					</div>
				</storeCtx.Provider>
			</Provider>
		);
	}
}
