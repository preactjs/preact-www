import marked from 'marked';
import { expose } from 'comlink';

expose({
	convert(markdown) {
		return marked(markdown);
	}
});
