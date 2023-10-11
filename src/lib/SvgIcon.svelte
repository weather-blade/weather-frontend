<script lang="ts">
	// https://stackoverflow.com/questions/66069647/best-way-to-import-svg-icons-into-a-svelte-app

	export let name: keyof typeof icons;

	const icons = {
		delete: {
			viewBox: '0 -960 960 960',
			svg: `<path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>`,
		},
	} as const;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="currentColor"
	viewBox={icons[name].viewBox}
	class={$$props.class}
>
	{@html icons[name].svg}
</svg>
