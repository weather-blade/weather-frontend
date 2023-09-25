<script lang="ts">
	import { onMount } from 'svelte';
	import { ReadingsAPI } from '$api/api';
	import ChartTempHum from '$lib/chart/ChartTempHum.svelte';
	import ChartPressure from '$lib/chart/ChartPressure.svelte';

	let readings: IReading[] = [];

	onMount(async () => {
		const res = await ReadingsAPI.fetchLast24h();
		readings = res;
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section class="flex h-full flex-col gap-2">
	<section>aktualni teplota 123</section>

	<section class="flex flex-grow flex-col gap-2 md:flex-row">
		<ChartTempHum {readings} />
		<ChartPressure {readings} />
	</section>
</section>
