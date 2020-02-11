import './style/index.less';
import './analytics';
import './pwa';
import App from './components/app';
import * as preact from 'preact';
import * as hooks from 'preact/hooks';

// Inline `preact/devtools` from the latest Preact release here, because
// we can't update the Preact version until hydration is sorted out.
// TODO: Replace this with `import "preact/devtools"` once hydration
// is solved.
if (typeof window !== 'undefined' && window.__PREACT_DEVTOOLS__) {
	window.__PREACT_DEVTOOLS__.attachPreact('10.0.5', preact.options, {
		Fragment: preact.Fragment
	});
}

export default App;

// allows users to play with preact in the browser developer console
global.preact = { ...preact, ...hooks };

// Install JSDOM's DOMParser globally. Used by <Markup> component's parser.
if (PRERENDER) {
	const jsdom = __non_webpack_require__('jsdom');
	global.DOMParser = new jsdom.JSDOM().window.DOMParser;
}
