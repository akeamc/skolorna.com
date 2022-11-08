<script lang="ts">
	import { goto } from "$app/navigation";
	import { getKey, search, type SearchResponse } from "./client";
	import { SearchIcon } from "svelte-feather-icons";
	import type { Menu } from "$lib/oden";

	let query = "";
	let key: string;
	let response: SearchResponse<Menu>;
	let focusedHit = 0;

	getKey().then((k) => {
		key = k;
	});

	$: {
		if (!key) break $;

		search<Menu>({ q: query }, key).then((r) => {
			if (r.query == query) {
				// prevent race condition
				response = r;
				focusedHit = 0;
			}
		});
	}

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
				break;
			case "ArrowDown":
				e.preventDefault(); // don't move the cursor
				focusedHit = Math.min((response?.hits.length || 0) - 1, focusedHit + 1);
				break;
		}
	};
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
		<div class="response">
			<ol>
				{#each response.hits as hit, i (hit.id)}
					<li>
						<a
							href={`/menyer/${hit.id}`}
							data-sveltekit-prefetch
							class:focus={i === focusedHit}
							tabindex="-1"
							on:mousemove={() => (focusedHit = i)}
						>
							{hit.title}
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
					{response.nbHits} resultat ({response.processingTimeMs} ms)
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
		--pad-block: 12px;
		--pad-inline: 8px;

		display: none;
		pointer-events: none;
		position: absolute;
		top: calc(100% + 8px);
		background-color: var(--surface1);
		border-radius: var(--border-radius);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		width: 100%;
		overflow: hidden;
		font: 500 14px/1 var(--font-sans);
		letter-spacing: -0.006em;
		z-index: 10;

		@media (min-width: 480px) {
			--pad-block: 10px;

			font-size: 12px;
			letter-spacing: 0;
		}
	}

	.search:focus-within .response {
		display: block;
		pointer-events: auto;
	}

	ol {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li a {
		display: block;
		padding-block: var(--pad-block);
		padding-inline: var(--pad-inline);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		border-bottom: 1px solid var(--color-separator);
		color: var(--color-on-surface);
		text-decoration: none;
		border-bottom: 1px solid var(--outline);

		&.focus {
			background-color: var(--theme-hover);
			color: var(--on-theme);
			outline: none;
		}

		&:active {
			background-color: var(--theme-active);
			color: var(--on-theme);
		}
	}

	.info {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-direction: column;
		padding-block: 24px;

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
