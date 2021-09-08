import marked from 'marked';
import { expose } from 'comlink';

if (typeof self === 'undefined') {
	globalThis.self = globalThis;
}

expose(
	{
		convert(markdown) {
			return marked(markdown);
		}
	},
	self
);
