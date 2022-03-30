import { defineConfig, Plugin } from 'vite';
import preact from '@preact/preset-vite';
import inspect from 'vite-plugin-inspect';
import yaml from 'yaml';
import path from 'path';
import fs from 'fs/promises';

export default defineConfig({
	build: {
		manifest: true
	},
	plugins: [inspect(), preact(), markdown()]
});

const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n\n?([\S\s]*)/i;

function markdown(): Plugin {
	return {
		name: 'md',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const url = req.url;
				if (url && url.endsWith('.md')) {
					const file = path.resolve(
						__dirname,
						url
							.slice(1)
							.split(path.posix.sep)
							.join(path.sep)
					);

					if (
						path.relative(path.join(__dirname, 'content'), file).startsWith('.')
					) {
						throw new Error(`Url "${url}" outside allowed folders`);
					}

					const md = await fs.readFile(file, 'utf-8');

					// We'll replace the yaml frontmatter with json frontmatter
					// to avoid the need to ship a yaml parser to the client
					const jsonMd = md.replace(FRONT_MATTER_REG, (s, y, rest) => {
						const meta =
							yaml.parse('---\n' + y.replace(/^/gm, '  ') + '\n') || {};
						return '---\n' + JSON.stringify(meta) + '\n---\n\n' + rest;
					});

					res.end(jsonMd);
					return;
				}
				next();
			});
		}
	};
}
