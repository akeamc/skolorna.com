"use client";

import chroma, { Color } from "chroma-js";
import { DateTime } from "luxon";

export class Lesson {
  constructor(
    public id: string,
    public location: string | null,
    public teacher: string | null,
    public start: DateTime,
    public end: DateTime,
    public course: string | null,
    public color: Color | null
  ) {}

  static fromJSON(json: unknown): Lesson {
    if (typeof json !== "object" || json === null)
      throw new Error("invalid json");

    const {
      id,
      location = null,
      teacher = null,
      start,
      end,
      course = null,
      color = null,
    } = json as Record<string, unknown>;

    if (typeof id !== "string") throw new Error("invalid id");
    if (location !== null && typeof location !== "string")
      throw new Error("invalid location");
    if (teacher !== null && typeof teacher !== "string")
      throw new Error("invalid teacher");
    if (typeof start !== "string") throw new Error("invalid start");
    if (typeof end !== "string") throw new Error("invalid end");
    if (course !== null && typeof course !== "string")
      throw new Error("invalid course");
    if (color !== null && typeof color !== "string")
      throw new Error("invalid color");

    return new Lesson(
      id,
      location,
      teacher,
      DateTime.fromISO(start),
      DateTime.fromISO(end),
      course,
      color ? chroma(color) : null
    );
  }

  seconds(): [number, number] {
    const { start, end } = this;

    return [
      start.hour * 3600 + start.minute * 60 + start.second,
      end.hour * 3600 + end.minute * 60 + end.second,
    ];
  }

  duration(): number {
    const [start, end] = this.seconds();
    return end - start;
  }

  private hue(): number | undefined {
    const hue = this.color?.get("hsl.h");
    if (!this.color?.get("hsl.s")) return undefined;
    return hue;
  }

  foreground(): Color {
    const hue = this.hue();
    if (!hue) return chroma("#111827");
    return chroma.hsl(hue, 0.51, 0.45);
  }

  background(): Color {
    const hue = this.hue();
    if (!hue) return chroma("#f3f4f6");
    return chroma.hsl(hue, 0.54, 0.92);
  }

  accent(): Color {
    const hue = this.hue();
    if (!hue) return chroma("#e5e7eb");
    return chroma.hsl(hue, 0.8, 0.6);
  }
}

export class Schedule {
  lessons: Lesson[];

  constructor(lessons: Lesson[]) {
    lessons.sort((a, b) => +a.start - +b.start);
    this.lessons = lessons;
  }

  static fromJSON(json: unknown): Schedule {
    if (!Array.isArray(json)) throw new Error("invalid schedule");

    return new Schedule(json.map(Lesson.fromJSON));
  }
}

export interface Day {
  date: DateTime;
  lessons: Lesson[];
}
