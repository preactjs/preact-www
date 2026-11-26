import { useEffect } from 'preact/hooks';

import { prefetchContent } from './use-content.js';
import {
	Home,
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
			const link =
				e.target instanceof Element ? e.target.closest('a[href]') : null;
			if (link instanceof HTMLAnchorElement) {
				if (!link.href.startsWith(location.origin)) return;
				const pathname = new URL(link.href).pathname;

				if (pathname === '/') {
					Home.preload();
				} else if (pathname.startsWith('/repl')) {
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

				// The home page is a component, without markdown content to fetch
				if (pathname !== '/') prefetchContent(pathname);
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
