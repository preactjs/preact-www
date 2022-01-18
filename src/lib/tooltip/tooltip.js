import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import cx from '../cx';
import './tooltip.css';

export const WithTooltip = ({ children, tooltip, showTooltip = true }) => {
	const wrapper = useRef();
	const [pos, setPos] = useState({ top: 0, left: 0 });

	function handleMouseOver() {
		const rect = wrapper.current.getBoundingClientRect();
		const header = document
			.querySelector('#app > header')
			.getBoundingClientRect();
		setPos({ top: rect.y - header.height, left: rect.left + rect.width / 2 });
	}

	return (
		<>
			<div
				className={cx(showTooltip && 'tooltip-enabled')}
				ref={wrapper}
				onMouseOver={handleMouseOver}
			>
				{children}
			</div>
			{showTooltip ? (
				<div
					className="tooltip-container"
					style={{
						top: pos.top,
						left: pos.left
					}}
				>
					<div className="tooltip-content">{tooltip}</div>
				</div>
			) : null}
		</>
	);
};
