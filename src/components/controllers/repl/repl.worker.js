import '@babel/polyfill';
import { rollup } from '@rollup/browser';
import { transform } from 'sucrase';
import { parseStackTrace } from './errors';

const PREPEND = `(function(module,exports){`;

// These are used by the Tutorial to inject solution detection.
const IMPORTS = `import * as $preact from 'preact';
import * as $hooks from 'preact/hooks';
Object.assign(self, {$preact:$preact,$hooks:$hooks},$preact);
self._require = m => self['$'+m];
`;

export function ping() {
	return true;
}

function transpile(code) {
	let codeUrl = `data:text/javascript;base64,${btoa(
		unescape(encodeURIComponent(code))
	)}`;
	try {
		return transform(code, {
			// prettier-ignore
			filePath: codeUrl,
			sourceMapOptions: {
				compiledFilename: 'repl.js'
			},
			transforms: ['jsx', 'typescript'],
			// omit _jsxSource junk
			production: true,
			jsxPragma: 'h',
			jsxFragmentPragma: 'Fragment'
		});
	} catch (err) {
		if (err.name !== 'SyntaxError' && /unexpected\stoken/i.test(err.message)) {
			let old = err;
			// eslint-disable-next-line no-ex-assign
			err = new SyntaxError(old.message);
			err.stack = old.stack;
			err.loc = old.loc;
		}

		if (err.name === 'SyntaxError') {
			err.message = err.message.replace(codeUrl, 'repl.js');
			const fileName = err.message.match(/([A-Za-z0-9_-]*\.js)/);
			// const fileName = 'repl.js';
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
				line = /\sexpected/.test(err.message) ? line - 2 : line;
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
}

async function bundle(sources) {
	const isSource = Object.prototype.hasOwnProperty.bind(sources);
	const bundle = await rollup({
		input: Object.keys(sources),
		treeshake: 'smallest',
		plugins: [
			{
				name: 'repl',
				resolveId(id, importer) {
					// Handle local source files
					if (isSource(id)) return id;

					// Resolve absolute path ids relative to their importer. For example,
					// esm.sh will return this internally. `https://esm.sh/preact` returns
					// `exports * from "/stable/preact@10.18.0/es2022/preact.mjs"`
					if (id[0] === '/') {
						if (!importer.match(/^https?:/)) {
							throw new Error(`Cannot resolve ${id} from ${importer}`);
						}

						try {
							return new URL(id, importer).href;
						} catch (e) {}
					}

					// If id is already an esm.sh url, add `?external=*` to it and return
					if (id.includes('://esm.sh/')) {
						const url = new URL(id);
						url.searchParams.set('external', '*');
						return url.href;
					}

					// Leave initial import, relative imports, & other http imports alone
					if (!importer || /(^\.\/|:\/\/)/.test(id)) {
						return id;
					}

					// For everything else (i.e. bare module specifiers), resolve to a
					// package on esm.sh. We'll support any syntax & options that esm.sh
					// supports
					const url = new URL(id, 'https://esm.sh/');
					url.searchParams.set('external', '*');
					return url.href;
				},
				async load(id) {
					if (isSource(id)) {
						const code = sources[id];
						const out = transpile(code);
						return out;
					}
					return get(id);
				}
			}
		]
	});
	const result = await bundle.generate({ format: 'cjs' });
	await bundle.close();
	return result.output[0];
}

// helper: cached http get text
const cache = new Map();
function get(url) {
	url = new URL(url).href;
	if (cache.has(url)) return cache.get(url);
	const p = fetch(url).then(r => (cache.set(r.url, p), r.text()));
	cache.set(url, p);
	return p;
}

export async function process(code, setup) {
	code = `${IMPORTS}${setup || ''}${code}`;

	const out = await bundle({
		'repl.js': code
	});

	// wrap & append sourceMap
	let transpiled = `${PREPEND}\n${(out && out.code) || ''}\n})`;

	if (transpiled && out.map) {
		try {
			transpiled += `\n//# sourceMappingURL=${out.map.toUrl()}`;
		} catch (e) {
			console.error(`Source Map generation failed: ${e}`);
		}
	}

	return transpiled;
}
