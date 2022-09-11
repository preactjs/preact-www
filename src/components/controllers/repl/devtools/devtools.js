import { Fragment } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import cx from '../../../../lib/cx';
import s from './devtools.less';
import { flattenMsg, isSerialized } from './serialize';
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
	const [filter, setFilter] = useState('*');

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
				setMsgs(prev => [...prev, { type, value: args, count: 0 }]);
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

	const filtered = msgs.filter(msg => {
		if (filter === '*') return true;
		if (filter === 'error' && msg.type === 'error') return true;
		if (filter === 'warn' && msg.type === 'warn') return true;
		return false;
	});

	const onClear = useCallback(() => setMsgs([]), []);

	const setAll = useCallback(() => setFilter('*'), []);
	const setError = useCallback(() => setFilter('error'), []);
	const setWarn = useCallback(() => setFilter('warn'), []);

	return (
		<div class={s.devtools}>
			<div class={s.devtoolsBar}>Console</div>
			<div class={s.consoleWrapper}>
				<div class={s.devtoolsActions}>
					<button class={s.devtoolsBtn} onClick={onClear}>
						<Icon icon="block" />
					</button>
					<div class={s.filter} aria-label="Console Filters">
						<button
							onClick={setAll}
							class={cx(s.filterBtn, filter === '*' && s.filterBtnActive)}
						>
							All
						</button>
						<button
							class={cx(s.filterBtn, filter === 'error' && s.filterBtnActive)}
							onClick={setError}
						>
							Errors
						</button>
						<button
							class={cx(s.filterBtn, filter === 'warn' && s.filterBtnActive)}
							onClick={setWarn}
						>
							Warnings
						</button>
					</div>
				</div>
				<div class={s.console}>
					{filtered.length === 0 && (
						<div class={cx(s.italic, s.consoleMsg, s.consoleHint)}>
							Console was cleared
						</div>
					)}
					{filtered.map((msg, i) => (
						<div
							key={i}
							class={cx(
								s.consoleMsg,
								msg.type == 'warn' && s.consoleWarn,
								msg.type == 'error' && s.consoleError
							)}
						>
							<Message type={msg.type} value={msg.value[0]} count={msg.count} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * @param {{type: import("./devtools-types").ConsoleMethod, value: number}} props
 */
function ConsoleIcon({ type, value }) {
	let children = (
		<span
			class={cx(
				s.consoleCount,
				type === 'warn'
					? s.consoleCountWarn
					: type === 'error'
					? s.consoleCountError
					: s.consoleCountInfo
			)}
		>
			<span>{value + 1}</span>
		</span>
	);
	if (value === 0) {
		if (type === 'error') {
			children = <Icon class={s.consoleIconError} icon="error" size="small" />;
		} else if (type === 'warn') {
			children = <Icon class={s.consoleIconWarn} icon="warn" size="small" />;
		} else if (type === 'info') {
			children = <Icon class={s.consoleIconInfo} icon="info" size="small" />;
		} else {
			children = <span class={s.consoleCountEmpty} />;
		}
	}

	return <span class={s.consoleIcon}>{children}</span>;
}

/**
 * @param {{ type: string, value: any[], count: number} } props
 */
function Message({ type, value, count }) {
	const [show, setShow] = useState(new Set([]));
	const out = [];
	flattenMsg(value, show, out, 'root');

	console.log(out);

	return (
		<>
			{out.map(msg => (
				<MessageItem
					key={msg.key}
					type={type}
					msg={msg}
					count={count}
					show={show}
					setShow={setShow}
				/>
			))}
		</>
	);
}

/**
 * @param {{dim?: boolean, children: any, preview: any}} props
 */
function Property({ dim, children, preview }) {
	return (
		<>
			<span class={cx(dim ? s.consoleMsgPropertyDim : s.consoleMsgProperty)}>
				{children}
			</span>
			{preview ? (
				<>
					{': '}
					<span class={s.preview}>{preview}</span>
				</>
			) : (
				''
			)}
		</>
	);
}

function MessageItem({ type, msg, count, show, setShow }) {
	const { value, key, label, kind, level } = msg;
	const collapsible = !isPrimitive(value) && kind !== 'function';

	const onClick = useCallback(() => {
		setShow(p => {
			const next = new Set(p);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	}, [key, setShow]);

	const isBuiltIn = label === '[[Entries]]';
	const preview = !isBuiltIn ? generatePreview(value, kind, level) : null;

	const previewJsx =
		level > 0 ? (
			<Property dim={isBuiltIn} preview={preview}>
				{label}
			</Property>
		) : (
			<span class={s.preview}>{preview}</span>
		);

	return (
		<div
			class={cx(
				s.consoleMsgItem,
				collapsible && count === 0 && s.consoleMsgCollapsible
			)}
			style={`--indent: calc(1rem * ${level})`}
		>
			<ConsoleIcon value={count} type={type} />
			<div class={s.consoleMsgWrapper}>
				{collapsible ? (
					<button class={s.collapseBtn} onClick={onClick}>
						<span class={s.collapseIcon}>{show.has(key) ? '▼' : '▶'}</span>
						{previewJsx}
					</button>
				) : (
					<>
						<span class={s.collapseIcon} />
						{previewJsx}
					</>
				)}
			</div>
		</div>
	);
}

export function generatePreview(value, kind, level = 0, end = false) {
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
		if (kind === 'entry-item') {
			return (
				<span>
					{'{ '}
					{generatePreview(value[0], '', level + 1)}
					{' => '}
					{generatePreview(value[1], '', level + 1)}
					{' }'}
				</span>
			);
		} else if (kind === 'entry-item-set') {
			return `Array(${value.length})`;
		}

		return (
			<span class={cx(level === 0 && s.italic)}>
				({value.length}) [
				{value.map((v, i) => (
					<>
						{generatePreview(v, kind, level + 1)}
						{i < value.length - 1 ? ', ' : ''}
					</>
				))}
				]
			</span>
		);
	}

	if (isSerialized(value)) {
		switch (value.__type) {
			case 'set': {
				let tail = null;
				const size = value.entries.length;
				if (size > 0) {
					const items = value.entries.map(v =>
						generatePreview(v, kind, level + 1, true)
					);
					tail = (
						<span class={cx(level === 0 && s.italic)}>
							{' {'}
							{items.map((item, i) => (
								<>
									{item}
									{i < items.length - 1 ? ', ' : ''}
								</>
							))}
							{'}'}
						</span>
					);
				}
				return (
					<span class={cx(level === 0 && s.italic)}>
						Set({size}){tail}
					</span>
				);
			}
			case 'map': {
				let tail = null;
				const size = value.entries.length;
				if (size > 0) {
					const items = value.entries.map(v => (
						<>
							{generatePreview(v[0], kind, level + 1)}
							{' => '}
							{generatePreview(v[1], kind, level + 1)}
						</>
					));
					tail = (
						<span class={cx(level === 0 && s.italic)}>
							{' {'}
							{items.map((item, i) => (
								<>
									{item}
									{i < items.length - 1 ? ', ' : ''}
								</>
							))}
							{'}'}
						</span>
					);
				}
				return (
					<span class={cx(level === 0 && s.italic)}>
						Map({size}){tail}
					</span>
				);
			}
			case 'function': {
				if (level === 0) {
					return <span class={s.italic}>{value.str}</span>;
				}

				const name = value.name ? <>{value.name}()</> : null;
				return (
					<>
						<span class={s.bright}>ƒ </span>
						{name}
					</>
				);
			}
		}
	}

	let keys = Object.keys(value);
	const len = keys.length;
	// Only show max of 5 keys like DevTools
	if (len > 5) {
		keys = keys.slice(0, 5);
	}

	if (end) {
		return (
			<span class={cx(level === 0 && s.italic)}>
				<span class={s.bright}>{'{'}</span>
				{len > 0 ? '…' : ''}
				<span class={s.bright}>{'}'}</span>
			</span>
		);
	}

	return (
		<span class={cx(level === 0 && s.italic)}>
			<span class={s.bright}>{'{'}</span>
			{keys.map((k, i) => (
				<Fragment key={k}>
					<span class={s.consoleDim}>{k}</span>:{' '}
					{generatePreview(value[k], kind, level + 1, true)}
					{i < keys.length - 1 ? ', ' : keys.length < len ? ', …' : ''}
				</Fragment>
			))}
			<span class={s.bright}>{'}'}</span>
		</span>
	);
}
