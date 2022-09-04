<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="root">
	{#if $page.status == 404}
		<div>
			<h1 class="status">404</h1>
			<p>Sidan hittades inte.</p>
			<a href="/">Tillbaka till startsidan</a>
		</div>
	{:else}
		<h1>Okänt fel</h1>
		<p>
			Ett okänt fel uppstod: <code>{$page.error.message}</code>
		</p>
		{#if $page.error.stack}
			<pre>{$page.error.stack}</pre>
		{/if}
	{/if}
</div>

<style lang="scss">
	.root {
		text-align: center;
		margin-block: 4rem;
		margin-inline: auto;
		padding-inline: var(--page-gutter);
		max-width: var(--content-width);

		@media (min-width: 768px) {
			margin-block: 8rem;
		}
	}

	h1 {
		font-size: max(4rem, 6vw);
		margin: 0;
		letter-spacing: -0.03em;
	}

	.status {
		font-size: max(4rem, 8vw);
	}

	p {
		font: 400 20px/1.5 var(--font-sans);
		letter-spacing: -0.01em;
		margin-block: 1rem;
		line-height: 1.5;
		color: var(--text0-muted);
	}

	code {
		background-color: var(--surface1);
		border-radius: 6px;
		display: inline-block;
		padding-inline: 0.4em;
		padding-block: 0.2em;
	}

	pre {
		padding: 0.5rem;
		background-color: var(--surface1);
		border-radius: 6px;
		text-align: start;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		margin-block: 1rem;
	}
</style>
