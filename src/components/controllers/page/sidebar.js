import { h } from 'preact';
import style from './sidebar.less';
import DocVersion, { getCurrentDocVersion } from './../../doc-version';
import Toc from './table-of-content';
import { useState, useCallback } from 'preact/hooks';
import config from '../../../config.json';

export default function Sidebar(props) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen(!open), [open]);
	const close = useCallback(() => setOpen(false));
	const version = getCurrentDocVersion();
	const docNav = config.docs
		.filter(item => item.path.indexOf(`/v${version}`) > -1)
		.map(item => ({ text: item.name, level: 2, href: item.path }));

	return (
		<div class={style.wrapper} data-open={open}>
			<button class={style.toggle} onClick={toggle} value="sidebar">
				{'<>'}
			</button>
			<aside class={style.sidebar}>
				<div class={style.sidebarInner}>
					<DocVersion />
					{/* <Toc items={props.toc} onClick={close} /> */}
					<Toc items={docNav} onClick={close} />
				</div>
			</aside>
		</div>
	);
}
