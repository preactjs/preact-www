import { h } from 'preact';
import cx from '../../../lib/cx';
import style from './sidebar-nav.less';
import { addLangToUrl } from '../../../lib/language';
import { getCurrentUrl } from 'preact-router';
import { useStore } from '../../store-adapter';

/**
 * @typedef {object} SidebarNavProps
 * @property {any[]} items
 * @property {() => void} onClick
 */

/**
 * The navigation menu in the sidebar
 * @param {SidebarNavProps} props
 */
export default function SidebarNav({ items, onClick }) {
	const { lang } = useStore(['lang']).state;
	// Remove trailing slash to fix activeCss check below.
	const url = getCurrentUrl().replace(/\/$/, '');
	return (
		<nav
			tabIndex="0"
			class={cx(style.toc, !(items && items.length > 1) && style.disabled)}
		>
			{items.map(({ text, level, href }) => {
				href = addLangToUrl(href, lang);
				let activeCss = href === url ? style.linkActive : undefined;
				return (
					<a
						href={href}
						onClick={onClick}
						class={cx(style.link, activeCss, style['level-' + level])}
					>
						{text}
					</a>
				);
			})}
		</nav>
	);
}
