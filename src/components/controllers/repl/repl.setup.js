import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import * as debug from 'preact/debug';
import * as compat from 'preact/compat';
import * as htm from 'htm';
import * as htmPreact from 'htm/preact';
import * as preactCustomElement from 'preact-custom-element';

let modules = {};
let moduleCache = {
	preact,
	'preact/hooks': hooks,
	'preact/debug': debug,
	'preact/compat': compat,
	react: compat,
	'react-dom': compat,
	htm,
	'htm/preact': htmPreact,
	'preact-custom-element': preactCustomElement
};

window._require = function(id) {
	// flatten unpkg
	if (typeof id === 'string') {
		id = id.replace(/(^(https?:)?\/\/unpkg\.com\/|\?module$)/gi, '');
	}
	if (id in moduleCache) {
		return moduleCache[id];
	}
	if (id in modules) {
		return (moduleCache[id] = modules[id]());
	}
	throw Error(`No module found for ${id}`);
};
