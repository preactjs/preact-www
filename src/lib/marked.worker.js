import 'preact-cli/lib/lib/webpack/polyfills';
import marked from 'marked';

export function convert(markdown) {
	return marked(markdown);
}
