"use client";
import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import {
  createEventFieldControlSx,
} from "@/src/styles/sx/createEventDrawer";
import { NewGroupInputType } from "@/src/lib/hooks/insert/useCreateNewGroup";
import LocationAutoComplete from "../event/locationAutoComplete";

type LocationInputProps = {
  control: Control<NewGroupInputType>;
  handleLocation: (input: string) => void;
};

export default function GroupLocation({
  control,
  handleLocation,
}: LocationInputProps): JSX.Element {

  return (
    <Controller
      name="location"
      control={control}
      render={() => (
        <FormControl fullWidth sx={createEventFieldControlSx}>
          <LocationAutoComplete 
          handleLocation={handleLocation}
          searchKind={"city"}
          />
        </FormControl>
      )}
    />
  );
}

