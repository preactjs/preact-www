import 'promise-polyfill/lib/polyfill';
import * as prism from '../../lib/prism';

export function highlight(code, lang) {
	if (lang == 'sh') lang = 'bash';
	if (prism.languages[lang] != null) {
		return prism.highlight(code, prism.languages[lang], lang);
	}
	throw Error(`Unknown language: ${lang}`);
}
