export default function getDefaultLanguage(available={}) {
	let langs = [navigator.language, (location.href.match(/[?&]lang=([a-z\-]+)/i) || [])[1]].concat(navigator.languages);
	for (let i=0; i<langs.length; i++) {
		if (langs[i]) {
			let lang = String(langs[i]).toLowerCase();
			if (available[lang]) return lang;
			// Respect order of `navigator.languages` by returning if the fallback language `English` is found
			if (lang === 'en') return;
		}
	}
}
