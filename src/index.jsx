import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { hydrate, prerender as ssr } from 'preact-iso';

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

let initialized = false,
	prerenderData = {
		preactVersion: '',
		preactReleaseURL: '',
		preactStargazers: 0
	};
export async function prerender() {
	const init = async () => {
		// DOMParser polyfill for `preact-markup`
		const { DOMParser } = await import('@xmldom/xmldom');
		globalThis.DOMParser = DOMParser;

		// fetch latest release data
		const { default: releaseLambda } = await import('./lambda/release.js');
		const { version, url } = await (await releaseLambda()).json();
		prerenderData.preactVersion = version;
		prerenderData.preactReleaseURL = url;

		// fetch latest stargazer count
		const { default: repoLambda } = await import('./lambda/repo.js');
		const { stargazers_count: stargazersCount } = await (await repoLambda()).json();
		prerenderData.preactStargazers = stargazersCount;

		initialized = true;
	};
	if (!initialized) await init();

	const res = await ssr(<App prerenderData={prerenderData} />);

	const elements = new Set([
		{ type: 'meta', props: { name: 'description', content: globalThis.description } },
		{ type: 'meta', props: { property: 'og:url', content: `https://preactjs.com${location.pathname}` } },
		{ type: 'meta', props: { property: 'og:title', content: globalThis.title } },
		{ type: 'meta', props: { property: 'og:description', content: globalThis.description } },
		location.pathname.includes('/v8/') && { type: 'meta', props: { name: 'robots', content: 'noindex' } },
		process.env.BRANCH && { type: 'script', children: `ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga('set','dimension1','${process.env.BRANCH}');onerror=function(e,f,l,c){ga('send','event','exception',e,f+':'+l+':'+c)}` }
	].filter(Boolean));

	res.html += '<script async defer src="https://www.google-analytics.com/analytics.js"></script>';

	return {
		...res,
		data: prerenderData,
		head: {
			lang: 'en',
			title: globalThis.title,
			elements
		}
	};
}
