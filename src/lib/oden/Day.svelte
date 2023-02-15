<script lang="ts">
	import type { Day } from "$lib/oden";
	import Skeleton from "$lib/Skeleton.svelte";
	import { onMount } from "svelte";
	import Meal from "./Meal.svelte";

	export let today = false;
	export let menu: string;
	export let data: Day | undefined = undefined;

	function datefmt(date: string) {
		return new Date(date).toLocaleString("sv", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	}

	let el: HTMLLIElement;

	onMount(() => {
		if (today) el.scrollIntoView({ block: "center", behavior: "smooth" });
	});
</script>

<li class="root" bind:this={el}>
	<h3 class:today>
		{#if data?.date}
			{datefmt(data.date)}
		{:else}
			<Skeleton width="15ch" />
		{/if}
	</h3>
	<ul>
		{#if !data?.meals}
			<li><Skeleton width="50ch" /></li>
			<li><Skeleton width="50ch" /></li>
		{:else}
			{#each data.meals as meal}
				<li><Meal {menu} date={data.date} {meal} /></li>
			{/each}
		{/if}
	</ul>
</li>

<style lang="scss">
	.root {
		padding-block: 1.5rem;
		border-bottom: var(--border);
	}

	h3 {
		font: 500 0.875rem/1 var(--font-sans);
		letter-spacing: -0.006em;
		color: var(--text0-muted);
		margin-block: 0 1rem;
		position: relative;

		&.today {
			color: var(--brand);

			&::before {
				--size: 0.4em;

				content: "";
				position: absolute;
				inset-inline-start: calc(-2 * var(--size));
				inset-block: calc(50% - var(--size) / 2);
				width: var(--size);
				height: var(--size);
				border-radius: 50%;
				background: currentColor;
			}
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
