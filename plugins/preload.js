import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * @returns {import('vite').Plugin}
 */
export function preloadPlugin() {
	return {
		name: 'preload-plugin',
		async closeBundle() {
			const [manifestContent, replContent, assetsDir] = await Promise.all([
				fs.readFile(path.resolve('build', '.vite/manifest.json'), 'utf-8'),
				fs.readFile(path.resolve('build', 'repl/index.html'), 'utf-8'),
				fs.readdir(path.resolve('build', 'assets'))
			]);

			const replWorker = `assets/${assetsDir.find((file) => file.startsWith('repl.worker-'))}`;

			const manifest = JSON.parse(manifestContent);

			let errorOverlay = '';
			for (const file in manifest) {
				if (manifest[file].name == 'error-overlay') {
					errorOverlay = file;
					break;
				}
			}

			const preloadTags = [
				'src/components/controllers/repl-page.jsx',
				'src/components/controllers/repl/runner.jsx',
				'src/components/code-editor/index.jsx',
				errorOverlay,
				replWorker
			].map((file) => {
				const filePath = manifest[file] ? manifest[file].file : file;
				return `\n\t\t<link rel="modulepreload" href="/${filePath}"></link>`;
			}).join('');

			const replWithPreload = replContent.replace(
				'</script>',
				`</script>${preloadTags}`
			);

			await fs.writeFile(path.resolve('build', 'repl/index.html'), replWithPreload);
		}
	};
}
