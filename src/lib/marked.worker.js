import 'promise-polyfill/dist/polyfill.min.js';
import marked from 'marked';

export function convert(markdown) {
	return marked(markdown);
}
