import { useEffect } from 'preact/hooks';
import { getContent } from './content.js';

/** @type {Map<string, Promise<any>>} */
const CACHE = new Map();

/**
 * @param {[ lang: string, path: string ]} args
 * @returns {{ html: string, meta: any }}
 */
export function useContent([lang, path]) {
	return useResource(() => getContent([lang, path]), [lang, path]);
}

export function useResource(fn, deps) {
	const cacheKey = '' + fn + JSON.stringify(deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = { promise: null, status: 'pending', result: undefined, users: 0 };

		state.promise = fn();
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
