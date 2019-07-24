/**
 * Throw if the response status is in the error range
 * @param {Response} r
 */
export function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}
	return r;
}
