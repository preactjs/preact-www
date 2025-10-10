import { useEffect } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets';
import { TocContext } from '../table-of-contents';
import { prefetchContent } from '../../lib/use-content';
import { ReplPage, TutorialPage, CodeEditor } from '../routes';

const COMPONENTS = {
	...widgets,
	a(props) {
		if (props.href && props.href.startsWith('/')) {
			const url = new URL(props.href, location.origin);

			const prefetchAndPreload = () => {
				if (props.href.startsWith('/repl')) {
					ReplPage.preload();
					CodeEditor.preload();
				} else if (props.href.startsWith('/tutorial')) {
					TutorialPage.preload();
					CodeEditor.preload();
				}

				prefetchContent(url.pathname);
			};

			props.onMouseOver = prefetchAndPreload;
			props.onTouchStart = prefetchAndPreload;
		}

		return <a {...props} />;
	}
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
