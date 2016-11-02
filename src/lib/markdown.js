import { h } from 'preact';
import marked from 'marked';
import Markup from 'preact-markup';

// Cache of markdown to generated html
const CACHE = {};

// Marked options (See https://github.com/chjj/marked#options-1)
const OPTIONS = {
	// sanitize: true
};

// Convert Markdown to HTML using Marked
const markdownToHtml = md => (
	CACHE[md] || (CACHE[md] = marked(md, OPTIONS))
);

/** Component that renders Markdown to HTML via VDOM, using preact-markup.
 *	@param props.markdown	Markdown string to render.
 *	@returns VNode
 */
export default ({ markdown, postProcess, ...props }) => {
	let markup = markdownToHtml(markdown);
	if (postProcess) markup = postProcess(markup);
	return (
		<Markup markup={markup} type="html" trim={false} {...props} />
	);
};
