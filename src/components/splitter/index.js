import { useCallback, useEffect, useRef } from 'preact/hooks';
import cx from '../../lib/cx';
import s from './splitter.less';

/**
 * @param {{orientation: "horizontal" | "vertical", initial?: string, children: any, other: any, force?: boolean}} props
 */
export function Splitter({
	orientation,
	initial = '50%',
	children,
	other,
	force
}) {
	const splitterPointerDown = useCallback(e => {
		let target = e.target;
		let root = target.parentNode;
		let v, perc, w, pid;
		function move(e) {
			const isHorizontal = orientation === 'horizontal';
			const pos = isHorizontal ? e.pageX : e.pageY;

			if (v == null) {
				pid = e.pointerId;
				target.setPointerCapture(pid);
				v = pos;
				perc = parseFloat(root.style.getPropertyValue('--size') || initial);
				w = isHorizontal ? root.offsetWidth : root.offsetHeight;
			} else {
				let p = Math.max(20, Math.min(80, perc + ((pos - v) / w) * 100));
				root.style.setProperty('--size', `${p.toFixed(2)}%`);
			}
		}
		function up(e) {
			move(e);
			cancel(e);
		}
		function cancel() {
			target.releasePointerCapture(pid);
			removeEventListener('pointermove', move);
			removeEventListener('pointerup', up);
			removeEventListener('pointercancel', cancel);
		}
		addEventListener('pointermove', move);
		addEventListener('pointerup', up);
		addEventListener('pointercancel', cancel);
	}, []);

	const ref = useRef(null);
	useEffect(() => {
		if (ref.current) {
			if (force) {
				ref.current.style.setProperty('--size', force);
			} else {
				ref.current.style.setProperty('--size', initial);
			}
		}
	}, [force]);

	return (
		<div
			ref={ref}
			class={cx(
				s.container,
				orientation === 'horizontal' ? s.horizontal : s.vertical
			)}
		>
			<div class={cx(s.first, s.area)}>{children}</div>
			<div class={s.splitter} onPointerDown={splitterPointerDown} />
			<div class={cx(s.second, s.area)}>{other}</div>
		</div>
	);
}
