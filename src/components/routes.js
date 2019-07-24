import { h, Component } from 'preact';
import { Router } from 'preact-router';
import config from '../config.json';
import controllers from './controllers';
import { Redirect } from '../lib/router.js';

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
					{/* Redirect old urls */}
					<Redirect
						path="/guide/getting-started"
						to="/guide/v8/getting-started"
					/>
					<Redirect
						path="/guide/differences-to-react"
						to="/guide/v8/differences-to-react"
					/>
					<Redirect
						path="/guide/switching-to-preact"
						to="/guide/v8/switching-to-preact"
					/>
					<Redirect
						path="/guide/types-of-components"
						to="/guide/v8/types-of-components"
					/>
					<Redirect path="/guide/api-reference" to="/guide/v8/api-reference" />
					<Redirect path="/guide/forms" to="/guide/v8/forms" />
					<Redirect path="/guide/linked-state" to="/guide/v8/linked-state" />
					<Redirect
						path="/guide/external-dom-mutations"
						to="/guide/v8/external-dom-mutations"
					/>
					<Redirect
						path="/guide/extending-component"
						to="/guide/v8/extending-component"
					/>
					<Redirect
						path="/guide/unit-testing-with-enzyme"
						to="/guide/v8/unit-testing-with-enzyme"
					/>
					<Redirect
						path="/guide/progressive-web-apps"
						to="/guide/v8/progressive-web-apps"
					/>
					<controllers.error route={{ content: '404', title: '404' }} default />
				</Router>
			</main>
		);
	}
}
