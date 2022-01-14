import { h, createElement, Fragment } from 'preact';
import cx from '../cx';
import './tooltip.css';

export const WithTooltip = ({ children, tooltip, showTooltip = true }) => (
	<div className={cx('tooltip-wrapper', showTooltip && 'tooltip-enabled')}>
		<div className="tooltip-container">
			{createElement(Fragment, {
				children: <div className="tooltip-content">{tooltip}</div>,
				_container: document.getElementById('overlay-stack')
			})}
		</div>
		{children}
	</div>
);
