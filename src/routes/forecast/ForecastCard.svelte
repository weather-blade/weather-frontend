<script lang="ts">
	import { Utils } from '$utils/functions';
	import ForecastRow from './ForecastRow.svelte';
	import SvgIcon from '$lib/SvgIcon.svelte';

	export let dayForecast: IForecast[];
	export let sunriseSunset: ISunrise | undefined = undefined;

	const DAY_NAMES = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

	let sunrise = '';
	let sunset = '';
	if (sunriseSunset !== undefined) {
		{
			const { hours, minutes } = Utils.padDate(sunriseSunset.sunrise);
			sunrise = `${hours}:${minutes}`;
		}
		{
			const { hours, minutes } = Utils.padDate(sunriseSunset.sunset);
			sunset = `${hours}:${minutes}`;
		}
	}
</script>

<section class="flex h-fit flex-col gap-4 rounded border border-zinc-700 bg-zinc-800 p-4">
	<strong>
		{DAY_NAMES[dayForecast[0].time.getDay()]}
		{dayForecast[0].time.getDate()}.{dayForecast[0].time.getMonth() + 1}.
	</strong>

	<table class="border-collapse text-center">
		<thead>
			<tr>
				<td>Čas</td>
				<td></td>
				<td>Teplota</td>
				<td>Srážky</td>
				<td>Oblačnost (%)</td>
			</tr>
		</thead>

		<tbody>
			{#each dayForecast as timePoint}
				<ForecastRow {timePoint} />
			{/each}
		</tbody>
	</table>

	{#if sunrise !== '' && sunset !== ''}
		<div class="flex justify-around text-center">
			<div class="grid grid-cols-2 grid-rows-2">
				<div class="col-span-2">Východ</div>

				<SvgIcon name="sunrise" class="h-8" />
				<span>{sunrise}</span>
			</div>
			<div class="grid grid-cols-2 grid-rows-2">
				<div class="col-span-2">Západ</div>

				<SvgIcon name="sunset" class="h-8" />
				<span>{sunset}</span>
			</div>
		</div>
	{/if}
</section>
