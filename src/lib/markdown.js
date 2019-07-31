import { h } from 'preact';
import marked from 'marked';
import Markup from 'preact-markup';
import { useEffect } from 'preact/hooks';
import { useForceUpdate, useStore } from '../components/store-adapter';

// Cache of markdown to generated html
const CACHE = {};

// Marked options (See https://github.com/chjj/marked#options-1)
const OPTIONS = {
	// sanitize: true
};

// Convert Markdown to HTML using Marked
export const markdownToHtml = md =>
	CACHE[md] || (CACHE[md] = marked(md, OPTIONS));

// Make sure that the markup component actually re-renders when the TOC is
// updated. This obviously pretty a gross hack, so don't copy that.
// TODO: Add support for stateful hooks in preact-markup.
Markup.prototype.shouldComponentUpdate = () => true;

/**
 * Component that renders Markdown to HTML via VDOM, using preact-markup.
 * @param props.markdown	Markdown string to render.
 * @returns VNode
 */
const Markdown = ({ content, postProcess, ...props }) => {
	// Workaround for hooks not working when a component is instantiated inside
	// the markdown. So far the issue only became to light with the toc. As a
	// workaround we'll just trigger a forceupdate of the markdown rendering to
	// ensure that the <toc> component inside the markdown get's most current
	// state
	const forceUpdate = useForceUpdate();
	const { toc } = useStore(['toc']).state;
	useEffect(() => {
		forceUpdate(toc);
	}, [toc]);

	let markup = markdownToHtml(content);
	if (postProcess) markup = postProcess(markup);
	return <Markup markup={markup} type="html" trim={false} {...props} />;
};

export default Markdown;
