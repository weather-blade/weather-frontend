<script lang="ts">
	export let title: string;
</script>

<div
	class="flex flex-1 flex-col items-center justify-center rounded border border-zinc-700 bg-zinc-800 p-1"
>
	<strong>
		{title}
	</strong>

	<div class="flex flex-col items-center">
		<slot />
	</div>
</div>
