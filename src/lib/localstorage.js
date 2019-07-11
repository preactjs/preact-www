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
