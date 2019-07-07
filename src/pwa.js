import { lazily } from './lib/lazily';

lazily(() => {
	import(/* webpackChunkName: "offline" */ 'offline-plugin/runtime').then(runtime => {
		runtime.install({
			onUpdateReady: () => runtime.applyUpdate(),
			onUpdated: () => location.reload()
		});
	});
});
