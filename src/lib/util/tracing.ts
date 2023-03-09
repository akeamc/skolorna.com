import * as api from "@opentelemetry/api";

export function catchySpan<R>(tracer: api.Tracer, name: string, fn: (span: api.Span) => R): R;

export function catchySpan<R>(
	tracer: api.Tracer,
	name: string,
	options: api.SpanOptions,
	fn: (span: api.Span) => R
): R;

export function catchySpan<R>(
	tracer: api.Tracer,
	name: string,
	optionsOrFn: api.SpanOptions | ((span: api.Span) => R),
	fn?: (span: api.Span) => R
): R {
	let options: api.SpanOptions = {};

	if (typeof optionsOrFn === "function") {
		fn = optionsOrFn;
	} else {
		options = optionsOrFn;
	}

	return tracer.startActiveSpan(name, options, (span) => {
		if (typeof fn !== "function") {
			throw new Error("fn must be a function");
		}

		try {
			return fn(span);
		} catch (err) {
			let message;
			if (err instanceof Error) {
				span.recordException(err);
				message = err.message;
			}
			span.setStatus({ code: api.SpanStatusCode.ERROR, message });
			throw err;
		} finally {
			span.end();
		}
	});
}
