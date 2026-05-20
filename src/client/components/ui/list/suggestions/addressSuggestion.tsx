import type { AddressSuggestion } from "@/src/lib/hooks/search/types";
import { Box, Chip, ListItemText, Typography } from "@mui/material";
import { HTMLAttributes, JSX } from "react";
import {
  createEventSuggestionChipSx,
  createEventSuggestionRowSx,
  createEventSuggestionTextSx,
} from "@/src/client/styles/sx/createEventDrawer";

type AddressSuggestionProps = {
  option: AddressSuggestion;
  props: HTMLAttributes<HTMLElement>;
};
export default function AddressSuggestionOption({
  option,
  props,
}: AddressSuggestionProps): JSX.Element {
  return (
    <Box
      component="li"
      {...props}
      sx={createEventSuggestionRowSx}
    >
      <ListItemText
        primary={
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={createEventSuggestionTextSx}>
              {option.label}
            </Typography>

            <Chip
              size="small"
              color="default"
              label={option.state}
              sx={createEventSuggestionChipSx}
            />
          </Box>
        }
      />
    </Box>
  );
}
