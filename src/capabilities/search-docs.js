import { defineCapability } from '@pracht/capabilities';
import { createContentSearchCapability } from '@pracht/content/capabilities';
import docs from 'virtual:pracht/content/docs';

const search = createContentSearchCapability(docs);

export default defineCapability({
	title: 'Search the Preact documentation',
	description:
		'Find Preact documentation pages matching a query. Returns ranked page paths, titles and matching excerpts.',
	input: {
		type: 'object',
		properties: {
			query: { type: 'string', minLength: 1, maxLength: 200 },
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
				]
			},
			limit: { type: 'integer', minimum: 1, maximum: 20, default: 5 }
		},
		required: ['query'],
		additionalProperties: false
	},
	output: {
		type: 'object',
		properties: {
			results: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						path: { type: 'string' },
						title: { type: 'string' },
						snippet: { type: 'string' },
						score: { type: 'integer' }
					},
					required: ['path', 'title', 'snippet', 'score'],
					additionalProperties: false
				}
			}
		},
		required: ['results'],
		additionalProperties: false
	},
	effect: 'read',
	expose: { http: true, webmcp: true },
	run: args =>
		search.run({
			...args,
			input: { ...args.input, locale: args.input.locale ?? 'en' }
		})
});
