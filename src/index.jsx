import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { hydrate, prerender as ssr } from 'preact-iso';
import App from './components/app';
import './style/index.css';
//import './analytics';
//import './pwa';

// allows users to play with preact in the browser developer console
globalThis.preact = { ...preact, ...hooks };


if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender() {
	globalThis.prismWorker = await import('./components/code-block/prism.worker.js');
	globalThis.markedWorker = await import('./lib/marked.worker.js');

	const { DOMParser } = await import('@xmldom/xmldom');
	globalThis.DOMParser = DOMParser;

	return await ssr(<App />);
}
