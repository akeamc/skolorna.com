<script lang="ts">
	import Skeleton from "$lib/Skeleton.svelte";

	export let inputId = "";
	export let label = "";
	export let skeleton = false;
</script>

<div class="field">
	<label for={inputId}>
		{#if skeleton}
			<Skeleton width="10ch" />
		{:else}
			{label}
		{/if}
	</label>
	{#if skeleton}
		<div class="skeleton" />
	{:else}
		<slot />
	{/if}
</div>

<style lang="scss">
	.field :global(input),
	.skeleton {
		height: 3rem;
		border-radius: 0.5rem;
		width: 100%;
		margin-block-start: 0.5rem;
		margin-block-end: 1.5rem;
	}

	.field :global(input) {
		border: 1px solid var(--outline);
		background-color: var(--surface1);
		padding-inline: 0.5rem;
		font-family: var(--font-sans);
		font-size: 14px;
		color: inherit;
		box-sizing: border-box;

		&:focus {
			outline: var(--theme-hover) solid 2px;
			outline-offset: -1px;
		}
	}

	.skeleton {
		background-color: var(--surface2);
	}

	label {
		display: block;
		font: 500 14px var(--font-sans);
	}
</style>
