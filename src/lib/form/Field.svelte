<script lang="ts">
	export let inputId = "";
	export let label = "";
</script>

<div class="field">
	<label for={inputId}>{label}</label>
	<slot />
</div>

<style lang="scss">
	.field :global(input) {
		height: 3rem;
		border: 1px solid var(--outline);
		border-radius: 8px;
		width: 100%;
		margin-block-start: 0.5rem;
		margin-block-end: 1.5rem;
		background-color: var(--surface1);
		padding-inline: 8px;
		font-family: var(--font-sans);
		font-size: 14px;
		color: inherit;
		box-sizing: border-box;

		&:focus {
			outline: var(--theme-hover) solid 2px;
			outline-offset: -1px;
		}
	}

	label {
		display: block;
		font: 500 14px var(--font-sans);
	}
</style>
