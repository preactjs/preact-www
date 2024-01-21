import 'promise-polyfill/lib/polyfill';
import marked from 'marked';
import * as Comlink from 'comlink';

export function convert(markdown) {
	return marked(markdown);
}

Comlink.expose({ convert });
