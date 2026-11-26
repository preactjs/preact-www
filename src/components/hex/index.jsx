import { useEffect, useId, useRef } from 'preact/hooks';
import style from './style.module.css';

/**
 * A pointy-top hexagon drawn inside an SVG, optionally with a centered label.
 *
 * @param {object} props
 * @param {string} [props.text]
 * @param {number} props.x
 * @param {number} props.y
 * @param {number} [props.size]
 * @param {number} [props.fontSize]
 * @param {boolean} [props.animate]
 * @param {Record<string, any>} [props.hexagonProps]
 */
export function Hexagon({
	text = '',
	x,
	y,
	size = 128,
	fontSize,
	hexagonProps,
	animate = false
}) {
	const radius = size / 2;
	const width = radius * Math.sqrt(3);
	const height = size;
	const points = Array.from({ length: 6 }, (_, i) => {
		const angle = (Math.PI / 3) * i - Math.PI / 2;
		return `${width / 2 + radius * Math.cos(angle)},${height / 2 + radius * Math.sin(angle)}`;
	}).join(' ');

	return (
		<g
			transform={`translate(${x} ${y})`}
			class={animate ? style.animate : undefined}
		>
			<polygon
				points={points}
				fill="none"
				stroke="var(--accent)"
				stroke-width="2"
				{...hexagonProps}
			/>
			{text && (
				<text
					x={width / 2}
					y={height / 2}
					text-anchor="middle"
					dominant-baseline="middle"
					fill="var(--text)"
					font-family="var(--font-sans)"
					font-size={fontSize ?? size / 4}
				>
					{text}
				</text>
			)}
		</g>
	);
}

const HEX_TILE =
	'M0 8 12 1 24 8 24 22 12 29 0 22ZM24 8 36 1 48 8 48 22 36 29 24 22ZM12 29 24 22 36 29 36 43 24 50 12 43Z';

/**
 * Faint hexagon grid that fills its (positioned) parent, with a purple glow
 * that follows the pointer.
 */
export function HexBackground() {
	const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
	const id = 'hex-pattern-' + useId();

	useEffect(() => {
		const el = ref.current;
		const parent = el?.parentElement;
		if (!el || !parent) return;

		/** @param {PointerEvent} e */
		const onMove = (e) => {
			if (e.pointerType === 'touch') return;
			const rect = parent.getBoundingClientRect();
			el.style.setProperty('--pointer-x', `${e.clientX - rect.left}px`);
			el.style.setProperty('--pointer-y', `${e.clientY - rect.top}px`);
			el.style.setProperty('--pointer-opacity', '0.12');
		};
		const onLeave = () => {
			el.style.removeProperty('--pointer-x');
			el.style.removeProperty('--pointer-y');
			el.style.removeProperty('--pointer-opacity');
		};

		parent.addEventListener('pointermove', onMove);
		parent.addEventListener('pointerleave', onLeave);
		return () => {
			parent.removeEventListener('pointermove', onMove);
			parent.removeEventListener('pointerleave', onLeave);
		};
	}, []);

	const fill = `url(#${id})`;

	return (
		<div ref={ref} class={style.background} aria-hidden="true">
			<svg class={style.base} focusable="false">
				<defs>
					<pattern
						id={id}
						width="64"
						height="56"
						viewBox="0 0 48 42"
						patternUnits="userSpaceOnUse"
					>
						<path d={HEX_TILE} fill="none" stroke="currentColor" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={fill} />
			</svg>
			<svg class={style.highlight} focusable="false">
				<rect width="100%" height="100%" fill={fill} />
			</svg>
		</div>
	);
}

/**
 * Hexagon-framed icon, the icon itself is drawn via `mask-image` so it
 * picks up the current text color.
 *
 * @param {{ src: string }} props
 */
export function HexIcon({ src }) {
	return (
		<span class={style.icon} aria-hidden="true">
			<svg viewBox="0 0 48 48" focusable="false">
				<path
					d="M12 3h24l12 21-12 21H12L0 24z"
					fill="var(--accent-bg)"
					stroke="var(--accent)"
					stroke-width="1.4"
				/>
			</svg>
			<span
				class={style.iconGlyph}
				style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
			/>
		</span>
	);
}
