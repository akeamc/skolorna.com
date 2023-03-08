import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import request from "$lib/request";
import { decodeJwt } from "jose";
import { onMount } from "svelte";
import { derived, get, writable } from "svelte/store";
import { localStorageStore } from "../util/localstorage";
import * as api from "@opentelemetry/api";

export const API_URL = "https://api.skolorna.com/v0/auth";

const tracer = api.trace.getTracer("auth-client");

interface OtpTokenRequest {
	grant_type: "otp";
	token: string;
	otp: string;
}

interface RefreshTokenRequest {
	grant_type: "refresh_token";
	refresh_token: string;
}

type OpenIdProvider = "google";

interface IdTokenRequest {
	grant_type: "id_token";
	provider: OpenIdProvider;
	id_token: string;
	nonce: string;
}

type TokenRequest = OtpTokenRequest | RefreshTokenRequest | IdTokenRequest;

interface TokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
}

export const refreshToken = localStorageStore("refresh_token");
export const accessToken = localStorageStore("access_token");
export const loginToken = localStorageStore("login_token");

export const authenticating = writable(false);
export const authenticated = derived([accessToken], ([token]) => !!token);

derived([refreshToken, accessToken], (v) => v).subscribe(([refresh, access]) => {
	if (refresh && !access) {
		authenticate({ grant_type: "refresh_token", refresh_token: refresh });
	}
});

export function logout(next?: string): void {
	if (next) goto(next);
	refreshToken.set(null);
	accessToken.set(null);
	loginToken.set(null);
}

function ingestTokenResponse(response: TokenResponse) {
	accessToken.set(response.access_token);

	if (response.refresh_token) refreshToken.set(response.refresh_token);

	loginToken.set(null);
}

export interface AuthError {
	status: number;
	message: string;
}

export function isError<T>(obj: T | AuthError): obj is AuthError {
	return (obj as AuthError)?.status !== undefined;
}

export const authenticate = (req: TokenRequest): Promise<TokenResponse | AuthError> =>
	tracer.startActiveSpan(
		"authenticate",
		{
			attributes: {
				grant_type: req.grant_type
			}
		},
		async (span) => {
			authenticating.set(true);

			try {
				const res = await request(
					`${API_URL}/token`,
					{
						method: "POST",
						headers: {
							"content-type": "application/x-www-form-urlencoded"
						},
						body: new URLSearchParams(req as unknown as Record<string, string>)
					},
					{ auth: false }
				);

				if (!res.ok) {
					span.setStatus({
						code: api.SpanStatusCode.ERROR
					});
					return { status: res.status, message: await res.text() };
				}

				const data: TokenResponse = await res.json();
				ingestTokenResponse(data);

				span.setStatus({
					code: api.SpanStatusCode.OK
				});

				return data;
			} finally {
				authenticating.set(false);
				span.end();
			}
		}
	);

interface LoginResponse {
	token: string;
}

export async function login(email: string): Promise<void | AuthError> {
	const res = await request(
		`${API_URL}/login`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({ email })
		},
		{ auth: false }
	);

	if (!res.ok) {
		authenticating.set(false);
		return { status: res.status, message: await res.text() };
	}

	const data: LoginResponse = await res.json();

	loginToken.set(data.token);
}

export interface RegistrationRequest {
	email: string;
	full_name: string;
}

export async function register(req: RegistrationRequest): Promise<void | AuthError> {
	const res = await request(
		`${API_URL}/account`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		},
		{ auth: false }
	);

	if (!res.ok) {
		const message = await res.text();
		authenticating.set(false);
		return { status: res.status, message };
	}

	const data: LoginResponse = await res.json();

	loginToken.set(data.token);
}

export function getAccessToken(minimumValidity = 5): Promise<string | null> {
	return tracer.startActiveSpan(
		"getAccessToken",
		{ attributes: { minimumValidity, cached: false } },
		async (span) => {
			const token = get(accessToken);

			if (token) {
				const { exp = 0 } = decodeJwt(token);
				const now = Math.floor(Date.now() / 1000);

				if (exp > now + minimumValidity) {
					span.setAttribute("cached", true);
					span.end();
					return token;
				}
			}

			accessToken.set(null); // trigger refresh

			if (get(authenticating)) {
				return new Promise<string>((resolve) => {
					const unsubscribe = accessToken.subscribe((v) => {
						if (v) {
							unsubscribe();
							resolve(v);
						}
					});
				});
			}

			span.end();

			return null;
		}
	);
}

interface User {
	id: string;
	email: string;
	full_name: string;
	created_at: string;
	last_login: string;
}

export const user = writable<User | null>(null);

authenticated.subscribe(async (v) => {
	if (!v) return user.set(null);

	user.set(await getUser());
});

export function getUser(): Promise<User> {
	return tracer.startActiveSpan("getUser", async (span) => {
		try {
			const res = await request(`${API_URL}/account`, undefined);
			if (!res.ok) throw new Error(await res.text());

			const user: User = await res.json();

			span.setStatus({
				code: api.SpanStatusCode.OK
			});

			return user;
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		} finally {
			span.end();
		}
	});
}

export function requireAuth(next?: string): void {
	const s = derived([authenticated, authenticating, navigating], (v) => v);

	onMount(() =>
		s.subscribe(([auth, authing, nav]) => {
			if (!auth && !authing && !nav) {
				goto(`/login?next=${next || get(page).url.pathname}`);
			}
		})
	);
}

export interface Profile {
	id: string;
	full_name: string;
	created_at: string;
}

export function getProfile(user: string): Promise<Profile> {
	return tracer.startActiveSpan("getProfile", { attributes: { user } }, async (span) => {
		try {
			const res = await request(`${API_URL}/users/${user}/profile`, undefined, { auth: false });
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			span.setStatus({
				code: api.SpanStatusCode.OK
			});
			return data;
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		} finally {
			span.end();
		}
	});
}

export interface ProfileUpdate {
	full_name?: string;
}

export function updateProfile(update: ProfileUpdate): Promise<Profile> {
	return tracer.startActiveSpan("updateProfile", async (span) => {
		try {
			await getAccessToken();
			const userId = get(user)?.id;
			if (!userId) throw new Error("not logged in");

			const res = await request(`${API_URL}/users/${userId}/profile`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify(update)
			});

			if (!res.ok) throw new Error(await res.text());

			const profile: Profile = await res.json();

			// todo: tidy this up
			user.update((u) => {
				if (u) {
					return { ...u, full_name: profile.full_name };
				}

				return u;
			});

			span.setStatus({
				code: api.SpanStatusCode.OK
			});

			return profile;
		} catch (err) {
			span.setStatus({
				code: api.SpanStatusCode.ERROR
			});
			throw err;
		} finally {
			span.end();
		}
	});
}
