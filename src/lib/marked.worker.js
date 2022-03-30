import 'promise-polyfill/lib/polyfill';
import * as comlink from 'comlink';
import marked from 'marked';

export function convert(markdown) {
	return marked(markdown);
}

comlink.expose({
	convert
});
