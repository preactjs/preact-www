import { defineCapability } from '@pracht/capabilities';

import { getSiteData } from '../data/site.js';

/**
 * "What's the current version of Preact?" is the single most common thing an
 * agent needs from this site, and the answer it gets from a scraped page is
 * whatever the build baked in. This reads the same value the header shows.
 */
export default defineCapability({
	title: 'Latest Preact release',
	description:
		'Return the latest published Preact release: version tag and the URL of its release notes.',
	input: {
		type: 'object',
		properties: {},
		additionalProperties: false
	},
	output: {
		type: 'object',
		properties: {
			version: { type: 'string' },
			url: { type: 'string' }
		},
		required: ['version', 'url']
	},
	effect: 'read',
	expose: { http: true, webmcp: true },
	async run() {
		const site = await getSiteData();
		return { version: site.preactVersion, url: site.preactReleaseURL };
	}
});
