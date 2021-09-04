/**
 *
 * @param {number} wait
 * @param {(...args: any[]) => any} fn
 * @returns
 */
export function debounce(wait, fn) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			fn(...args);
		}, wait);
	};
}

/**
 *
 * @param {(...args: any[]) => any} fn
 * @param {Map<any, any>} [cache]
 * @returns
 */
export function memoOne(fn, cache = new Map()) {
	return (...args) => {
		let cached = cache.get(args[0]);
		if (!cached) {
			cached = fn(...args);
			cache.set(args[0], cached);
		}
		return cached;
	};
}
