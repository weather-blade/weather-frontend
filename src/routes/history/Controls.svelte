<script lang="ts">
	import { subMonths } from 'date-fns';
	import { ReadingsAPI } from '$api/api';
	import { Utils } from '$utils/functions';
	import SvgIcon from '$lib/SvgIcon.svelte';
	import { slide } from 'svelte/transition';
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

	const yearsGroups = months.reduce<{
		[year: number]: {
			months: Date[];
			isOpen: boolean;
		};
	}>((acc, month) => {
		const year = month.getFullYear();

		if (!acc[year]) {
			acc[year] = {
				months: [],
				isOpen: false,
			};

			if (year === new Date().getFullYear()) {
				acc[year].isOpen = true;
			}
		}

		acc[year].months.push(month);

		return acc;
	}, {});

	/**
	 * Change readings to the corresponding year and month
	 */
	async function updateReadings(month: Date) {
		const res = await ReadingsAPI.fetchMonth(month.getFullYear(), month.getMonth() + 1);

		$readings = res;
	}
</script>

<section class="flex min-h-48 flex-grow flex-col rounded border border-zinc-700 bg-zinc-800 p-2">
	<div
		class="scrollBar flex h-0 flex-auto items-stretch justify-between gap-2 overflow-y-scroll p-1 md:flex-col md:justify-start"
	>
		{#each Object.entries(yearsGroups).reverse() as [year, yearData]}
			<div class="flex min-w-20 flex-col items-stretch">
				<button
					class="mb-1 flex items-center justify-between hover:brightness-110 active:brightness-125"
					on:click={() => {
						yearData.isOpen = !yearData.isOpen;
					}}
				>
					<span>
						{year}
					</span>

					<SvgIcon
						name="expand_more"
						class="
							h-8 w-8 text-stone-400 transition-transform
							{yearData.isOpen ? 'rotate-180' : ''}
						"
					/>
				</button>

				{#if yearData.isOpen}
					<div transition:slide class="flex flex-col gap-2">
						{#each yearData.months as month}
							<button
								class="rounded border border-zinc-600 bg-zinc-700 p-1 hover:brightness-110 active:brightness-125"
								on:click={() => {
									updateReadings(month);
								}}
							>
								{MONTH_NAMES[month.getMonth()]}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.scrollBar {
		scrollbar-gutter: stable both-edges;
	}

	.scrollBar::-webkit-scrollbar {
		width: 5px;
	}

	.scrollBar::-webkit-scrollbar-thumb {
		background-color: rgba(128, 128, 128, 0.8);
		border-radius: 20rem;
	}

	.scrollBar::-webkit-scrollbar-thumb:hover {
		background-color: rgba(128, 128, 128, 1);
	}
</style>
