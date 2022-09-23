<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import Search from "$lib/search/Search.svelte";
	import { authenticated, authenticating, user } from "./auth";
	import Button from "./Button.svelte";
	import Skeleton from "./Skeleton.svelte";

	let scrollY: number;
</script>

<header class:floating={scrollY > 0}>
	<div class="container">
		<Search />
		<ul>
			<li>
				<a href="/schedule">Schema</a>
			</li>
			<hr />
			{#if browser && !$authenticating}
				{#if $authenticated}
					<li>
						<a href="/account">
							{#if $user?.full_name}
								{$user?.full_name}
							{:else}
								Konto
							{/if}
						</a>
					</li>
				{:else}
					<li><a href={`/login?next=${$page.url.pathname}`}>Logga in</a></li>
					<li><Button href={`/register?next=${$page.url.pathname}`}>Skapa konto</Button></li>
				{/if}
			{:else}
				<Skeleton width="12rem" height="3rem" />
			{/if}
		</ul>
	</div>
</header>

<svelte:window bind:scrollY />

<style lang="scss">
	header {
		display: flex;
		height: var(--header-height);
		background-color: var(--surface0);
		border-bottom: 1px solid var(--outline);
		box-sizing: border-box;
		padding-inline: var(--page-gutter);
	}

	.container {
		max-width: var(--content-width);
		margin: 0 auto;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		align-items: center;
		gap: 1rem;
	}

	ul a {
		color: var(--text0-muted);
		text-decoration: none;
		font: 500 14px/1 var(--font-sans);
		transition: color 0.1s;

		&:hover {
			color: var(--text0);
		}
	}

	hr {
		block-size: 1.25rem;
		inline-size: 1px;
		border: none;
		background-color: var(--outline);
	}
</style>
