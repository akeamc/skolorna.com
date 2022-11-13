<script lang="ts">
	import { browser } from "$app/environment";

	import MenuViewer from "$lib/oden/MenuViewer.svelte";
	import Seo from "$lib/Seo.svelte";
	import Skeleton from "$lib/Skeleton.svelte";
	import { DateTime } from "luxon";
	import type { PageData } from "./$types";

	export let data: PageData;

	const now = DateTime.now();
	const updatedAt = DateTime.fromISO(data.updated_at);
	const updatedAtText = browser
		? updatedAt.setLocale("sv").toLocaleString({
				year: updatedAt.year != now.year ? "numeric" : undefined,
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric"
		  })
		: null;
</script>

<Seo title={data.title} />

<div class="container">
	<header>
		<h1>{data.title}</h1>
		<p class="updated-at">
			{#if updatedAtText}
				Uppdaterad {updatedAtText}.
			{:else}
				<Skeleton width="25ch" />
			{/if}
		</p>
	</header>

	<MenuViewer menu={data.id} />
</div>

<style lang="scss">
	.container {
		padding-inline: var(--page-gutter);
		max-width: var(--content-width);
		margin-inline: auto;
	}

	header {
		margin-block: calc(2 * var(--page-gutter));

		h1 {
			font: 700 2rem/1.2 var(--font-sans);
			letter-spacing: -0.022em;
			max-width: 20ch;
			margin: 0;
			word-break: break-word;

			@media (min-width: 768px) {
				font-size: 3rem;
			}
		}

		p {
			font: 500 0.875rem/1.1 var(--font-sans);
			letter-spacing: -0.006em;
			margin-block: 1rem;
			color: var(--text0-muted);
		}
	}
</style>
