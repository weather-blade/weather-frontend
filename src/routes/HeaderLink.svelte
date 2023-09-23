<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	export let linkName: string;
	export let linkRoute: string;
</script>

<a
	class="
		border-b-2 border-solid active:border-blue-400 active:text-blue-400
		{$page.route.id === linkRoute
		? 'border-stone-300 text-stone-300'
		: 'border-transparent hover:border-stone-400'}"
	href="{base}{linkRoute}"
>
	{linkName}
</a>
