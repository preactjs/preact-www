import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
	plugins: [inspect(), preact()]
});
