import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import React, { FunctionComponent } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { API_KEY, HOST_URL, INDEX_NAME } from "./search";

export const instantSearch = instantMeiliSearch(HOST_URL, API_KEY);

export const InstantMenuSearch: FunctionComponent = (props) => (
  <InstantSearch
    indexName={INDEX_NAME}
    searchClient={instantSearch}
    {...props}
  />
);
