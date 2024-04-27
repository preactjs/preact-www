import { createContext } from 'preact';
import { useContext, useMemo, useRef } from 'preact/hooks';

/** @type {import('preact').Context<{ toc: any}>} */
export const TocContext = createContext({ toc: null });

export default function Toc() {
	const ref = useRef(null);
	const cache = useRef([]);

	const { toc } = useContext(TocContext);

	// eslint-disable-next-line
	const items = useMemo(() => {
		return toc !== null
			? (cache.current = listToTree(toc))
			: cache.current || [];
	}, [toc]);

	if (items.length === 0) return <div ref={ref} />;

	return (
		<div ref={ref}>
			<nav onFocus={this.open}>
				<ul>
					{items.map(entry => (
						<TocItem {...entry} />
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
	const { id, text, children } = props;

	return (
		<li>
			<a href={'#' + id}>{text}</a>
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
