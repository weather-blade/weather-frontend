<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	const { needRefresh, updateServiceWorker } = useRegisterSW({
		onNeedRefresh() {
			console.log('[SW] New version available');
		},

		onRegisteredSW(r) {
			console.log('[SW] Registered:', r);
		},

		onRegisterError(error) {
			console.error('[SW] Registration error:', error);
		},

		onOfflineReady() {
			console.log('[SW] Offline mode ready');
		},
	});

	function update() {
		updateServiceWorker(true);
	}

	function cancel() {
		$needRefresh = false;
	}
</script>

{#if $needRefresh}
	<div
		class="fixed bottom-0 right-0 m-4 flex flex-col gap-2 rounded border border-zinc-600 bg-zinc-700 p-2 shadow-md"
	>
		<p>Je dostupná nová verze stránky. Aktualizujte stránku tlačítkem "aktualizovat"</p>

		<div class="flex gap-2">
			<button
				class="rounded border border-zinc-500 bg-zinc-600 p-1 hover:brightness-110 active:brightness-125"
				on:click={update}
			>
				Aktualizovat
			</button>
			<button
				class="rounded border border-zinc-500 bg-zinc-600 p-1 hover:brightness-110 active:brightness-125"
				on:click={cancel}
			>
				Zavřít
			</button>
		</div>
	</div>
{/if}
