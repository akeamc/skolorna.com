<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";
	import Skeleton from "$lib/Skeleton.svelte";
	import { DateTime } from "luxon";
	import { spanfmt } from "./date";
	import { getDays, type Day } from "./oden";
	import { browser } from "$app/environment";

	export let menu: string;

	let cursor = browser ? DateTime.now() : null;

	$: first = cursor?.startOf("week");
	$: last = cursor?.endOf("week");
	$: days =
		first && last
			? getDays(menu, first, last)
			: new Promise<Day[]>(() => {
					// never resolve
			  });

	function dayfmt(date: string) {
		return new Date(date).toLocaleString("sv", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	}

	const now = DateTime.now();
</script>

<section>
	<div class="toolbar">
		<div class="buttons">
			<button on:click={() => cursor && (cursor = cursor.minus({ weeks: 1 }))}>
				<ChevronLeftIcon />
			</button>
			<button class="wide" on:click={() => (cursor = DateTime.now())}> Idag </button>
			<button on:click={() => cursor && (cursor = cursor.plus({ weeks: 1 }))}>
				<ChevronRightIcon />
			</button>
		</div>
		<h2>
			{#if first && last}
				{spanfmt(first.toJSDate(), last.toJSDate(), "sv")}
			{:else}
				<Skeleton width="10ch" />
			{/if}
		</h2>
	</div>

	<div class="result">
		{#await days then days}
			<ol>
				{#each days as day (day.date)}
					<li class="day">
						<h3 class:today={day.date == now.toISODate()}>
							{dayfmt(day.date)}
						</h3>
						<ul>
							{#each day.meals as meal}
								<li>{meal.value}</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>
			{#if days.length == 0}
				<div class="void">
					Vi vet inte vad det {+(last || 0) > +now ? "blir" : "blev"} till lunch.
				</div>
			{/if}
		{:catch error}
			<code>{error.message}</code>
		{/await}
	</div>
</section>

<style lang="scss">
	section {
		margin-block: 2rem;
	}

	.toolbar {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		@media (min-width: 480px) {
			gap: 1rem;
		}

		.buttons {
			--radius: 0.5rem;

			display: flex;
			gap: 1px;

			button {
				border-radius: 0;
				background-color: var(--brand);
				color: var(--on-theme);
				border: 0;
				padding: 0.25rem;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				font: 500 0.875rem/1 var(--font-sans);
				letter-spacing: -0.006em;
				margin: 0;

				&:hover {
					background-color: var(--theme-hover);
				}

				&:active {
					background-color: var(--theme-active);
				}

				&:focus {
					outline: var(--on-theme) solid 2px;
					outline-offset: -4px;
				}

				&:first-child {
					border-start-start-radius: var(--radius);
					border-end-start-radius: var(--radius);
				}

				&:last-child {
					border-start-end-radius: var(--radius);
					border-end-end-radius: var(--radius);
				}

				:global(svg) {
					width: 1.5rem;
					height: 1.5rem;
				}

				&.wide {
					padding-inline: 0.5rem;

					@media (min-width: 480px) {
						padding-inline: 1rem;
					}
				}
			}
		}

		h2 {
			font: 600 1.25rem/1.2 var(--font-sans);
			letter-spacing: -0.014em;
			margin: 0;
		}
	}

	.result {
		--border: 1px solid var(--outline);

		border-top: var(--border);
	}

	ul,
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.day {
		padding-block: 1.5rem;
		border-bottom: var(--border);

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

		li {
			font: 500 1.125rem/1.2 var(--font-sans);
			letter-spacing: -0.014em;
			margin-block: 1rem 0;
		}
	}

	.void {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-block: 1rem;
		padding: 1.5rem;
		text-align: center;
		background-color: var(--surface1);
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		border-radius: 1rem;
		min-height: 10rem;
		color: var(--text0-muted);
		animation: fadeIn 0.5s ease-in-out forwards;
		font: 500 0.875rem/1.2 var(--font-sans);
		letter-spacing: -0.006em;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
