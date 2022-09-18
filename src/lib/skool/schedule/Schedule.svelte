<script lang="ts">
	import { browser } from "$app/environment";
	import { DateTime } from "luxon";
	import { derived, get, writable } from "svelte/store";
	import { getSchedule, type Schedule } from "../client";
	import { setScheduleContext, type Scope } from "./schedule";
	import Table from "./Table.svelte";

	const cursor = writable(DateTime.now());
	const scope = writable<Scope>("week");
	const schedule = writable<Schedule | null>(null);
	const lessonDialog = writable<string | null>(null);
	const offset = writable(7 * 3600);

	$: browser &&
		getSchedule($cursor.year, $cursor.weekNumber).then((res) => {
			const c = get(cursor);

			if (res.week == c.weekNumber && res.year == c.year) schedule.set(res);
		});

	setScheduleContext({
		schedule,
		cursor,
		scope,
		startOfScope: derived([cursor, scope], ([$cursor, $scope]) => $cursor.startOf($scope)),
		endOfScope: derived([cursor, scope], ([$cursor, $scope]) => $cursor.endOf($scope)),
		lessonDialog,
		offset
	});
</script>

<div style:--offset={$offset}>
	<Table />
</div>
