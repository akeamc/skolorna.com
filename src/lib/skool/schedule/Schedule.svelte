<script lang="ts">
	import { browser } from "$app/environment";
	import { isError } from "$lib/auth/auth";
	import { DateTime } from "luxon";
	import { derived, get, writable } from "svelte/store";
	import { createLink, getLinks, getSchedule, type Schedule, type SkoolError } from "../client";
	import Credentials from "../Credentials.svelte";
	import { hasCredentials } from "../stores";
	import { endOfScope, setScheduleContext, startOfScope, type Scope } from "./schedule";
	import Table from "./Table.svelte";
	import logo from "$lib/assets/sterik.svg";
	import SplashScreen from "./SplashScreen.svelte";
	import Modal from "$lib/Modal.svelte";

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

	let modalOpen = true;

	const onClose = () => {
		modalOpen = false;
		setTimeout(() => (modalOpen = true), 1000);
	};
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
	{#if $hasCredentials === false}
		<!-- <div class="unauthenticated">
			<div class="modal">
				<header>
					<div class="logo">
						<img alt="Sankt Erik med solglasögon" src={logo} />
					</div>
				</header>
				<div class="inner">
					<Credentials />
				</div>
			</div>
		</div> -->

		<Modal open={modalOpen} {onClose}>
			<div class="header" slot="header">
				<div class="logo">
					<img alt="Sankt Erik med solglasögon" src={logo} />
				</div>
			</div>
			<div slot="main">
				<Credentials />
			</div>
		</Modal>
	{/if}

	{#if $splashScreen || $hasCredentials !== true}
		<SplashScreen />
	{:else}
		<Table />
	{/if}
</section>

<style lang="scss">
	@use "../../../styles/mixins";

	section {
		position: relative;
	}

	.header {
		@include mixins.dotted-background;

		padding: var(--padding);
		border-start-start-radius: var(--border-radius);
		border-start-end-radius: var(--border-radius);
		display: flex;
		justify-content: center;
	}

	.logo {
		max-width: 8rem;
		display: flex;
		aspect-ratio: 1;
		background-color: var(--surface0);
		border-radius: 50%;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
	}

	img {
		display: block;
		width: 100%;
		object-fit: contain;
		margin: 20%;

		@media (prefers-color-scheme: dark) {
			filter: saturate(0.5);
		}
	}
</style>
