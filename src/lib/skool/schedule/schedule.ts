import type { DateTime } from "luxon";
import { getContext, setContext } from "svelte";
import type { Readable, Writable } from "svelte/store";
import type { Schedule } from "../client";

export const key = Symbol();

export type Scope = "day" | "week";

export interface ScheduleContext {
	schedule: Readable<Schedule | null>;
	cursor: Writable<DateTime>;
	scope: Writable<Scope>;
	startOfScope: Readable<DateTime>;
	endOfScope: Readable<DateTime>;
	lessonDialog: Writable<string | null>;
}

export const setScheduleContext = (ctx: ScheduleContext): ScheduleContext => setContext(key, ctx);

export const getScheduleContext = (): ScheduleContext => getContext(key);
