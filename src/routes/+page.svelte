<script lang="ts">
	import { onMount } from 'svelte';
	import { ReadingsAPI } from '$api/api';
	import ChartTempHum from '$lib/chart/ChartTempHum.svelte';
	import ChartPressure from '$lib/chart/ChartPressure.svelte';
	import Dashboard from './Dashboard.svelte';

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
	{#if readings.length === 0}
		<!-- @TODO -->
		placeholder
	{:else}
		<section>
			<Dashboard bind:readings />
		</section>
	{/if}

	<button
		on:click={() => {
			readings.unshift({
				id: 69,
				createdAt: new Date(),
				humidity_DHT: 69,
				pressure_BMP: 69,
				temperature_BMP: 69,
				temperature_DHT: 69,
			});

			readings = readings;
		}}>xd</button
	>

	<section class="flex flex-grow flex-col gap-2 md:flex-row">
		<ChartTempHum {readings} />
		<ChartPressure {readings} />
	</section>
</section>
