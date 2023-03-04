<script lang="ts">
	import { ratingHistogram, type Review } from "$lib/oden";
	import Skeleton from "$lib/Skeleton.svelte";

	/**
	 * Average rating. `null` if no reviews; `undefined` if reviews are loading.
	 */
	export let average: number | null | undefined = undefined;
	export let reviews: Review[] | undefined = undefined;

	$: histogram = reviews ? ratingHistogram(reviews) : undefined;

	const ratings = [5, 4, 3, 2, 1];
</script>

<div class="container">
	<div class="summary">
		<div class="average">
			{#if typeof average === "number"}
				{average.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
			{:else if average === null}
				-
			{:else}
				<Skeleton width="2.5ch" />
			{/if}
		</div>
		<div class="count">
			{reviews?.length}
			{reviews?.length === 1 ? "recension" : "recensioner"}
		</div>
	</div>
	<table>
		<tbody>
			{#each ratings as rating}
				{@const frequency = histogram?.[rating] || 0}
				<tr>
					<td class="rating">
						{rating}
					</td>
					<td>
						<div class="bar">
							<div class="fill" style="width: {(100 * frequency) / (reviews?.length || 1)}%" />
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}

	@media (min-width: 480px) {
		.container {
			grid-template-columns: 1fr 8rem;
		}

		.summary {
			grid-column: 2;
		}

		table {
			grid-row: 1;
		}
	}

	.rating {
		font-size: 0.875rem;
		width: 2ch;
		line-height: 1.5;
	}

	.bar {
		height: 0.5rem;
		width: 100%;
		background-color: var(--outline);
		border-radius: 9999px;
		overflow: hidden;

		.fill {
			height: 100%;
			background-color: var(--text0);
			border-radius: 9999px;
			transition: width 0.25s ease-in-out;
		}
	}

	.summary {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.5rem;
	}

	.average {
		font: 500 3rem/1 var(--font-sans);
		letter-spacing: -0.022em;
	}

	.count {
		font: 400 0.875rem/1 var(--font-sans);
		color: var(--text0-muted);
		letter-spacing: -0.006em;
	}
</style>
