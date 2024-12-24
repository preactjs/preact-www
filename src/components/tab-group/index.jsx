import { useState, useId } from 'preact/hooks';

import style from './style.module.css';

/**
 * Used in markdown files to switch between different API styles, i.e,
 * Class Components and Hooks. This displays either-or, not both at once,
 * so it's not necessarily meant for directly comparing API styles.
 *
 * @param {Object} props
 * @param {string} props.tabstring - Comma-separated list of tab names
 * @param {Array<import('preact').Component | string>} props.children - Array of JSX elements
 */
export default function TabGroup({ tabstring, children }) {
	const [activeTab, setActiveTab] = useState(0);
	const id = useId();

	// Removes the empty strings caused by newlines in our HTML in markdown
	children = children.filter(s => typeof s !== 'string' || s.trim() !== '');
	const tabs = tabstring.split(',').map(s => s.trim());

	// Adapted from MDN tabs example:
	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#example
	const onKeyDown = (e) => {
		const tabContainer = e.currentTarget;
		let focusedTabIndex = activeTab;

		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			if (e.key == 'ArrowRight') {
				focusedTabIndex++;
				if (focusedTabIndex >= tabs.length) focusedTabIndex = 0;
			} else if (e.key == 'ArrowLeft') {
				focusedTabIndex--;
				if (focusedTabIndex < 0) focusedTabIndex = tabs.length - 1;
			}

			setActiveTab(focusedTabIndex);
			tabContainer.children[focusedTabIndex].focus();
		}
	};

	return (
		<div>
			<div class={style.tabs} role="tablist" aria-label="API Styles" aria-orientation="horizontal" onKeyDown={onKeyDown}>
				{tabs.map((tab, i) => (
					<button
						class={style.tab}
						onClick={() => setActiveTab(i)}
						role="tab"
						id={`tab-${id}-${tabs[i]}`}
						aria-controls={`panel-${id}-${tabs[i]}`}
						aria-selected={activeTab == i ? 'true' : 'false'}
						tabIndex={activeTab == i ? 0 : -1}
					>
						{tab}
					</button>
				))}
			</div>
			{children.map((child, i) => (
				<div
					role="tabpanel"
					id={`panel-${id}-${tabs[i]}`}
					aria-labelledby={`tab-${id}-${tabs[i]}`}
					tabIndex={0}
					hidden={activeTab != i}
				>
					{child}
				</div>
			))}
		</div>
	);
}
