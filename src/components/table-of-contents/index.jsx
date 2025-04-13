import { createContext } from 'preact';
import { useContext, useMemo, useRef } from 'preact/hooks';

/** @type {import('preact').Context<{ toc: any}>} */
export const TocContext = createContext({ toc: null });

export default function Toc() {
	const cache = useRef([]);

	const { toc } = useContext(TocContext);

	const items = useMemo(() => (
		toc !== null
			? (cache.current = listToTree(toc))
			: cache.current || []
	), [toc]);

	// TODO: Should we throw an error? No good reason to have a toc
	// on the page if there is nothing to populate it with.
	if (items.length === 0) return null;

	return (
		<nav>
			<ul>
				{items.map(entry => <TocItem {...entry} />)}
			</ul>
		</nav>
	);
}

// Toc always starts at h2
function listToTree(arr) {
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

function TocItem(props) {
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
