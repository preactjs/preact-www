let hasInteracted, shouldReload;

function sw() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistration().then(reg => {
			reg.onupdatefound = () => {
				const w = reg.installing;
				w.onstatechange = () => {
					if (w.state === 'installed' && navigator.serviceWorker.controller) {
						shouldReload = true;
						if (!hasInteracted) location.reload();
					}
				};
			};
		});
	}
}

if (!PRERENDER) {
	addEventListener(
		'click',
		e => {
			hasInteracted = true;
			const link = e.target.closest('a');
			if (link && shouldReload) {
				location.href = link.href;
				e.preventDefault();
				return false;
			}
		},
		true
	);

	if (document.readyState === 'complete') setTimeout(sw);
	else addEventListener('load', sw);
}
