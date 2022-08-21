<script lang="ts">
	import { goto } from "$app/navigation";

	import type { Menu } from "$lib/oden/types";

	import { getKey, search, type SearchResponse } from "./client";

	let query: string = "";
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
			}
		});
	}

	const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (e) => {
		switch (e.key) {
			case "Escape":
				e.currentTarget.blur();
				break;
			case "Enter":
				const hit = response?.hits[focusedHit];
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
				// const numOptions =
				//   query === "" ? recent.length : response?.hits.length || 0; // show recent
				const numOptions = response?.hits.length || 0;
				focusedHit = Math.min(numOptions - 1, focusedHit + 1);
				break;
		}
	};
</script>

<div class="search">
	<div class="box">
		<input type="search" placeholder="Sök ..." bind:value={query} on:keydown={handleKeyDown} />
	</div>
	{#if response}
		<div class="response">
			<ol>
				{#each response.hits as hit, i (hit.id)}
					<li>
						<a
							href={`/menyer/${hit.id}`}
							sveltekit:prefetch
							class:focus={i === focusedHit}
							on:mousemove={() => (focusedHit = i)}
						>
							{hit.title}</a
						>
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

	input {
		background: var(--surface1);
		border: 0;
		font: 500 14px/1 var(--font-sans);
		letter-spacing: -0.006em;
		block-size: 36px;
		padding-inline-start: 32px;
		padding-inline-end: 16px;
		width: 100%;
		border: 1px solid var(--outline);
		border-radius: var(--border-radius);
		color: var(--text1);
	}

	input:focus {
		outline: none;
		border-color: var(--theme-hover);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.response {
		--pad-block: 16px;
		--pad-inline: 12px;

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
		color: var(--color-text-muted);
		z-index: 1;

		@media (min-width: 480px) {
			--pad-block: 10px;
			--pad-inline: 8px;

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
		color: #777;
	}
</style>
