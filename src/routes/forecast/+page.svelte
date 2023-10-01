<script lang="ts">
	import { onMount } from 'svelte';
	import { ForecastAPI } from '$api/api';
	import ForecastTable from './ForecastTable.svelte';

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
	{#if forecast.length === 0}
		<!-- @TODO -->
		placeholder
	{:else}
		<ForecastTable {forecast} {sunriseSunset} />
	{/if}
</section>
