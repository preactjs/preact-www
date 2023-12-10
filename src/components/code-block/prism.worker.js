import * as Comlink from 'comlink';
import * as prism from '../../lib/prism';

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
