import createStore from './lib/store';
import getDefaultLanguage from './lib/default-language';
import config from './config';

const SAVE = ['lang'];

export default () => {
	let state = getSavedState();

	if (!state.lang) state.lang = getDefaultLanguage(config.languages);

	let store = createStore(state);
	store.subscribe(saveState);
	return store;
};

function saveState(state) {
	let saved = {};
	for (let i=SAVE.length; i--; ) saved[SAVE[i]] = state[SAVE[i]];
	localStorage.state = JSON.stringify(saved);
}

function getSavedState() {
	let state;
	try {
		state = JSON.parse(localStorage.state);
	} catch (e) {}
	return state || {};
}
