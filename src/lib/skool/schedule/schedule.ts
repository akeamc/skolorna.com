import type { DateTime } from "luxon";
import { getContext, setContext } from "svelte";
import type { Readable, Writable } from "svelte/store";
import type { Schedule } from "../client";

export const key = Symbol();

export type Scope = "day" | "week";

export function startOfScope(cursor: DateTime, scope: Scope): DateTime {
	return cursor.startOf(scope);
}

export function endOfScope(cursor: DateTime, scope: Scope): DateTime {
	if (scope === "week") return cursor.endOf("week").minus({ days: 2 });
	else return cursor.endOf(scope);
}

export interface ScheduleContext {
	schedule: Readable<Schedule | null>;
	loading: Readable<boolean>;
	cursor: Writable<DateTime>;
	scope: Writable<Scope>;
	startOfScope: Readable<DateTime>;
	endOfScope: Readable<DateTime>;
	lessonDialog: Writable<string | null>;
	offset: Writable<number>;
}

export const setScheduleContext = (ctx: ScheduleContext): ScheduleContext => setContext(key, ctx);

export const getScheduleContext = (): ScheduleContext => getContext(key);
