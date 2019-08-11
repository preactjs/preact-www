import Markup from 'preact-markup';
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
				<Markup
					// key={content}
					markup={content}
					type="html"
					trim={false}
					components={COMPONENTS}
				/>
			)}
		</content-region>
	);
}
