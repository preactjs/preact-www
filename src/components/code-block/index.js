import { useMemo } from 'preact/hooks';
import { wrap } from 'comlink';
import { FakeSuspense, useResource } from '../use-resource';

const PrismWorker = wrap(
	new Worker(new URL('./prism.worker.js', import.meta.url), {
		type: 'module'
	})
);

/**
 * @param {{ code: string, lang: string }} props
 * @returns {import('preact').ComponentChild}
 */
function HighlightedCode({ code, lang }) {
	const highlighted = useResource(() => PrismWorker.highlight(code, lang), [
		code,
		lang
	]);

	const htmlObj = useMemo(() => ({ __html: highlighted }), [highlighted]);
	return <code class={`language-${lang}`} dangerouslySetInnerHTML={htmlObj} />;
}

/**
 * @param {{ code: string, lang: string, repl?: string }} props
 * @returns {import('preact').ComponentChild}
 */
function HighlightedCodeBlock({ code, lang, repl }) {
	const replLink =
		(lang === 'js' || lang === 'jsx') &&
		code.split('\n').length > 2 &&
		repl !== 'false';

	// Show unhighlighted code as a fallback until we're reary
	const fallback = <code class={`language-${lang}`}>{code}</code>;

	return (
		<div class="highlight-container">
			<pre class="highlight">
				<FakeSuspense fallback={fallback}>
					<HighlightedCode code={code} lang={lang} />
				</FakeSuspense>
			</pre>
			{replLink && (
				<a class="repl-link" href={`/repl?code=${encodeURIComponent(code)}`}>
					Run in REPL
				</a>
			)}
		</div>
	);
}

const getChild = props =>
	Array.isArray(props.children) ? props.children[0] : props.children;

export const CodeBlock = props => {
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
