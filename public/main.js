import 'preact/devtools';
import { hydrate } from 'preact-iso';
import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { App } from '../src/index.js';

// allows users to play with preact in the browser developer console
globalThis.preact = { ...preact, ...hooks };

// Install JSDOM's DOMParser globally. Used by <Markup> component's parser.
if (import.meta.env.PRERENDER) {
	const jsdom = __non_webpack_require__('jsdom');
	globalThis.DOMParser = new jsdom.JSDOM().window.DOMParser;
}

if (typeof document !== 'undefined') {
	hydrate(<App />, document.getElementById('root'));
}

export async function prerender(data) {
	return (await import('../src/prerender.js')).prerender(<App {...data} />);
}
