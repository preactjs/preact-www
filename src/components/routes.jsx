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

function isValidSiblingRoute(sibling, route) {
	const idx = route.path.lastIndexOf('/');
	const common = idx > 1 ? route.path.slice(0, idx) : route.path;
	return sibling && sibling.path.substring(0, common.length) === common;
}

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
		const routes = [];
		const stack = [...nav];
		let route;
		while ((route = stack.pop())) {
			if (route.routes) {
				stack.push(...route.routes);
			} else {
				routes.push(route);
			}
		}

		return routes.reverse().reduce((out, route, i, routes) => {
			if (route.path) {
				const skip = route.path === '/' || /^\/about/.test(route.path);
				const prev = !skip && i - 1 > 0 ? routes[i - 1] : null;
				const next = !skip && i + 1 < routes.length ? routes[i + 1] : null;

				const view = this.buildRoute(
					route,
					isValidSiblingRoute(prev, route) ? prev : null,
					isValidSiblingRoute(next, route) ? next : null
				);
				out.push(view);
			}
			return out;
		}, []);
	}

	buildRoute(route, prev, next) {
		let Ctrl = controllers.default;
		if (route.controller) {
			// eslint-disable-next-line no-unused-vars
			for (let i in controllers) {
				if (i.toLowerCase() === route.controller.toLowerCase()) {
					Ctrl = controllers[i];
				}
			}
		}
		return (
			<Ctrl path={route.path || ''} route={route} prev={prev} next={next} />
		);
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
