<script lang="ts">
	import { onMount } from 'svelte';
	import { ReadingsAPI } from '$api/api';

	let readings: IReading[] = [];

	onMount(async () => {
		const res = await ReadingsAPI.fetchLast24h();
		readings = res;
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section class="flex flex-col gap-6">dashboard text xd</section>

<div>
	{JSON.stringify(readings)}
</div>
