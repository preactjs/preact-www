import { useRoute } from 'preact-iso';
import DocVersion from '../doc-version';
import SidebarNav from './sidebar-nav';
import config from '../../config.json';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import {
	useLanguage
	//getSidebarRouteName,
	//getHeaderRouteName
} from '../../lib/i18n';
import style from './style.module.css';

export default function Sidebar() {
	const {
		version
	} = /** @type {{ version: 'v8' | 'v10' | 'v11' }} */ (useRoute().params);
	const [lang] = useLanguage();
	const [open, setOpen] = useOverlayToggle();

	const navItems = [];
	for (const item of config.docs[version]) {
		if ('routes' in item) {
			navItems.push({
				text: '',
				level: 2,
				href: null,
				routes: item.routes.map(nested => ({
					text: '',
					level: 3,
					href: `/guide/${version}${nested.path}`
				}))
			});
		} else {
			navItems.push({
				text: '',
				level: 2,
				href: `/guide/${version}${item.path}`
			});
		}
	}

	// TODO: Is "Guide" really the best label for the button?
	const mobileButtonLabel = '';

	return (
		<div class={style.wrapper} data-open={open}>
			<button
				class={style.toggle}
				onClick={() => setOpen(v => !v)}
				value="sidebar"
			>
				{mobileButtonLabel}
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
