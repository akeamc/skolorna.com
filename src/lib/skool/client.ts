import request from "$lib/request";
import { DateTime } from "luxon";
import { hasCredentials } from "./stores";
import * as api from "@opentelemetry/api";

export const API_URL = "https://api.skolorna.com/v0/skool";

const tracer = api.trace.getTracer("skool-client");

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

export interface SkoolError {
	status: number;
	message: string;
}

export function isError<T>(obj: T | SkoolError): obj is SkoolError {
	return (obj as SkoolError)?.status !== undefined;
}

export async function putCredentials(credentials: Credentials): Promise<Response> {
	const res = await request(`${API_URL}/credentials`, {
		method: "PUT",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(credentials)
	});

	if (res.ok) hasCredentials.set(true);

	return res;
}

export async function getCredentials(): Promise<CredentialsInfo | null> {
	const res = await request(`${API_URL}/credentials`);

	if (res.status === 404) {
		hasCredentials.set(false);
		return null;
	}

	return res.json();
}

export async function deleteCredentials(): Promise<void> {
	const res = await request(`${API_URL}/credentials`, {
		method: "DELETE"
	});

	if (!res.ok) throw new Error(await res.text());

	hasCredentials.set(false);
}

export class Lesson {
	constructor(
		public id: string,
		public teacher: string | null,
		public location: string | null,
		public start: DateTime,
		public end: DateTime,
		public course: string | null,
		public color: string | null
	) {}

	static fromJSON(json: unknown): Lesson {
		if (typeof json !== "object" || json === null) throw new Error("invalid json");

		const {
			id,
			location = null,
			teacher = null,
			start,
			end,
			course = null,
			color = null
		} = json as Record<string, unknown>;

		if (typeof id !== "string") throw new Error("invalid id");
		if (location !== null && typeof location !== "string") throw new Error("invalid location");
		if (teacher !== null && typeof teacher !== "string") throw new Error("invalid teacher");
		if (typeof start !== "string") throw new Error("invalid start");
		if (typeof end !== "string") throw new Error("invalid end");
		if (course !== null && typeof course !== "string") throw new Error("invalid course");
		if (color !== null && typeof color !== "string") throw new Error("invalid color");

		return new Lesson(
			id,
			location,
			teacher,
			DateTime.fromISO(start),
			DateTime.fromISO(end),
			course,
			color
		);
	}

	seconds(): [number, number] {
		const { start, end } = this;

		return [
			start.hour * 3600 + start.minute * 60 + start.second,
			end.hour * 3600 + end.minute * 60 + end.second
		];
	}
}

export class Schedule {
	year: number;
	week: number;
	lessons: Lesson[];

	constructor(year: number, week: number, lessons: Lesson[]) {
		lessons.sort((a, b) => +a.start - +b.start);
		this.lessons = lessons;
		this.year = year;
		this.week = week;
	}

	static fromJSON(year: number, week: number, json: unknown): Schedule {
		if (!Array.isArray(json)) throw new Error("invalid schedule");

		return new Schedule(year, week, json.map(Lesson.fromJSON));
	}
}

export function getSchedule(year: number, week: number): Promise<Schedule | SkoolError> {
	return tracer.startActiveSpan("getSchedule", async (span) => {
		try {
			const res = await request(`${API_URL}/schedule?year=${year}&week=${week}`);

			if (!res.ok) {
				if (res.status === 401) hasCredentials.set(false);
				const message = await res.text();
				span.setStatus({ code: api.SpanStatusCode.ERROR, message });

				return {
					status: res.status,
					message
				};
			}

			const schedule = Schedule.fromJSON(year, week, await res.json());

			hasCredentials.set(true);

			span.setStatus({ code: api.SpanStatusCode.OK });

			return schedule;
		} catch (err) {
			span.setStatus({ code: api.SpanStatusCode.ERROR });
			throw err;
		} finally {
			span.end();
		}
	});
}

export class Link {
	constructor(public id: string) {}

	static fromJSON(json: unknown): Link {
		if (typeof json !== "object" || json === null) throw new Error("invalid json");

		const { id } = json as Record<string, unknown>;

		if (typeof id !== "string" || !id) throw new Error("invalid id");

		return new Link(id);
	}

	get url(): string {
		return `https://skolorna.com/schedule?share=${this.id}`;
	}

	get icalUrl(): string {
		return `https://api.skolorna.com/v0/skool/schedule/ical?share=${this.id}`;
	}

	copyToClipboard(): Promise<void> {
		return navigator.clipboard.writeText(this.url);
	}

	async del(): Promise<void> {
		return deleteLink(this.id);
	}
}

export async function getLinks(): Promise<Link[]> {
	const res = await request(`${API_URL}/schedule/links`);

	const links = await res.json();

	if (!Array.isArray(links)) throw new Error("invalid links");

	return links.map(Link.fromJSON);
}

export async function createLink(): Promise<Link> {
	const res = await request(`${API_URL}/schedule/links`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});

	const json = await res.json();

	return Link.fromJSON(json);
}

export async function deleteLink(id: string): Promise<void> {
	const res = await request(`${API_URL}/schedule/links/${id}`, {
		method: "DELETE"
	});

	if (!res.ok) throw new Error(await res.text());
}
