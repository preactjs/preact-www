import { Prism } from '../../lib/prism.js';
import { expose } from 'comlink';

export function highlight(code, lang) {
	if (lang == 'sh') lang = 'bash';
	if (Prism.languages[lang] != null) {
		return Prism.highlight(code, Prism.languages[lang], lang);
	}
	return code;
}

if (typeof process !== 'object') {
	expose({ highlight });
}
