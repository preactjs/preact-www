import * as preact from 'preact';
import * as hooks from 'preact/hooks';

if (typeof window !== 'undefined') {
	// Lets readers poke at Preact from the browser console while reading the docs.
	globalThis.preact = { ...preact, ...hooks };

	// The site shipped a service worker years ago. Anyone who visited back then
	// still has it registered, so we keep tearing it down.
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(registrations => {
			for (const registration of registrations) {
				registration.unregister();
			}
		});
	}
}
