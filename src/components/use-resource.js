import { useEffect } from 'preact/hooks';

/** @type {Map<string, Promise<any>} */
const CACHE = new Map();

/**
 * @template T
 * @param {(...args: any[]) => T} fn
 * @param {any[]} deps
 * @returns {T}
 */
export function useResource(fn, deps) {
	const cacheKey = '' + fn + JSON.stringify(deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = { promise: null, status: 'pending', result: undefined, users: 1 };
		state.promise = fn()
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

	useEffect(() => {
		return () => {
			// Delete cached Promise if nobody uses it anymore
			if (state.users-- <= 0) {
				CACHE.delete(cacheKey);
			}
		};
	}, [cacheKey, state]);

	if (state.status === 'pending') {
		throw state.promise;
	} else if (state.status === 'error') {
		throw state.result;
	}

	return state.result;
}

/**
 * @param {{fallback: import('preact').ComponentChildren, children?: import('preact').ComponentChildren}} props
 * @returns {import('preact').ComponentChildren}
 */
export function FakeSuspense(props) {
	this.__c = childDidSuspend;
	return this.state.suspended ? props.fallback : props.children;
}

function childDidSuspend(err) {
	this.setState({ suspended: true });
	err.then(() => this.setState({ suspended: false }));
}
