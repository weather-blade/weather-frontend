<script lang="ts">
	import HeaderLink from './HeaderLink.svelte';
</script>

<header>
	<nav class="flex justify-center gap-4 text-lg text-stone-400">
		<HeaderLink linkName="Dashboard" linkRoute="/" />
		<HeaderLink linkName="Předpověď" linkRoute="/forecast" />
	</nav>
</header>
