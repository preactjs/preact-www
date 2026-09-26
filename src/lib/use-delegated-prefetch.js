import { useEffect } from 'preact/hooks';

import { prefetchContent } from './use-content.js';
import {
	ReplPage,
	TutorialPage,
	CodeEditor,
	BlogPage
} from '../components/routes.jsx';

export function useDelegatedPrefetch() {
	useEffect(() => {
		const prefetchAndPreload = e => {
			if (e.target.tagName === 'A') {
				if (!e.target.href.startsWith(location.origin)) return;
				const pathname = new URL(e.target.href).pathname;

				if (pathname.startsWith('/repl')) {
					ReplPage.preload();
					CodeEditor.preload();
				} else if (pathname.startsWith('/tutorial')) {
					TutorialPage.preload();
					CodeEditor.preload();
				} else if (pathname.startsWith('/blog/')) {
					BlogPage.preload();
				}

				prefetchContent(pathname);
			}
		};

		addEventListener('mouseover', prefetchAndPreload);
		addEventListener('touchstart', prefetchAndPreload);

		return () => {
			removeEventListener('mouseover', prefetchAndPreload);
			removeEventListener('touchstart', prefetchAndPreload);
		};
	}, []);
}
