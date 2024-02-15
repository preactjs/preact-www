import { useEffect } from 'preact/hooks';
import { getContent, getContentOnServer } from './content.js';

/** @type {Map<string, Promise<any>>} */
const CACHE = new Map();

/**
 * @param {[ lang: string, url: string ]} args
 * @returns {{ html: string, meta: any }}
 */
export function useContent([lang, url]) {
	return useResource(
		() => (PRERENDER ? getContentOnServer : getContent)([lang, url]),
		[lang, url]
	);
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

export function FakeSuspense(props) {
	this.__c = childDidSuspend;
	return this.state && this.state.suspended ? props.fallback : props.children;
}

function childDidSuspend(err) {
	err.then(() => this.forceUpdate());
}
