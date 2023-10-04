<script lang="ts">
	import { base } from '$app/paths';
	import { Utils } from '$utils/functions';

	export let timePoint: IForecast;

	function getHours(timePoint: IForecast) {
		let hours = timePoint.time.getHours();
		let hoursText = Utils.padWithZeroes(hours);

		const precipitation1hr = timePoint.data?.next_1_hours?.details?.precipitation_amount;

		// if the timepoint doesn't have data for the next hour, it applies to the next 6 hours
		if (precipitation1hr === undefined) {
			const hoursStart = Utils.padWithZeroes(hours);

			// day has only 24 hours, so move the clock if it would overflow into the next day
			if (hours + 6 > 23) {
				hours = hours - 24;
			}
			const hoursEnd = Utils.padWithZeroes(hours + 6);

			hoursText = `${hoursStart}—${hoursEnd}`;
		}

		return hoursText;
	}

	function getIconCode(timePoint: IForecast) {
		const icon1hr = timePoint.data?.next_1_hours?.summary?.symbol_code;
		const icon6hr = timePoint.data?.next_6_hours?.summary?.symbol_code;

		if (icon1hr === undefined && icon6hr === undefined) {
			console.warn('Missing precipitation icon:', timePoint);
		}

		const iconCode = icon1hr ?? icon6hr ?? 'heavysnowshowersandthunder_day';

		return iconCode;
	}

	function getTemperature(timePoint: IForecast) {
		return Math.round(timePoint.data.instant.details.air_temperature);
	}

	function getPrecipitation(timePoint: IForecast) {
		const precipitation1hr = timePoint.data?.next_1_hours?.details?.precipitation_amount;
		const precipitation6hr = timePoint.data?.next_6_hours?.details?.precipitation_amount;

		// Preferably use the 1 hour data. If not available, use the 6 hour data.
		const precipitation = precipitation1hr ?? precipitation6hr ?? 0;

		if (precipitation === 0) {
			return '';
		} else {
			return precipitation;
		}
	}

	function getClouds(timePoint: IForecast) {
		return Math.round(timePoint.data.instant.details.cloud_area_fraction);
	}
</script>

<tr class="border-b border-zinc-700">
	<td>
		{getHours(timePoint)}
	</td>

	<td class="flex justify-center">
		<img
			class="h-8"
			src="{base}/icons/weathericons/{getIconCode(timePoint)}.svg"
			alt={getIconCode(timePoint)}
		/>
	</td>

	<td class="text-rose-600">
		{getTemperature(timePoint)}˚
	</td>

	<td class="text-blue-400">
		{getPrecipitation(timePoint)}
	</td>

	<td>
		{getClouds(timePoint)}
	</td>
</tr>

<style>
	td {
		padding: 2px 0;
	}
</style>
