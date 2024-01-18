import 'promise-polyfill/lib/polyfill';
import * as prism from '../../lib/prism';
import * as Comlink from 'comlink';

export function highlight(code, lang) {
	if (lang == 'sh') lang = 'bash';
	if (prism.languages[lang] != null) {
		return prism.highlight(code, prism.languages[lang], lang);
	}
	throw Error(`Unknown language: ${lang}`);
}

// .expose will throw in SSR env
if (!PRERENDER) {
	Comlink.expose({ highlight });
}
