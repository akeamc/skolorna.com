<script lang="ts">
	import Search from "$lib/search/Search.svelte";

	let scrollY: number;
</script>

<header class:floating={scrollY > 0}>
	<div class="container">
		<Search />
	</div>
</header>

<svelte:window bind:scrollY />

<style>
	header {
		display: flex;
		height: var(--header-height);
		background-color: var(--surface0);
		border-bottom: 1px solid var(--outline);
		box-sizing: border-box;
		padding-inline: var(--page-gutter);
	}

	.container {
		max-width: var(--content-width);
		margin: 0 auto;
		display: flex;
		width: 100%;
		align-items: center;
	}
</style>
