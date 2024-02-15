import 'promise-polyfill/lib/polyfill';
import * as prism from '../../lib/prism';
import * as Comlink from 'comlink';

export function highlight(code, lang) {
	if (lang == 'sh') lang = 'bash';
	if (prism.languages[lang] != null) {
		return prism.highlight(code, prism.languages[lang], lang);
	}
	//console.error(`Unknown language: ${lang}`);
	return code;
}

// .expose will throw in SSR env
if (!PRERENDER) {
	Comlink.expose({ highlight });
}
