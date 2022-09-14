<script lang="ts">
	import type { Lesson } from "../client";
	import chroma from "chroma-js";
	import { DateTime } from "luxon";
	import { getScheduleContext } from "./schedule";

	export let lesson: Lesson;

	const { tableDialog } = getScheduleContext();

	const [start, end] = lesson.seconds();
	const color = lesson.color ? chroma(lesson.color) : null;
	const hue = color?.get("hsl.h") || 0;

	const onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = ({ target }) => {
		const rect = (target as HTMLButtonElement).getBoundingClientRect();
		tableDialog.set({ lesson, rect });
	};

	const onBlur = () =>
		tableDialog.update((d) => {
			if (d?.lesson.id == lesson.id) return null;
			return d;
		});
</script>

<button class="lesson" style:--start={start} style:--end={end} style:--hue={hue} on:click={onClick}>
	<h3>{lesson.course}</h3>
	<p>
		{lesson.start.setLocale("sv").toLocaleString(DateTime.TIME_SIMPLE)}
		{#if lesson.teacher}<span>{lesson.teacher}</span>{/if}
		{#if lesson.location}<span>{lesson.location}</span>{/if}
	</p>
</button>

<style lang="scss">
	.lesson {
		--border-radius: 0.5rem;
		--duration: calc(var(--end) - var(--start));
		--accent: hsl(var(--hue), 100%, 50%);

		@media (prefers-color-scheme: dark) {
			--accent: hsl(var(--hue), 40%, 50%);
		}

		all: unset;
		position: absolute;
		height: calc(var(--duration) * var(--second-height));
		background-color: var(--surface0);
		border-radius: 0.5rem;
		top: calc(var(--start) * var(--second-height));
		left: 0;
		right: 0;
		padding: 0.5rem;
		padding-block-start: 0.75rem;
		box-sizing: border-box;
		overflow: hidden;
		font: 400 0.875rem/1.1 var(--font-sans);
		letter-spacing: -0.006em;
		color: var(--text0-muted);
		width: 100%;
		cursor: pointer;
		transition: box-shadow 0.1s;
		display: flex;
		flex-direction: column;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

		&::before {
			content: "";
			position: absolute;
			inset-inline: 0;
			inset-block-start: 0;
			block-size: 0.25rem;
			background-color: var(--accent);
			border-radius: var(--border-radius);
		}

		&:hover,
		&:focus {
			box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
			z-index: 1;
		}

		&:focus-visible {
			outline: 2px solid var(--theme-hover);
		}
	}

	h3 {
		margin-block: 0 0.5rem;
		font: inherit;
		font-weight: 600;
		color: var(--text0);
	}

	p {
		margin: 0;
	}
</style>
