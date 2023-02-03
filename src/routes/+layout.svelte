<script lang="ts">
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { browser } from "$app/environment";
	import Header from "$lib/header/Header.svelte";
	import "../app.scss";

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Header />

	<main>
		<slot />
	</main>
</QueryClientProvider>
