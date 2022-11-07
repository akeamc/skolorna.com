import { DateTime } from "luxon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decode(token: string): any | null {
	try {
		const payload = token.split(".")[1];
		return JSON.parse(atob(payload));
	} catch (e) {
		return null;
	}
}

export function exp(token: string): DateTime | null {
	const payload = decode(token);
	if (typeof payload?.exp === "number") {
		return DateTime.fromSeconds(payload.exp);
	}
	return null;
}
