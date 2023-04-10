<script lang="ts">
	import Lesson from "./Lesson.svelte";
	import { getScheduleContext } from "./schedule";
	import type { Lesson as LessonType } from "../client";
	import TableCorner from "./TableCorner.svelte";
	import { DateTime } from "luxon";
	import { monthSpanFmt } from "$lib/date";
	import Skeleton from "$lib/Skeleton.svelte";
	import Clock from "./Clock.svelte";
	import ShareModal from "./share/ShareModal.svelte";
	import ExportModal from "./ExportModal.svelte";
	import Button from "$lib/Button.svelte";
	// import Button from "$lib/Button.svelte";
	// import { ShareIcon } from "svelte-feather-icons";

	let windowWidth: number;
	let shareModalOpen = false;
	let exportModalOpen = false;

	const { schedule, loading, error, scope, startOfScope, endOfScope, offset } =
		getScheduleContext();
	const now = DateTime.now();

	$: numDays = $scope == "week" ? 5 : 1;

	$: cols = ($schedule?.lessons ?? []).reduce((cols, lesson) => {
		const { start, end } = lesson;

		if (start >= $startOfScope && end <= $endOfScope) {
			const col = Math.floor(start.diff($startOfScope, "days").as("days"));
			cols[col].push(lesson);
		}

		return cols;
	}, Array.from({ length: numDays }).map(() => []) as LessonType[][]);

	$: if (windowWidth < 768) {
		$scope = "day";
	} else {
		$scope = "week";
	}

	$: scale = Array.from({ length: 24 * (60 / 15) })
		.map((_, i) => i * 15)
		.filter((i) => i > $offset / 60);

	$: numLessons = $schedule?.lessons?.filter(
		({ start, end }) => +start >= +$startOfScope && +end <= +$endOfScope
	)?.length;
</script>

<ShareModal open={shareModalOpen} onClose={() => (shareModalOpen = false)} />

<ExportModal open={exportModalOpen} onClose={() => (exportModalOpen = false)} />

