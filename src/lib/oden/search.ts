import { MeiliSearch } from "meilisearch";

export const searchClient = new MeiliSearch({
  host: "https://api-staging.skolorna.com/v0/search",
  apiKey: "8802393b6aa51c9b2727ea5be44fe3a19b65a68022f8f6ac31bc87896bb6e56d"
});
