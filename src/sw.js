import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';

setupRouting();

setupPrecaching(getFiles());

// fix upgrades from the old site
self.caches.keys().then(keys => {
	const key = keys.filter(k => /^webpack-offline:/.test(k))[0];
	if (key) {
		caches.delete(key);
		setTimeout(() => {
			self.skipWaiting();
		}, 50);
	}
});
