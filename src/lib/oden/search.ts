import { MeiliSearch } from "meilisearch";
import useSWR from "swr";
import { ODEN_ENDPOINT } from "./client";

export const HOST_URL = "https://api.skolorna.com/v0/search";
export const INDEX_NAME = "menus";

export const useSearchKey = () =>
  useSWR(`${ODEN_ENDPOINT}/key`, async (path) => {
    const res = await fetch(path);
    return res.text();
  });
