import { getAccessToken } from "$lib/auth/auth";
import type { Span } from "@sentry/types";

export interface Options {
	auth?: boolean;
	minimumTokenValidity?: number;

	/**
	 * A tracing span to attach to the request.
	 */
	span?: Span;
}

export default async function request(
	input: RequestInfo | URL,
	init?: RequestInit,
	options: Options = {}
): Promise<Response> {
	const { auth = true, minimumTokenValidity, span: parentSpan } = options;

	const span = parentSpan?.startChild({
		data: {
			type: "request"
		},
		description: `${init?.method ?? "GET"} ${input}`,
		op: "http.client"
	});

	const token = auth ? await getAccessToken(minimumTokenValidity) : null;

	const headers = new Headers(init?.headers);

	if (token) headers.append("authorization", `Bearer ${token}`);
	if (span) headers.append("sentry-trace", span.toTraceparent());

	try {
		const res = await fetch(input, { ...init, headers });
		span?.setHttpStatus(res.status);
		return res;
	} catch (error) {
		span?.setStatus("internal_error");
		throw error;
	} finally {
		span?.finish();
	}
}
