import { h } from 'preact';
import style from './sidebar.less';
import DocVersion from './../../doc-version';
import Toc from './table-of-content';
import { useState, useCallback } from 'preact/hooks';

export default function Sidebar(props) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen(!open), [open]);
	const close = useCallback(() => setOpen(false));
	return (
		<div class={style.wrapper} data-open={open}>
			<button class={style.toggle} onClick={toggle} value="sidebar">
				{'<>'}
			</button>
			<aside class={style.sidebar}>
				<div class={style.sidebarInner}>
					<DocVersion />
					<Toc items={props.toc} onClick={close} />
				</div>
			</aside>
		</div>
	);
}
