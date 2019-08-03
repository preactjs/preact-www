import { h } from 'preact';
import { Link } from 'preact-router';
import * as prism from '../lib/prism';
import cx from '../lib/cx';

/*global PRERENDER */

const CodeBlock = ({ children, ...props }) => {
	let child = children && children[0];
	let isHighlight = child && child.type === 'code';

	let firstChild = child.props.children[0];
	// Children is mutated and it will have the highlighted tree on second render.
	// We can detect that by checken if we have more than one child
	if (
		isHighlight &&
		child.props.children.length === 1 &&
		typeof firstChild === 'string'
	) {
		let text = (firstChild || '').replace(/(^\s+|\s+$)/g, '');
		let lang =
			child.props.class &&
			child.props.class.match(/(?:lang|language)-([a-z]+)/)[1];

		const canHighlight = prism.languages[lang] != null;

		let highlighted = canHighlight
			? prism.highlight(text, prism.languages[lang], lang)
			: text;

		let repl =
			(lang === 'js' || lang === 'jsx') &&
			text.split('\n').length > 2 &&
			props.repl !== 'false';

		return (
			<pre class={cx('highlight', props.class)}>
				<code
					class={`language-${lang}`}
					dangerouslySetInnerHTML={
						canHighlight ? { __html: highlighted } : undefined
					}
					children={!canHighlight ? text : undefined}
				/>
				{repl && (
					<Link
						class="repl-link"
						href={`/repl?code=${encodeURIComponent(text)}`}
					>
						Run in REPL
					</Link>
				)}
			</pre>
		);
	}
	return <pre {...props}>{children}</pre>;
};

export default CodeBlock;
