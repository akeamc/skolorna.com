import { MeiliSearch } from "meilisearch";

export const HOST_URL = "https://api.skolorna.com/v0/search";
export const API_KEY =
  "dgvIqsOt4f126af064837d0110acdfa5f9d93fbaed88e4f59e3f6055a0c98660816b17fa";
export const INDEX_NAME = "menus";

export const searchClient = new MeiliSearch({
  host: HOST_URL,
  apiKey: API_KEY,
});
