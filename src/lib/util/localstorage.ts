import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export function localStorageStore(key: string): Writable<string | null> {
	const store = writable(browser ? localStorage.getItem(key) : null, (set) => {
		function handleStorageChange(event: StorageEvent) {
			if (event.key === key) {
				set(event.newValue);
			}

			if (event.key === null) {
				set(localStorage.getItem(key));
			}
		}

		if (browser) {
			window.addEventListener("storage", handleStorageChange);
			return () => window.removeEventListener("storage", handleStorageChange);
		}
	});

	store.subscribe((value) => {
		if (browser) {
			if (value) localStorage.setItem(key, value);
			else localStorage.removeItem(key);
		}
	});

	return store;
}
