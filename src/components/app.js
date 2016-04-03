import { h, Component } from 'preact';
import pure from 'pure-component';
import Routes from './routes';
import Header from './header';
import Footer from './footer';

/*global ga*/

@pure
export default class App extends Component {
	constructor({ url='/' }) {
		super();
		this.state = { url };
	}

	componentDidUpdate(prevProps, prevState) {
		let { url } = this.state;
		if (url!==prevState.url) {
			ga('send', 'pageview', url);
			// document.body.scrollTop = 0;
		}
	}

	render(_, { url }) {
		return (
			<div id="app">
				<Header url={url} />
				<Routes onChange={this.linkState('url', 'url')} />
				<Footer />
			</div>
		);
	}
}
