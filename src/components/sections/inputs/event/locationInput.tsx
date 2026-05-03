"use client";
import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import type { NewEventType } from "@/src/lib/hooks/insert/useCreateEvent";
import type { Control } from "react-hook-form";
import { createEventFieldControlSx } from "@/src/styles/sx/createEventDrawer";
import LocationAutoComplete from "./locationAutoComplete";

type LocationInputProps = {
  control: Control<NewEventType>;
  handleLocation: (input: string) => void;
  searchKind: "city" | "street"
};

export default function LocationInput({
  control,
  handleLocation,
  searchKind
}: LocationInputProps): JSX.Element {
  return (
    <Controller
      name="meeting_location"
      control={control}
      render={() => (
        <FormControl fullWidth sx={createEventFieldControlSx}>
          <LocationAutoComplete handleLocation={handleLocation} searchKind={searchKind}/>
        </FormControl>
      )}
    />
  );
}
