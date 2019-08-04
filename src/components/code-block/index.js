import { h } from 'preact';
import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
// import { highlight } from './prism.worker';
import cx from '../../lib/cx';

// const { highlight } = PRERENDER ? require('./prism.worker') : require('workerize-loader!./prism.worker');
let highlight;
if (PRERENDER) {
	highlight = require('./prism.worker').highlight;
} else {
	const createWorker = require('workerize-loader!./prism.worker');
	let worker;
	// highlight = (code, lang) => (worker || (worker = createWorker())).highlight(code, lang);
	highlight = (code, lang) => {
		if (!worker) worker = createWorker();
		// console.log('got worker: ', worker);
		return worker.highlight(code, lang);
	};
	// console.log({ highlight });
}

/*global PRERENDER */

// function unboxPromise(promise) {
// 	if (promise instanceof Promise) {
// 		if ('_value' in promise) return promise._value;
// 		if ('_error' in promise) throw promise._error;
// 	}
// 	return promise;
// }

function useFuture(initializer, params) {
	const getInitialState = () => {
		try {
			const value = initializer();
			if (value && value.then) {
				if ('_value' in value) return [value._value];
				if ('_error' in value) return [undefined, value._error];
				return [undefined, undefined, value];
			}
			return [value];
		} catch (err) {
			return [undefined, err];
		}
	};

	const [pair, setValue] = useState(getInitialState);
	// const prevParams = useRef(params);

	// only run on changes, not initial mount
	const isFirstRun = useRef(true);
	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		// for (let i=0; i<Math.max(params.length, prevParams.current.length); i++) {
		// 	if (params[i] !== prevParams.current[i]) {
		// 		console.log('differ['+i+']: ', params[i], prevParams.current[i]);
		// 	}
		// }
		// console.log('rehighlighting', params[0].substring(0,40), params[1]);
		// console.log(prevParams.current[0].substring(0,40), prevParams.current[1]);
		// prevParams.current = params;
		setValue(getInitialState());
	}, params || []);

	const pending = pair[2];
	if (pending) {
		if (!pending._processing) {
			pending._processing = true;
			pending
				.then(value => {
					pending._value = value;
					setValue([value]);
				})
				.catch(err => {
					pending._error = err;
					setValue([undefined, err]);
				});
		}
	}
	return pair;
}

const CACHE = {};
function cachedHighlight(code, lang) {
	const id = lang + '\n' + code;
	return CACHE[id] || (CACHE[id] = highlight(code, lang));
}

// function differing(obj, obj2) {
// 	for (let i in obj) if (obj2[i]!==obj[i]) return true;
// 	for (let i in obj2) if (!(i in obj)) return true;
// 	return false;
// }
// function sCU(props, state) {
// 	return differing(props, this.props) || differing(state, this.state);
// 	// return props.code !== this.props.code || props.lang !== this.props.lang;
// }

// let id = 0;

function HighlightedCodeBlock({ code, lang, ...props }) {
	// const renderCount = this._renders = (this._renders || 0) + 1;
	// this._id = this._id || ++id;
	const [highlighted, error, pending] = useFuture(
		() => cachedHighlight(code, lang),
		[code, lang]
	);
	const repl =
		(lang === 'js' || lang === 'jsx') &&
		code.split('\n').length > 2 &&
		props.repl !== 'false';
	const canHighlight = !!pending || !error;
	const html =
		(canHighlight && highlighted) ||
		code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const htmlObj = useMemo(() => ({ __html: html }), [html]);

	// if (renderCount > 1) {
	// if (code.match(/function Counter/)) {
	// 	console.log(`Component #${this._id} (render ${renderCount})`, { pending, error, html: html && html.substring(0,20) });
	// }
	// console.log('re-render', code.substr(0,5), lang);

	// this.shouldComponentUpdate = sCU;

	// console.log({
	// 	canHighlight,
	// 	highlighted: highlighted && highlighted.substring(0,10),
	// 	pending: !!pending,
	// 	error,
	// 	vnode: <code
	// 		class={`language-${lang}`}
	// 		dangerouslySetInnerHTML={
	// 		canHighlight ? { __html: highlighted } : undefined
	// 	}
	// 		children={!canHighlight ? code : undefined}
	// 	       />
	// });

	// console.log({ canHighlight, highlighted: highlighted && highlighted.substring(0,10) });

	// const className = `language-${lang}`;

	return (
		<pre class={cx('highlight', props.class)}>
			<code
				class={`language-${lang}`}
				dangerouslySetInnerHTML={
					// { __html: canHighlight ? highlighted : code.replace(/</g,'&lt;').replace(/>/g,'&gt;') }
					htmlObj
				}
			/>
			{/*
			{canHighlight ? (
				<code class={className} dangerouslySetInnerHTML={{ __html: highlighted }} />
			) : (
				<code class={className}>{code}</code>
			)}
			*/}
			{/*
			<code
				class={`language-${lang}`}
				dangerouslySetInnerHTML={
					canHighlight ? { __html: highlighted } : undefined
				}
				children={!canHighlight ? code : undefined}
			/>
			*/}
			{repl && (
				<Link class="repl-link" href={`/repl?code=${encodeURIComponent(code)}`}>
					Run in REPL
				</Link>
			)}
		</pre>
	);
}

const getChild = props =>
	Array.isArray(props.children) ? props.children[0] : props.children;

const CodeBlock = props => {
	let child = getChild(props);
	let isHighlight = child && child.type === 'code';

	if (isHighlight) {
		const lang = (child.props.class || '').match(
			/(?:lang|language)-([a-z]+)/
		)[1];
		const firstChild = getChild(child.props);
		const code = (firstChild || '').replace(/(^\s+|\s+$)/g, '');
		return <HighlightedCodeBlock {...props} code={code} lang={lang} />;
	}

	return <pre {...props} />;
};

export default CodeBlock;
