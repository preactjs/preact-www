/**
 * @param {string} title
 */
export function createTitle(title) {
	const url = location.pathname;

	// Titles for various content areas
	let suffix = '';
	switch (true) {
		case url.startsWith('/guide/v10'):
			suffix = 'Preact Guide';
			break;
		// TODO v11: Switch when v11 is properly released
		case url.startsWith('/guide/v11'):
			suffix = 'Preact Guide v11';
			break;
		case url.startsWith('/guide/v8'):
			suffix = 'Preact Guide v8';
			break;
		case url.startsWith('/tutorial'):
			suffix = 'Preact Tutorial';
			break;
		default:
			suffix = 'Preact';
	}

	if (suffix !== title) title += ' – ' + suffix;
	return title;
}
