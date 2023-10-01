<script lang="ts">
	import ForecastCard from './ForecastCard.svelte';

	export let forecast: IForecast[];
	export let sunriseSunset: ISunrise | undefined;

	// split forecast into sub-arrays of timepoints grouped by days
	function splitByDays(forecast: IForecast[]) {
		let currentDay = forecast[0].time.getDate();
		const days: IForecast[][] = [[]];

		for (const timePoint of forecast) {
			if (timePoint.time.getDate() !== currentDay) {
				// create new day sub-array
				days.push([]);
				currentDay = timePoint.time.getDate();
			}

			// add the timepoint to the last sub-array
			days[days.length - 1].push(timePoint);
		}

		return days;
	}

	$: days = splitByDays(forecast);
</script>

<section class="flex flex-col gap-2">
	{#each days as dayForecast, i}
		{#if i === 0}
			<!-- add sunrise time only to today's card -->
			<ForecastCard {dayForecast} {sunriseSunset} />
		{:else}
			<ForecastCard {dayForecast} />
		{/if}
	{/each}
</section>
