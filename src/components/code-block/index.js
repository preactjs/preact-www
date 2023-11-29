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
	let repl = false;
	let source = code;
	if (code.startsWith('// --repl')) {
		repl = true;
		const idx = code.indexOf('\n');
		if (idx > -1) {
			code = code.slice(idx + 1);
			source = source.slice(idx + 1);
		}

		const beforeMarker = '// --repl-before';
		const beforeIdx = code.indexOf(beforeMarker);
		if (beforeIdx > -1) {
			const pos = beforeIdx + beforeMarker.length + 1;
			code = code.slice(pos);
			// Only replace comment line with newline in source
			source = source.slice(0, beforeIdx) + '\n' + source.slice(pos);
		}

		const afterMarker = '// --repl-after';
		const afterIdx = code.indexOf(afterMarker);
		if (afterIdx > -1) {
			code = code.slice(0, afterIdx);

			// Only replace comment line with newline in source
			// ATTENTION: We cannot reuse the index from `code`
			// as the content and thereby offsets are different
			const sourceAfterIdx = source.indexOf(afterMarker);
			source =
				source.slice(0, sourceAfterIdx) +
				'\n' +
				source.slice(sourceAfterIdx + afterMarker.length + 1) +
				'\n';
		}
	}

	const [highlighted, error, pending] = useFuture(
		() => cachedHighlight(code, lang),
		[code, lang]
	);

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
				<Link
					class="repl-link"
					href={`/repl?code=${encodeURIComponent(source)}`}
				>
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
		return (
			<HighlightedCodeBlock
				{...props}
				code={code}
				lang={lang}
				key={lang + '\n' + code}
			/>
		);
	}

	return <pre {...props} />;
};

export default CodeBlock;
