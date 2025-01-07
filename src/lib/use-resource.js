import { useEffect } from 'preact/hooks';

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

export function prefetchRepl() {
	const load = () => Promise.all([
		import('../components/code-editor'),
		import('../components/controllers/repl/runner')
	]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default }));

	const cacheKey = createCacheKey(load, ['repl']);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(load, cacheKey);
}

export function useRepl() {
	return useResource(() => Promise.all([
		import('../components/code-editor'),
		import('../components/controllers/repl/runner')
	]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default })), ['repl']);
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
export function setupCacheEntry(fn, cacheKey) {
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
