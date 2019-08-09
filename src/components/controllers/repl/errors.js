/**
 * Convert native error stack trace into an array of json-based frames.
 * @param {Error} err
 */
export function parseStackTrace(err) {
	let include = true;
	return err.stack
		.split('\n')
		.slice(1)
		.filter(
			line => (include && !/node_modules/.test(line)) || (include = false)
		)
		.map(line => line.replace(/\(.*:(\d+):(\d+)\)/, '($1:$2)'))
		.map(line => {
			const match = line.match(/at\s+(.*)\s\((\d+):(\d+)\)/);
			return {
				functionName: match != null ? match[1] : 'unknown',
				line: match != null ? parseInt(match[2], 10) : 0,
				column: match != null ? parseInt(match[3], 10) : 0
			};
		});
}

/**
 * Correct the location if available
 * @param {Error} err
 */
export function patchErrorLocation(err) {
	const match = err.stack.match(/\(.*:(\d+):(\d+)\)/);

	if (!match) return;
	if (err.loc) return;

	err.loc = { line: 0, column: 0 };
	let line = +match[1];
	if (err.name === 'ReferenceError') {
		line -= 5;
	}
	err.loc.line = line;
	err.loc.column = +match[2];
}
