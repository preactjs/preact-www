import { h, Component } from 'preact';
import { Router, Route, ErrorBoundary } from 'preact-iso';
import config from '../config.json';
import { DocPage } from './doc-page';
import controllers from './controllers';

let { pushState } = history;
history.pushState = (a, b, url) => {
	pushState.call(history, a, b, url);
	if (url.indexOf('#') < 0) {
		// next time content loads, scroll to top:
		window.nextStateToTop = true;
		// scrollTo(0, 0);
	}
};

function isValidSiblingRoute(sibling, route) {
	const idx = route.path.lastIndexOf('/');
	const common = idx > 1 ? route.path.slice(0, idx) : route.path;
	return sibling && sibling.path.substring(0, common.length) === common;
}

let i = 0;

export default class Routes extends Component {
	state = { loading: true };

	shouldComponentUpdate(_, nextState) {
		if (this.state.loading !== nextState.loading) {
			return true;
		}
		console.log(this.state, nextState);
		return true;
	}

	render() {
		if (i++ > 30) {
			console.log('poop');
			throw new Error('poop');
		}
		return (
			<main>
				<progress-bar showing={!!this.state.loading} />
				<ErrorBoundary>
					<Router
						onLoadStart={() => {
							if (!this.state.loading) {
								this.setState({ loading: true });
							}
						}}
						onLoadEnd={() => {
							if (this.state.loading) {
								this.setState({ loading: false });
							}
						}}
					>
						<Route path="/guide/:version/:name" component={DocPage} />
						<controllers.error
							route={{ content: '404', title: '404' }}
							default
						/>
					</Router>
				</ErrorBoundary>
			</main>
		);
	}
}
