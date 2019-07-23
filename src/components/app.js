import { h, Component } from 'preact';
import { Provider } from 'unistore/preact';
import createStore from '../store';
import Routes from './routes';
import Header from './header';
import Footer from './footer';

export default class App extends Component {
	store = createStore({
		url: this.props.url || location.pathname
	});

	handleUrlChange = ({ url }) => {
		let prev = this.store.getState().url || '/';
		if (url !== prev && typeof ga === 'function') {
			this.store.setState({ url });
			ga('send', 'pageview', url);
		}
	};

	render() {
		const { url } = this.store.getState();
		return (
			<Provider store={this.store}>
				<div id="app">
					<Header url={url} />
					<Routes url={url} onChange={this.handleUrlChange} />
					<Footer />
				</div>
			</Provider>
		);
	}
}
