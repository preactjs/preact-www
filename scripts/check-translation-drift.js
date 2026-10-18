/** @import { TranslationScoreEntry } from '../src/types.d.ts' */

/**
 * Script to try to codify translation drift in the docs, i.e., how
 * much a translation has diverged from the English source. It's a
 * bit iffy and scoring is pretty subjective, but it should flag some
 * of the more egregious cases of out-of-date content.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parseFrontmatter } from '../src/lib/frontmatter.js';

const contentRoot = new URL('../content', import.meta.url).pathname;
const enRoot = path.join(contentRoot, 'en');

/**
 * Parses content with `marked`, tries to build a shape of the document
 * while extracting code blocks and links.
 *
 * @param {string} body
 * @returns {{shape: string[], codeBlocks: string[], links: Set<string>}}
 */
function getContentData(body) {
	const tokens = marked.lexer(body);
	const codeBlocks = [];
	const links = new Set();

	/**
	 * @param {import('marked').Token[]} tokens
	 */
	const extractLinks = (tokens) => {
		for (const token of tokens) {
			if (token.type === 'link') {
				const target = token.href.split('#')[0];
				if (target) links.add(target);
			}
			if ('tokens' in token && token.tokens) {
				extractLinks(token.tokens);
			}
		}
	};

	const shape = [];
	for (const token of tokens) {
		if ('tokens' in token && token.tokens) extractLinks(token.tokens);

		switch (token.type) {
			case 'heading':
				shape.push(`h${token.depth}`);
				break;
			case 'code':
				shape.push(`code:${token.lang || ''}`);
				codeBlocks.push(token.text || '');
				break;
			case 'list':
				shape.push(`list:${token.ordered ? 1 : 0}:${token.items?.length ?? 0}`);
				break;
			case 'table':
				shape.push('table');
				break;
			case 'blockquote':
				shape.push('bq');
				break;
			case 'paragraph':
				shape.push('p');
				break;
			case 'space':
				break;
			default:
				shape.push(token.type);
		}
	}

	return { shape, codeBlocks, links };
}

/**
 * Levenshtein distance impl for arrays of artbitrary tokens
 *
 * @param {string[]} a
 * @param {string[]} b
 */
function editDistance(a, b) {
	const dp = Array.from({ length: a.length + 1 }, () =>
		new Array(b.length + 1).fill(0)
	);

	for (let i = 0; i <= a.length; i++) dp[i][0] = i;
	for (let j = 0; j <= b.length; j++) dp[0][j] = j;
	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
			else
				dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
		}
	}
	return dp[a.length][b.length];
}

/**
 * @param {string[]} a
 * @param {string[]} b
 */
function similarity(a, b) {
	if (a.length === 0 && b.length === 0) return 1;
	return 1 - editDistance(a, b) / Math.max(a.length, b.length);
}

/**
 * @param {string[]} enBlocks
 * @param {string[]} langBlocks
 * @returns {number | null}
 */
function codeSimilarity(enBlocks, langBlocks) {
	if (enBlocks.length === 0 && langBlocks.length === 0) return null;
	const max = Math.max(enBlocks.length, langBlocks.length);
	let sum = 0;
	for (let i = 0; i < max; i++) {
		const a = enBlocks[i],
			b = langBlocks[i];
		// Missing or additional block
		if (a == null || b == null) continue;
		sum += similarity(a.split('\n'), b.split('\n'));
	}
	return sum / max;
}

/**
 * @param {Set<string>} enLinks
 * @param {Set<string>} langLinks
 * @returns {number | null}
 */
function linkSimilarity(enLinks, langLinks) {
	if (enLinks.size === 0) return null;
	let shared = 0;
	for (const link of enLinks) if (langLinks.has(link)) shared++;
	return shared / (enLinks.size + langLinks.size - shared);
}

// Ironically, this should hold no weight!
// Pretty much a vauge guess at how to score, can revise in the future after using it a bit.
//
// Thought process here is that structure is the most important, then code blocks (which may have
// translated variable names or comments), and then links. A bad link should rarely be the deciding factor.
const weights = { structure: 0.45, code: 0.35, links: 0.2 };

/**
 * @template {number | null} T
 * @param {T} value
 * @returns {T}
 */
const toFixedNumber = (value) =>
	value == null ? value : /** @type {T} */ (Number(value.toFixed(2)));

/**
 * @param {ArrayIterator<string>} iter
 * @param {string} langRoot
 * @param {TranslationScoreEntry[]} rows
 */
async function scoreFile(iter, langRoot, rows) {
	for (const file of iter) {
		const [enContent, langContent] = await Promise.all([
			fs.readFile(path.join(enRoot, file), 'utf-8'),
			fs.readFile(path.join(langRoot, file), 'utf-8')
		]);

		const enBody = parseFrontmatter(enContent, file).body,
			langBody = parseFrontmatter(langContent, file).body;

		const en = getContentData(enBody),
			lang = getContentData(langBody);

		const results = /** @type {const} */ ({
			structure: toFixedNumber(similarity(en.shape, lang.shape)),
			code: toFixedNumber(codeSimilarity(en.codeBlocks, lang.codeBlocks)),
			links: toFixedNumber(linkSimilarity(en.links, lang.links))
		});

		let weighted = 0,
			totalWeight = 0;

		/** @type {keyof results} */
		let key;
		for (key in results) {
			const value = results[key];
			if (value == null) continue;
			weighted += weights[key] * value;
			totalWeight += weights[key];
		}

		const score = toFixedNumber(weighted / totalWeight);

		rows.push({ ...results, file, score });
	}
}

/**
 * @param {string} langRoot
 * @returns {Promise<string[]>}
 */
async function getTranslatedFilePaths(langRoot) {
	const directoryEntries = await fs.readdir(langRoot, {
		withFileTypes: true,
		recursive: true
	});

	const results = [];
	for (const entry of directoryEntries) {
		if (entry.isDirectory()) continue;

		const relativePath = path.relative(
			langRoot,
			path.join(entry.parentPath, entry.name)
		);

		results.push(relativePath);
	}

	return results;
}

/**
 * @param {string[]} langs
 * @returns {Promise<Record<string, TranslationScoreEntry[]>>}
 */
export async function scoreTranslations(langs) {
	const results = /** @type {Record<string, TranslationScoreEntry[]>} */ ({});
	for (const lang of langs) {
		const langRoot = path.join(contentRoot, lang);
		const files = await getTranslatedFilePaths(langRoot);

		const rows = /** @type {TranslationScoreEntry[]} */ ([]);
		await Promise.all(
			Array(5)
				.fill(files.values())
				.map((iter) => scoreFile(iter, langRoot, rows))
		);

		results[lang] = rows;
	}

	return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const targetLang = process.argv[2];

	if (!targetLang) {
		console.error('Usage: node check-translation-drift.mjs <lang>');
		process.exit(1);
	}

	const result = await scoreTranslations([targetLang]);
	const rows = result[targetLang];

	rows.sort((a, b) => a.score - b.score);

	console.log(`--- ${targetLang} ---`);
	for (const row of rows) {
		console.log(
			`${row.score.toFixed(2)}  (struct ${row.structure.toFixed(2)} / code ${row.code?.toFixed(2) ?? 'n/a '} / links ${row.links?.toFixed(2) ?? 'n/a '})  ${row.file}`
		);
	}
	const mean = rows.reduce((s, r) => s + r.score, 0) / rows.length;
	console.log(`--- mean: ${mean.toFixed(2)} ---`);
}
