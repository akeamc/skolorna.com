<script lang="ts">
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { browser } from "$app/environment";
	import Header from "$lib/header/Header.svelte";
	import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
	import "../app.scss";
	import GoogleId from "$lib/auth/GoogleId.svelte";

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<GoogleId clientId={PUBLIC_GOOGLE_CLIENT_ID} />

	<Header />

	<main>
		<slot />
	</main>
</QueryClientProvider>
