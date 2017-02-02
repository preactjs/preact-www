import './lib/polyfills';
import './style';
import { h, render } from 'preact';
require('offline-plugin/runtime').install();

let root = document.getElementById('app');
function init() {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
}

if (process.env.NODE_ENV==='development' && module.hot) {
	require('preact/devtools');
	module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
