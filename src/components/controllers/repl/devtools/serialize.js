export function serialize(value, limit = 20) {
	if (limit === 0) return { __type: 'limit' };

	if (value === null) return null;
	switch (typeof value) {
		case 'boolean':
		case 'number':
		case 'string':
			return value;
		case 'function':
			return { __type: 'function', name: value.name, str: value.toString() };
		case 'symbol':
			return { __type: 'symbol', value: value.toString() };
		case 'undefined':
			return { __type: 'undefined', value: undefined };
		case 'bigint':
			return { __type: 'bigint', value: value.toString() };
	}

	// This is a bit meh, but for some reason `set instanceof Set` fails.
	// Don't know why.
	const proto = value.toString();
	if (Array.isArray(value)) {
		return value.map(item => serialize(item, limit - 1));
	} else if (value instanceof Date) {
		return { __type: 'date', value: value.toISOString() };
	} else if (proto === '[object Set]') {
		return {
			__type: 'set',
			entries: Array.from(value.values()).map(item =>
				serialize(item, limit - 1)
			)
		};
	} else if (proto === '[object Map]') {
		return {
			__type: 'map',
			entries: Array.from(value.entries()).map(entry => [
				serialize(entry[0], limit - 1),
				serialize(entry[1], limit - 1)
			])
		};
	}

	return Object.keys(value).reduce((acc, key) => {
		acc[key] = serialize(value[key], limit - 1);
		return acc;
	}, {});
}

function newTreeItem(key, level, label, value, kind, collapsible) {
	return { key, label, value, level, kind, collapsible };
}

const SERIALIZED = new Set([
	'set',
	'map',
	'date',
	'undefined',
	'function',
	'bigint',
	'symbol',
	'limit'
]);

export function isSerialized(value) {
	return '__type' in value && SERIALIZED.has(value.__type);
}

/**
 * @param {any} value
 * @param {Set<string>} show
 * @param {Array<{ key: string, label: string, level: number, value: any, collapsible: boolean}>} out
 */
export function flattenMsg(value, show, out, key, label = '', level = 0) {
	if (value === null || value === undefined) {
		out.push(newTreeItem(key, level, label, value, String(value), false));
		return;
	}

	switch (typeof value) {
		case 'number':
		case 'string':
		case 'boolean':
			out.push(newTreeItem(key, level, label, value, typeof value, false));
			return;
	}

	if (Array.isArray(value)) {
		const kind = /\.entries\.\d+$/.test(key) ? 'entry-item-set' : 'array';
		out.push(newTreeItem(key, level, label, value, kind, value.length > 0));

		if (show.has(key) && value.length > 0) {
			for (let i = 0; i < value.length; i++) {
				flattenMsg(value[i], show, out, `${key}.${i}`, i, level + 1);
			}
		}
		return;
	}

	if (isSerialized(value)) {
		switch (value.__type) {
			case 'set': {
				const entries = value.entries;
				const size = entries.length;
				out.push(newTreeItem(key, level, label, value, 'set', size));

				if (show.has(key) && size > 0) {
					out.push(
						newTreeItem(
							`${key}.entries`,
							level + 1,
							'[[Entries]]',
							value,
							'entries',
							true
						)
					);

					if (show.has(`${key}.entries`)) {
						for (let i = 0; i < entries.length; i++) {
							out.push(
								newTreeItem(
									`${key}.entries.${i}`,
									level + 2,
									i,
									entries[i],
									'entry-item',
									true
								)
							);

							if (show.has(`${key}.entries.${i}`)) {
								flattenMsg(
									entries[i],
									show,
									out,
									`${key}.entries.${i}.value`,
									'value',
									level + 3
								);
							}
						}
					}
				}
				return;
			}
			case 'map': {
				const entries = value.entries;
				const size = entries.length;
				out.push(newTreeItem(key, level, label, value, 'map', size));

				if (show.has(key) && size > 0) {
					out.push(
						newTreeItem(
							`${key}.entries`,
							level + 1,
							'[[Entries]]',
							value,
							'entries',
							true
						)
					);

					if (show.has(`${key}.entries`)) {
						for (let i = 0; i < entries.length; i++) {
							out.push(
								newTreeItem(
									`${key}.entries.${i}`,
									level + 2,
									i,
									entries[i],
									'entry-item',
									true
								)
							);

							if (show.has(`${key}.entries.${i}`)) {
								flattenMsg(
									entries[i][0],
									show,
									out,
									`${key}.entries.${i}.key`,
									'key',
									level + 3
								);
								flattenMsg(
									entries[i][1],
									show,
									out,
									`${key}.entries.${i}.value`,
									'value',
									level + 3
								);
							}
						}
					}
				}
				return;
			}
		}
	} else {
		const keys = Object.keys(value);
		const hasProps = keys.length > 0;
		out.push(newTreeItem(key, level, label, value, 'object', hasProps));

		if (show.has(key) && hasProps) {
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				flattenMsg(value[k], show, out, `${key}.${k}`, k, level + 1);
			}
		}
	}
}
