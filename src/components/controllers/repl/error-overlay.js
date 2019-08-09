import { h } from 'preact';
import style from './error-overlay.less';

export function ErrorOverlay({ name, message, stack }) {
	return (
		<div class={style.root}>
			<h1>
				{name}: {message}
			</h1>
			<span class={style.stackLabel}>Stack trace:</span>
			{stack.map(frame => (
				<p class={style.frame}>
					{frame.functionName} :{frame.line}:{frame.column}
				</p>
			))}
		</div>
	);
}
