import { h } from 'preact';
import { Link } from 'preact-router';
import * as prism from '../lib/prism';
import cx from '../lib/cx';

/*global PRERENDER */

const CodeBlock = ({ children, ...props }) => {
	let child = children && children[0];
	let isHighlight = child && child.type === 'code';

	if (isHighlight) {
		let text = (child.props.children[0] || '').replace(/(^\s+|\s+$)/g, '');
		let lang = (child.props.class && child.props.class).match(
			/lang-([a-z]+)/
		)[1];

		let highlighted = text;
		if (!PRERENDER && prism.languages[lang]) {
			highlighted = prism.highlight(text, prism.languages[lang], lang);
		}
		let repl =
			lang === 'js' && text.split('\n').length > 2 && props.repl !== 'false';

		return (
			<pre class={cx('highlight', props.class)}>
				<code
					class={`language-${lang}`}
					dangerouslySetInnerHTML={{ __html: highlighted }}
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
