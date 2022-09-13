import { authedFetch } from "../client";

export const API_URL = "http://localhost:8000";

interface SkolplattformenCredentials {
	service: "skolplattformen";
	username: string;
	password: string;
}

type SkolplattformenCredentialsInfo = Omit<SkolplattformenCredentials, "password">;

type Credentials = SkolplattformenCredentials;

type CredentialsInfo = SkolplattformenCredentialsInfo & {
	updated_at: string;
};

export async function putCredentials(credentials: Credentials): Promise<Response> {
	return authedFetch(`${API_URL}/credentials`, {
		method: "PUT",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(credentials)
	});
}

export async function getCredentials(): Promise<CredentialsInfo | null> {
	const res = await authedFetch(`${API_URL}/credentials`);

	if (res.status === 404) return null;

	return res.json();
}

export async function deleteCredentials(): Promise<void> {
	await authedFetch(`${API_URL}/credentials`, {
		method: "DELETE"
	});
}
