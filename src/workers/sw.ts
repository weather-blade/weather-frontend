// https://github.com/microsoft/TypeScript/issues/14877
// https://kit.svelte.dev/docs/service-workers#type-safety
/// <reference types="vite/client" />
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="WebWorker" />
/// <reference lib="ES2022" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (e) => {
	console.log('[SW] Installing new service worker');
});

self.addEventListener('push', (event) => {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		console.error('[SW] Notifications are disabled');
		return;
	}

	let data: Record<string, string | undefined> = {};

	try {
		data = event.data?.json() ?? {};
	} catch (error) {
		console.error('[SW] Push message is not a valid JSON\n', error, '\n\n', event.data?.text());
		return;
	}

	console.log('[SW] New push notification\n', data);

	if (data.body === undefined) {
		return;
	}

	const fallbackIcon = 'icons/icon-main.svg';

	const title = data.title ?? '';
	const body = data.body;
	const icon = data.icon !== undefined ? `icons/weathericons/${data.icon}.svg` : fallbackIcon;
	const url = 'https://weather.bladesheng.com/forecast';

	self.registration.showNotification(title, {
		body,
		icon,
		data: {
			url,
		},
	});
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();

	const url = event.notification.data.url;

	self.clients.openWindow(url);
});

self.addEventListener('activate', (e) => {
	console.log('[SW] Activating new service worker');
});

self.addEventListener('message', (event) => {
	// For when we call updateServiceWorker
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

export {};
