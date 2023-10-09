<script lang="ts">
	import { writable } from 'svelte/store';
	import Controls from './Controls.svelte';
	import ChartHistory from '$lib/chart/ChartHistory.svelte';

	const readings = writable<IReading[]>([]);
</script>

<svelte:head>
	<title>Úplná data</title>
</svelte:head>

<section class="flex h-full flex-col gap-2">
	<Controls {readings} />

	<ChartHistory readings={$readings} />
</section>

<style>
</style>
