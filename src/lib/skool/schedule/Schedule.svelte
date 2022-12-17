<script lang="ts">
	import { browser } from "$app/environment";
	import { isError } from "$lib/auth/auth";
	import { DateTime } from "luxon";
	import { derived, get, writable } from "svelte/store";
	import { createLink, getLinks, getSchedule, type Schedule, type SkoolError } from "../client";
	import { hasCredentials } from "../stores";
	import { endOfScope, setScheduleContext, startOfScope, type Scope } from "./schedule";
	import Table from "./Table.svelte";
	import SplashScreen from "./SplashScreen.svelte";
	import CredentialsModal from "../CredentialsModal.svelte";

	const cursor = writable(DateTime.now());
	const scope = writable<Scope>("week");
	const schedule = writable<Schedule | null>(null);
	const loading = writable(true);
	const error = writable<SkoolError | null>(null);
	const lessonDialog = writable<string | null>(null);
	const offset = writable(7 * 3600);
	const splashScreen = writable(true);

	const links = getLinks();

	loading.subscribe((v) => {
		if (!v) splashScreen.set(false);
	});

	$: year = $cursor.year;
	$: week = $cursor.weekNumber;

	$: {
		if (browser && $hasCredentials !== false) {
			$loading = true;
			$error = null;

			getSchedule(year, week).then((res) => {
				if (isError(res)) {
					$loading = false;
					$error = res;
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
		error,
		cursor,
		scope,
		startOfScope: derived([cursor, scope], ([$cursor, $scope]) => startOfScope($cursor, $scope)),
		endOfScope: derived([cursor, scope], ([$cursor, $scope]) => endOfScope($cursor, $scope)),
		lessonDialog,
		offset
	});
</script>

<h2>Dela</h2>

{#await links}
	laddar
{:then links}
	<ul class="links">
		{#each links as link}
			<li>
				<button on:click={() => link.copyToClipboard()}>Kopiera länk</button>
				<button on:click={() => link.delete()}>Ta bort</button>
			</li>
		{/each}
	</ul>
{/await}

<button on:click={createLink}>Ny länk</button>

<section style:--offset={$offset}>
	<CredentialsModal />

	{#if $splashScreen || $hasCredentials !== true}
		<SplashScreen />
	{:else}
		<Table />
	{/if}
</section>

<style lang="scss">
	section {
		position: relative;
	}
</style>
