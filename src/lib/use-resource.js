import { useEffect } from 'preact/hooks';
import { getContent } from './content.js';

/**
 * @typedef {Object} CacheEntry
 * @property {Promise<any>} promise
 * @property {'pending'|'success'|'error'} status
 * @property {any} result
 * @property {number} users
 */

/** @type {Map<string, CacheEntry>} */
const CACHE = new Map();
const createCacheKey = (fn, deps) => '' + fn + JSON.stringify(deps);

/**
 * @param {[ lang: string, path: string ]} args
 * @returns {{ html: string, meta: any }}
 */
export function useContent([lang, path]) {
	return useResource(() => getContent([lang, path]), [lang, path]);
}

export function prefetchContent([lang, path]) {
	const cacheKey = createCacheKey(() => getContent([lang, path]), [lang, path]);
	if (CACHE.has(cacheKey)) return;

	/** @type {CacheEntry} */
	const state = {
		promise: getContent([lang, path]),
		status: 'pending',
		result: undefined,
		users: 0
	};
	state.promise
		.then(r => {
			state.status = 'success';
			state.result = r;
		})
		.catch(err => {
			state.status = 'error';
			state.result = err;
		});
	CACHE.set(cacheKey, state);
}

export function useResource(fn, deps) {
	const cacheKey = createCacheKey(fn, deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = { promise: fn(), status: 'pending', result: undefined, users: 0 };

		if (state.promise.then) {
			state.promise
				.then(r => {
					state.status = 'success';
					state.result = r;
				})
				.catch(err => {
					state.status = 'error';
					state.result = err;
				});
		} else {
			state.status = 'success';
			state.result = state.promise;
		}

		CACHE.set(cacheKey, state);
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
