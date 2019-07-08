import './window';
import { transform, availablePlugins } from 'babel-standalone';

// rpc
addEventListener('message', ({ data }) => {
	let { id, method, params } = data;
	new Promise( r => r() )
		.then( () => ACTIONS[method](...[].concat(params)) )
		.then( result => postMessage({ id, result }) )
		.catch( ({ message, loc }) => postMessage({ id, error: { message,loc } }) );
});

const ACTIONS = {};

ACTIONS.ping = () => 'pong';

const PREPEND = '(function(h,Component,render,module,exports,regeneratorRuntime,fetch){';

ACTIONS.transform = code => {
	let mocked = '//' + new Array(PREPEND.length-1).join(' ') + '\n' + code;

	let out = transform(mocked, {
		sourceMap: true,
		presets: ['es2015', 'stage-0', 'react'],
		plugins: [
			[availablePlugins['transform-react-jsx'], { pragma: 'h' }]
		]
	});

	// wrap & append sourceMap
	let transpiled = out && out.code || '';
	transpiled = `${PREPEND}\n${transpiled}\n})`;

	if (transpiled && out.map) {
		try {
			transpiled += `\n//@ sourceMappingURL=data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(out.map))))}`;
		}
		catch (e) {
			console.error(`Source Map generation failed: ${e}`);
		}
	}

	return transpiled;
};
