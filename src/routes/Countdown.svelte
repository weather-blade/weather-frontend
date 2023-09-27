<script lang="ts">
	import { onMount } from 'svelte';
	import { Utils } from '$utils/functions';

	// date, when the countdown will reach 0
	export let endDate: Date;
	// maximum duration of the progress bar (== average delay) in milliseconds
	export let maxDuration: number;

	// time left until the end, in seconds
	$: timer = Math.round((endDate.getTime() - Date.now()) / 1000);

	$: minutes = Math.floor(Math.abs(timer / 60));
	$: seconds = Math.abs(timer % 60);

	onMount(() => {
		const interval = setInterval(() => {
			timer--;
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div>
	<progress value={maxDuration / 1000 - timer} max={maxDuration / 1000} />

	{Utils.padWithZeroes(minutes)}:{Utils.padWithZeroes(seconds)}

	{#if timer < 0}
		(Zpoždění)
	{/if}
</div>
