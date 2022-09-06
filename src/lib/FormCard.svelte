<div class="root">
	<div class="card">
		<slot />
	</div>
</div>

<style lang="scss">
	.root {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: calc(100vh - var(--header-height));
		padding-inline: var(--page-gutter);
	}

	.card {
		padding: 0;
		margin: calc(var(--header-height) + var(--page-gutter)) 0;
		text-align: center;
		font: 400 14px var(--font-sans);
	}

	@media (min-width: 480px) {
		.root {
			background-color: var(--surface1);
			justify-content: center;
		}

		.card {
			padding: var(--page-gutter);
			width: 400px;
			border-radius: 12px;
			box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
			background-color: var(--surface0);
		}
	}

	.card :global(h1) {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		margin-block: 0 1rem;
	}

	.card :global(form) {
		text-align: start;
	}

	.card :global(input) {
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

	.card :global(label) {
		font-weight: 500;
	}

	.card :global(p) {
		margin-block: 1rem 0;
	}

	.card :global(button) {
		width: 100%;
	}
</style>
