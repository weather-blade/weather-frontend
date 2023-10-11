<script lang="ts">
	import { subMonths } from 'date-fns';
	import { ReadingsAPI } from '$api/api';
	import { Utils } from '$utils/functions';
	import SvgIcon from '$lib/SvgIcon.svelte';
	import type { Writable } from 'svelte/store';

	// currently displayed readings
	export let readings: Writable<IReading[]>;

	const MONTH_NAMES = [
		'Leden',
		'Únor',
		'Březen',
		'Duben',
		'Květen',
		'Červen',
		'Červenec',
		'Srpen',
		'Září',
		'Říjen',
		'Listopad',
		'Prosinec',
	] as const;

	export const FIRST_READING_EVER = new Date('2022-07-02T20:00:00.000Z');
	const numberOfMonths = Utils.monthDiff(FIRST_READING_EVER, new Date()) + 1;
	// array of months between now and first reading ever
	const months = [...Array(numberOfMonths)].map((_, i) => {
		return subMonths(new Date(), i);
	});

	// array of years+months that have readings to select from
	const options = months.map((date) => {
		const year = date.getFullYear();
		const month = date.getMonth();

		return {
			year,
			month,
		};
	});

	// how many months are visible when options are collapsed
	const COLLAPSED_OPTIONS_COUNT = 5;
	$: visibleOptions = options.slice(0, COLLAPSED_OPTIONS_COUNT);

	/**
	 * Collapse / expand months
	 */
	function toggleOptions() {
		if (visibleOptions.length > COLLAPSED_OPTIONS_COUNT) {
			// show only few
			visibleOptions = options.slice(0, COLLAPSED_OPTIONS_COUNT);
		} else {
			// show all
			visibleOptions = options;
		}
	}

	/**
	 * Change readings to the corresponding year and month
	 */
	async function updateReadings(year: number, month: number) {
		const res = await ReadingsAPI.fetchMonth(year, month);

		$readings = res;
	}
</script>

<section
	class="fixed mx-14 my-5 flex flex-col items-center rounded border border-zinc-700 bg-zinc-800 p-2 opacity-50 hover:opacity-100"
>
	<div class="flex flex-col items-stretch gap-2">
		{#each visibleOptions as option}
			<button
				class="rounded border border-zinc-600 bg-zinc-700 p-1 hover:brightness-110 active:brightness-125"
				on:click={() => {
					updateReadings(option.year, option.month + 1);
				}}
			>
				{MONTH_NAMES[option.month]}
			</button>
		{/each}
	</div>

	<button on:click={toggleOptions}>
		<SvgIcon
			name="delete"
			class="
				h-10 w-10 text-stone-400 transition-transform hover:brightness-110 active:brightness-125
				{visibleOptions.length > COLLAPSED_OPTIONS_COUNT ? 'rotate-180' : ''}
			"
		/>
	</button>
</section>
