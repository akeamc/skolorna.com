import { browser } from "$app/env";
import { decodeJwt } from "jose";
import { derived, get, writable } from "svelte/store";

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

function ingestTokenResponse(response: TokenResponse) {
	accessToken.set(response.access_token);

	if (response.refresh_token) refreshToken.set(response.refresh_token);
}

export async function authenticate(req: TokenRequest): Promise<TokenResponse> {
	authenticating.set(true);

	const res = await fetch("https://api-staging.skolorna.com/v0/auth/token", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams(req as unknown as Record<string, string>)
	});

	if (!res.ok) {
		const e = await res.text();
		authenticating.set(false);
		throw new Error(e);
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

export async function register(req: RegistrationRequest) {
	authenticating.set(true);

	const res = await fetch("https://api-staging.skolorna.com/v0/auth/users", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(req)
	});

	if (!res.ok) {
		const e = await res.text();
		authenticating.set(false);
		throw new Error(e);
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
			console.log("using existing access token");
			return token;
		}
	}

	accessToken.set(null); // trigger refresh

	if (get(authenticating)) {
		console.log("AUTENTICATING");
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

export function logout(): void {
	refreshToken.set(null);
	accessToken.set(null);
}
