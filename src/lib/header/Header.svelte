<script lang="ts">
	import { browser } from "$app/environment";
	import { beforeNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import Search from "$lib/search/Search.svelte";
	import { MenuIcon } from "svelte-feather-icons";
	import { authenticated, authenticating, user } from "../auth/auth";
	import Button from "../Button.svelte";
	import Drawer from "./Drawer.svelte";
	import Skeleton from "../Skeleton.svelte";
	import Logo from "./Logo.svelte";

	let drawerOpen = false;

	beforeNavigate(() => {
		drawerOpen = false;
	});
</script>

<header>
	<div class="container">
		<a href="/" class="logo">
			<Logo />
		</a>
		<Search />
		<button class="toggle" on:click={() => (drawerOpen = !drawerOpen)}>
			<MenuIcon />
		</button>
		<nav>
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
						<li>
							<Button href={`/login?next=${$page.url.pathname}`} size="medium">Logga in</Button>
						</li>
					{/if}
				{:else}
					<Skeleton width="12rem" height="3rem" />
				{/if}
			</ul>
		</nav>
	</div>
</header>

<div class="drawer">
	<Drawer open={drawerOpen} onClose={() => (drawerOpen = false)} />
</div>

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

		@media (min-width: 480px) {
			gap: 1rem;
		}
	}

	.logo {
		flex: 0 0 1.5rem;
		display: flex;
		color: var(--text0);

		:global(svg) {
			fill: currentColor;
		}
	}

	nav {
		display: none;
	}

	.toggle {
		--size: 1.5rem;

		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		width: var(--size);
		height: var(--size);
		flex: 0 0 var(--size);

		&:focus {
			outline: var(--theme-hover) solid 2px;
		}
	}

	nav,
	.toggle {
		margin-inline-start: auto;
	}

	@media (min-width: 768px) {
		.toggle,
		.drawer {
			display: none;
		}

		nav {
			display: block;
		}
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
		font: 500 0.875rem/1 var(--font-sans);
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
		margin: 0;
	}
</style>
