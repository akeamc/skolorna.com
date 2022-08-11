import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import React, { FunctionComponent } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { HOST_URL, INDEX_NAME, useSearchKey } from "./search";

export const InstantMenuSearch: FunctionComponent = (props) => {
  const { data: apiKey } = useSearchKey();

  return (
    <InstantSearch
      indexName={INDEX_NAME}
      searchClient={instantMeiliSearch(HOST_URL, apiKey)}
      {...props}
    />
  );
};
