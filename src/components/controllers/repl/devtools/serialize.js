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

	if (Array.isArray(value)) {
		return value.map(item => serialize(item, limit - 1));
	} else if (value instanceof Date) {
		return { __type: 'date', value: value.toISOString() };
	} else if (value instanceof Set) {
		return {
			__type: 'set',
			value: Array.from(value.values()).map(item => serialize(item, limit - 1))
		};
	} else if (value instanceof Map) {
		return {
			__type: 'map',
			value: Array.from(value.entries()).map(entry => [
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

/**
 *
 * @param {any} value
 * @param {Set<string>} show
 * @param {Array<{ key: string, level: number, value: any, collapsible: boolean}>} out
 */
export function flattenMsg(value, show, out, key = '.', level = 0) {
	if (key !== '.' && !show.has(key)) {
		return;
	}
	console.log(' shown', key, show);

	if (value === null || value === undefined) {
		out.push({ key, level, value, collapsible: false });
		return;
	}

	switch (typeof value) {
		case 'number':
		case 'string':
		case 'boolean':
			out.push({ key, level, value, collapsible: false });
			return;
	}

	const keys = Object.keys(value);
	const hasProps = keys.length > 0;
	out.push({ key, level, value, collapsible: hasProps });

	if (hasProps) {
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			const nextKey = key + '.' + k;
			out.push({
				key: nextKey,
				level: level + 1,
				value: value[k],
				collapsible: false
			});

			if (show.has(nextKey)) {
				flattenMsg(value[k], show, out, nextKey, level + 1);
			}
		}
	}
}
