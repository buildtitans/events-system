"use client";
import type { HTMLAttributes, JSX } from "react";
import { useSearchLocationSuggestions } from "@/src/lib/hooks/search/useSearchLocationSuggestions";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import AddressSuggestionOption from "@/src/components/ui/list/suggestions/addressSuggestion";
import LocationInputTextField from "../event/locationInputTextField";
import { AddressSuggestion } from "@/src/lib/hooks/search/types";
import {
  createEventAutocompletePaperSx,
  createEventAutocompleteSx,
} from "@/src/styles/sx/createEventDrawer";

type LocationAutoCompleteProps = {
  handleLocation: (input: string) => void;
  searchKind: 'city' | 'street';
};

export default function LocationAutoComplete({
  handleLocation,
  searchKind
}: LocationAutoCompleteProps): JSX.Element {
  const { onInputChange, suggestions, query, selectAddressOption } =
    useSearchLocationSuggestions(handleLocation, searchKind);

  return (
    <Autocomplete
      sx={createEventAutocompleteSx}
      onChange={selectAddressOption}
      onInputChange={onInputChange}
      disabled={false}
      noOptionsText={"Query matched 0 locations"}
      inputValue={query}
      getOptionLabel={(option: AddressSuggestion) => option.label}
      renderOption={(
        props: HTMLAttributes<HTMLLIElement> & {
          key: React.Key;
        },
        option: AddressSuggestion,
      ) => {
        const { key, ...rest } = props;
        return (
          <AddressSuggestionOption props={rest} key={key} option={option} />
        );
      }}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <LocationInputTextField params={params} />
      )}
      slotProps={{
        paper: {
          sx: createEventAutocompletePaperSx,
        },
      }}
      disablePortal
      options={suggestions.status === "ready" ? suggestions.data : []}
    />
  );
}
