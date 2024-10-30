import { useEffect } from 'preact/hooks';

import { getContent } from './content.js';
import { useLanguage } from './i18n';

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
 */
export function prefetchContent([lang, path]) {
	const cacheKey = createCacheKey(() => getContent([lang, path]), [lang, path]);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(() => getContent([lang, path]), cacheKey);
}

/**
 * @param {string} path
 * @returns {{ html: string, meta: any }}
 */
export function fetchContent(path) {
	const [lang] = useLanguage();
	return useResource(() => getContent([lang, path]), [lang, path]);
}

export function useResource(fn, deps) {
	const cacheKey = createCacheKey(fn, deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = setupCacheEntry(fn, cacheKey);
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
 * @returns {CacheEntry}
 */
function setupCacheEntry(fn, cacheKey) {
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
			});
	} else {
		state.status = 'success';
		state.result = state.promise;
	}

	CACHE.set(cacheKey, state);
	return state;
}
