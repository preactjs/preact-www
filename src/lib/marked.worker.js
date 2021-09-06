import marked from 'marked';
import { expose } from 'comlink';

if (typeof self === 'undefined') {
	globalThis.self = globalThis;
	console.log('SELF', self);
}

expose(
	{
		convert(markdown) {
			return marked(markdown);
		}
	},
	self
);
