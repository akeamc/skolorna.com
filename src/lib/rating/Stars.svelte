<script lang="ts">
	import Star from "./Star.svelte";

	export let total = 5;
	export let rating = 0;
	export let interactive = false;

	function onStarClick(n: number) {
		if (interactive) {
			rating = n + 1;
		}
	}
</script>

<div class="stars">
	{#each new Array(total) as _, i}
		<Star
			{interactive}
			percentage={Math.min(Math.max(rating - i, 0), 1)}
			title={`${i + 1} av ${total} stjärnor`}
			on:click={() => onStarClick(i)}
		/>
	{/each}
</div>

<style lang="scss">
	.stars {
		display: flex;
	}
</style>
