import { h } from 'preact';
import cx from '../../lib/cx';
import s from './icon.less';

/**
 * @param {{icon: "block", size: "normal" | "small"}} props
 */
export function Icon({ icon, size = 'normal' }) {
	return (
		<svg
			class={cx(
				s.icon,
				size === 'normal' && s.iconNormal,
				size === 'small' && s.iconSmall
			)}
		>
			<use xlinkHref={`#${icon}`} />
		</svg>
	);
}
