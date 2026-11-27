import { useEffect, useRef } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets.js';
import { TocContext } from '../table-of-contents/index.jsx';
import { useScrollableRegions } from '../../lib/use-scrollable-regions.js';

const COMPONENTS = {
	...widgets
};

const USER_INPUT = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

export default function ContentRegion({ content, components, ...props }) {
	components = Object.assign({}, COMPONENTS, components);
	const ref = useRef(/** @type {HTMLElement | null} */ (null));
	useScrollableRegions(ref, 'table, pre', content);

	// The router scrolls to the top on navigation, also to a `#fragment` on
	// another page: scroll to it once it's rendered, once per navigation, and
	// again if the content is replaced (the translation of the prerendered
	// English page) before the reader has scrolled or pressed anything
	const scrolled = useRef({ target: '', content: '', userMoved: false });
	useEffect(() => {
		const onInput = () => (scrolled.current.userMoved = true);
		for (const type of USER_INPUT) {
			addEventListener(type, onInput, { capture: true, passive: true });
		}
		return () => {
			for (const type of USER_INPUT) {
				removeEventListener(type, onInput, { capture: true });
			}
		};
	}, []);
	useEffect(() => {
		const target = props.current + location.hash;
		const last = scrolled.current;
		if (
			!location.hash ||
			(last.target === target && (last.content === content || last.userMoved))
		) {
			return;
		}
		let id = location.hash.slice(1);
		try {
			id = decodeURIComponent(id);
		} catch {}
		const el = document.getElementById(id);
		if (el && ref.current?.contains(el)) {
			const now = { target, content, userMoved: false };
			scrolled.current = now;
			el.scrollIntoView();
			// Text above it reflows once a webfont it needs (e.g. Cyrillic) loads
			requestAnimationFrame(() =>
				document.fonts?.ready.then(() => {
					if (scrolled.current === now && !now.userMoved && el.isConnected) {
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
