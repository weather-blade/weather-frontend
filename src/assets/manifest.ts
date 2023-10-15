import type { ManifestOptions } from 'vite-plugin-pwa';

export const manifest: Partial<ManifestOptions> = {
	name: 'Meteostanice',
	short_name: 'Meteostanice',
	description: 'Webová aplikace pro sledování meteostanice',
	icons: [
		{
			src: 'images/android-chrome-192x192.png',
			sizes: '192x192',
			type: 'image/png',
		},
		{
			src: 'images/android-chrome-512x512.png',
			sizes: '512x512',
			type: 'image/png',
		},
		{
			src: 'images/maskable-icon-192x192.png',
			sizes: '192x192',
			type: 'image/png',
			purpose: 'maskable',
		},
		{
			src: 'images/maskable-icon-512x512.png',
			sizes: '512x512',
			type: 'image/png',
			purpose: 'maskable',
		},
	],
	start_url: '/weather-station-frontend-v2',
	scope: '/',
	display: 'standalone',
	theme_color: '#18181b',
	background_color: '#18181b',
	orientation: 'any',
};
