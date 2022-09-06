<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	const menus = data?.menus.toLocaleString("sv") ?? "jättemånga";
	const days = data?.days.toLocaleString("sv") ?? "ett astronomiskt antal";
</script>

<section class="hero">
	<h1>Vi vet vad det blir till lunch på <em>{menus}</em> ställen</h1>
	<p>Hittills har vi arkiverat {days} måltider.</p>
</section>

<style lang="scss">
	.hero {
		margin-block: 4rem;
		text-align: center;
		max-width: var(--content-width);
		padding: 0 var(--page-gutter);
		margin-inline: auto;

		@media (min-width: 768px) {
			margin-block: 8rem;
		}
	}

	h1 {
		font-size: max(3rem, 6vw);
		line-height: 1.25;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-block: 3rem;

		em {
			padding-inline: 0.3ch;
			font-style: normal;
			background-color: hsla(
				var(--brand-hue) var(--brand-saturation) var(--brand-lightness) / 0.15
			);
			color: var(--brand);
			border-radius: 0.2em;
		}
	}

	p {
		font: 400 20px/1.5 var(--font-sans);
		letter-spacing: -0.01em;
		margin: 0;
		line-height: 1.5;
		color: var(--text0-muted);
	}
</style>
