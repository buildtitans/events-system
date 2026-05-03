import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import type { SuggestionType } from "@/src/lib/hooks/search/types";
import type { HTMLAttributes } from "react";

type SearchSuggestionProps = {
  option: SuggestionType;
  props: HTMLAttributes<HTMLLIElement>
};

export default function SearchSuggestion({
  option,
  props,
}: SearchSuggestionProps) {


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
        borderRadius: 2,
        color: "rgba(255, 255, 255, 0.88)",
        transition: "background-color 160ms ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          color: option.kind === "event" ? "#7cc6ff" : "rgba(255, 255, 255, 0.72)",
        }}
      >
        {option.kind === "event" ? (
          <EventRoundedIcon fontSize="small" />
        ) : (
          <GroupRoundedIcon fontSize="small" />
        )}
      </ListItemIcon>

      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {option.label}
            </Typography>

            <Chip
              size="small"
              label={option.kind === "event" ? "Event" : "Group"}
              sx={{
                height: 22,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: "rgba(255, 255, 255, 0.74)",
              }}
            />
          </Box>
        }
        secondary={
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {option.kind === "event"
              ? `in /group/${option.slug}`
              : `Go to group page`}
          </Typography>
        }
      />
    </Box>
  );
}
