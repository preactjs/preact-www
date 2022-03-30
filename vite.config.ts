import { defineConfig, Plugin } from 'vite';
import preact from '@preact/preset-vite';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
	build: {
		manifest: true
	},
	plugins: [inspect(), preact(), markdown()]
});

function markdown(): Plugin {
	const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n(.*)/i;

	return {
		name: 'md',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = req.url;
				if (url && url.endsWith('.md')) {
					const [, lang, file] = url.match(/^\/content\/(.*)\/(.*)\.md$/);
					console.log(url, lang, file);
				}
				next();
			});
		},
		transform(code, id) {
			if (!id.includes('.md')) return;
			console.log('transform', id);

			let [, frontMatter] = code.match(FRONT_MATTER_REG) || [];

			return;
			meta = (frontMatter && JSON.parse(frontMatter)) || {};
			console.error(code);
		}
	};
}
