export type ElementType = "node" | "way" | "relation";

export function parseOsmId(id: string): [ElementType, number] {
	let type: ElementType;

	switch (id[0].toLowerCase()) {
		case "n":
			type = "node";
			break;
		case "w":
			type = "way";
			break;
		case "r":
			type = "relation";
			break;
		default:
			throw new Error("invalid id");
	}

	return [type, parseInt(id.slice(1))];
}

export interface OsmElement {
	id: number;
	type: ElementType;
	tags: Record<string, string>;
}

export async function getElement(id: string): Promise<OsmElement> {
	const [type, idNum] = parseOsmId(id);

	const res = await fetch("https://overpass-api.de/api/interpreter", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: `data=[out:json]; ${type}(${idNum}); out;`
	});

	const json = await res.json();

	if (!Array.isArray(json.elements)) throw new Error("invalid elements");

	const element = json.elements[0];

	if (!element) throw new Error("element not found");

	return {
		id: element.id,
		type: element.type,
		tags: element.tags
	};
}

export function osmUrl(id: string): string {
	const [type, idNum] = parseOsmId(id);

	return `https://www.openstreetmap.org/${type}/${idNum}`;
}
