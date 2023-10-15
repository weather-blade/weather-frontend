// https://github.com/microsoft/TypeScript/issues/14877
// https://kit.svelte.dev/docs/service-workers#type-safety
/// <reference types="vite/client" />
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="WebWorker" />
/// <reference lib="ES2022" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (e) => {
	console.log('[SW] Installing new service worker');
});

// self.addEventListener("fetch", (e) => {
//   console.log(`[SW] Fetching resource: ${e.request.url}`);
// });

self.addEventListener('activate', (e) => {
	console.log('[SW] Activating new service worker');
});

export {};