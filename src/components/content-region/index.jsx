import { useEffect } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets';
import { TocContext } from '../table-of-contents';

const COMPONENTS = {
	...widgets
};

export default function ContentRegion({ content, components, ...props }) {
	components = Object.assign({}, COMPONENTS, components);

	useEffect(() => {
		const hash = location.hash;
		if (hash) {
			// Hack to force a scroll
			location.hash = '';
			location.hash = hash;
		}
	}, [props.current]);

	return (
		<content-region name={props.current} can-edit={props.canEdit}>
			{content && (
				<TocContext.Provider value={{ toc: props.toc }}>
					<Markup
						markup={content}
						type="html"
						trim={false}
						components={components}
					/>
				</TocContext.Provider>
			)}
		</content-region>
	);
}
