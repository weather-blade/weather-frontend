<script lang="ts">
	import { tweened } from 'svelte/motion';

	export let value: number;
	export let max = 1;
	export let bgClass = '';
	export let barClass = '';

	const progress = tweened(0, {
		duration: 400,
	});

	$: {
		if (value > max) {
			$progress = max;
		} else {
			$progress = value;
		}
	}
</script>

<div
	role="progressbar"
	class="
		h-full w-full overflow-hidden rounded-full
		{bgClass === '' ? 'bg-gray-500' : bgClass}
	"
>
	<div
		style:transform={`scaleX(${$progress / max})`}
		class="
			h-full w-full origin-left
			{barClass === '' ? 'bg-blue-500' : barClass}
		"
	/>
</div>
