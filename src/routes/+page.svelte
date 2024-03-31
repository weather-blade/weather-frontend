<script lang="ts">
	import { onMount } from 'svelte';
	import { ReadingsAPI } from '$api/api';
	import ChartTempHum from '$lib/chart/ChartTempHum.svelte';
	import ChartPressure from '$lib/chart/ChartPressure.svelte';
	import Dashboard from './Dashboard.svelte';

	let readings: IReading[] = [];

	let isOnline = navigator.onLine;
	let listeningToSSE = false;
	let eventSource: EventSource;

	onMount(() => {
		get24hReadings();

		window.addEventListener('online', goOnline);
		window.addEventListener('offline', goOffline);

		return () => {
			window.removeEventListener('online', goOnline);
			window.removeEventListener('offline', goOffline);

			if (eventSource !== undefined) {
				eventSource.close();
			}
		};
	});

	// open new SSE connection if you are online and not listening yet
	$: if (!listeningToSSE && isOnline) {
		eventSource = new EventSource(`${ReadingsAPI.apiURL}/api/readings/events`);

		// update current readings with newly received reading
		eventSource.addEventListener('message', (event) => {
			const newReading: IReading = JSON.parse(event.data);
			newReading.createdAt = new Date(newReading.createdAt); // string to date object
			console.log('New reading: ', newReading);

			// remove last reading to only keep readings from last 24 hours
			readings.pop();

			readings.unshift(newReading);

			readings = readings;
		});

		eventSource.addEventListener('error', (error) => {
			eventSource.close(); // close the connection to prevent additional errors

			console.warn('EventSource failed:', error);

			setTimeout(() => {
				// try to restart the connection after 10s
				listeningToSSE = false;
			}, 10000);
		});

		listeningToSSE = true;
	}

	async function goOnline() {
		console.log('Going Online');
		isOnline = navigator.onLine;

		// Fetch latest readings after reconnecting to a network
		await get24hReadings();
	}

	function goOffline() {
		console.log('Going Offline');
		isOnline = navigator.onLine;
	}

	async function get24hReadings() {
		const res = await ReadingsAPI.fetchLast24h();
		readings = res;
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section class="flex h-full flex-col gap-2">
	{#if readings.length === 0}
		<!-- placeholder -->
		<section class="flex flex-wrap gap-2">
			{#each Array(5) as _}
				<div class="flex-1 animate-pulse rounded bg-zinc-800">
					<div class="h-16 w-36"></div>
				</div>
			{/each}
		</section>
	{:else}
		<section>
			<Dashboard bind:readings />
		</section>
	{/if}

	<section class="flex flex-grow flex-col gap-2 md:flex-row">
		<ChartTempHum {readings} />
		<ChartPressure {readings} />
	</section>
</section>
