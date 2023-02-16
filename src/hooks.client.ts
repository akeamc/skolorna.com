import {
	BatchSpanProcessor,
	TraceIdRatioBasedSampler,
	WebTracerProvider
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";

const provider = new WebTracerProvider({
	resource: Resource.default().merge(
		new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: "skolorna.com"
		})
	),
	sampler: new TraceIdRatioBasedSampler(0.1)
});
provider.addSpanProcessor(
	new BatchSpanProcessor(
		new OTLPTraceExporter({
			url: "https://api.skolorna.com/collector/v1/traces"
		})
	)
);

provider.register({
	contextManager: new ZoneContextManager()
});

const fetchInstrumentation = new FetchInstrumentation({
	propagateTraceHeaderCorsUrls: [/^https:\/\/api\.skolorna\.com\//]
});
fetchInstrumentation.setTracerProvider(provider);

registerInstrumentations({
	instrumentations: [new DocumentLoadInstrumentation(), fetchInstrumentation]
});
