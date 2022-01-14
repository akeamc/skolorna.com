import { MeiliSearch } from "meilisearch";

export const HOST_URL = "https://api.skolorna.com/v0/search";
export const API_KEY =
  "ab455b91fcf3dc98a68f5005b82b9445f268c4f21cf6a79ab7743d2262dcf040";
export const INDEX_NAME = "menus";

export const searchClient = new MeiliSearch({
  host: HOST_URL,
  apiKey: API_KEY,
});
