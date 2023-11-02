import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { manifest } from './src/assets/manifest';

export default defineConfig({
	build: {
		target: 'ES2022',
		sourcemap: true,
	},

	define: {
		// https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#generate-custom-service-worker
		'process.env.NODE_ENV':
			process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
	},

	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// https://github.com/vite-pwa/sveltekit/blob/main/examples/sveltekit-ts/vite.config.ts

			registerType: 'prompt',

			strategies: 'injectManifest',
			srcDir: 'src/workers',
			filename: 'sw.ts',

			// enable logs
			mode: 'development',
			devOptions: {
				enabled: true,
				type: 'module', // docs say this doesn't work in firefox even though it does
			},

			manifest,
			includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

			workbox: {
				sourcemap: true,

				globPatterns: ['client/**/*.{html,css,js,ico,png,svg,webp,woff,woff2}'],
			},

			injectManifest: {
				globPatterns: ['client/**/*.{html,css,js,ico,png,svg,webp,woff,woff2}'],
			},
		}),
	],

	server: {
		port: 8000,
	},
	preview: {
		port: 8000,
	},

	clearScreen: false,
});
