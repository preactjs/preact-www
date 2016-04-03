import { h, render } from 'preact';
import './polyfills';
import './style';
import { install } from 'offline-plugin/runtime';

let root;
function init() {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
}

init();
install();

if (process.env.NODE_ENV==='development' && module.hot) {
	let log = console.log,
		logs = [];
	console.log = (t, ...args) => {
		if (typeof t==='string' && t.match(/^\[(HMR|WDS)\]/)) {
			if (t.match(/(up to date|err)/i)) logs.push(t.replace(/^.*?\]\s*/m,''), ...args);
		}
		else {
			log.call(console, t, ...args);
		}
	};
	module.hot.accept('./components/app', () => requestAnimationFrame( () => {
		console.log(`%c🚀 ${logs.join(' ')}`, 'color:#888;');
		logs.length = 0;
		init();
	}) );
}
