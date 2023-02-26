<div>
	<slot />
</div>

<style lang="scss">
	div {
		border: 1px solid var(--outline);
		background-color: var(--surface1);
		margin: 0 auto;
		border-radius: 1rem;
		display: inline-block;
		font: 400 0.875rem/1.25 var(--font-sans);
		letter-spacing: -0.006em;
		padding-block: 0.25rem;
		padding-inline: 1rem;
		box-sizing: border-box;
		color: var(--text0);

		& :global(a) {
			color: inherit;
			font-weight: 600;

			& :global(svg) {
				height: 1em;
				width: 1em;
				vertical-align: middle;
				margin-left: 0.25rem;
			}
		}
	}
</style>
