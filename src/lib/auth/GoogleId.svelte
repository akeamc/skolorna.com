<script lang="ts">
	import { onMount } from "svelte";
	import { authenticate, authenticated, authenticating } from "./auth";

	export let clientId: string;

	function onResponse(res: google.accounts.id.CredentialResponse, nonce: string) {
		authenticate({
			grant_type: "id_token",
			provider: "google",
			id_token: res.credential,
			nonce
		});
	}

	let initialized = false;

	onMount(() => {
		const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		google.accounts.id.initialize({
			client_id: clientId,
			callback: (res) => onResponse(res, nonce),
			nonce,
			prompt_parent_id: "google-id-container"
		});

		initialized = true;
	});

	$: if (initialized && !$authenticated && !$authenticating) {
		google.accounts.id.prompt();
	}
</script>

<div class="track">
	<div id="google-id-container" />
</div>

<style>
	.track {
		position: absolute;
		top: var(--header-height);
		right: 0;
		height: 100%;
	}

	#google-id-container {
		position: sticky;
		top: 0;
		right: 0;
		z-index: 9999;
	}
</style>
