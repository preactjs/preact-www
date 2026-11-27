import { useEffect, useRef } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets.js';
import { TocContext } from '../table-of-contents/index.jsx';
import { useScrollableRegions } from '../../lib/use-scrollable-regions.js';
import { hasInputSinceNavigation } from '../../lib/reader-input.js';

const COMPONENTS = {
	...widgets
};

export default function ContentRegion({ content, components, ...props }) {
	components = Object.assign({}, COMPONENTS, components);
	const ref = useRef(/** @type {HTMLElement | null} */ (null));
	useScrollableRegions(ref, 'table, pre', content);

	// The router scrolls to the top on navigation, also to a `#fragment` on
	// another page: scroll to it once it's rendered, and again if the content
	// is replaced (the translation of the prerendered English page) or a
	// webfont it needs (e.g. Cyrillic) loads, unless the reader has done
	// anything since the navigation
	const scrolled = useRef({ target: '', content: '' });
	useEffect(() => {
		const { hash } = location;
		const target = props.current + hash;
		const last = scrolled.current;
		if (
			!hash ||
			(last.target === target && last.content === content) ||
			hasInputSinceNavigation()
		) {
			return;
		}
		let id = hash.slice(1);
		try {
			id = decodeURIComponent(id);
		} catch {}
		const el = document.getElementById(id);
		if (el && ref.current?.contains(el)) {
			const now = { target, content };
			scrolled.current = now;
			el.scrollIntoView();
			requestAnimationFrame(() =>
				document.fonts?.ready.then(() => {
					if (
						scrolled.current === now &&
						location.hash === hash &&
						!hasInputSinceNavigation() &&
						el.isConnected
					) {
						el.scrollIntoView();
					}
				})
			);
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
