import { createContext, Fragment } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import cx from '../../../../lib/cx';
import s from './devtools.less';
import { flattenMsg } from './serialize';

export const DevtoolsCtx = createContext(new EventTarget());

/**
 * @param {{ hub: EventTarget }} props
 */
export function Console({ hub }) {
	const [msgs, setMsgs] = useState([]);
	useEffect(() => {
		const listenToConsole = type => event => {
			setMsgs(prev => [...prev, { type, value: event.detail }]);
		};

		hub.addEventListener('log', listenToConsole('log'));
		hub.addEventListener('warn', listenToConsole('warn'));
		hub.addEventListener('error', listenToConsole('error'));
	}, []);

	return (
		<div class={s.devtools}>
			<div class={s.consoleWrapper}>
				<div class={s.console}>
					{msgs.map((msg, i) => {
						return <Message key={i} type={msg.type} value={msg.value[0]} />;
					})}
				</div>
			</div>
		</div>
	);
}

/**
 * @param {{ type: string, value: any[]} } props
 */
function Message({ type, value }) {
	const [collapsed, setCollapsed] = useState(new Set());

	return (
		<div
			class={cx(
				s.consoleMsg,
				type == 'warn' && s.consoleWarn,
				type == 'error' && s.consoleError
			)}
		>
			<MessageItem
				value={value}
				level={0}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
			/>
		</div>
	);
}

function MessageItem({ value, level, collapsed, setCollapsed }) {
	const collapsible =
		value !== null && value !== undefined && typeof value === 'object';

	return (
		<div class={s.consoleData}>
			{collapsible ? (
				<button
					class={s.collapseBtn}
					onClick={() => {
						const next = new Set(collapsed);
						if (next.has(value)) {
							next.delete(value);
						} else {
							next.add(value);
						}
						setCollapsed(next);
					}}
				>
					<span class={s.collapseIcon}>{collapsed.has(value) ? '▼' : '▶'}</span>

					{generatePreview(value)}
				</button>
			) : (
				generatePreview(value)
			)}
		</div>
	);
}

export function generatePreview(value, end = false) {
	if (value === null || value === undefined) {
		return String(value);
	}

	switch (typeof value) {
		case 'number':
		case 'boolean':
			return <span class={s.primitive}>{String(value)}</span>;
		case 'string':
			return <span class={s.string}>'{value}'</span>;
	}

	const keys = Object.keys(value);

	if (end) {
		return `{${keys.length > 0 ? '...' : ''}}`;
	}

	return (
		<>
			{'{'}
			{keys.map(k => {
				return (
					<>
						<span class={s.consoleDim}>{k}</span>:{' '}
						{generatePreview(value[k], true)}
					</>
				);
			})}
			{'}'}
		</>
	);
}
