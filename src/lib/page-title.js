/**
 * @param {string} title
 */
export function createTitle(title) {
	const url = location.pathname;

	// Titles for various content areas
	let suffix = '';
	switch (true) {
		// Shouldn't be an issue, but `startsWith` is wildly faster than `includes`
		case url.startsWith('/guide/v10'):
			suffix = 'Preact Guide';
			break;
		case url.startsWith('/tutorial'):
			suffix = 'Preact Tutorial';
			break;
		case url.startsWith('/guide/v8'):
			suffix = 'Preact Version 8';
			break;
		default:
			suffix = 'Preact';
	}

	if (suffix !== title) title += ' – ' + suffix;
	return title;
}
