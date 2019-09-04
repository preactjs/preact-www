import 'promise-polyfill/lib/polyfill';

if (!Uint8Array.prototype.slice) {
	Uint8Array.prototype.slice = function (begin, end) {
		return new Uint8Array([].slice.call(this, begin, end));
	};
}

function includes(needle) {
	return this.indexOf(needle) !== -1;
}

if (!String.prototype.includes) {
	String.prototype.includes = includes;
}

if (!Array.prototype.includes) {
	Array.prototype.includes = includes;
}
