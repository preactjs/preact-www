// This file contains polyfills that are necessary to make our
// site work in older browsers like IE11
require('preact-cli/src/lib/webpack/polyfills');

if (typeof window !== 'undefined') {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.msMatchesSelector ||
			Element.prototype.webkitMatchesSelector;
	}

	if (!Element.prototype.closest) {
		Element.prototype.closest = function(s) {
			// eslint-disable-next-line no-var
			var el = this;

			do {
				if (el.matches(s)) return el;
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);
			return null;
		};
	}
}
