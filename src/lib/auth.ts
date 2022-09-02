import { browser } from "$app/env";
import { derived, writable } from "svelte/store";

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

derived([refreshToken, accessToken], (v) => v).subscribe(([refresh, access]) => {
	if (refresh && !access) {
		authorize({ grant_type: "refresh_token", refresh_token: refresh });
	}
});

export async function authorize(req: TokenRequest): Promise<void> {
	const res = await fetch("https://api-staging.skolorna.com/v0/auth/token", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams(req as unknown as Record<string, string>)
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	const data: TokenResponse = await res.json();

	accessToken.set(data.access_token);

	if (data.refresh_token) {
		refreshToken.set(data.refresh_token);
	}
}

export function logout(): void {
	refreshToken.set(null);
	accessToken.set(null);
}
