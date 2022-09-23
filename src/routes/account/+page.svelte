<script lang="ts">
	import { logout, requireAuth, user } from "$lib/auth";
	import Button from "$lib/Button.svelte";
	import Credentials from "$lib/skool/Credentials.svelte";
	import Skeleton from "$lib/Skeleton.svelte";

	requireAuth();
</script>

<div class="root">
	<h1>
		{#if $user}{$user.full_name}{:else}<Skeleton width="10ch" />{/if}
	</h1>

	{#if !$user?.verified}
		<p>Du har inte bekräftat din e-postadress ({$user?.email}).</p>
	{/if}

	<section>
		<Credentials />
	</section>

	<Button on:click={() => logout("/")}>Logga ut</Button>
</div>

<style lang="scss">
	.root {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: 0 var(--page-gutter);
	}

	section {
		border-radius: 0.5rem;
		border: 1px solid var(--outline);
		padding: 1rem;
		margin-block: 2rem;
		text-align: start;

		:global(input) {
			max-width: 20rem;
		}
	}
</style>
