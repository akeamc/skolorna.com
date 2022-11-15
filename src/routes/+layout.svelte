<script lang="ts">
	import { PUBLIC_SENTRY_DSN } from "$env/static/public";
	import Header from "$lib/header/Header.svelte";
	import "../app.scss";

	import * as Sentry from "@sentry/svelte";
	import { BrowserTracing } from "@sentry/tracing";

	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN || undefined,
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0
	});
</script>

<Header />

<main>
	<slot />
</main>
