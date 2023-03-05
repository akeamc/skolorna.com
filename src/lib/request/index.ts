import { getAccessToken } from "$lib/auth/auth";

export interface Options {
	auth?: boolean;
	minimumTokenValidity?: number;
}

export default async function request(
	input: RequestInfo | URL,
	init?: RequestInit,
	options: Options = {}
): Promise<Response> {
	const { auth = true, minimumTokenValidity } = options;

	const token = auth ? await getAccessToken(minimumTokenValidity) : null;

	const headers = new Headers(init?.headers);

	if (token) headers.append("authorization", `Bearer ${token}`);

	return fetch(input, { ...init, headers });
}
