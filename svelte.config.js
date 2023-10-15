import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			// https://www.okupter.com/blog/deploy-sveltekit-website-to-github-pages#set-the-base-path
			// because Github pages serves the website from a subfolder, not from root
			base: process.env.NODE_ENV === 'production' ? '/weather-station-frontend-v2' : '',
			relative: false,
		},

		alias: {
			$api: 'src/api',
			$assets: 'src/assets',
			$config: 'src/config',
			$styles: 'src/styles',
			$types: 'src/types',
			$utils: 'src/utils',
		},

		files: {
			serviceWorker: 'src/workers/sw.ts',
		},
	},
};

export default config;
