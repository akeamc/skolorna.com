<script lang="ts">
	import Search from "$lib/search/Search.svelte";
	import { authenticated, authenticating, logout } from "./auth";
	import Button from "./Button.svelte";

	let scrollY: number;
</script>

<header class:floating={scrollY > 0}>
	<div class="container">
		<Search />
		<ul>
			{#if $authenticated}
				<li><Button on:click={logout}>Logga ut</Button></li>
			{:else}
				<li><a href="/login">Logga in</a></li>
				<li><Button href="/registrera">Skapa konto</Button></li>
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
		font: 500 14px/1.5 var(--font-sans);
		transition: color 0.1s;

		&:hover {
			color: var(--text0);
		}
	}
</style>
