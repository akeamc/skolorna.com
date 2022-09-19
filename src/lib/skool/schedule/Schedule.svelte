<script lang="ts">
	import { browser } from "$app/environment";
	import { isError } from "$lib/auth";
	import { DateTime } from "luxon";
	import { derived, get, writable } from "svelte/store";
	import { getSchedule, type Schedule } from "../client";
	import Credentials from "../Credentials.svelte";
	import { hasCredentials } from "../stores";
	import { setScheduleContext, type Scope } from "./schedule";
	import Table from "./Table.svelte";

	const cursor = writable(DateTime.now());
	const scope = writable<Scope>("week");
	const schedule = writable<Schedule | null>(null);
	const loading = writable(false);
	const lessonDialog = writable<string | null>(null);
	const offset = writable(7 * 3600);
	$: year = $cursor.year;
	$: week = $cursor.weekNumber;

	$: {
		if (browser && $hasCredentials !== false) {
			$loading = true;

			getSchedule(year, week).then((res) => {
				if (isError(res)) {
					$loading = false;
					return;
				}

				const c = get(cursor);

				if (res.week == c.weekNumber && res.year == c.year) {
					$schedule = res;
					$loading = false;
				}
			});
		}
	}

	setScheduleContext({
		schedule,
		loading,
		cursor,
		scope,
		startOfScope: derived([cursor, scope], ([$cursor, $scope]) => $cursor.startOf($scope)),
		endOfScope: derived([cursor, scope], ([$cursor, $scope]) => $cursor.endOf($scope)),
		lessonDialog,
		offset
	});
</script>

<section style:--offset={$offset}>
	<div class="unauthenticated" class:visible={$hasCredentials === false}>
		<div class="modal">
			<Credentials />
		</div>
	</div>

	<Table />
</section>

<style lang="scss">
	section {
		position: relative;
	}

	.unauthenticated {
		position: absolute;
		inset: 0;
		z-index: 3;
		backdrop-filter: blur(8px);
		background-color: rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease-in-out;

		@media (min-width: 480px) {
			padding: 0 var(--page-gutter);
		}

		&.visible {
			opacity: 1;
			pointer-events: all;
		}

		.modal {
			background-color: var(--surface0);
			text-align: center;
			margin: 0;
			box-sizing: border-box;
			padding: var(--page-gutter);
			flex: 1;
			max-width: 100%;

			@media (min-width: 480px) {
				padding: 2rem;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
				border-radius: 1rem;
				width: 40rem;
				margin-top: 10rem;
				flex: 0;
			}
		}
	}
</style>
