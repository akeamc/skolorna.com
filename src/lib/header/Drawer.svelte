<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import Logo from "./Logo.svelte";
	import { authenticated, authenticating, user } from "../auth/auth";
	import { page } from "$app/stores";

	export let open = false;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	export let onClose = () => {};

	$: if (browser) {
		document.body.style.overflow = open ? "hidden" : "auto";
	}

	onMount(() => {
		let mql = window.matchMedia("(min-width: 768px)");

		function mediaQueryChanged() {
			if (mql.matches) onClose();
		}

		mql.addEventListener("change", mediaQueryChanged);

		return () => {
			document.body.style.overflow = "auto";
			mql.removeEventListener("change", mediaQueryChanged);
		};
	});
</script>

<div class="root">
	<div class="overlay" class:visible={open} on:click={onClose} />

	<div class="drawer" class:open>
		<header>
			<Logo />
			<span>Skolorna</span>
		</header>
		<nav>
			<ul>
				<li><a href="/">Start</a></li>
				<li><a href="/schedule">Schema</a></li>
				{#if browser && !$authenticating}
					{#if $authenticated}
						<li>
							<a href="/account">
								Konto {#if $user?.full_name}({$user?.full_name}){/if}
							</a>
						</li>
					{:else}
						<li><a href={`/login?next=${$page.url.pathname}`}>Logga in</a></li>
					{/if}
				{/if}
			</ul>
		</nav>
	</div>
</div>

<style lang="scss">
	.root {
		--z: 1000;
	}

	.overlay {
		position: fixed;
		inset: 0;
		backdrop-filter: brightness(0.8) blur(8px);
		z-index: var(--z);
		opacity: 0;
		pointer-events: none;
		cursor: pointer;
		transition: opacity 0.2s ease-in-out;

		&.visible {
			opacity: 1;
			pointer-events: all;
		}
	}

	.drawer {
		--border-radius: 1rem;
		--padding: 1rem;

		background-color: var(--surface1);
		box-shadow: none;
		position: fixed;
		inset-block: 0;
		right: 0;
		width: 20rem;
		max-width: 100%;
		transform: translateX(100%);
		transition: all 0.2s ease-in-out;
		z-index: var(--z);
		border-start-start-radius: var(--border-radius);
		border-end-start-radius: var(--border-radius);

		&.open {
			transform: translateX(0);
			box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
		}
	}

	header {
		height: var(--header-height);
		border-bottom: 1px solid var(--outline);
		display: flex;
		align-items: center;
		padding-inline: 1rem;
		gap: 0.5rem;
		box-sizing: border-box;

		:global(svg) {
			width: 1.5rem;
			fill: currentColor;
		}

		span {
			font: 800 1.5rem/1 var(--font-sans);
			letter-spacing: -0.022em;
		}
	}

	nav {
		padding: 0.5rem;
	}

	.drawer li {
		transition: opacity 0.1s;
		opacity: 0;
	}

	.drawer.open li {
		opacity: 1;
		transition-delay: 0.15s;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;

		a {
			color: var(--text0);
			display: block;
			padding-block: 0.75rem;
			padding-inline: 0.5rem;
			border-radius: 0.5rem;
			font: 500 0.875rem/1 var(--font-sans);
			text-decoration: none;

			&:hover {
				background-color: var(--surface2);
			}
		}
	}
</style>
