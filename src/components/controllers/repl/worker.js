import { transform, availablePresets, availablePlugins } from 'babel-standalone';

// rpc
addEventListener('message', ({ data }) => {
	let { id, method, params } = data;
	new Promise( r => r() )
		.then( () => ACTIONS[method](...[].concat(params)) )
		.then( result => postMessage({ id, result }) )
		.catch( ({ message, loc }) => postMessage({ id, error:{message,loc} }) );
});

const ACTIONS = {};

ACTIONS.ping = () => 'pong';

ACTIONS.transform = code => {
	let out = transform(code, {
		sourceMap: true,
		presets: ['es2015', 'stage-0', 'react'],
		plugins: [
			[availablePlugins['transform-react-jsx'], { pragma:'h' }]
		]
	});

	// wrap & append sourceMap
	let transpiled = out && out.code || '';
	transpiled = `(function(h,Component,render,module,exports,regeneratorRuntime,fetch){\n${transpiled}\n})`;

	if (transpiled && out.map) {
		transpiled += `\n//@ sourceMappingURL=data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(out.map))))}`;
	}

	return transpiled;
};
