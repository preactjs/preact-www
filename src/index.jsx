import './style/index.css';
import { render } from 'preact';
//import './analytics';
//import './pwa';
import App from './components/app';
//import * as preact from 'preact';
//import * as hooks from 'preact/hooks';

// allows users to play with preact in the browser developer console
//global.preact = { ...preact, ...hooks };

// Install JSDOM's DOMParser globally. Used by <Markup> component's parser.
//if (PRERENDER) {
//	const jsdom = __non_webpack_require__('jsdom');
//	global.DOMParser = new jsdom.JSDOM().window.DOMParser;
//}

render(<App />, document.getElementById('app'));
