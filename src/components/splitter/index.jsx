import { useCallback, useEffect, useState } from 'preact/hooks';
import cx from '../../lib/cx';
import s from './splitter.module.css';

const determineSplitterOrientation = (width) => width > 600 ? 'horizontal' : 'vertical';

/**
 * @typedef {Object} SplitterProps
 * @property {"horizontal" | "vertical" | "auto"} orientation
 * @property {string} [initial]
 * @property {import('preact').ComponentChildren} children
 * @property {import('preact').ComponentChildren} other
 * @property {string | undefined} [force]
 */

/**
 * @param {SplitterProps} props
 */
export function Splitter({
	orientation,
	initial = '50%',
	children,
	other,
	force
}) {
	const [splitterOrientation, setSplitterOrientation] = useState(() => (
		orientation === 'auto'
			? determineSplitterOrientation(document.body.clientWidth)
			: orientation
	));

	useEffect(() => {
		if (orientation !== 'auto') return;
		const observer = new ResizeObserver((entries) => {
			setSplitterOrientation(
				determineSplitterOrientation(entries[0].contentRect.width)
			);
		});

		observer.observe(document.body);
		return () => observer.disconnect();
	}, []);

	const splitterPointerDown = useCallback(e => {
		let target = e.target;
		let root = target.parentNode;
		let v, perc, w, pid;
		function move(e) {
			const isHorizontal = splitterOrientation === 'horizontal';
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
			cancel();
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
	}, [splitterOrientation]);

	return (
		<div
			ref={(n) => n?.style.setProperty('--size', force || initial)}
			class={cx(
				s.container,
				splitterOrientation === 'horizontal' ? s.horizontal : s.vertical
			)}
		>
			<div class={cx(s.first, s.area)}>{children}</div>
			<div class={s.splitter} onPointerDown={splitterPointerDown} />
			<div class={cx(s.second, s.area)}>{other}</div>
		</div>
	);
}
