import { useRoute } from 'preact-iso';
import cx from '../../lib/cx';
import { prefetchContent } from '../../lib/use-content';
import style from './sidebar-nav.module.css';

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
	const { path } = useRoute();

	return (
		<nav class={cx(style.toc, !(items && items.length > 1) && style.disabled)}>
			{items.map(({ text, level, href, routes }) => {
				if (!href) {
					return (
						<>
							<SidebarGroup level={level}>{text}</SidebarGroup>
							<div class={style.accordionBody}>
								{routes.map(route => {
									const { href, text } = route;
									return (
										<SidebarNavLink
											key={href}
											href={href}
											onClick={onClick}
											isActive={href === path}
										>
											{text}
										</SidebarNavLink>
									);
								})}
							</div>
						</>
					);
				}
				return (
					<SidebarNavLink
						key={href}
						href={href}
						onClick={onClick}
						isActive={href === path}
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
			onMouseOver={() => prefetchContent(href)}
			onTouchStart={() => prefetchContent(href)}
			class={cx(style.link, activeCss, style['level-' + level])}
		>
			{children}
		</a>
	);
}
