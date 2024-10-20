<script lang="ts">
	import { Utils } from '$utils/functions';
	import Widget from './Widget.svelte';
	import Countdown from './Countdown.svelte';

	export let readings: IReading[];

	$: ({ minTemperature, maxTemperature } = getMinMaxTemperatures(readings));

	$: lastDate = getLastReadingDate(readings);

	$: nextReadingDate = getNextReadingDate(readings);

	/**
	 * @returns min and max temperature (average) from the past 24h
	 */
	function getMinMaxTemperatures(readings: IReading[]): {
		minTemperature: number;
		maxTemperature: number;
	} {
		const avgTemperatures = readings.map((reading) => {
			return (reading.temperature_dht + reading.temperature_bmp) / 2;
		});
		minTemperature = Math.min(...avgTemperatures);
		maxTemperature = Math.max(...avgTemperatures);

		return { minTemperature, maxTemperature };
	}

	/**
	 * @returns object with padded values (hh:mm:ss dd.mm.yyyy) of the last reading
	 */
	function getLastReadingDate(readings: IReading[]) {
		const lastDate = readings[0].created_at;
		return Utils.padDate(lastDate);
	}

	/**
	 * @returns date, when next reading is expected
	 */
	function getNextReadingDate(readings: IReading[]) {
		const avgDelay = getAvgDelay(readings);

		return new Date(readings[0].created_at.getTime() + avgDelay);
	}

	/**
	 * @returns average delay between all the readings in milliseconds
	 */
	function getAvgDelay(readings: IReading[]) {
		const delays: number[] = [];
		for (let i = 0; i < readings.length - 1; i++) {
			const delay = readings[i].created_at.getTime() - readings[i + 1].created_at.getTime();
			delays.push(delay);
		}

		return Utils.getAvg(delays);
	}
</script>

<section class="flex flex-wrap gap-2 whitespace-nowrap">
	<Widget title="Aktuální teplota">
		{Utils.round((readings[0].temperature_dht + readings[0].temperature_bmp) / 2, 1)} ˚C
	</Widget>

	<Widget title="Aktuální vlhkost">
		{Math.round(readings[0].humidity_dht)} %
	</Widget>

	<Widget title="Poslední aktualizace">
		{lastDate.hours}:{lastDate.minutes} ({lastDate.dayOfMonth}.{lastDate.month}.{lastDate.year})
	</Widget>

	<Widget title="Další aktualizace za">
		<Countdown endDate={nextReadingDate} maxDuration={getAvgDelay(readings)} />
	</Widget>

	<Widget title="Min / max teplota (24 h)">
		{Utils.round(minTemperature, 1)} /
		{Utils.round(maxTemperature, 1)} ˚C
	</Widget>
</section>
