/**
 * Serve the agent-skills catalog.
 *
 * - `/.well-known/agent-skills/index.json` — the discovery manifest, per the
 *   agent skills discovery RFC.
 * - `/skills/<name>/SKILL.md` — each skill's source.
 *
 * Neither path is a route, so this is mounted on the not-found page, which is
 * where unmatched URLs land. Serving them from the app rather than as static
 * assets is deliberate: `@pracht/adapter-node`'s static MIME table has no
 * `.md` entry, so a static `SKILL.md` goes out as `application/octet-stream` —
 * wrong for the `curl -o` install the docs tell people to run. Fixing that
 * upstream would let these become plain assets again.
 *
 * The manifest is generated from the same sources it points at, so the digests
 * cannot drift from what this middleware serves.
 */

const PREFIX = '/skills/';
const MANIFEST_PATH = '/.well-known/agent-skills/index.json';

const ORIGIN = 'https://preactjs.com';

/** @type {Record<string, () => Promise<string>>} */
const SKILLS = import.meta.glob('/skills/*/SKILL.md', {
	query: '?raw',
	import: 'default'
});

/** @type {Promise<string> | undefined} */
let manifest;

/**
 * @type {import('@pracht/core').MiddlewareFn}
 */
export const middleware = async ({ url }, next) => {
	if (url.pathname === MANIFEST_PATH) {
		return new Response(await getManifest(), {
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'public, max-age=3600',
				'access-control-allow-origin': '*'
			}
		});
	}

	if (url.pathname.startsWith(PREFIX)) {
		const load = SKILLS[url.pathname];
		if (load) {
			return new Response(await load(), {
				headers: {
					'content-type': 'text/markdown; charset=utf-8',
					'cache-control': 'public, max-age=3600',
					'access-control-allow-origin': '*'
				}
			});
		}
	}

	return next();
};

/**
 * @returns {Promise<string>}
 */
function getManifest() {
	if (!manifest) manifest = buildManifest();
	return manifest;
}

/**
 * @returns {Promise<string>}
 */
async function buildManifest() {
	const skills = [];

	for (const file of Object.keys(SKILLS).sort()) {
		const source = await SKILLS[file]();
		const meta = frontmatter(source);
		const name = file.slice(PREFIX.length, -'/SKILL.md'.length);

		skills.push({
			name: meta.name ?? name,
			type: 'claude-skill',
			version: meta.version,
			description: meta.description,
			url: `${ORIGIN}${file}`,
			sha256: await sha256(source)
		});
	}

	return JSON.stringify(
		{
			$schema: 'https://agentskills.io/schema/v0.2.0/index.json',
			name: 'preact',
			description:
				'Skills for building with Preact — migration, upgrades, signals, SSR, testing and performance.',
			homepage: ORIGIN,
			skills
		},
		null,
		2
	);
}

/**
 * Web Crypto rather than `node:crypto`, so this keeps working if the site moves
 * to a Worker or an edge function.
 *
 * @param {string} source
 * @returns {Promise<string>}
 */
async function sha256(source) {
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(source)
	);

	return Array.from(new Uint8Array(digest))
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Deliberately minimal: skill frontmatter is three flat string fields, and a
 * YAML parser in the server bundle for that would be silly.
 *
 * @param {string} source
 * @returns {Record<string, string>}
 */
function frontmatter(source) {
	const match = source.match(/^\s*---\n([\s\S]*?)\n---\n/);
	if (!match) return {};

	/** @type {Record<string, string>} */
	const meta = {};
	for (const line of match[1].split('\n')) {
		const at = line.indexOf(':');
		if (at === -1) continue;
		meta[line.slice(0, at).trim()] = line
			.slice(at + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
	}

	return meta;
}
