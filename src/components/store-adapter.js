import { createContext } from 'preact';
import { useContext, useEffect, useCallback, useState } from 'preact/hooks';
import { mapActions } from 'unistore/src/util';

/**
 * Store context that will be passed around the app. Complex shared state
 * should be stored here.
 */
export const storeCtx = createContext();

function mapStateToProps(keys, state) {
	return keys.reduce((acc, key) => {
		acc[key] = state[key];
		return acc;
	}, {});
}

/**
 * Wire a component up to the store. Passes state as props, re-renders on change.
 * @param {string[]} keys A function mapping of store
 * state to prop values, or an array/CSV of properties to map.
 * @param {Function|Object} [actions] Action functions (pure state mappings),
 * or a factory returning them. Every action function gets current state as the
 * first parameter and any other params next
 */
export function useStore(keys = [], actions) {
	const store = useContext(storeCtx);
	let state = mapStateToProps(keys, store.getState());
	let [v, setV] = useState(0);

	const update = useCallback(() => {
		let mapped = mapStateToProps(keys, store.getState());
		for (let i in mapped) {
			if (mapped[i] !== state[i]) {
				state = mapped;
				return setV(++v);
			}
		}
		for (let i in state) {
			if (!(i in mapped)) {
				state = mapped;
				return setV(++v);
			}
		}
	}, [v]);

	useEffect(() => {
		store.subscribe(update);
		return () => store.unsubscribe(update);
	}, [update]);

	return {
		state,
		actions: actions ? mapActions(actions, store) : { store },
		update: s => store.setState(Object.assign(store.getState, s))
	};
}
