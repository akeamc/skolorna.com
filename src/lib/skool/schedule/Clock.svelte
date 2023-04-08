<script lang="ts">
	import { onMount } from "svelte";
	import { getScheduleContext } from "./schedule";

	const { offset, startOfScope, endOfScope } = getScheduleContext();

	let time = new Date();

	$: hour = time.getHours().toString().padStart(2, "0");
	$: minute = time.getMinutes().toString().padStart(2, "0");
	$: seconds = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
	$: visible = seconds >= $offset && +time >= +$startOfScope && +time <= +$endOfScope;

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if visible}
	<div style:--seconds={seconds}>
		<span>{hour}:{minute}</span>
	</div>
{/if}

<style lang="scss">
	div {
		--color: var(--brand);

		position: absolute;
		top: calc((var(--seconds) - var(--offset)) * var(--second-height));
		z-index: 1;
		transition: top 0.5s cubic-bezier(0.52, 0.03, 0.38, 0.97);

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0.5rem;
			width: calc(100vw - 0.5rem);
			height: 1px;
			background: var(--color);
		}

		span {
			position: absolute;
			left: 0.5rem;
			top: 50%;
			transform: translateY(-50%);
			font-feature-settings: "tnum";
			font: var(--font);
			background: var(--color);
			color: var(--on-theme);
			border-radius: 0.25rem;
			padding-inline: 0.5em;
			padding-block: 0.25em;
		}
	}
</style>
