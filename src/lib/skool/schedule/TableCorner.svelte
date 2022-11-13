<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";
	import { get } from "svelte/store";
	import { getScheduleContext } from "./schedule";

	const { scope, cursor } = getScheduleContext();
</script>

<div class="container">
	<button on:click={() => cursor.update((c) => c.minus({ [get(scope)]: 1 }))}>
		<ChevronLeftIcon />
	</button>
	<button on:click={() => cursor.update((c) => c.plus({ [get(scope)]: 1 }))}>
		<ChevronRightIcon />
	</button>
</div>

<style lang="scss">
	.container {
		grid-column: 1;
		grid-row: 2 / 3;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: var(--header-background);
		border-bottom: var(--border);
		margin-bottom: -1px;
		position: sticky;
		top: var(--header-height);
		z-index: 1;
	}

	button {
		all: unset;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		transition: background-color 0.1s;
		color: var(--text0);
		padding: 0.25rem;
		user-select: none;

		&:hover {
			background-color: var(--surface2);
		}

		&:focus {
			outline: var(--theme-hover) solid 2px;
			outline-offset: -2px;
		}

		:global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
