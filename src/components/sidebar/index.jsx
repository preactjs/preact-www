import { useRoute } from 'preact-iso';
import DocVersion from '../doc-version';
import SidebarNav from './sidebar-nav';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { useTranslate } from '../../lib/i18n';
import { docPages } from '../../route-config.js';
import style from './style.module.css';

export default function Sidebar() {
	const {
		version
	} = /** @type {{ version: 'v8' | 'v10' | 'v11' }} */ (useRoute().params);
	const [open, setOpen] = useOverlayToggle();
	const translate = useTranslate();

	const navItems = [];
	for (const item in docPages[version]) {
		if (version == 'v8') {
			navItems.push({
				text: translate('sidebarNav', docPages[version][item].label),
				level: 2,
				href: `/guide/${version}${item}`
			});
		} else {
			navItems.push({
				text: translate(
					'sidebarSections',
					/** @type {keyof typeof docPages.v10 | keyof typeof docPages.v11} */ (item)
				),
				level: 2,
				href: null,
				routes: Object.entries(docPages[version][item]).map(
					([pagePath, page]) => ({
						text: translate('sidebarNav', page.label),
						level: 3,
						href: `/guide/${version}${pagePath}`
					})
				)
			});
		}
	}

	return (
		<div class={style.wrapper} data-open={open}>
			<button class={style.toggle} onClick={() => setOpen(v => !v)}>
				{translate('i18n', 'mobileGuideButton')}
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
