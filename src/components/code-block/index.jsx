import { useMemo } from 'preact/hooks';
import { Suspense } from 'preact/compat';
import { wrap } from 'comlink';
import { useResource } from '../../lib/use-resource';

let prismWorker;

/**
 * @param {{ code: string, lang: string }} props
 */
function HighlightedCode({ code, lang }) {
	// lazy init to ensure `globalThis.markedWorker` is available w/ prerendering
	if (!prismWorker) {
		prismWorker = typeof window === 'undefined'
			? globalThis.prismWorker
			: wrap(new Worker(new URL('./prism.worker.js', import.meta.url), { type: 'module' }));
	}

	const highlighted = useResource(() => prismWorker.highlight(code, lang), [code, lang]);

	const htmlObj = useMemo(() => ({ __html: highlighted }), [highlighted]);
	return <code class={`language-${lang}`} dangerouslySetInnerHTML={htmlObj} />;
}

function processRepl(code, repl) {
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

	return [code, source, repl];
}

/**
 * @param {{ code: string, lang: string, repl?: string }} props
 */
function HighlightedCodeBlock({ code, lang }) {
	let repl = false,
		source = code;

	[code, source, repl] = processRepl(source, repl);

	// Show unhighlighted code as a fallback until we're ready
	const fallback = <code class={`language-${lang}`}>{code}</code>;

	return (
		<div class="highlight-container">
			<pre class="highlight">
				<Suspense fallback={fallback}>
					<HighlightedCode code={code} lang={lang} />
				</Suspense>
			</pre>
			{repl && (
				<a class="repl-link" href={`/repl?code=${encodeURIComponent(source)}`}>
					Run in REPL
				</a>
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
		// Slight hack to facilitate multi-line code blocks, w/ blank lines, in HTML in Markdown.
		// Blank lines are an end condition to the code block, so we instead use a `<br>`
		// which then requires a conversion back to `\n` for the code content.
		const children = child.props.children.map(el => el.type == 'br' ? '\n' : el).join('');
		const code = children.replace(/(^\s+|\s+$)/g, '');
		return <HighlightedCodeBlock {...props} code={code} lang={lang} />;
	}

	return <pre {...props} />;
};

export default CodeBlock;
