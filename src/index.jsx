import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { hydrate } from 'preact-iso';

import App from './components/app';
import './analytics';
import './style/index.css';

// allows users to play with preact in the browser developer console
globalThis.preact = { ...preact, ...hooks };

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));

	// Might need to keep this around indefinitely, unfortunately
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(registrations => {
			for (const registration of registrations) {
				registration.unregister();
			}
		});
	}
}

export { App };
