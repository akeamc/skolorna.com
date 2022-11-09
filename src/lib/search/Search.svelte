<script lang="ts">
	import { goto } from "$app/navigation";
	import { getKey, search, type SearchResponse } from "./client";
	import { ClockIcon, SearchIcon } from "svelte-feather-icons";
	import type { Menu } from "$lib/oden";
	import reltime from "$lib/util/reltime";
	import { DateTime } from "luxon";

	let query = "";
	let key: string;
	let response: SearchResponse<Menu>;
	let focusedHit = 0;
	let responseElement: HTMLElement;

	getKey().then((k) => {
		key = k;
	});

	$: {
		if (!key) break $;

		search<Menu>({ q: query, attributesToHighlight: ["title"] }, key).then((r) => {
			if (r.query == query) {
				// prevent race condition
				response = r;
				focusedHit = 0;
			}
		});
	}

	const scrollToFocused = () => {
		const element = document.querySelector(`[data-hit-no="${focusedHit}"]`);
		if (element) element.scrollIntoView({ block: "center", behavior: "smooth" });
	};

	const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (e) => {
		const hit = response?.hits[focusedHit];

		switch (e.key) {
			case "Escape":
				e.currentTarget.blur();
				break;
			case "Enter":
				if (hit) {
					goto(`/menyer/${hit.id}`);
				}
				break;
			case "ArrowUp":
				e.preventDefault(); // don't move the cursor
				focusedHit = Math.max(focusedHit - 1, 0);
				scrollToFocused();
				break;
			case "ArrowDown":
				e.preventDefault(); // don't move the cursor
				focusedHit = Math.min((response?.hits.length || 0) - 1, focusedHit + 1);
				scrollToFocused();
				break;
		}
	};

	const rtf = new Intl.RelativeTimeFormat("sv", { numeric: "auto" });
</script>

<div class="search">
	<div class="box">
		<SearchIcon />
		<input
			type="search"
			placeholder="Sök efter menyer …"
			bind:value={query}
			on:keydown={handleKeyDown}
		/>
	</div>
	{#if response}
		<div class="response" bind:this={responseElement}>
			<ol>
				{#each response.hits as hit, i (hit.id)}
					<li>
						<a
							href={`/menyer/${hit.id}`}
							data-sveltekit-prefetch
							class:focus={i === focusedHit}
							tabindex="-1"
							data-hit-no={i}
							on:mousemove={() => (focusedHit = i)}
						>
							<div class="title">
								{@html hit._formatted?.title ?? hit.title}
							</div>
							<div class="updated">
								<ClockIcon />
								Uppdaterad {reltime(+DateTime.fromISO(hit.updated_at) - +DateTime.now(), rtf)}
							</div>
						</a>
					</li>
				{/each}
			</ol>
			{#if response.hits.length === 0}
				<div class="info">
					<pre>(╯°□°）╯︵ ┻━┻ </pre>
					<p>Inga menyer hittades.</p>
				</div>
			{:else}
				<div class="stats">
					{response.estimatedTotalHits} resultat ({response.processingTimeMs} ms)
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.search {
		--border-radius: 8px;

		width: 100%;
		max-width: 40ch;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.box {
		--box-block-size: 2.25rem;
	}

	.box :global(svg) {
		position: absolute;
		inset-block-start: calc((var(--box-block-size) - 1rem) / 2);
		inset-inline-start: 0.6rem;
		color: var(--text0-muted);
		width: 1rem;
		height: 1rem;
	}

	input {
		background: var(--surface1);
		font: 500 14px/1 var(--font-sans);
		letter-spacing: -0.006em;
		block-size: var(--box-block-size);
		padding-inline-start: 2rem;
		padding-inline-end: 0;
		width: 100%;
		border: 1px solid var(--outline);
		border-radius: var(--border-radius);
		color: var(--text0);
	}

	input::placeholder {
		color: var(--text0-muted);
	}

	input:focus {
		outline: none;
		border-color: var(--theme-hover);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.response {
		--pad-block: 10px;
		--pad-inline: 8px;

		opacity: 0;
		pointer-events: none;
		position: absolute;
		top: calc(100% + 8px);
		background-color: var(--surface1);
		border-radius: var(--border-radius);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		width: 100%;
		overflow: hidden;
		font: 500 0.75rem/1 var(--font-sans);
		letter-spacing: 0;
		z-index: 10;
		max-height: min(80vh, 30rem);
		overflow-y: auto;
		transform: translateY(-8px);
		transition: all 0.15s ease-in-out;
	}

	.search:focus-within .response {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	ol {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li a {
		--primary: var(--text0);
		--secondary: var(--text0-muted);

		display: block;
		padding-block: var(--pad-block);
		padding-inline: var(--pad-inline);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		border-bottom: 1px solid var(--color-separator);
		text-decoration: none;
		border-bottom: 1px solid var(--outline);

		&.focus {
			--primary: var(--on-theme);
			--secondary: var(--on-theme);

			background-color: var(--theme-hover);
			outline: none;
		}

		&:active {
			--primary: var(--on-theme);
			--secondary: var(--on-theme);

			background-color: var(--theme-active);
		}

		.title {
			color: var(--primary);
		}

		.title :global(em) {
			font-style: normal;
			text-decoration: underline;
		}

		.updated {
			margin-block-start: 0.5rem;
			display: flex;
			align-items: center;
			color: var(--secondary);

			:global(svg) {
				--size: 0.75rem;

				width: var(--size);
				height: var(--size);
				flex: 0 0 var(--size);
				margin-inline-end: 0.25rem;
			}
		}
	}

	.info {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-direction: column;
		padding-block: 1.5rem;
		color: var(--text0-muted);

		pre {
			font: 400 20px/1 var(--font-sans);
			letter-spacing: -0.017em;
			margin-block: 0 1em;

			@media (min-width: 480px) {
				font-size: 32px;
				letter-spacing: -0.022em;
			}
		}

		p {
			font: 500 14px/1 var(--font-sans);
			letter-spacing: -0.006em;
			margin: 0;
		}
	}

	.stats {
		padding-block: var(--pad-block);
		padding-inline: var(--pad-inline);
		color: var(--text0-muted);
	}
</style>
