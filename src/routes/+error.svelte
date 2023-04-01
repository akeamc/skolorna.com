<script lang="ts">
	import { page } from "$app/stores";
	import Seo from "$lib/Seo.svelte";
	import { DateTime } from "luxon";

	const menus = [
		{
			date: "2023-02-01",
			meals: [
				"Ugnsgratinerad nötfalukorv med tomat och ost serveras med hemlagat potatismos",
				"Gratinerad vegetarisk korv med tomat och ost serveras med hemlagat potatismos"
			]
		},
		{
			date: "2023-02-02",
			meals: [
				"Bolognese serveras med ECO spaghetti",
				"Vegetarisk Bolognese serveras med ECO spaghetti"
			]
		},
		{
			date: "2023-02-03",
			meals: [
				"Hamburgare serveras med bröd, dressing och klyftpotatis",
				"Vegoburgare serveras med bröd, dressing och klyftpotatis"
			]
		}
	];
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
		<p>Det verkar som att hemsidan faktiskt inte fungerar. Pinsamt.</p>
	{/if}
</div>

<Seo />

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
</style>
