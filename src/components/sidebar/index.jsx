import { useRoute } from 'preact-iso';
import DocVersion from '../doc-version';
import SidebarNav from './sidebar-nav';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { useTranslate, usePathTranslate } from '../../lib/i18n';
import { docPages } from '../../route-config.js';
import style from './style.module.css';

export default function Sidebar() {
	const {
		version
	} = /** @type {{ version: 'v8' | 'v10' | 'v11' }} */ (useRoute().params);
	const [open, setOpen] = useOverlayToggle();
	const translate = useTranslate();
	const translatePath = usePathTranslate();

	const navItems = [];
	for (const item in docPages[version]) {
		if (version == 'v8') {
			navItems.push({
				text: translatePath(
					'sidebarNav',
					/** @type {keyof typeof import('../../route-config.js').allPages} */ (item)
				),
				level: 2,
				href: `/guide/${version}${item}`
			});
		} else {
			navItems.push({
				text: translate(
					'sidebarSections',
					/** @type {keyof typeof docPages['v10']} */ (item)
				),
				level: 2,
				href: null,
				routes: Object.keys(docPages[version][item]).map(nested => ({
					text: translatePath(
						'sidebarNav',
						/** @type {keyof typeof import('../../route-config.js').allPages} */ (nested)
					),
					level: 3,
					href: `/guide/${version}${nested}`
				}))
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
