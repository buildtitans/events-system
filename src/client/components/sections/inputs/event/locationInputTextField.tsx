"use client";
import type { JSX } from "react";
import TextField from "@mui/material/TextField";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import { createEventTextFieldSx } from "@/src/styles/sx/createEventDrawer";

type LocationInputTextFieldProps = {
    params: AutocompleteRenderInputParams 
}

export default function LocationInputTextField({
  params,
}: LocationInputTextFieldProps ): JSX.Element {
  return (
    <TextField
      {...params}
      label="Location"
      fullWidth
      sx={createEventTextFieldSx}
    />
  );
}
