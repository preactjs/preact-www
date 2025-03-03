import { useState, useEffect } from 'preact/hooks';

/**
 * @typedef {Object} CacheEntry
 * @property {Promise<any>} promise
 * @property {'pending'|'success'|'error'} status
 * @property {any} result
 * @property {number} users
 */

/** @type {Map<string, CacheEntry>} */
export const CACHE = new Map();
export const createCacheKey = (fn, deps) => '' + fn + JSON.stringify(deps);

export function useResource(fn, deps) {
	const update = useState({})[1];
	const cacheKey = createCacheKey(fn, deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = setupCacheEntry(fn, cacheKey, update);
	}

	useEffect(() => {
		state.users++;

		return () => {
			// Delete cached Promise if nobody uses it anymore
			if (state.users-- <= 0) {
				CACHE.delete(cacheKey);
			}
		};
	}, [cacheKey, state]);

	if (state.status === 'success') return state.result;
	else if (state.status === 'error') throw state.result;
	throw state.promise;
}

/**
 * @param {() => Promise<any>} fn
 * @param {string} cacheKey
 * @param {(state: CacheEntry) => void} [update]
 * @returns {CacheEntry}
 */
export function setupCacheEntry(fn, cacheKey, update) {
	/** @type {CacheEntry} */
	const state = { promise: fn(), status: 'pending', result: undefined, users: 0 };

	if (state.promise.then) {
		state.promise
			.then(r => {
				state.status = 'success';
				state.result = r;
			})
			.catch(err => {
				state.status = 'error';
				state.result = err;
			})
			.finally(() => {
				update && update(state);
			});
	} else {
		state.status = 'success';
		state.result = state.promise;
	}

	CACHE.set(cacheKey, state);
	return state;
}
