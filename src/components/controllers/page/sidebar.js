import { h, Fragment } from 'preact';
import style from './sidebar.less';
import DocVersion from './../../doc-version';
import Toc from './table-of-content';
import { useState, useCallback } from 'preact/hooks';

export default function Sidebar(props) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen(!open), [open]);
	return (
		<Fragment>
			<button class={style.toggle} onClick={toggle} value="sidebar">
				{'<>'}
			</button>
			<aside class={style.sidebar} data-open={open}>
				<div class={style.sidebarInner}>
					<DocVersion />
					<Toc items={props.toc} />
				</div>
			</aside>
		</Fragment>
	);
}
