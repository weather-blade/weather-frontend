<script lang="ts">
	import HeaderLink from './HeaderLink.svelte';
</script>

<header>
	<nav class="flex flex-wrap justify-center gap-4 whitespace-nowrap text-lg text-stone-400">
		<HeaderLink linkName="Dashboard" linkRoute="/" />
		<HeaderLink linkName="Úplná data" linkRoute="/history" />
		<HeaderLink linkName="Předpověď" linkRoute="/forecast" />
		<HeaderLink linkName="O meteostanici" linkRoute="/about" />
	</nav>
</header>
