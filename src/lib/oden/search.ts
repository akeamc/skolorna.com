import { MeiliSearch } from "meilisearch";

export const HOST_URL = "https://api-staging.skolorna.com/v0/search";
export const API_KEY =
  "8802393b6aa51c9b2727ea5be44fe3a19b65a68022f8f6ac31bc87896bb6e56d";
export const INDEX_NAME = "menus";

export const searchClient = new MeiliSearch({
  host: HOST_URL,
  apiKey: API_KEY,
});
