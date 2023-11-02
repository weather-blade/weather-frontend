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
			base: process.env.NODE_ENV === 'production' ? '/weather-frontend' : '',
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
		serviceWorker: {
			// https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#generate-custom-service-worker
			// https://kit.svelte.dev/docs/service-workers

			// disable the sveltekit automatic registration,
			// because we are doing the registration manually in +layout.svelte with vite-plugin-pwa
			register: false,
		},
	},
};

export default config;
