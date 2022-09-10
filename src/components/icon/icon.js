import { h } from 'preact';
import cx from '../../lib/cx';
import s from './icon.less';

/**
 * @param {{icon: "block" | "error" | "info" | "warn", size: "normal" | "small", class?: string}} props
 */
export function Icon({ icon, size = 'normal', class: klass }) {
	return (
		<svg
			class={cx(
				s.icon,
				size === 'normal' && s.iconNormal,
				size === 'small' && s.iconSmall,
				klass
			)}
		>
			<use xlinkHref={`#${icon}`} />
		</svg>
	);
}
