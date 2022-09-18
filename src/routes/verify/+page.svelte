<script lang="ts">
	import { page } from "$app/stores";
	import { verifyEmail } from "$lib/auth";

	const token = $page.url.searchParams.get("token") || "";

	const res = verifyEmail(token);
</script>

{#await res}
	Verifierar........
{:then}
	Din e-post är nu verifierad!
{:catch}
	Verifieringen misslyckades.
{/await}
