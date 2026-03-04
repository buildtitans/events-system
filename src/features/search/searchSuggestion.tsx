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
      }}
    >
      <ListItemIcon sx={{ minWidth: 0 }}>
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
              sx={{ height: 20 }}
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
