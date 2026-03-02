"use client";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { useDebouncedSerach } from "@/src/lib/hooks/search/useDebouncedSearch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import type { HTMLAttributes } from "react";
import React, { JSX } from "react";
import SearchSuggestion from "./searchSuggestion";
import SearchBar from "./searchBar";
import { SuggestionType } from "@/src/lib/store/slices/search/types";

export function Search(): JSX.Element {
  const mountStatus = useSelector(
    (s: RootState) => s.rendering.initialLoadStatus,
  );
  const { suggestions, input, onInputChange, selectOption, status } =
    useDebouncedSerach();

  return (
    <Autocomplete
      loading={status === "pending"}
      disabled={mountStatus !== "idle"}
      noOptionsText={"Query matched 0 results"}
      inputValue={input}
      onChange={selectOption}
      onInputChange={onInputChange}
      getOptionLabel={(option: SuggestionType) => option.label}
      renderOption={(
        props: HTMLAttributes<HTMLLIElement> & {
          key: React.Key;
        },
        option: SuggestionType,
      ) => <SearchSuggestion props={props} key={option.slug} option={option} />}
      disablePortal
      options={suggestions}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <SearchBar params={params} />
      )}
    />
  );
}
