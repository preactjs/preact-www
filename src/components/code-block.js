import { h } from 'preact';
import { Link } from 'preact-router';
import cx from '../lib/cx';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';

const LANGUAGES = { javascript, json, xml };
Object.keys(LANGUAGES).forEach(key =>
	hljs.registerLanguage(key, LANGUAGES[key])
);

const CodeBlock = ({ children, ...props }) => {
	let child = children && children[0],
		isHighlight = child && child.nodeName === 'code';
	if (isHighlight) {
		let text = child.children[0].replace(/(^\s+|\s+$)/g, ''),
			lang = (child.attributes.class && child.attributes.class).match(
				/lang-([a-z]+)/
			)[1],
			highlighted = hljs.highlightAuto(text, lang ? [lang] : null),
			hLang = highlighted.language,
			repl =
				hLang === 'js' && text.split('\n').length > 2 && props.repl !== 'false';
		return (
			<pre class={cx('highlight', `highlight-${hLang}`, props.class)}>
				<code
					class={`hljs lang-${hLang}`}
					dangerouslySetInnerHTML={{ __html: highlighted.value }}
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
