import { useEffect } from 'preact/hooks';

import { prefetchContent } from './use-content.js';
import {
	ReplPage,
	TutorialPage,
	CodeEditor,
	BlogPage
} from '../components/routes.jsx';
import { BlogOverview, WeAreUsing } from '../components/widgets.js';

export function useDelegatedPrefetch() {
	useEffect(() => {
		/** @param {MouseEvent | TouchEvent} e */
		const prefetchAndPreload = (e) => {
			if (e.target && e.target instanceof HTMLAnchorElement) {
				if (!e.target.href.startsWith(location.origin)) return;
				const pathname = new URL(e.target.href).pathname;

				if (pathname.startsWith('/repl')) {
					ReplPage.preload();
					CodeEditor.preload();
				} else if (pathname.startsWith('/tutorial')) {
					TutorialPage.preload();
					CodeEditor.preload();
				} else if (pathname === '/blog') {
					BlogOverview.preload();
				} else if (pathname === '/about/we-are-using') {
					WeAreUsing.preload();
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
