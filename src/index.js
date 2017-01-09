import './lib/polyfills';
import './style';
import './offline';
import { h, render } from 'preact';

let root = document.getElementById('app');

let init = () => {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
};

init();

if (module.hot) {
	require('preact/devtools');

	module.hot.accept('./components/app', () => requestAnimationFrame( () => {
		init();
	}) );
}
