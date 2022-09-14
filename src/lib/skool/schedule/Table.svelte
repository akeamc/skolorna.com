<script lang="ts">
	import Lesson from "./Lesson.svelte";
	import { getScheduleContext } from "./schedule";
	import type { Lesson as LessonType } from "../client";
	import { DateTime } from "luxon";
	import TableDialog from "./TableDialog.svelte";

	const { schedule, scope, startOfScope, endOfScope, tableDialog } = getScheduleContext();

	$: numDays = $scope == "week" ? 5 : 1;

	$: cols = ($schedule?.lessons ?? []).reduce((cols, lesson) => {
		const { start, end } = lesson;

		if (start >= $startOfScope && end <= $endOfScope) {
			const col = Math.floor(start.diff($startOfScope, "days").as("days"));
			cols[col].push(lesson);
		}

		return cols;
	}, Array.from({ length: numDays }).map(() => []) as LessonType[][]);
</script>

<div class={`root ${$scope}`}>
	{#if $tableDialog}
		<TableDialog dialog={$tableDialog} />
	{/if}
	<!-- {#each Array.from({ length: 48 }).map((_, i) => i * 30) as mins}
		<p>{mins}</p>
	{/each} -->

	{#each cols as lessons, i}
		<div class="col" style:grid-column={i + 1}>
			{$startOfScope.plus({ days: i }).setLocale("sv").toLocaleString(DateTime.DATE_FULL)}
			<div class="inner">
				{#each lessons as lesson (lesson.id)}
					<Lesson {lesson} />
				{/each}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.root {
		--second-height: calc(4rem / 3600);

		display: grid;
		column-gap: 0.25rem;
		background-color: var(--surface1);

		&.day {
			grid-template-columns: 1fr;
		}

		&.week {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.col {
		.inner {
			position: relative;
			height: calc(86400 * var(--second-height));
		}
	}
</style>
