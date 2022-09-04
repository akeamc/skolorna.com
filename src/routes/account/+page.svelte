<script lang="ts">
	import { browser } from "$app/env";
	import { navigating } from "$app/stores";
	import { goto } from "$app/navigation";
	import { authenticated, logout, user } from "$lib/auth";
	import Button from "$lib/Button.svelte";

	$: if (browser && !$authenticated && !$navigating) {
		goto("/login?next=/account");
	}
</script>

<div class="root">
	<h1>{$user?.full_name}</h1>

	{#if !$user?.verified}
		<p>Du har inte bekräftat din e-postadress ({$user?.email}).</p>
	{/if}

	<Button on:click={() => logout("/")}>Logga ut</Button>
</div>

<style>
	.root {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: 0 var(--page-gutter);
	}
</style>
