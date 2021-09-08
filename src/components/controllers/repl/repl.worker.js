import { parseStackTrace } from './errors';
import { transform, parse } from 'escorn';
import { expose } from 'comlink';
import babelHtm from 'babel-plugin-transform-jsx-to-htm';

const PREPEND = `(function(module,exports,require,fetch){`;

const IMPORTS = `
import {render,hydrate,h,createElement,Fragment,createRef,Component,cloneElement,createContext,toChildArray,options} from 'preact';
import {useState,useReducer,useEffect,useLayoutEffect,useRef,useImperativeHandle,useMemo,useCallback,useContext,useDebugValue} from 'preact/hooks';\n
`;

function process(code) {
	code = `${IMPORTS}${code}`;

	if (!code.match(/[\s\b;,]export[{ ]/)) {
		code = code.replace(
			/([\s\b;,])((async )?(function|class)[\s{])/g,
			'$1export default $2'
		);
	}

	let out = {};
	try {
		// FIXME: Sucrase imports a bunch of react-specific stuff which breaks
		const result = transform(code, {
			parse,
			plugins: [babelHtm]
		});
		out.code = result.code;
	} catch (err) {
		if (err.name !== 'SyntaxError' && /unexpected\stoken/i.test(err.message)) {
			let old = err;
			// eslint-disable-next-line no-ex-assign
			err = new SyntaxError(old.message);
			err.stack = old.stack;
			err.loc = old.loc;
		}

		if (err.name === 'SyntaxError') {
			const fileName = err.message.match(/([A-Za-z0-9_-]*\.js)/);
			const loc = err.message.match(/(\d+):(\d+)\)/) || [0, 0, 0];
			err.message = err.message
				.replace(/Error\stransforming\s.*\.js:/, '')
				.replace(/\(.*\)$/, '');
			const stack = parseStackTrace(err);

			let line = loc[1];
			let column = loc[2];

			// sucrase's line mappings are not correct even with this fix.
			// It seems like don't generate correct mappings
			if (line > 0) {
				line = /\sexpected/.test(err.message) ? line - 4 : line;
			}

			stack.splice(1, 0, `    at ${fileName[1]} (:${line}:${column})\n`);
			err.stack = stack.join('\n');

			if (!err.loc) {
				err.loc = {
					line,
					column
				};
			}
		}
		throw err;
	}

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

expose({
	ping() {
		return true;
	},
	process
});
