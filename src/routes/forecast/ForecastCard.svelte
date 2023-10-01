<script lang="ts">
	import { Utils } from '$utils/functions';

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

<section class="flex h-full flex-col gap-2">
	<strong>
		{DAY_NAMES[dayForecast[0].time.getDay()]}
		{dayForecast[0].time.getDate()}.{dayForecast[0].time.getMonth() + 1}.
	</strong>

	<table>
		<thead>
			<tr>
				<td>Čas</td>
				<td></td>
				<td>Teplota</td>
				<td>Srážky</td>
				<td>Oblačnost (%)</td>
			</tr>
		</thead>
		<tbody>rows</tbody>
	</table>

	{#if sunrise !== '' && sunset !== ''}
		<div>
			<div>
				<div>Východ</div>

				<img class="h-6" src="/icons/sunrise.svg" alt="sunrise" />
				<span>{sunrise}</span>
			</div>
			<div>
				<div>Západ</div>

				<img class="h-6" src="/icons/sunset.svg" alt="sunset" />
				<span>{sunset}</span>
			</div>
		</div>
	{/if}
</section>
