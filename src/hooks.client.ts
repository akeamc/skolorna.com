import * as Sentry from "@sentry/svelte";
import { BrowserTracing } from "@sentry/tracing";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN || undefined,
	integrations: [
		new BrowserTracing({
			// tracePropagationTargets: [/^https?:\/\/(?:[^\/]+\.)?skolorna\.com(?:\/|$)/],
			tracePropagationTargets: [/.*/]
		})
	],
	tracesSampleRate: 1.0
});
