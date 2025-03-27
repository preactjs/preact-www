import { useLocation } from 'preact-iso';
import DocVersion from '../doc-version';
import SidebarNav from './sidebar-nav';
import config from '../../config.json';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { getRouteName } from '../header';
import { useLanguage } from '../../lib/i18n';
import style from './style.module.css';

export default function Sidebar() {
	const { version } = useLocation().pathParams;
	const [lang] = useLanguage();
	const [open, setOpen] = useOverlayToggle();

	const navItems = [];
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

	// TODO: use URL match instead of .content
	const guide = config.nav.filter(item => item.content === 'guide')[0];
	const sectionName = getRouteName(guide, lang);

	return (
		<div class={style.wrapper} data-open={open}>
			<button
				class={style.toggle}
				onClick={() => setOpen(v => !v)}
				value="sidebar"
			>
				{sectionName}
			</button>
			<aside class={style.sidebar}>
				<div class={style.sidebarInner}>
					<DocVersion />
					<SidebarNav items={navItems} onClick={() => setOpen(false)} />
				</div>
			</aside>
		</div>
	);
}
