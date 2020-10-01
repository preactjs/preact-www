import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import cx from '../../lib/cx';
import PrismWorker from 'workerize-loader?name=prism.[hash:5]!./prism.worker';

// @TODO this should work in development, but Preact CLI transforms to CommonJS.
const { highlight } =
	PRERENDER || process.env.NODE_ENV === 'development'
		? require('./prism.worker')
		: new PrismWorker();

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

	// only run on changes, not initial mount
	const isFirstRun = useRef(true);
	useEffect(() => {
		if (isFirstRun.current) return (isFirstRun.current = false);
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

function HighlightedCodeBlock({ code, lang, ...props }) {
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

	return (
		<div class={cx('highlight-container', props.class)}>
			<pre class="highlight">
				<code class={`language-${lang}`} dangerouslySetInnerHTML={htmlObj} />
			</pre>
			{repl && (
				<Link class="repl-link" href={`/repl?code=${encodeURIComponent(code)}`}>
					Run in REPL
				</Link>
			)}
		</div>
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
		const code = String(firstChild || '').replace(/(^\s+|\s+$)/g, '');
		return <HighlightedCodeBlock {...props} code={code} lang={lang} />;
	}

	return <pre {...props} />;
};

export default CodeBlock;
