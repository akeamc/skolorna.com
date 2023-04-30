export const API_URL = "https://api.skolorna.com/v0/auth";

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

export type TokenRequest =
  | OtpTokenRequest
  | RefreshTokenRequest
  | IdTokenRequest;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export interface AuthError {
  status: number;
  message: string;
}

export function isError<T>(obj: T | AuthError): obj is AuthError {
  return (obj as AuthError)?.status !== undefined;
}

export async function getToken(
  req: TokenRequest
): Promise<TokenResponse | AuthError> {
  try {
    const res = await fetch(`${API_URL}/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(req as unknown as Record<string, string>),
    });

    if (!res.ok) {
      return { status: res.status, message: await res.text() };
    }

    const data: TokenResponse = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { status: 500, message: error.message };
    }
    console.error(error);
    return { status: 500, message: "Unknown error" };
  }
}

// interface LoginResponse {
// 	token: string;
// }

// export async function login(email: string): Promise<void | AuthError> {
// 	const res = await request(
// 		`${API_URL}/login`,
// 		{
// 			method: "POST",
// 			headers: {
// 				"content-type": "application/json"
// 			},
// 			body: JSON.stringify({ email })
// 		},
// 		{ auth: false }
// 	);

// 	if (!res.ok) {
// 		authenticating.set(false);
// 		return { status: res.status, message: await res.text() };
// 	}

// 	const data: LoginResponse = await res.json();

// 	loginToken.set(data.token);
// }

// export interface RegistrationRequest {
// 	email: string;
// 	full_name: string;
// }

// export async function register(req: RegistrationRequest): Promise<void | AuthError> {
// 	const res = await request(
// 		`${API_URL}/account`,
// 		{
// 			method: "POST",
// 			headers: {
// 				"content-type": "application/json"
// 			},
// 			body: JSON.stringify(req)
// 		},
// 		{ auth: false }
// 	);

// 	if (!res.ok) {
// 		const message = await res.text();
// 		authenticating.set(false);
// 		return { status: res.status, message };
// 	}

// 	const data: LoginResponse = await res.json();

// 	loginToken.set(data.token);
// }

// export function getAccessToken(minimumValidity = 5): Promise<string | null> {
// 	return tracer.startActiveSpan(
// 		"getAccessToken",
// 		{ attributes: { minimumValidity, cached: false } },
// 		async (span) => {
// 			const token = get(accessToken);

// 			if (token) {
// 				const { exp = 0 } = decodeJwt(token);
// 				const now = Math.floor(Date.now() / 1000);

// 				if (exp > now + minimumValidity) {
// 					span.setAttribute("cached", true);
// 					span.end();
// 					return token;
// 				}
// 			}

// 			accessToken.set(null); // trigger refresh

// 			if (get(authenticating)) {
// 				return new Promise<string>((resolve) => {
// 					const unsubscribe = accessToken.subscribe((v) => {
// 						if (v) {
// 							unsubscribe();
// 							resolve(v);
// 						}
// 					});
// 				});
// 			}

// 			span.end();

// 			return null;
// 		}
// 	);
// }

// interface User {
// 	id: string;
// 	email: string;
// 	full_name: string;
// 	created_at: string;
// 	last_login: string;
// }

// export const user = writable<User | null>(null);

// authenticated.subscribe(async (v) => {
// 	if (!v) return user.set(null);

// 	user.set(await getUser());
// });

// export function getUser(): Promise<User> {
// 	return catchySpan(tracer, "getUser", async (span) => {
// 		const res = await request(`${API_URL}/account`, undefined);
// 		if (!res.ok) throw new Error(await res.text());

// 		const user: User = await res.json();

// 		span.setStatus({
// 			code: api.SpanStatusCode.OK
// 		});

// 		return user;
// 	});
// }

// export interface Profile {
// 	id: string;
// 	full_name: string;
// 	created_at: string;
// }

// export async function getProfile(user: string): Promise<Profile> {
// 		const res = await request(`${API_URL}/users/${user}/profile`, undefined, { auth: false });
// 		if (!res.ok) throw new Error(await res.text());
// 		const data = await res.json();
// 		return data;
// }

// export interface ProfileUpdate {
// 	full_name?: string;
// }

// export async function updateProfile(update: ProfileUpdate): Promise<Profile> {
// 		await getAccessToken();
// 		const userId = get(user)?.id;
// 		if (!userId) throw new Error("not logged in");

// 		const res = await request(`${API_URL}/users/${userId}/profile`, {
// 			method: "PATCH",
// 			headers: {
// 				"content-type": "application/json"
// 			},
// 			body: JSON.stringify(update)
// 		});

// 		if (!res.ok) throw new Error(await res.text());

// 		const profile: Profile = await res.json();

// 		// todo: tidy this up
// 		user.update((u) => {
// 			if (u) {
// 				return { ...u, full_name: profile.full_name };
// 			}

// 			return u;
// 		});

// 		return profile;
// }

export interface Profile {
  id: string;
  full_name: string;
  created_at: string;
}
