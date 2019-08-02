import createStore from 'unistore';
import { getDefaultLanguage } from './lib/language';
import config from './config';
import { localStorageSet, localStorageGet } from './lib/localstorage';

const SAVE = ['lang'];

export default initial => {
	let storedState = getSavedState();
	let state = { ...initial, ...storedState };

	if (state.lang !== '') {
		// Use `location.href` instead of `location.search` because the latter is
		// not patched in preact-cli.
		// See: https://github.com/preactjs/preact-cli/pull/856
		let langOverride = (
			(location.href.match(/[?&]lang=([a-z-]+)/i) || [])[1] || ''
		).toLowerCase();
		if (langOverride && config.languages[langOverride])
			state.lang = langOverride;

		if (!state.lang) state.lang = getDefaultLanguage(config.languages) || 'en';
	} else {
		state.lang = 'en';
	}

	let store = createStore(state);
	store.subscribe(saveState);
	return store;
};

function saveState(state) {
	let saved = {};
	for (let i = SAVE.length; i--; ) saved[SAVE[i]] = state[SAVE[i]];
	localStorageSet('state', JSON.stringify(saved));
}

function getSavedState() {
	let state;
	try {
		state = JSON.parse(localStorageGet('state'));
	} catch (e) {}
	return state || {};
}
