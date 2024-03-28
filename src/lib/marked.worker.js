import marked from 'marked';
import { expose } from 'comlink';

export function convert(markdown) {
	return marked(markdown);
}

if (typeof process !== 'object') {
	expose({ convert });
}