<div class={`root ${$scope}`} style:--days={numDays}>
	<aside class="scale">
		{#each scale as mins}
			{@const hour = ~~(mins / 60)}
			{@const min = mins % 60}
			<div class="line" class:whole={min == 0} class:half={min % 30 == 0} style:--mins={mins}>
				{#if min == 0}
					<span>
						{hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}
					</span>
				{/if}
			</div>
		{/each}

		<Clock />
	</aside>

	<TableCorner />

	<header>
		<h1>
			{monthSpanFmt($startOfScope.toJSDate(), $endOfScope.toJSDate(), "sv")}
		</h1>
		<div class="count" class:error={$error}>
			{#if $error}
				Ett fel uppstod. Förhoppingsvis är det Skolplattformens (och inte vårt) fel.
			{:else if $loading || typeof numLessons !== "number"}
				<Skeleton width="15ch" />
			{:else}
				{numLessons} {numLessons == 1 ? "lektion" : "lektioner"}
			{/if}
		</div>
		<div class="actions">
			<Button size="medium" variant="secondary" on:click={() => (exportModalOpen = true)}>
				Exportera
			</Button>
		</div>
	</header>

	{#each cols as lessons, i}
		{@const col = i + 2}
		{@const day = $startOfScope.plus({ days: i }).setLocale("sv")}
		<div class="cell col-header" style:grid-column={col} class:today={now.hasSame(day, "day")}>
			<h2>
				<div class="weekday">
					{day.toLocaleString({ weekday: "short" })}
				</div>
				<div class="day">
					{day.toLocaleString({ day: "numeric" })}
				</div>
			</h2>
		</div>
		<div class="cell" style:grid-column={col}>
			<div class="track">
				{#each lessons as lesson (lesson.id)}
					<Lesson {lesson} />
				{/each}
			</div>
		</div>
	{/each}
</div>

<svelte:window bind:innerWidth={windowWidth} />

<style lang="scss">
	.root {
		--second-height: calc(4rem / 3600);
		--scale-size: 3.5rem;
		--scale-font-size: 0.625rem;
		--scale-letter-spacing: 0.01em;
		--header-height: 6rem;
		--header-background: var(--surface1);
		--border: 1px solid var(--outline);

		@media (min-width: 1024px) {
			--scale-size: 5rem;
			--scale-font-size: 0.75rem;
			--scale-letter-spacing: 0;
		}

		display: grid;
		background-color: var(--surface0);
		grid-template-columns: var(--scale-size);
		grid-auto-columns: 1fr;
		position: relative;

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: calc(8 * 3600 * var(--second-height));
			background: linear-gradient(180deg, var(--surface0-transparent) 0%, var(--surface0) 100%);
			pointer-events: none;
		}
	}

	.cell {
		padding: 0 0.25rem;
		border-left: var(--border);
	}

	.track {
		position: relative;
		height: calc((86400 - var(--offset)) * var(--second-height));
	}

	h2 {
		font: 600 1rem/1 var(--font-sans);
		margin-block: 0.5rem;
		letter-spacing: -0.011em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (min-width: 480px) {
			font-size: 1.25rem;
			letter-spacing: -0.006em;
		}
	}

	.scale {
		grid-column: 1;
		grid-row: 3;
		position: relative;

		--font: 500 var(--scale-font-size) / 1 var(--font-sans);

		div {
			position: absolute;
			top: calc((var(--mins) * 60 - var(--offset)) * var(--second-height));

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0.5rem;
				width: calc(var(--scale-size) * 0.25);
				height: 1px;
				background-color: var(--outline);
			}

			&.half::before {
				width: calc(var(--scale-size) * 0.5);
			}

			&.whole::before {
				left: calc(var(--scale-size));
				width: calc(100vw - var(--scale-size));
			}

			span {
				position: absolute;
				left: 0.5rem;
				top: 50%;
				transform: translateY(-50%);
				font: var(--font);
				letter-spacing: var(--scale-letter-spacing);
				color: var(--text0-muted);
				font-feature-settings: "tnum";
			}
		}
	}

	header,
	.col-header {
		background-color: var(--header-background);
		position: sticky;
		grid-column: 2;
		z-index: 2;
	}

	.col-header {
		grid-row: 2;
		border-bottom: var(--border);
		top: var(--header-height);
		margin-bottom: -1px;
		text-align: center;

		h2 {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.25rem;
			margin-block: 1rem;
			height: 3.5rem;
			width: 3.5rem;
			margin-inline: auto;
			border-radius: 0.5rem;

			.day {
				font: 600 1.5rem/1 var(--font-sans);
				letter-spacing: -0.01em;
			}

			.weekday {
				font: 600 0.75rem/1 var(--font-sans);
				letter-spacing: 0.01em;
				color: var(--text0-muted);
			}
		}

		&.today h2 {
			background-color: var(--brand);
			color: var(--on-theme);
			box-shadow: 0 4px 4px 0 var(--brand-transparent);

			.weekday {
				color: var(--on-theme);
			}
		}
	}

	header {
		grid-column: 1 / calc(2 + var(--days));
		grid-row: 1;
		top: 0;
		height: var(--header-height);
		border-bottom: var(--border);
		padding: 0.5rem var(--page-gutter);
		box-sizing: border-box;
		display: grid;
		gap: 0.5rem;
		align-items: center;

		h1 {
			grid-column: 1;
			grid-row: 1;
			margin: 0;
			font: 700 1.5rem/1 var(--font-sans);
			align-self: flex-end;
		}

		.actions {
			grid-column: 2;
			grid-row: 1 / span 2;
			justify-self: flex-end;
		}

		.count {
			font: 500 0.875rem/1 var(--font-sans);
			color: var(--text0-muted);
			letter-spacing: -0.006em;
			grid-column: 1;
			grid-row: 2;
			align-self: flex-start;

			&.error {
				color: var(--text0-error);
			}
		}
	}
</style>
