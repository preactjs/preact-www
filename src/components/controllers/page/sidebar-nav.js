import { h, Fragment } from 'preact';
import cx from '../../../lib/cx';
import style from './sidebar-nav.less';
import { getCurrentUrl } from 'preact-router';

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
	// Remove trailing slash to fix activeCss check below.
	// Note that netlify will always append a slash to the url so that we end
	// up with something like "foo/bar/?lang=de". That's why we first remove
	// the search params before removing the trailing slash.
	const url = getCurrentUrl()
		.replace(/\?.*/, '')
		.replace(/\/$/, '');

	return (
		<nav
			tabIndex="0"
			class={cx(style.toc, !(items && items.length > 1) && style.disabled)}
		>
			{items.map(({ text, level, href, routes }) => {
				if (!href) {
					return (
						<Fragment>
							<SidebarGroup level={level}>{text}</SidebarGroup>
							<div class={style.accordionBody}>
								{routes.map(route => {
									const { href, text } = route;
									return (
										<SidebarNavLink
											key={href}
											href={href}
											onClick={onClick}
											isActive={href === url}
										>
											{text}
										</SidebarNavLink>
									);
								})}
							</div>
						</Fragment>
					);
				}
				return (
					<SidebarNavLink
						key={href}
						href={href}
						onClick={onClick}
						isActive={href === url}
					>
						{text}
					</SidebarNavLink>
				);
			})}
		</nav>
	);
}

function SidebarGroup({ level, children }) {
	return (
		<h3 className={cx(style.category, style['level-' + level])}>{children}</h3>
	);
}

function SidebarNavLink(props) {
	const { href, onClick, level, isActive, children } = props;
	let activeCss = isActive ? style.linkActive : undefined;
	return (
		<a
			href={href}
			onClick={onClick}
			class={cx(style.link, activeCss, style['level-' + level])}
		>
			{children}
		</a>
	);
}
