import { useState } from 'preact/hooks';

export const localStorageGet = key => {
	try {
		return localStorage.getItem(key);
	} catch (e) {
		return null;
	}
};

export const localStorageSet = (key, value) => {
	try {
		localStorage.setItem(key, value);
	} catch (e) {}
};

/**
 * Automatically sync a value to localStorage
 * @param {string} key The key to store the data in
 * @param {any} initial Initial value when no localStorage entry was found
 */
export function useStoredValue(key, initial) {
	let stored = localStorageGet(key);
	if (stored == null) stored = initial;

	const [value, setValue] = useState(stored);

	function setStoredValue(v) {
		localStorageSet(key, v);
		setValue(v);
	}

	return [value, setStoredValue];
}
