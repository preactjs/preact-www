import { transform } from 'sucrase';

const PREPEND = `(function(module,exports,require,fetch){`;

const IMPORTS = `
const {h,createElement,Fragment,Component,render,hydrate} = require('preact');
const {useState,useReducer,useEffect,useLayoutEffect,useRef,useImperativeHandle,useMemo,useCallback,useContext,useDebugValue} = require('preact/hooks');\n
`;

export function ping() {
	return true;
}

export function process(code) {
	code = `${IMPORTS}${code}`;

	if (!code.match(/[\s\b;,]export[{ ]/)) {
		code = code.replace(
			/([\s\b;,])((async )?(function|class)[\s{])/g,
			'$1export default $2'
		);
	}

	const out = transform(code, {
		filePath: 'repl.js',
		// sourceMapOptions: {},
		transforms: ['jsx', 'typescript', 'imports'],
		// omit _jsxSource junk
		production: true,
		// .default fixing since we're using shim modules
		enableLegacyTypeScriptModuleInterop: true,
		enableLegacyBabel5ModuleInterop: true,
		jsxPragma: 'h',
		jsxFragmentPragma: 'Fragment'
	});

	// wrap & append sourceMap
	let transpiled = (out && out.code) || '';
	transpiled = `${PREPEND}\n${transpiled}\n})`;

	if (transpiled && out.map) {
		try {
			// Do not format this line or worker-loader will fail for some reason!
			// prettier-ignore
			transpiled += `\n//@ sourceMappingURL=data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(out.map))))}`;
		} catch (e) {
			console.error(`Source Map generation failed: ${e}`);
		}
	}

	return transpiled;
}
