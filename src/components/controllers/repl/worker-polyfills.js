import 'promise-polyfill/lib/polyfill';

if (!Uint8Array.prototype.slice) {
	Uint8Array.prototype.slice = function (begin, end) {
		return new Uint8Array([].slice.call(this, begin, end));
	};
}

if (!String.prototype.includes) {
	String.prototype.includes = function(needle) {
		return this.indexOf(needle) !== -1;
	};
}
