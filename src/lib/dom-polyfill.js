/**
 * `preact-markup` turns the compiled markdown HTML into a Preact tree by
 * parsing it with `DOMParser`, then falls back to `document.implementation`
 * when that is missing. Neither exists in a server runtime, so without this the
 * content region renders empty and every page ships its prose only inside the
 * hydration payload — invisible to crawlers and to the first paint.
 *
 * The old prerender entry installed the same polyfill. It lives here, imported
 * by the server-only content module, so it is guaranteed to be in place before
 * any page renders and is stripped from the client build along with the loaders.
 */

import { DOMParser } from '@xmldom/xmldom';

if (typeof globalThis.DOMParser === 'undefined') {
	globalThis.DOMParser = /** @type {any} */ (DOMParser);
}
