import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import request from "$lib/request";
import { decodeJwt } from "jose";
import { onMount } from "svelte";
import { derived, get, writable } from "svelte/store";
import { localStorageStore } from "../util/localstorage";
import * as Sentry from "@sentry/svelte";

export const API_URL = "https://api2.skolorna.com/v0/auth";

interface OtpTokenRequest {
	grant_type: "otp";
	token: string;
	otp: string;
}

interface RefreshTokenRequest {
	grant_type: "refresh_token";
	refresh_token: string;
}

type TokenRequest = OtpTokenRequest | RefreshTokenRequest;

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

	Sentry.setUser(null);
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

export async function authenticate(req: TokenRequest): Promise<TokenResponse | AuthError> {
	const transaction = Sentry.startTransaction({
		name: "authenticate",
		op: "http.client"
	});

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
			{ auth: false, span: transaction }
		);

		if (!res.ok) {
			return { status: res.status, message: await res.text() };
		}

		const data: TokenResponse = await res.json();
		ingestTokenResponse(data);

		transaction.setStatus("ok");

		return data;
	} finally {
		transaction.finish();
		authenticating.set(false);
	}
}

interface LoginResponse {
	token: string;
}

export async function login(email: string): Promise<void | AuthError> {
	const transaction = Sentry.startTransaction({ name: "login" });

	try {
		const res = await request(
			`${API_URL}/login`,
			{
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({ email })
			},
			{ auth: false, span: transaction }
		);

		if (!res.ok) {
			authenticating.set(false);
			return { status: res.status, message: await res.text() };
		}

		const data: LoginResponse = await res.json();

		loginToken.set(data.token);
		transaction.setStatus("ok");
	} finally {
		transaction.finish();
	}
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

export async function getAccessToken(minimumValidity = 5): Promise<string | null> {
	const token = get(accessToken);

	if (token) {
		const { exp = 0 } = decodeJwt(token);
		const now = Math.floor(Date.now() / 1000);

		if (exp > now + minimumValidity) {
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

	return null;
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

export async function getUser(): Promise<User> {
	const transaction = Sentry.startTransaction({ name: "getUser" });

	try {
		const res = await request(`${API_URL}/account`, undefined, { span: transaction });
		if (!res.ok) throw new Error(await res.text());

		const user: User = await res.json();
		transaction.setStatus("ok");

		Sentry.setUser({ id: user.id, email: user.email });

		return user;
	} finally {
		transaction.finish();
	}
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
