import { MeiliSearch } from "meilisearch";

export const searchClient = new MeiliSearch({
  host: "https://api-staging.skolorna.com/v0/search",
  apiKey: "a0c3773f83653bf6f76440ab3b89d7c133a266a2523aa092c4cdc09c3437297f"
});
