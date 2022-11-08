import { goto } from "$app/navigation";
import { navigating, page } from "$app/stores";
import { decodeJwt } from "jose";
import { onMount } from "svelte";
import { derived, get, writable } from "svelte/store";
import { authedFetch } from "./client";
import { localStorageStore } from "./util/localstorage";

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
	authenticating.set(true);

	const res = await fetch(`${API_URL}/token`, {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams(req as unknown as Record<string, string>)
	});

	if (!res.ok) {
		authenticating.set(false);
		return { status: res.status, message: await res.text() };
	}

	const data: TokenResponse = await res.json();

	ingestTokenResponse(data);
	authenticating.set(false);

	return data;
}

interface LoginResponse {
	token: string;
}

export async function login(email: string): Promise<void | AuthError> {
	const res = await fetch(`${API_URL}/login`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({ email })
	});

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
	const res = await fetch(`${API_URL}/account`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(req)
	});

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
	verified: boolean;
}

export const user = writable<User | null>(null);

authenticated.subscribe(async (v) => {
	if (!v) return user.set(null);

	user.set(await getUser());
});

export async function getUser(): Promise<User> {
	const res = await authedFetch(`${API_URL}/account`);

	if (!res.ok) throw new Error(await res.text());

	return res.json();
}

export async function verifyEmail(token: string): Promise<void> {
	const res = await fetch(`${API_URL}/verify`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({ token })
	});

	if (!res.ok) throw new Error(await res.text());
}

interface RequestResetLink {
	email: string;
}

interface ResetPassword {
	token: string;
	password: string;
}

export async function resetPassword(
	data: RequestResetLink | ResetPassword
): Promise<void | AuthError> {
	const res = await fetch(`${API_URL}/account/password`, {
		method: "PUT",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	});

	if (!res.ok) {
		return { status: res.status, message: await res.text() };
	}
}

export function requireAuth(next?: string): void {
	const s = derived([authenticated, authenticating, navigating], (v) => v);

	onMount(() =>
		s.subscribe(([auth, authing, nav]) => {
			if (!auth && !authing && !nav) {
				console.log("going");
				goto(`/login?next=${next || get(page).url.pathname}`);
			}
		})
	);
}
