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

type LocationInputProps = {
  control: Control<NewEventType, any, NewEventType>;
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
        <FormControl>
          <Autocomplete
            onChange={selectAddressOption}
            onInputChange={onInputChange}
            disabled={suggestions.status === "pending"}
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
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: 2,
        },

        "& .MuiFormLabel-root.Mui-focused": {
          border: 0,
        },
      }}
    />
  );
}
