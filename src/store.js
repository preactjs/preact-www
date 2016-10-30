import createStore from './lib/store';
import getDefaultLanguage from './lib/default-language';
import config from './config';

export default () => {
	let state = getSavedState();
	if (!state.lang) state.lang = getDefaultLanguage(config.languages);

	let store = createStore(state);
	store.subscribe(saveState);
	return store;
};

function saveState(state) {
	localStorage.state = JSON.stringify(state);
}

function getSavedState() {
	let state;
	try {
		state = JSON.parse(localStorage.state);
	} catch (e) {}
	return state || {};
}
