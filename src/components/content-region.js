import Markdown from './markdown';
import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import { memoize } from 'decko';
import Markdown from 'lib/markdown';
import widgets from './widgets';

const COMPONENTS = {
	...widgets,
	pre: widgets.CodeBlock,
	img(props) {
		return <img decoding="async" {...props} />;
	},
	a(props) {
		if (!props.target && props.href.match(/:\/\//)) {
			props.target = '_blank';
			props.rel = 'noopener noreferrer';
		}
		return <a {...props} />;
	}
};

export default function ContentRegion({ content, ...props }) {
	return (
		<content-region {...props}>
			{content && (
				<Markdown
					// key={content}
					content={content}
					components={COMPONENTS}
				/>
			)}
		</content-region>
	);
}
