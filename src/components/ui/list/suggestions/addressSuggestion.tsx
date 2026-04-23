import type { AddressSuggestion } from "@/src/lib/hooks/search/types";
import { Box, Chip, ListItemText, Typography } from "@mui/material";
import { HTMLAttributes, JSX } from "react";

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
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        py: 1,
        px: 1.25,
        borderTop: 1,
        borderColor: "rgba(255, 255, 255, 0.25)",
      }}
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {option.label}
            </Typography>

            <Chip
              size="small"
              color="default"
              label={option.state}
              sx={{ height: 20 }}
            />
          </Box>
        }
      />
    </Box>
  );
}
