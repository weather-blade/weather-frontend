<script>
	import Header from './Header.svelte';
	import { Toaster } from 'svelte-french-toast';

	import '$styles/app.css';
</script>

<div
	class="flex h-screen flex-col gap-6 overflow-y-auto overflow-x-hidden bg-zinc-900 p-6 font-fontStack text-stone-400"
>
	<Header />

	<main class="flex-auto">
		<slot />
	</main>

	<Toaster />
</div>
