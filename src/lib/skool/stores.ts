import { writable } from "svelte/store";

export const hasCredentials = writable<boolean | null>(null);
