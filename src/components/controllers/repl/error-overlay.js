import { h } from 'preact';
import style from './error-overlay.less';

export function ErrorOverlay({ name, message, stack }) {
	return (
		<div class={style.root}>
			<h1>
				{name}: {message}
			</h1>
			<p>Stack trace:</p>
			<p>{stack}</p>
		</div>
	);
}
