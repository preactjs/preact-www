import { h } from 'preact';
import cx from '../../lib/cx';
import style from './style.less';
import { storeCtx } from '../store-adapter';
import { useMemo, useContext, useRef, useEffect } from 'preact/hooks';

export default function Toc() {
	const store = useContext(storeCtx);
	const ref = useRef(null);

	// WARNING: We can't use any state/effect hooks here because
	// this component will be rendered inside the markdown. The parent component
	// that's responsible for rendering the markdown will trigger a re-render so
	// that we get the correct current state.
	const { toc, url } = store.getState();
	const items = useMemo(() => (toc !== null ? listToTree(toc) : []), [toc]);

	// We'll set the current height of the last toc and keep it around until
	// the toc changes. This reduces the layout jumpiness quite noticeably
	// because the toc is always visible at the top.
	useEffect(() => {
		if (ref.current != null && toc != null && toc.length > 0) {
			const dim = ref.current.getBoundingClientRect();
			ref.current.style.height = dim.height + 'px';
		}
	}, [toc, ref.current]);

	if (toc == null || toc.length === 0) return <div ref={ref} />;

	const loc = url.slice(url.indexOf('#') >>> 0);

	return (
		<div ref={ref} class={cx(style.toc, !(toc.length > 1) && style.disabled)}>
			<nav tabIndex="0" onFocus={this.open}>
				<ul>
					{items.map(entry => (
						<TocItem {...entry} loc={loc} />
					))}
				</ul>
			</nav>
		</div>
	);
}

// Toc always starts at h2
export function listToTree(arr) {
	if (arr.length == 0) return [];

	// Prepare list
	const list = arr.map(x => ({ ...x, level: x.level - 2, children: [] }));

	const tree = [];

	const lastLevelItems = new Array(6);
	for (let i = 0; i < list.length; i++) {
		const node = list[i];
		const level = node.level;
		if (level > 0 && lastLevelItems[level - 1]) {
			lastLevelItems[level - 1].children.push(node);
		} else if (level === 0) {
			tree.push(node);
		}

		lastLevelItems[level] = node;
	}

	return tree;
}

export function TocItem(props) {
	const { id, text, level, children, loc } = props;
	let activeCss = loc ? style.linkActive : undefined;

	return (
		<li>
			<a
				href={'#' + id}
				class={cx(style.link, activeCss, style['level-' + level])}
			>
				{text}
			</a>
			{children.length > 0 && (
				<ul>
					{children.map(entry => (
						<TocItem key={entry.id} {...entry} />
					))}
				</ul>
			)}
		</li>
	);
}
