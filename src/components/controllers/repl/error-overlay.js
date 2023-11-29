import { h } from 'preact';
import { useReducer } from 'preact/hooks';
import style from './error-overlay.module.less';

export function ErrorOverlay({ class: c, name, message, stack }) {
	const [showStack, toggleStack] = useReducer(s => !s, false);
	const hasStack = stack && stack.length > 0;

	return (
		<div class={`${style.root} ${c || ''}`}>
			<h5>
				{name}: {message}
			</h5>
			{hasStack && (
				<button
					class={style.showStack + ' ' + (showStack ? style.showing : '')}
					onClick={toggleStack}
				>
					Error Stack
				</button>
			)}
			{hasStack && showStack && (
				<div class={style.stack}>
					{stack.map(frame => (
						<p class={style.frame}>
							{frame.functionName} :{frame.line}:{frame.column}
						</p>
					))}
				</div>
			)}
		</div>
	);
}
