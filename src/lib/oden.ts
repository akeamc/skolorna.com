const API_URL = "https://api.skolorna.com/v0/oden";

export async function get(path: string): Promise<Response> {
	return fetch(`${API_URL}${path}`);
}

export interface Stats {
	menus: number;
	days: number;
}

export async function getStats(): Promise<Response> {
	return get("/stats");
}

export interface Menu {
	title: string;
	id: string;
	updated_at: string;
}

export async function getMenu(id: string): Promise<Response> {
	return get(`/menus/${id}`);
}
