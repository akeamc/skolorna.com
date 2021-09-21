export interface User {
	email: string;
	password: string;
	full_name: string;
}

export interface CreateUser {
	email: string;
	password: string;
	full_name: string;
}

export async function createUser(query: CreateUser) {
	const res = await fetch("https://api-staging.skolorna.com/v1/auth/users", {
		method: "POST",
		body: JSON.stringify(query),
		headers: {
			"Content-Type": "application/json",
		}
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	console.log(res);
	console.log(await res.json());
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	refresh_token: string;
}

export async function login(query: LoginUser): Promise<LoginResponse> {
	const res = await fetch("https://api-staging.skolorna.com/v1/auth/login", {
		method: "POST",
		body: JSON.stringify(query),
		headers: {
			"Content-Type": "application/json",
		}
	});

	console.log(await res.json());

	return {
		access_token: "",
		refresh_token: "",
	};
}
