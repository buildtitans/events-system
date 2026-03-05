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
import type { SuggestionType } from "@/src/lib/hooks/search/types";

export function Search(): JSX.Element {
  const mountStatus = useSelector(
    (s: RootState) => s.rendering.initialLoadStatus,
  );
  const { suggestions, input, onInputChange, selectOption, status } =
    useDebouncedSerach();

  return (
    <Autocomplete
      sx={{
        display: { xl: 'flex', xs: 'none'}
      }}
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
      ) =>  { 
        const { key, ...rest } = props;
        return (<SearchSuggestion props={rest} key={key} option={option} />)}}
      disablePortal
      options={suggestions}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <SearchBar params={params} />
      )}
    />
  );
}
