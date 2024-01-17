import 'promise-polyfill/lib/polyfill';
import { Prism } from '../../lib/prism';
import * as Comlink from 'comlink';

export function highlight(code, lang) {
	if (lang == 'sh') lang = 'bash';
	if (Prism.languages[lang] != null) {
		return Prism.highlight(code, Prism.languages[lang], lang);
	}
	//console.error(`Unknown language: ${lang}`);
	return code;
}

// .expose will throw in SSR env
if (!PRERENDER) {
	Comlink.expose({ highlight });
}
