import { h } from 'preact';
import cx from '../cx';
import './tooltip.css';

export const WithTooltip = ({ children, tooltip, showTooltip = true }) => (
	<div className={cx('tooltip-wrapper', showTooltip && 'tooltip-enabled')}>
		<div className="tooltip-container">
			<div className="tooltip-content">{tooltip}</div>
		</div>
		{children}
	</div>
);
