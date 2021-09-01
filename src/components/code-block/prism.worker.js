import prism from '../../lib/prism';
import { expose } from 'comlink';

expose({
	highlight(code, lang) {
		if (lang == 'sh') lang = 'bash';
		if (prism.languages[lang] != null) {
			return prism.highlight(code, prism.languages[lang], lang);
		}
		throw Error(`Unknown language: ${lang}`);
	}
});
