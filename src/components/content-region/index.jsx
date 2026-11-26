import { useEffect, useRef } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets.js';
import { TocContext } from '../table-of-contents/index.jsx';
import { useScrollableRegions } from '../../lib/use-scrollable-regions.js';

const COMPONENTS = {
	...widgets
};

export default function ContentRegion({ content, components, ...props }) {
	components = Object.assign({}, COMPONENTS, components);
	const ref = useRef(/** @type {HTMLElement | null} */ (null));
	useScrollableRegions(ref, 'table, pre', content);

	// The router scrolls to the top on navigation, also to a `#fragment` on
	// another page: scroll to it once it's rendered, once per navigation
	const scrolledTo = useRef('');
	useEffect(() => {
		const target = props.current + location.hash;
		if (!location.hash || scrolledTo.current === target) return;
		let id = location.hash.slice(1);
		try {
			id = decodeURIComponent(id);
		} catch {}
		const el = document.getElementById(id);
		if (el && ref.current?.contains(el)) {
			scrolledTo.current = target;
			el.scrollIntoView();
		}
	}, [props.current, content]);

	return (
		<content-region
			ref={ref}
			name={props.current}
			can-edit={props.canEdit}
			lang={props.lang}
		>
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
