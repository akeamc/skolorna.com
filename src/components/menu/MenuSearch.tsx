import React, {
  FunctionComponent,
} from "react";
import { Highlight, Hits, InstantSearch, SearchBox } from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { BasicDoc, Hit as HitType } from "react-instantsearch-core";

const searchClient = instantMeiliSearch(
  "https://api-staging.skolorna.com/v0/search",
  "a0c3773f83653bf6f76440ab3b89d7c133a266a2523aa092c4cdc09c3437297f"
);

const Hit: FunctionComponent<{ hit: HitType<BasicDoc> }> = ({ hit }) => (
  <Highlight attribute="title" hit={hit} />
);

const MenuSearch: FunctionComponent = () => (
  <InstantSearch indexName="menus" searchClient={searchClient}>
    <SearchBox />
    <Hits hitComponent={Hit} />
  </InstantSearch>
);

export default MenuSearch;
