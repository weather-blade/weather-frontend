import { defineConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	build: {
		target: 'ES2022',
		sourcemap: true,
	},

	plugins: [sveltekit()],

	server: {
		port: 8000,
	},
	preview: {
		port: 8000,
	},

	clearScreen: false,
});
