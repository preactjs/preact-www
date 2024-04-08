/// <reference types="vite/client" />

import preact from 'preact';

declare module "preact" {
	namespace JSX {
		interface IntrinsicElements {
			'loading-bar': LoadingBarProps;
		}
	}
}

interface LoadingBarProps extends preact.JSX.HTMLAttributes<HTMLElement> {
	showing: boolean;
}

declare var prerenderPreactVersion: string;
declare var prerenderPreactReleaseUrl: string;
