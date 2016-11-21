import { h, Component } from 'preact';
import { Provider } from '../lib/store';
import createStore from '../store';
import Routes from './routes';
import Header from './header';
import Footer from './footer';

/*global ga*/

let store = createStore();

export default class App extends Component {
	handleUrlChange({ url }) {
		let prev = store.getState().url || '/';
		if (url!==prev) {
			store.setState({ url });
			ga('send', 'pageview', url);
		}
	}

	render() {
		return (
			<Provider store={store}>
				<div id="app">
					<Header />
					<Routes onChange={this.handleUrlChange} />
					<Footer />
				</div>
			</Provider>
		);
	}
}
