import { defineCapability } from '@pracht/capabilities';
import { createContentPageCapability } from '@pracht/content/capabilities';
import docs from 'virtual:pracht/content/docs';

const page = createContentPageCapability(docs);

export default defineCapability({
	title: 'Read a Preact documentation page',
	description:
		'Return the Markdown body of a page on preactjs.com, given its path (for example /guide/v10/hooks).',
	input: {
		type: 'object',
		properties: {
			path: {
				type: 'string',
				minLength: 1,
				description: 'Exact root-relative page route.'
			},
			locale: {
				type: 'string',
				minLength: 1,
				enum: [
					'en',
					'de',
					'es',
					'fr',
					'it',
					'ja',
					'kr',
					'pt-br',
					'ru',
					'tr',
					'zh'
				],
				description: 'Preferred content locale.'
			}
		},
		required: ['path'],
		additionalProperties: false
	},
	output: {
		type: 'object',
		properties: {
			found: { type: 'boolean' },
			path: { type: 'string' },
			locale: { type: 'string' },
			title: { type: 'string' },
			content: { type: 'string' }
		},
		required: ['found', 'path', 'locale', 'title', 'content'],
		additionalProperties: false
	},
	effect: 'read',
	expose: { http: true, webmcp: true },
	run: page.run
});
