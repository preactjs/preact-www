import { useRoute } from 'preact-iso';
import cx from '../../lib/cx.js';
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
		<nav
			class={cx(style.toc, !(items && items.length > 1) && style.disabled)}
			// The sidebar's (hidden) "Docs" label, see ./index.jsx
			aria-labelledby="docs-sidebar-label"
		>
			{items.map(({ text, lang, level, href, routes }) => {
				if (!href) {
					return (
						<>
							<SidebarGroup level={level} lang={lang}>
								{text}
							</SidebarGroup>
							<div class={style.accordionBody}>
								{routes.map((route) => {
									const { href, text, lang } = route;
									return (
										<SidebarNavLink
											key={href}
											href={href}
											lang={lang}
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
						lang={lang}
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

function SidebarGroup({ level, lang, children }) {
	return (
		<h3 className={cx(style.category, style['level-' + level])} lang={lang}>
			{children}
		</h3>
	);
}

function SidebarNavLink(props) {
	const { href, lang, onClick, level, isActive, children } = props;
	let activeCss = isActive ? style.linkActive : undefined;
	return (
		<a
			href={href}
			lang={lang}
			onClick={onClick}
			class={cx(style.link, activeCss, style['level-' + level])}
			aria-current={isActive ? 'page' : undefined}
		>
			{children}
		</a>
	);
}
