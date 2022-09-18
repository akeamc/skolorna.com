import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { decodeJwt } from "jose";
import { derived, get, writable } from "svelte/store";
import { authedFetch } from "./client";

export const API_URL = "https://api2.skolorna.com/v0/auth";

interface PasswordTokenRequest {
	grant_type: "password";
	username: string;
	password: string;
}

interface RefreshTokenRequest {
	grant_type: "refresh_token";
	refresh_token: string;
}

type TokenRequest = PasswordTokenRequest | RefreshTokenRequest;

interface TokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
}

export const refreshToken = writable<string | null>(
	browser ? localStorage.getItem("refresh_token") : null
);
export const accessToken = writable<string | null>(
	browser ? localStorage.getItem("access_token") : null
);

refreshToken.subscribe((v) => {
	if (browser) {
		if (v) localStorage.setItem("refresh_token", v);
		else localStorage.removeItem("refresh_token");
	}
});

accessToken.subscribe((v) => {
	if (browser) {
		if (v) localStorage.setItem("access_token", v);
		else localStorage.removeItem("access_token");
	}
});

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
}

function ingestTokenResponse(response: TokenResponse) {
	accessToken.set(response.access_token);

	if (response.refresh_token) refreshToken.set(response.refresh_token);
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

export interface RegistrationRequest {
	email: string;
	password: string;
	full_name: string;
}

export async function register(req: RegistrationRequest): Promise<void | AuthError> {
	authenticating.set(true);

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

	ingestTokenResponse(await res.json());
	authenticating.set(false);
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
