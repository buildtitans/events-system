"use client";
import type { HTMLAttributes, JSX } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import type { NewEventType } from "@/src/lib/hooks/insert/useCreateEvent";
import type { Control } from "react-hook-form";
import { useSearchAddressSuggestions } from "@/src/lib/hooks/search/useSearchAddressSuggestions";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import AddressSuggestionOption from "@/src/components/ui/list/suggestions/addressSuggestion";
import { AddressSuggestion } from "@/src/lib/hooks/search/types";
import {
  createEventAutocompletePaperSx,
  createEventAutocompleteSx,
  createEventFieldControlSx,
  createEventTextFieldSx,
} from "@/src/styles/sx/createEventDrawer";

type LocationInputProps = {
  control: Control<NewEventType>;
  handleLocation: (input: string) => void;
};

export default function LocationInput({
  control,
  handleLocation,
}: LocationInputProps): JSX.Element {
  const { onInputChange, suggestions, query, selectAddressOption } =
    useSearchAddressSuggestions(handleLocation);

  return (
    <Controller
      name="meeting_location"
      control={control}
      render={() => (
        <FormControl fullWidth sx={createEventFieldControlSx}>
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
                <AddressSuggestionOption
                  props={rest}
                  key={key}
                  option={option}
                />
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
        </FormControl>
      )}
    />
  );
}

function LocationInputTextField({ params}: { params: AutocompleteRenderInputParams}) {
  return (
    <TextField
        {...params}
      label="Location"
      fullWidth
      sx={createEventTextFieldSx}
    />
  );
}
