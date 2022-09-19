import { DateTime } from "luxon";
import { authedFetch } from "../client";

export const API_URL = "https://api2.skolorna.com/v0/skool";

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
	const res = await authedFetch(`${API_URL}/credentials`, {
		method: "DELETE"
	});

	if (!res.ok) throw new Error(await res.text());
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

export async function getSchedule(year: number, week: number): Promise<Schedule> {
	const res = await authedFetch(`${API_URL}/schedule?year=${year}&week=${week}`);

	const lessons = await res.json();

	return Schedule.fromJSON(year, week, lessons);
}
