import { MeiliSearch } from "meilisearch";

export const HOST_URL = "https://api-staging.skolorna.com/v0/search";
export const API_KEY =
  "Bx550HX6f1da372c436f80be564bfdea7ce136cf98576766c23580f0a92114ad0aecd558";
export const INDEX_NAME = "menus";

export const searchClient = new MeiliSearch({
  host: HOST_URL,
  apiKey: API_KEY,
});
