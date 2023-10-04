<script lang="ts">
	import { onMount } from 'svelte';
	import { ForecastAPI } from '$api/api';
	import ChartForecast from '$lib/chart/ChartForecast.svelte';
	import ForecastTable from './ForecastTable.svelte';
	import Footer from './Footer.svelte';

	let forecast: IForecast[] = [];
	let sunriseSunset: ISunrise | undefined;

	onMount(() => {
		getForecast();
	});

	async function getForecast() {
		const res = await ForecastAPI.fetchForecast();
		({ forecast, sunriseSunset } = res);
	}
</script>

<svelte:head>
	<title>Předpověď</title>
</svelte:head>

<section class="flex h-full flex-col gap-2">
	<ChartForecast {forecast} />

	{#if forecast.length === 0}
		<!-- placeholder -->
		<div class="placeholder grid gap-2">
			{#each Array(10) as _}
				<div class="flex-1 animate-pulse rounded bg-zinc-800">
					<div class="h-[800px]"></div>
				</div>
			{/each}
		</div>
	{:else}
		<ForecastTable {forecast} {sunriseSunset} />
	{/if}
</section>

<Footer />

<style>
	.placeholder {
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
	}
</style>
