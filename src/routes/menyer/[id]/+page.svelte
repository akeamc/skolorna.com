<script lang="ts">
	import MenuViewer from "$lib/oden/MenuViewer.svelte";
	// import OsmId from "$lib/OsmId.svelte";
	import Seo from "$lib/Seo.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Seo title={data.title} />

<div class="container">
	<header>
		<h1>{data.title}</h1>
		<!-- {#if data.osm_id}
			<div class="osm">
				<OsmId id={data.osm_id} />
			</div>
		{/if} -->
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
	}

	// .osm {
	// 	margin-block: 1rem;
	// }
</style>
