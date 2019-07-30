import { h } from 'preact';
import cx from '../../lib/cx';
import style from './style.less';
import { useStore } from '../store-adapter';

export default function Toc() {
	const store = useStore(['toc', 'url']);
	const { toc, url } = store.state;

	if (toc.length === 0) return null;

	const loc = url.slice(url.indexOf('#') >>> 0);
	const items = listToTree(toc);

	return (
		<div class={cx(style.toc, !(toc.length > 1) && style.disabled)}>
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
