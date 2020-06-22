import { h, Fragment } from 'preact';
import cx from '../../../lib/cx';
import style from './sidebar-nav.less';
import { getCurrentUrl } from 'preact-router';
import { useState, useCallback } from 'preact/hooks';

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
	const [activeGroups, setActiveGroup] = useState({});

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
					const textId = text.replace(/\s+/g, '-');
					const headerId = `accordion_header_${textId}`;
					const id = `accordion_body_${textId}`;
					const isActive =
						activeGroups[headerId] === undefined || !!activeGroups[headerId];
					routes.some(r => r.href === url);

					return (
						<Fragment key={headerId}>
							<SidebarGroup
								id={headerId}
								level={level}
								controls={id}
								isActive={isActive}
								// eslint-disable-next-line react/jsx-no-bind
								onClick={(name, value) =>
									setActiveGroup({ ...activeGroups, [name]: value })
								}
							>
								{text}
							</SidebarGroup>
							<div
								id={id}
								role="region"
								aria-labelledby={headerId}
								hidden={!isActive}
								class={style.accordionBody}
							>
								{routes.map(route => {
									const { href, onClick, text } = route;
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

function SidebarGroup(props) {
	const { id, level, onClick, children, isActive, controls } = props;
	const onClickFn = useCallback(() => {
		onClick(id, !isActive);
	}, [onClick, id, isActive]);

	return (
		<button
			id={id}
			onClick={onClickFn}
			className={cx(style.category, style['level-' + level])}
			aria-controls={controls}
			aria-expanded={'' + !!isActive}
		>
			{children}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 8.467 8.467"
				aria-hidden="true"
				className={cx(style.accordionIcon, isActive && style.active)}
			>
				<path
					d="M1.587 2.913L4.233 5.56 6.88 2.913"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
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
