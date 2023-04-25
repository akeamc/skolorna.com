import { FunctionComponent } from "react";
import SearchProvider from "../search/SearchProvider";
import { IndexedMenu, useSearch } from "../search/search";

const Box: FunctionComponent = () => {
  const { query, setQuery, response } = useSearch<IndexedMenu>();

  return (
    <input 

const BigSearch: FunctionComponent = () => (
  <SearchProvider index="menus">
    
  </SearchProvider>
)