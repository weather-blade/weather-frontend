<script lang="ts">
	import { onMount } from 'svelte';
	import { ReadingsAPI } from '$api/api';
	import ChartTempHum from '$lib/chart/ChartTempHum.svelte';

	let readings: IReading[] = [];

	onMount(async () => {
		const res = await ReadingsAPI.fetchLast24h();
		readings = res;
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section class="flex flex-col gap-6">
	<ChartTempHum {readings} />
</section>
