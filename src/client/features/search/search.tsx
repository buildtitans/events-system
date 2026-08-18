"use client";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { useAppSearchSuggestions } from "@/src/lib/hooks/search/useAppSearchSuggestions";
import { useSubmitAppSearch } from "@/src/lib/hooks/search/useSubmitAppSearch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import type { HTMLAttributes } from "react";
import React, { JSX, useState } from "react";
import SearchSuggestion from "./searchSuggestion";
import SearchBar from "./searchBar";
import type { SuggestionType } from "@/src/lib/hooks/search/types";
import {
  navMenuListSx,
  navMenuPaperSx,
  navSearchAutocompleteSx,
} from "@/src/client/styles/sx/nav";
import { Box } from "@mui/material";

export function Search(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const appBoot = useSelector((s: RootState) => s.rendering.appBoot.status);
  const { submitSearch } = useSubmitAppSearch();
  const { input, onInputChange, selectOption, resetSuggestions } =
    useAppSearchSuggestions();
  const suggestions = useSelector((s: RootState) => s.search.suggestions);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const query = formData.get("q");

    if (typeof query !== "string" || !query.trim()) return;
    setOpen(false);
    resetSuggestions();
    void submitSearch(query);
  };

  return (
    <Box
      sx={{ minWidth: 0, maxWidth: { xs: "100%", md: 440 }, width: "100%" }}
      component={"form"}
      role="search"
      onSubmit={handleSubmit}
    >
      <Autocomplete
        sx={navSearchAutocompleteSx}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={suggestions.status === "pending"}
        disabled={appBoot !== "ready"}
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
        ) => {
          const { key, ...rest } = props;
          return <SearchSuggestion props={rest} key={key} option={option} />;
        }}
        options={suggestions.status === "ready" ? suggestions.data : []}
        slotProps={{
          clearIndicator: {
            sx: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          listbox: {
            sx: navMenuListSx,
          },
          paper: {
            sx: navMenuPaperSx,
          },
          popper: {
            sx: {
              zIndex: 1600,
            },
          },
          popupIndicator: {
            sx: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        }}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <SearchBar params={params} />
        )}
      />
    </Box>
  );
}
