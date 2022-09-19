<p class={$$props.class}>
	<slot />
</p>

<style lang="scss">
	p {
		padding: 1rem;
		background-color: var(--surface0-error);
		border-radius: 0.5rem;
		font: 500 14px var(--font-sans);
		color: var(--text0-error);
		margin: 0;

		:global(a) {
			color: var(--text0-error);
			text-decoration: underline;
			font-weight: 600;
		}
	}
</style>
