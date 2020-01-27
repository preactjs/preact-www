import { h, Component } from 'preact';
import { Router } from 'preact-router';
import config from '../config.json';
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

export default class Routes extends Component {
	/**
	 * Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = event => {
		let { onChange } = this.props;
		if (onChange) onChange(event);
	};

	shouldComponentUpdate() {
		return false;
	}

	getNavRoutes(nav) {
		return nav.reduce((routes, route) => {
			if (route.path) {
				routes.push(this.buildRoute(route));
			}
			if (route.routes) {
				routes = routes.concat(this.getNavRoutes(route.routes));
			}
			return routes;
		}, []);
	}

	buildRoute(route) {
		let Ctrl = controllers.default;
		if (route.controller) {
			// eslint-disable-next-line no-unused-vars
			for (let i in controllers) {
				if (i.toLowerCase() === route.controller.toLowerCase()) {
					Ctrl = controllers[i];
				}
			}
		}
		return <Ctrl path={route.path || ''} route={route} />;
	}

	render({ url }) {
		return (
			<main>
				<Router url={url} onChange={this.handleRoute}>
					{this.getNavRoutes(config.docs)}
					{this.getNavRoutes(config.nav)}
					<controllers.error route={{ content: '404', title: '404' }} default />
				</Router>
			</main>
		);
	}
}
