import './style/index.less';
import './analytics';
import './pwa';
import App from './components/app';
import * as preact from 'preact';
import * as hooks from 'preact/hooks';

let app = App;

if (!PRERENDER) {
	app = undefined;
	const root = document.getElementById('app');
	preact.hydrate(preact.h(App), root.parentNode, root);
}

export default app;

// allows users to play with preact in the browser developer console
global.preact = { ...preact, ...hooks };

// Install JSDOM's DOMParser globally. Used by <Markup> component's parser.
if (PRERENDER) {
	const jsdom = __non_webpack_require__('jsdom');
	global.DOMParser = new jsdom.JSDOM().window.DOMParser;
}
