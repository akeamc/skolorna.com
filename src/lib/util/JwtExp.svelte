<script lang="ts">
	import { DateTime } from "luxon";
	import { onMount } from "svelte";
	import { ClockIcon } from "svelte-feather-icons";
	import { exp } from "./jwt";
	import reltime from "./reltime";

	export let token: string;

	let now = DateTime.now();

	$: expires = exp(token);
	$: remaining = expires ? +expires - +now : null;

	onMount(() => {
		const interval = setInterval(() => {
			now = DateTime.now();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	const rtf = new Intl.RelativeTimeFormat("sv", { numeric: "auto" });
</script>

{#if remaining}
	{@const expired = remaining < 0}

	<div class:expired>
		<ClockIcon />

		{#if expired}
			<slot name="expired" />
		{:else}
			<slot name="expiring" expires={reltime(remaining, rtf)} />
		{/if}
	</div>
{/if}

<style lang="scss">
	div {
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		color: var(--text0-muted);

		:global(svg) {
			margin-right: 0.5rem;
			height: 1.25rem;
			width: 1.25rem;
		}
	}

	.expired {
		color: var(--text0-error);
	}
</style>
