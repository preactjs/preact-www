import { defineConfig } from 'wmr';
import OMT from '@surma/rollup-plugin-off-main-thread';
import yaml from 'yaml';
import { promises as fs } from 'fs';
import path from 'path';

export default defineConfig({
	// eslint-disable-next-line new-cap
	plugins: [
		{
			name: 'markdown-plugin',
			config(opts) {
				return {
					middleware: [
						async (req, res, next) => {
							if (!req.url.endsWith('.md')) return next();

							// Find YAML FrontMatter preceeding a markdown document
							const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

							// Find a leading title in a markdown document
							const TITLE_REG = /^\s*#\s+(.+)\n+/;

							// FIXME:
							const filePath = path.join(opts.cwd, req.url);
							if (!filePath.startsWith(path.join(opts.cwd, 'content'))) {
								const err = new Error('Not found');
								err.code = 404;
								return next(err);
							}

							let content = await fs.readFile(filePath, 'utf-8');

							const matches = content.match(FRONT_MATTER_REG);
							if (!matches) return content;

							const meta =
								yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n') ||
								{};
							content = content.replace(FRONT_MATTER_REG, '');
							if (!meta.title) {
								let [, title] = content.match(TITLE_REG) || [];
								if (title) {
									content = content.replace(TITLE_REG, '');
									meta.title = title;
								}
							}

							content = '---\n' + JSON.stringify(meta) + '\n---\n' + content;

							res.statusCode = 200;
							res.end(content);
						}
					]
				};
			}
		},
		OMT({ silenceESMWorkerWarning: true })
	]
});
