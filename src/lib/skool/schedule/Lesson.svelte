<script lang="ts">
	import type { Lesson } from "../client";
	import chroma from "chroma-js";
	import { DateTime } from "luxon";
	import { getScheduleContext } from "./schedule";

	export let lesson: Lesson;

	const { lessonDialog } = getScheduleContext();

	const [start, end] = lesson.seconds();
	const color = lesson.color ? chroma(lesson.color) : null;
	const hue = color?.get("hsl.h") || 0;
	const sat = color?.get("hsl.s");
</script>

<div
	class="lesson"
	class:gray={sat === 0}
	style:--start={start}
	style:--end={end}
	style:--hue={hue}
>
	<button class:compact={end - start <= 2700} on:click={() => lessonDialog.set(lesson.id)}>
		<h3>{lesson.course}</h3>
		<p>
			{lesson.start.setLocale("sv").toLocaleString(DateTime.TIME_SIMPLE)}
			{#if lesson.teacher}<span>{lesson.teacher}</span>{/if}
			{#if lesson.location}<span>{lesson.location}</span>{/if}
		</p>
	</button>
</div>

<style lang="scss">
	.lesson {
		--duration: calc(var(--end) - var(--start));
		--background: hsl(var(--hue), 54%, 92%);
		--foreground: hsl(var(--hue), 51%, 45%);
		--shadow: hsla(var(--hue), 51%, 35% / 1);

		@media (prefers-color-scheme: dark) {
			--background: hsl(var(--hue), 40%, 20%);
			--foreground: hsl(var(--hue), 40%, 80%);
		}

		position: absolute;
		height: calc(var(--duration) * var(--second-height));
		top: calc((var(--start) - var(--offset)) * var(--second-height));
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;

		&.gray {
			--background: var(--surface1);
			--foreground: var(--text0);
		}
	}

	button {
		--border-radius: 0.5rem;

		all: unset;
		flex: 1;
		background-color: var(--background);
		border-radius: var(--border-radius);
		padding: 0.5rem;
		box-sizing: border-box;
		overflow: hidden;
		color: var(--foreground);
		width: 100%;
		cursor: pointer;
		transition: box-shadow 0.1s;
		display: flex;
		flex-direction: column;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
		position: relative;

		&:hover,
		&:focus {
			box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
			z-index: 1;
		}

		&:focus-visible {
			outline: 2px solid var(--theme-hover);
		}

		&.compact {
			padding-block: 0;
			flex-direction: row;
			align-items: center;

			h3 {
				margin-block: 0;
				margin-inline-end: 0.5rem;
			}
		}
	}

	h3 {
		margin: 0;
		font-weight: 600;
		line-height: 1.1;
		font-size: clamp(0.75rem, 1rem * var(--duration) / 3600, 0.875rem);
		letter-spacing: -0.006em;
		margin-block-end: clamp(0.25rem, 0.5rem * (var(--duration) / 3600 - 1), 0.5rem);
	}

	p {
		margin: 0;
		flex: 1;
		font-size: 0.75rem;
		font-weight: 500;
	}
</style>
