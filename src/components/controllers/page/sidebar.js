import { h } from 'preact';
import style from './sidebar.module.less';
import DocVersion from './../../doc-version';
import SidebarNav from './sidebar-nav';
import { useCallback } from 'preact/hooks';
import config from '../../../config.json';
import { useStore } from '../../store-adapter';
import { useOverlayToggle } from '../../../lib/toggle-overlay';
import { getRouteName } from '../../header';

export default function Sidebar() {
	const [open, setOpen] = useOverlayToggle(false);
	const toggle = useCallback(() => setOpen(!open), [open]);
	const close = useCallback(() => setOpen(false), []);
	const { lang } = useStore(['lang']).state;

	const navItems = [];
	for (const version in config.docs) {
		const routes = config.docs[version];
		for (let i = 0; i < routes.length; i++) {
			const item = routes[i];
			if (item.routes) {
				navItems.push({
					text: getRouteName(item, lang),
					level: 2,
					href: null,
					routes: item.routes.map(nested => ({
						text: getRouteName(nested, lang),
						level: 3,
						href: `/guide/${version}${nested.path}`
					}))
				});
			} else {
				navItems.push({
					text: getRouteName(item, lang),
					level: 2,
					href: `/guide/${version}${item.path}`
				});
			}
		}
	}

	// TODO: use URL match instead of .content
	const guide = config.nav.filter(item => item.content === 'guide')[0];
	const sectionName = getRouteName(guide, lang);

	return (
		<div class={style.wrapper} data-open={open}>
			<button class={style.toggle} onClick={toggle} value="sidebar">
				{sectionName}
			</button>
			<aside class={style.sidebar}>
				<div class={style.sidebarInner}>
					<DocVersion />
					<SidebarNav items={navItems} onClick={close} />
				</div>
			</aside>
		</div>
	);
}
