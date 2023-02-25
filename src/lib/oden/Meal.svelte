<script lang="ts">
	import type { Meal } from "$lib/oden";
	import Stars from "$lib/rating/Stars.svelte";
	import Skeleton from "$lib/Skeleton.svelte";
	import { ChevronsDownIcon } from "svelte-feather-icons";
	import Reviews from "./Reviews.svelte";

	export let menu: string;
	export let date: string | undefined = undefined;
	export let meal: Meal | undefined = undefined;

	let expanded = false;
</script>

<div class="meal">
	<h4>
		{#if meal}{meal.value}{:else}<Skeleton width="50ch" />{/if}
	</h4>

	<div class="reviews" class:expanded>
		<button class="rating" on:click={() => (expanded = !expanded)} disabled={!meal}>
			<Stars rating={meal?.rating ?? undefined} />

			<div class="chevron">
				<ChevronsDownIcon />
			</div>
		</button>

		{#if date && meal}
			<div class="collapsible">
				<Reviews {menu} {date} meal={meal.value} count={meal.reviews} enabled={expanded} />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.meal {
		margin-block: 1rem 0;
	}

	h4 {
		font: 500 1.125rem/1.2 var(--font-sans);
		letter-spacing: -0.014em;
		margin: 0;
	}

	.rating {
		all: unset;
		display: flex;
		align-items: center;
		font: 400 0.875rem/1 var(--font-sans);
		margin-block: 0.5rem;
		gap: 0.25rem;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:focus-visible {
			outline: 2px solid var(--theme-hover);
		}

		.chevron :global(svg) {
			color: var(--text0-muted);
			width: 1rem;
			height: 1rem;
			transition: transform 0.2s cubic-bezier(0.85, 0.04, 0.24, 0.98);
		}
	}

	.collapsible {
		visibility: collapse;
	}

	.reviews.expanded {
		.collapsible {
			visibility: visible;
		}

		.chevron :global(svg) {
			transform: rotate(180deg);
		}
	}
</style>
