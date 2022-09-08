import { createContext, Fragment } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import cx from '../../../../lib/cx';
import s from './devtools.less';
import { flattenMsg } from './serialize';
import { Icon } from '../../../icon/icon';

function isPrimitive(v) {
	switch (typeof v) {
		case 'boolean':
		case 'number':
		case 'string':
		case 'undefined':
			return true;
		default:
			return v === null;
	}
}

/**
 * @param {{ hub: EventTarget }} props
 */
export function Console({ hub }) {
	const [msgs, setMsgs] = useState([]);
	const [filters, setFilters] = useState({ error: false, warn: false });

	useEffect(() => {
		/** @type {import("./devtools-types").ConsoleItem | undefined} */
		let last;
		const listenToConsole = type => event => {
			const args = event.detail;
			if (args.length === 1 && isPrimitive(args[0])) {
				if (
					last !== undefined &&
					last.type === type &&
					last.value === args[0]
				) {
					setMsgs(prev => {
						if (!prev.length) return prev;
						const l = prev[prev.length - 1];
						l.count++;
						return prev.slice();
					});
				} else {
					last = { type, value: args[0] };
					setMsgs(prev => [...prev, { type, value: args, count: 0 }]);
				}
			} else {
				last = undefined;
				setMsgs(prev => {
					return [...prev, { type, value: args, count: 0 }];
				});
			}
		};

		hub.addEventListener('log', listenToConsole('log'));
		hub.addEventListener('info', listenToConsole('info'));
		hub.addEventListener('warn', listenToConsole('warn'));
		hub.addEventListener('error', listenToConsole('error'));
		hub.addEventListener('console-clear', () => {
			setMsgs([]);
			last = undefined;
		});
	}, []);

	return (
		<div class={s.devtools}>
			<div class={s.devtoolsBar}>Console</div>
			<div class={s.consoleWrapper}>
				<div class={s.devtoolsActions}>
					<button class={s.devtoolsBtn} onClick={() => setMsgs([])}>
						<Icon icon="block" />
					</button>
					<div class={s.filter} aria-label="Console Filters">
						<button
							onClick={() => {
								const isAll = !filters.error && !filters.warn;
								if (!isAll) {
									setFilters({ error: false, warn: false });
								}
							}}
							class={cx(
								s.filterBtn,
								!filters.error && !filters.warn && s.filterBtnActive
							)}
						>
							All
						</button>
						<button
							class={cx(s.filterBtn, filters.error && s.filterBtnActive)}
							onClick={() => setFilters(p => ({ error: true, warn: false }))}
						>
							Errors
						</button>
						<button
							class={cx(s.filterBtn, filters.warn && s.filterBtnActive)}
							onClick={() => setFilters(p => ({ error: false, warn: true }))}
						>
							Warnings
						</button>
					</div>
				</div>
				<div class={s.console}>
					{msgs.length === 0 && (
						<div class={cx(s.italic, s.consoleMsg, s.consoleHint)}>
							Console was cleared
						</div>
					)}
					{msgs.map((msg, i) => {
						return (
							<Message
								key={i}
								type={msg.type}
								value={msg.value[0]}
								count={msg.count}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

/**
 * @param {{ type: string, value: any[], count: number} } props
 */
function Message({ type, value, count }) {
	const [collapsed, setCollapsed] = useState(new Set());
	return (
		<div
			class={cx(
				type == 'warn' && s.consoleWarn,
				type == 'error' && s.consoleError
			)}
		>
			<MessageItem
				type={type}
				value={value}
				count={count}
				level={0}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
			/>
		</div>
	);
}

function MessageItem({ type, value, level, count, collapsed, setCollapsed }) {
	const collapsible =
		value !== null && value !== undefined && typeof value === 'object';

	return (
		<div class={cx(s.consoleMsg, collapsible && s.consoleMsgCollapsible)}>
			<span
				class={cx(
					s.consoleCount,
					count > 0 &&
						(type === 'error'
							? s.consoleCountError
							: type === 'warn'
							? s.consoleCountWarn
							: s.consoleCountInfo)
				)}
			>
				{count > 0 ? count + 1 : ''}
			</span>
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

export function generatePreview(value, level = 0, end = false) {
	if (value === null || value === undefined) {
		return String(value);
	}

	switch (typeof value) {
		case 'number':
		case 'boolean':
			return <span class={s.primitive}>{String(value)}</span>;
		case 'string':
			return level === 0 ? value : <span class={s.string}>'{value}'</span>;
	}

	if (Array.isArray(value)) {
		if (end) return `Array(${value.length})`;
		return `[TODO]`;
	}

	const keys = Object.keys(value);

	if (end) {
		return (
			<span class={cx(level === 0 && s.italic)}>
				<span class={s.bright}>{'{'}</span>
				{keys.length > 0 ? '…' : ''}
				<span class={s.bright}>{'}'}</span>
			</span>
		);
	}

	return (
		<span class={cx(level === 0 && s.italic)}>
			<span class={s.bright}>{'{'}</span>
			{keys.map(k => {
				return (
					<>
						<span class={s.consoleDim}>{k}</span>:{' '}
						{generatePreview(value[k], level + 1, true)}
					</>
				);
			})}
			<span class={s.bright}>{'}'}</span>
		</span>
	);
}
