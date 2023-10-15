<script>
	import '$styles/app.css';
	import Header from './Header.svelte';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { Toaster } from 'svelte-french-toast';
	import { registerSW } from 'virtual:pwa-register';

	onMount(async () => {
		if (pwaInfo) {
			registerSW({
				immediate: true,

				onRegisteredSW(r) {
					console.log('[SW] Registered:', r);
				},

				onRegisterError(error) {
					console.log('[SW] Registration error:', error);
				},

				onOfflineReady() {
					console.log('[SW] Offline mode ready');
				},
			});
		}
	});

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div
	class="flex h-screen flex-col gap-6 overflow-y-auto overflow-x-hidden bg-zinc-900 p-6 font-fontStack text-stone-400"
>
	<Header />

	<main class="flex-auto">
		<slot />
	</main>

	<Toaster />
</div>
