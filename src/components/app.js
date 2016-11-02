import { h, Component } from 'preact';
import { Provider } from '../lib/store';
import createStore from '../store';
import pure from '../lib/pure-component';
import Routes from './routes';
import Header from './header';
import Footer from './footer';

/*global ga*/

let store = createStore();

@pure
export default class App extends Component {
	state = { url: this.props.url || '/' };

	componentDidUpdate(prevProps, prevState) {
		let { url } = this.state;
		if (url!==prevState.url) {
			ga('send', 'pageview', url);
			// document.body.scrollTop = 0;
		}
	}

	render(_, { url }) {
		return (
			<Provider store={store}>
				<div id="app">
					<Header url={url} />
					<Routes onChange={this.linkState('url', 'url')} />
					<Footer />
				</div>
			</Provider>
		);
	}
}
